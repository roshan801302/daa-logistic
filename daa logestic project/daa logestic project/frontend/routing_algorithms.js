// =============================================================
// LOGISTICS ROUTING ALGORITHMS ENGINE
// Implements: Dijkstra, CH, CRP, Tabu Search, ACO
// =============================================================

// ---------------------
// CITY GRAPH WITH WEIGHTED EDGES
// Real approximate road distances (km) between major Indian cities
// ---------------------
const GRAPH_NODES = [
  { id: 0, name: 'Mumbai',    lat: 19.0760,  lng: 72.8777 },
  { id: 1, name: 'Delhi',     lat: 28.6139,  lng: 77.2090 },
  { id: 2, name: 'Bangalore', lat: 12.9716,  lng: 77.5946 },
  { id: 3, name: 'Chennai',   lat: 13.0827,  lng: 80.2707 },
  { id: 4, name: 'Hyderabad', lat: 17.3850,  lng: 78.4867 },
  { id: 5, name: 'Ahmedabad', lat: 23.0225,  lng: 72.5714 },
  { id: 6, name: 'Kolkata',   lat: 22.5726,  lng: 88.3639 },
  { id: 7, name: 'Pune',      lat: 18.5204,  lng: 73.8567 },
  { id: 8, name: 'Jaipur',    lat: 26.9124,  lng: 75.7873 },
  { id: 9, name: 'Surat',     lat: 21.1702,  lng: 72.8311 },
  { id: 10, name: 'Lucknow',  lat: 26.8467,  lng: 80.9462 },
  { id: 11, name: 'Nagpur',   lat: 21.1458,  lng: 79.0882 },
];

// Edge list: [from, to, distance_km, traffic_weight]
// traffic_weight > 1 means congestion (higher = slower)
const GRAPH_EDGES_RAW = [
  [0, 7,  149, 1.1],  // Mumbai - Pune
  [0, 5,  529, 1.2],  // Mumbai - Ahmedabad
  [0, 9,  285, 1.1],  // Mumbai - Surat
  [0, 11, 901, 1.3],  // Mumbai - Nagpur
  [1, 8,  282, 1.2],  // Delhi - Jaipur
  [1, 10, 555, 1.4],  // Delhi - Lucknow
  [1, 5,  934, 1.3],  // Delhi - Ahmedabad
  [1, 6,  1474,1.5],  // Delhi - Kolkata
  [2, 3,  348, 1.1],  // Bangalore - Chennai
  [2, 4,  575, 1.2],  // Bangalore - Hyderabad
  [2, 7,  840, 1.2],  // Bangalore - Pune
  [3, 4,  630, 1.2],  // Chennai - Hyderabad
  [3, 6,  1659,1.5],  // Chennai - Kolkata
  [4, 0,  711, 1.3],  // Hyderabad - Mumbai
  [4, 11, 507, 1.1],  // Hyderabad - Nagpur
  [4, 7,  560, 1.2],  // Hyderabad - Pune
  [5, 9,  267, 1.0],  // Ahmedabad - Surat
  [5, 8,  664, 1.2],  // Ahmedabad - Jaipur
  [6, 10, 982, 1.4],  // Kolkata - Lucknow
  [7, 11, 748, 1.2],  // Pune - Nagpur
  [8, 10, 560, 1.3],  // Jaipur - Lucknow
  [9, 0,  285, 1.1],  // Surat - Mumbai (dup for bidirectionality)
  [10, 11,505, 1.2],  // Lucknow - Nagpur
  [11, 4, 507, 1.1],  // Nagpur - Hyderabad (dup)
  [0, 4,  711, 1.3],  // Mumbai - Hyderabad (shortcut)
  [1, 11, 1091,1.4],  // Delhi - Nagpur
];

// Build adjacency list (bidirectional)
function buildGraph(nodes, rawEdges) {
  const adj = Array.from({ length: nodes.length }, () => []);
  rawEdges.forEach(([u, v, dist, tw]) => {
    const cost = dist * tw; // effective weighted cost
    adj[u].push({ to: v, dist, cost });
    adj[v].push({ to: u, dist, cost }); // bidirectional
  });
  return adj;
}

const ADJ = buildGraph(GRAPH_NODES, GRAPH_EDGES_RAW);

// Distance matrix for O(1) lookup (initialized lazily)
let DIST_MATRIX = null;
function getDistMatrix() {
  if (DIST_MATRIX) return DIST_MATRIX;
  const n = GRAPH_NODES.length;
  DIST_MATRIX = Array.from({ length: n }, () => Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) DIST_MATRIX[i][i] = 0;
  GRAPH_EDGES_RAW.forEach(([u, v, d]) => {
    DIST_MATRIX[u][v] = Math.min(DIST_MATRIX[u][v], d);
    DIST_MATRIX[v][u] = Math.min(DIST_MATRIX[v][u], d);
  });
  return DIST_MATRIX;
}

// Map city name to node ID
function cityNameToId(name) {
  return GRAPH_NODES.findIndex(n => n.name === name);
}

// ===========================================================
// ALGORITHM 1: DIJKSTRA (Classic, with priority queue)
// Finds the shortest weighted path between two nodes
// ===========================================================
function dijkstra(adj, src, dst) {
  const n = adj.length;
  const dist = Array(n).fill(Infinity);
  const prev = Array(n).fill(-1);
  const visited = Array(n).fill(false);
  dist[src] = 0;

  // Min-heap: [cost, node]
  const pq = [[0, src]];

  const t0 = performance.now();
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();

    if (visited[u]) continue;
    visited[u] = true;
    if (u === dst) break;

    for (const edge of adj[u]) {
      const nd = d + edge.cost;
      if (nd < dist[edge.to]) {
        dist[edge.to] = nd;
        prev[edge.to] = u;
        pq.push([nd, edge.to]);
      }
    }
  }
  const elapsed = performance.now() - t0;

  // Reconstruct path
  const path = [];
  let cur = dst;
  while (cur !== -1) { path.unshift(cur); cur = prev[cur]; }
  if (path[0] !== src) return { path: [], dist: Infinity, time: elapsed };

  const totalDist = dist[dst];
  return { path, dist: totalDist, time: elapsed, algo: 'Dijkstra' };
}

// ===========================================================
// ALGORITHM 2: CH (Contraction Hierarchies) — Simplified
// Phase 1: Assign node importance (degree + edge difference heuristic)
// Phase 2: Bidirectional Dijkstra on upward/downward graphs
// ===========================================================
function buildCH(adj) {
  const n = adj.length;
  const level = Array(n).fill(0);
  const upAdj   = Array.from({ length: n }, () => []); // upward edges
  const downAdj = Array.from({ length: n }, () => []); // downward edges

  // Importance = number of neighbors (degree). Contract lowest importance first.
  const importance = adj.map(edges => edges.length);
  const order = Array.from({ length: n }, (_, i) => i)
    .sort((a, b) => importance[a] - importance[b]);

  const contracted = Array(n).fill(false);

  order.forEach((v, rank) => {
    level[v] = rank;
    contracted[v] = true;

    // Add shortcuts: for each pair (u, v, w): if v is contracted and
    // the only path from u to w goes through v, add shortcut u->w
    const inNeighbors  = adj[v].filter(e => !contracted[e.to]);
    const outNeighbors = adj[v].filter(e => !contracted[e.to]);

    inNeighbors.forEach(eu => {
      outNeighbors.forEach(ew => {
        if (eu.to === ew.to) return;
        const shortcutCost = eu.cost + ew.cost;
        // Only add if shortcut is necessary (simplified: always add for correctness)
        adj[eu.to].push({ to: ew.to, cost: shortcutCost, dist: eu.dist + ew.dist, shortcut: true });
        adj[ew.to].push({ to: eu.to, cost: shortcutCost, dist: eu.dist + ew.dist, shortcut: true });
      });
    });
  });

  // Build upward / downward adjacency based on importance levels
  for (let u = 0; u < n; u++) {
    for (const e of adj[u]) {
      if (level[e.to] > level[u]) {
        upAdj[u].push(e);    // u -> higher level node
        downAdj[e.to].push({ ...e, to: u }); // mirror for backward search
      }
    }
  }

  return { level, upAdj, downAdj };
}

let _ch = null;
function getCH() {
  if (!_ch) {
    // Deep copy adj since CH mutates it with shortcuts
    const adjCopy = ADJ.map(edges => edges.map(e => ({ ...e })));
    _ch = buildCH(adjCopy);
  }
  return _ch;
}

function dijkstraUp(adj, src) {
  const n = adj.length;
  const dist = Array(n).fill(Infinity);
  const prev = Array(n).fill(-1);
  dist[src] = 0;
  const pq = [[0, src]];
  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d > dist[u]) continue;
    for (const e of adj[u]) {
      const nd = d + e.cost;
      if (nd < dist[e.to]) {
        dist[e.to] = nd;
        prev[e.to] = u;
        pq.push([nd, e.to]);
      }
    }
  }
  return { dist, prev };
}

function chSearch(src, dst) {
  const { upAdj, downAdj } = getCH();
  const t0 = performance.now();

  const fwd = dijkstraUp(upAdj, src);
  const bwd = dijkstraUp(downAdj, dst);

  // Find meeting node with minimum combined distance
  let best = Infinity, meeting = -1;
  for (let i = 0; i < GRAPH_NODES.length; i++) {
    const combined = fwd.dist[i] + bwd.dist[i];
    if (combined < best) { best = combined; meeting = i; }
  }

  const elapsed = performance.now() - t0;

  // Reconstruct path forward from src to meeting
  const fwdPath = [];
  let cur = meeting;
  while (cur !== -1) { fwdPath.unshift(cur); cur = fwd.prev[cur]; }

  // Reconstruct path backward from meeting to dst (using downAdj prev)
  const bwdPath = [];
  cur = dst;
  // Use bwd.prev from dst
  const visited = new Set();
  while (cur !== -1 && !visited.has(cur)) {
    visited.add(cur);
    if (cur !== meeting) bwdPath.push(cur);
    cur = bwd.prev[cur];
  }

  const path = [...fwdPath, ...bwdPath];
  // Deduplicate consecutive
  const deduped = path.filter((v, i) => i === 0 || v !== path[i - 1]);

  return { path: deduped, dist: best === Infinity ? Infinity : best, time: elapsed, algo: 'CH' };
}

// ===========================================================
// ALGORITHM 3: CRP (Customizable Route Planning) — Partition-based
// Nodes are partitioned into regions; routing goes via a region overlay graph.
// Inter-region: use precomputed region border distances (boundary nodes).
// ===========================================================
const REGIONS = {
  north:  [1, 8, 10],          // Delhi, Jaipur, Lucknow
  west:   [0, 5, 7, 9],        // Mumbai, Ahmedabad, Pune, Surat
  south:  [2, 3, 4],           // Bangalore, Chennai, Hyderabad
  central:[11],                // Nagpur
  east:   [6],                 // Kolkata
};

function getNodeRegion(nodeId) {
  for (const [region, nodes] of Object.entries(REGIONS)) {
    if (nodes.includes(nodeId)) return region;
  }
  return 'unknown';
}

// Precomputed region boundary edges (simplified as direct edges between regions)
const REGION_GRAPH = {
  north:   { west: [1, 5, 934], central: [1, 11, 1091], east: [1, 6, 1474] },
  west:    { north: [5, 1, 934], south: [7, 2, 840], central: [11, 0, 901] },
  south:   { west: [2, 7, 840], central: [4, 11, 507], east: [3, 6, 1659] },
  central: { north: [11, 1, 1091], west: [11, 0, 901], south: [11, 4, 507], east: [11, 6, 1700] },
  east:    { north: [6, 1, 1474], south: [6, 3, 1659], central: [6, 11, 1700] },
};

function crpSearch(src, dst) {
  const t0 = performance.now();
  const srcRegion = getNodeRegion(src);
  const dstRegion = getNodeRegion(dst);

  // If same region, just run Dijkstra
  if (srcRegion === dstRegion) {
    const res = dijkstra(ADJ, src, dst);
    return { ...res, algo: 'CRP', time: performance.now() - t0 };
  }

  // Find best cross-region path using region-level routing
  // Step 1: Run Dijkstra within source region to boundary nodes
  // Step 2: Route between regions at overlay level
  // Step 3: Run Dijkstra from boundary node to destination
  // Simplified: Dijkstra within region connectivity + overlay

  const srcNodes = REGIONS[srcRegion] || [src];
  const dstNodes = REGIONS[dstRegion] || [dst];

  let bestDist = Infinity, bestPath = [];

  // Try each boundary pair (connecting boundary node of src region to dst region)
  for (const bSrc of srcNodes) {
    for (const bDst of dstNodes) {
      const r1 = dijkstra(ADJ, src, bSrc);
      const r2 = dijkstra(ADJ, bSrc, bDst);
      const r3 = dijkstra(ADJ, bDst, dst);
      const totalDist = r1.dist + r2.dist + r3.dist;

      if (totalDist < bestDist) {
        bestDist = totalDist;
        // Merge paths without internal duplicates
        const p2 = r2.path.filter((v, i) => i > 0 || v !== r1.path[r1.path.length - 1]);
        const p3 = r3.path.filter((v, i) => i > 0 || v !== p2[p2.length - 1]);
        bestPath = [...r1.path, ...p2, ...p3];
      }
    }
  }

  const elapsed = performance.now() - t0;
  return { path: bestPath, dist: bestDist, time: elapsed, algo: 'CRP' };
}

// ===========================================================
// ALGORITHM 4: TABU SEARCH (TSP/VRP Metaheuristic)
// Finds near-optimal visit order for multiple delivery stops.
// Starts with nearest-neighbor, then improves with 2-opt swaps.
// Forbidden (tabu) recent swaps to escape local optima.
// ===========================================================
function tabuSearch(nodes, maxIter = 300, tabuTenure = 15) {
  const t0 = performance.now();
  const dm = getDistMatrix();
  const n = nodes.length;
  if (n <= 2) return { path: nodes, dist: 0, time: 0, algo: 'Tabu Search' };

  // Nearest-neighbor initial solution
  const visited = Array(n).fill(false);
  let current = [0]; visited[0] = true;
  for (let i = 1; i < n; i++) {
    const last = current[current.length - 1];
    let best = -1, bestD = Infinity;
    for (let j = 0; j < n; j++) {
      if (!visited[j]) {
        const u = nodes[last], v = nodes[j];
        const d = dm[u]?.[v] !== undefined ? dm[u][v] : haversine(GRAPH_NODES[u], GRAPH_NODES[v]);
        if (d < bestD) { bestD = d; best = j; }
      }
    }
    current.push(best); visited[best] = true;
  }

  function routeCost(route) {
    let cost = 0;
    for (let i = 0; i < route.length - 1; i++) {
      const u = nodes[route[i]], v = nodes[route[i + 1]];
      const d = dm[u] !== undefined && dm[u][v] !== Infinity ? dm[u][v] : haversine(GRAPH_NODES[u], GRAPH_NODES[v]);
      cost += d;
    }
    return cost;
  }

  let bestSolution = [...current];
  let bestCost = routeCost(bestSolution);
  let currentSolution = [...bestSolution];
  let currentCost = bestCost;

  const tabuList = new Map(); // key: "i-j", value: iteration when freed

  for (let iter = 0; iter < maxIter; iter++) {
    let bestNeighborCost = Infinity;
    let bestNeighbor = null;
    let bestMove = null;

    // Evaluate all 2-opt neighbors
    for (let i = 1; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const moveKey = `${i}-${j}`;
        const isTabu = tabuList.has(moveKey) && tabuList.get(moveKey) > iter;

        // Apply 2-opt swap
        const neighbor = [
          ...currentSolution.slice(0, i),
          ...currentSolution.slice(i, j + 1).reverse(),
          ...currentSolution.slice(j + 1)
        ];
        const neighborCost = routeCost(neighbor);

        // Aspiration: accept tabu if it improves best
        if (!isTabu || neighborCost < bestCost) {
          if (neighborCost < bestNeighborCost) {
            bestNeighborCost = neighborCost;
            bestNeighbor = neighbor;
            bestMove = moveKey;
          }
        }
      }
    }

    if (!bestNeighbor) break;

    currentSolution = bestNeighbor;
    currentCost = bestNeighborCost;
    if (bestMove) tabuList.set(bestMove, iter + tabuTenure);

    if (currentCost < bestCost) {
      bestCost = currentCost;
      bestSolution = [...currentSolution];
    }
  }

  const elapsed = performance.now() - t0;
  return {
    path: bestSolution.map(i => nodes[i]),
    dist: bestCost,
    time: elapsed,
    algo: 'Tabu Search',
    iterations: maxIter,
  };
}

// ===========================================================
// ALGORITHM 5: ACO (Ant Colony Optimization)
// Each "ant" explores routes guided by pheromone trails and heuristic distance.
// Pheromones are deposited on good routes and evaporate over time.
// ===========================================================
function antColonyOptimization(nodes, {
  numAnts = 20,
  maxIter = 100,
  alpha = 1.0,    // pheromone importance
  beta  = 3.0,    // heuristic importance
  rho   = 0.15,   // evaporation rate
  Q     = 1000,   // pheromone deposit constant
} = {}) {
  const t0 = performance.now();
  const dm = getDistMatrix();
  const n = nodes.length;

  if (n <= 2) return { path: nodes, dist: 0, time: 0, algo: 'ACO' };

  // Distance function between route indices
  function dist(i, j) {
    const u = nodes[i], v = nodes[j];
    const d = dm[u] !== undefined && dm[u][v] !== Infinity ? dm[u][v] : haversine(GRAPH_NODES[u], GRAPH_NODES[v]);
    return d === 0 ? 0.001 : d;
  }

  // Initialize pheromone matrix
  const tau = Array.from({ length: n }, () => Array(n).fill(1.0));
  // Heuristic matrix (inverse of distance)
  const eta = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => i === j ? 0 : 1 / dist(i, j))
  );

  let bestTour = null, bestDist = Infinity;

  for (let iter = 0; iter < maxIter; iter++) {
    const allTours = [];

    // Each ant constructs a tour
    for (let ant = 0; ant < numAnts; ant++) {
      const visited = Array(n).fill(false);
      const start = Math.floor(Math.random() * n);
      const tour = [start];
      visited[start] = true;

      while (tour.length < n) {
        const cur = tour[tour.length - 1];
        // Calculate probabilities for next city
        let total = 0;
        const probs = Array(n).fill(0);
        for (let j = 0; j < n; j++) {
          if (!visited[j]) {
            probs[j] = Math.pow(tau[cur][j], alpha) * Math.pow(eta[cur][j], beta);
            total += probs[j];
          }
        }
        // Roulette wheel selection
        let r = Math.random() * total;
        let next = -1;
        for (let j = 0; j < n; j++) {
          if (!visited[j]) {
            r -= probs[j];
            if (r <= 0) { next = j; break; }
          }
        }
        if (next === -1) {
          // Fallback: pick nearest unvisited
          let minD = Infinity;
          for (let j = 0; j < n; j++) {
            if (!visited[j] && dist(cur, j) < minD) { minD = dist(cur, j); next = j; }
          }
        }
        tour.push(next);
        visited[next] = true;
      }

      // Calculate tour cost
      let tourDist = 0;
      for (let i = 0; i < tour.length - 1; i++) tourDist += dist(tour[i], tour[i + 1]);
      allTours.push({ tour, dist: tourDist });

      if (tourDist < bestDist) {
        bestDist = tourDist;
        bestTour = [...tour];
      }
    }

    // Evaporate pheromones
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        tau[i][j] *= (1 - rho);

    // Deposit pheromones from best ants this iteration
    allTours.sort((a, b) => a.dist - b.dist);
    const topAnts = allTours.slice(0, Math.ceil(numAnts / 3));
    topAnts.forEach(({ tour, dist: d }) => {
      const deposit = Q / (d || 1);
      for (let i = 0; i < tour.length - 1; i++) {
        tau[tour[i]][tour[i + 1]] += deposit;
        tau[tour[i + 1]][tour[i]] += deposit;
      }
    });

    // Clamp pheromone values to prevent extremes
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        tau[i][j] = Math.min(Math.max(tau[i][j], 0.01), 20.0);
  }

  const elapsed = performance.now() - t0;
  return {
    path: bestTour.map(i => nodes[i]),
    dist: bestDist,
    time: elapsed,
    algo: 'ACO',
    iterations: maxIter,
    ants: numAnts,
  };
}

// ===========================================================
// UTILITY: Haversine distance between two lat/lng points (km)
// ===========================================================
function haversine(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lng - a.lng) * Math.PI / 180;
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// ===========================================================
// UNIFIED API — Run any/all algorithms on a set of stop names
// ===========================================================
function runRoutingAlgorithm(algoName, stopNames) {
  // Map stop names to node IDs, fallback to nearest city
  const nodeIds = stopNames.map(name => {
    const exact = cityNameToId(name);
    if (exact !== -1) return exact;
    // Find nearest city by name prefix
    const idx = GRAPH_NODES.findIndex(n => n.name.toLowerCase().startsWith(name.toLowerCase()));
    return idx !== -1 ? idx : 0;
  });

  // Remove duplicates while preserving order
  const seen = new Set();
  const unique = nodeIds.filter(id => { if (seen.has(id)) return false; seen.add(id); return true; });

  if (unique.length < 2) return null;

  const src = unique[0];
  const dst = unique[unique.length - 1];

  switch (algoName) {
    case 'dijkstra': return dijkstra(ADJ, src, dst);
    case 'ch':       return chSearch(src, dst);
    case 'crp':      return crpSearch(src, dst);
    case 'tabu':     return tabuSearch(unique);
    case 'aco':      return antColonyOptimization(unique);
    default:         return dijkstra(ADJ, src, dst);
  }
}

function runAllAlgorithms(stopNames) {
  const algos = ['dijkstra', 'ch', 'crp', 'tabu', 'aco'];
  return algos.map(a => {
    try { return runRoutingAlgorithm(a, stopNames); }
    catch (e) { return { algo: a, path: [], dist: Infinity, time: 0, error: e.message }; }
  });
}

// Path ID → LatLng array for map drawing
function pathToLatLngs(path) {
  return path.map(id => {
    const n = GRAPH_NODES[id];
    return n ? [n.lat, n.lng] : null;
  }).filter(Boolean);
}
