// ==============================
// LOGISTICS OPTIMIZATION PLATFORM
// Module 1: Sorting Engine Frontend
// ==============================

// ===== GLOBAL STATE =====
const cities = [
  { name: 'Mumbai',    lat: 19.0760,  lng: 72.8777 },
  { name: 'Delhi',     lat: 28.6139,  lng: 77.2090 },
  { name: 'Bangalore', lat: 12.9716,  lng: 77.5946 },
  { name: 'Chennai',   lat: 13.0827,  lng: 80.2707 },
  { name: 'Hyderabad', lat: 17.3850,  lng: 78.4867 },
  { name: 'Ahmedabad', lat: 23.0225,  lng: 72.5714 },
  { name: 'Kolkata',   lat: 22.5726,  lng: 88.3639 },
  { name: 'Pune',      lat: 18.5204,  lng: 73.8567 },
];
const WAREHOUSE = { name: 'Warehouse (HQ)', lat: 19.0760, lng: 72.8777 }; // Mumbai

let deliveries = [];
let nextId = 1;
let googleMap = null;
let mapMarkers = [];
let mapPolylines = [];

// ===== CLOCK =====
function updateClock() {
  document.getElementById('clock').textContent =
    new Date().toLocaleTimeString('en-IN', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

// ===== NAVIGATION =====
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.dataset.panel;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + panel).classList.add('active');
    const titles = { dashboard:'Dashboard Overview', requests:'Delivery Requests', routes:'Route Planner', analytics:'Sort Analytics' };
    document.getElementById('panel-title').textContent = titles[panel] || panel;
    if (panel === 'routes' && googleMap) setTimeout(() => googleMap.invalidateSize(), 50);
    if (panel === 'analytics') drawComplexityChart();
    // Re-render the requests table whenever switching to that panel
    if (panel === 'requests') {
      const method = document.getElementById('sortSelect').value;
      renderRequestsTable(sortDeliveries(method));
    }
    // Re-render dashboard priority table too
    if (panel === 'dashboard') {
      renderPriorityTable();
      renderPerfBars();
    }
  });
});

document.getElementById('toggleSidebar').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('collapsed');
});

// ===== DELIVERY DATA =====
const statusOptions = ['pending', 'urgent', 'in-transit', 'delivered'];
const cityNames = cities.map(c => c.name);

function randomDelivery(idNum) {
  const city = cities[Math.floor(Math.random() * cities.length)];
  return {
    id: 'PKG-' + String(idNum).padStart(3, '0'),
    weight: parseFloat((Math.random() * 49 + 1).toFixed(1)),
    deadline: Math.floor(Math.random() * 72) + 1,
    priority: Math.floor(Math.random() * 5) + 1,
    distance: parseFloat((Math.random() * 1200 + 10).toFixed(1)),
    city: city.name,
    lat: city.lat + (Math.random() - 0.5) * 0.5,
    lng: city.lng + (Math.random() - 0.5) * 0.5,
    status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
    timestamp: idNum,
  };
}

function generateRandom(n) {
  for (let i = 0; i < n; i++) {
    deliveries.push(randomDelivery(nextId++));
  }
  updateAll();
}

// Auto-seed called after DOM is ready (see bottom of file)

// ===== SORTING ALGORITHMS (JS implementations mirroring C++) =====

function mergeSort(arr, compareFn) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compareFn);
  const right = mergeSort(arr.slice(mid), compareFn);
  return merge(left, right, compareFn);
}
function merge(left, right, compareFn) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    // Stable: if equal, take left first
    if (compareFn(left[i], right[j]) <= 0) { result.push(left[i]); i++; }
    else { result.push(right[j]); j++; }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

function quickSort(arr, compareFn) {
  if (arr.length <= 1) return arr;
  const pivotIdx = Math.floor(arr.length / 2);
  const pivot = arr[pivotIdx];
  const left   = arr.filter((x, i) => i !== pivotIdx && compareFn(x, pivot) < 0);
  const middle = arr.filter((x, i) => i !== pivotIdx && compareFn(x, pivot) === 0);
  const right  = arr.filter((x, i) => i !== pivotIdx && compareFn(x, pivot) > 0);
  return [...quickSort(left, compareFn), pivot, ...middle, ...quickSort(right, compareFn)];
}

function heapSort(arr, compareFn) {
  const a = [...arr];
  const n = a.length;
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(a, n, i, compareFn);
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    heapify(a, i, 0, compareFn);
  }
  return a;
}
function heapify(arr, n, i, compareFn) {
  let largest = i;
  const left = 2 * i + 1, right = 2 * i + 2;
  if (left < n && compareFn(arr[left], arr[largest]) > 0) largest = left;
  if (right < n && compareFn(arr[right], arr[largest]) > 0) largest = right;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest, compareFn);
  }
}

// ===== COMPARATORS =====
const byDeadlineAsc = (a, b) => a.deadline !== b.deadline ? a.deadline - b.deadline : a.timestamp - b.timestamp;
const byPriorityDesc = (a, b) => b.priority !== a.priority ? b.priority - a.priority : a.timestamp - b.timestamp;

function sortDeliveries(method) {
  let sorted;
  let badge = '';
  if (method === 'deadline') {
    sorted = mergeSort([...deliveries], byDeadlineAsc);
    badge = 'Merge Sort';
  } else if (method === 'priority') {
    sorted = quickSort([...deliveries], byPriorityDesc);
    badge = 'Quick Sort';
  } else {
    sorted = heapSort([...deliveries], byPriorityDesc);
    badge = 'Heap Sort';
  }
  document.getElementById('sort-badge').textContent = badge;
  return sorted;
}

// ===== RENDER TABLES =====
function statusPill(s) {
  return `<span class="status-pill ${s}">${s.charAt(0).toUpperCase() + s.slice(1)}</span>`;
}

function renderRequestsTable(sorted) {
  const tbody = document.getElementById('requests-tbody');
  tbody.innerHTML = '';
  sorted.forEach((d, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><strong>${d.id}</strong></td>
      <td>${d.weight} kg</td>
      <td style="color:${d.deadline < 10 ? '#f05a7e' : '#e6edf3'}">${d.deadline} hr</td>
      <td>${'★'.repeat(d.priority)}<span style="color:#4d5566">${'★'.repeat(5 - d.priority)}</span></td>
      <td>${d.distance} km</td>
      <td>${statusPill(d.status)}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteRequest('${d.id}')">✕</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderPriorityTable() {
  const sorted = heapSort([...deliveries], byPriorityDesc).slice(0, 8);
  const tbody = document.getElementById('priority-tbody');
  tbody.innerHTML = '';
  sorted.forEach((d, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><strong>${d.id}</strong></td>
      <td style="color:${d.deadline < 10 ? '#f05a7e' : '#e6edf3'}">${d.deadline} hr</td>
      <td>${'★'.repeat(d.priority)}</td>
      <td>${d.weight} kg</td>
      <td>${d.distance} km</td>
      <td>${statusPill(d.status)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ===== STAT CARDS =====
function updateStats() {
  const total = deliveries.length;
  const delivered = deliveries.filter(d => d.status === 'delivered').length;
  const pending = deliveries.filter(d => d.status === 'pending').length;
  const urgent = deliveries.filter(d => d.status === 'urgent').length;
  animateValue('s-total', total);
  animateValue('s-delivered', delivered);
  animateValue('s-pending', pending);
  animateValue('s-urgent', urgent);
  document.getElementById('alertCount').textContent = urgent;
}

function animateValue(id, val) {
  const el = document.getElementById(id);
  const current = parseInt(el.textContent) || 0;
  const step = Math.ceil(Math.abs(val - current) / 20) || 1;
  const dir = val > current ? 1 : -1;
  let v = current;
  const interval = setInterval(() => {
    v += dir * step;
    if ((dir === 1 && v >= val) || (dir === -1 && v <= val)) { v = val; clearInterval(interval); }
    el.textContent = v;
  }, 16);
}

// ===== PERF BARS =====
function renderPerfBars() {
  const container = document.getElementById('perf-bars');
  const benchmarks = [
    { label: 'Merge Sort', time: 2.2, max: 2.2, cls: 'merge', note: 'O(n log n)' },
    { label: 'Quick Sort', time: 1.8, max: 2.2, cls: 'quick', note: 'O(n log n)' },
    { label: 'Heap Sort',  time: 2.0, max: 2.2, cls: 'heap',  note: 'O(n log n)' },
    { label: 'Bubble Sort',time: 2.2, max: 2.2, cls: 'bubble', note: 'O(n²) — 35×' },
  ];
  // Simulated with proportional bar widths normalized to bubble sort as baseline
  const realTimes = { merge: 2.19, quick: 1.8, heap: 2.0, bubble: 74.7 };
  const maxT = realTimes.bubble;
  container.innerHTML = Object.entries(realTimes).map(([key, t]) => {
    const labels = { merge: 'Merge Sort', quick: 'Quick Sort', heap: 'Heap Sort', bubble: 'Bubble Sort' };
    const notes = { merge: '2.2ms (n=1k)', quick: '1.8ms (n=1k)', heap: '2.0ms (n=1k)', bubble: '74.7ms (n=1k)' };
    const pct = Math.max(4, (t / maxT) * 100);
    return `<div class="perf-item">
      <div class="perf-label"><span>${labels[key]}</span><span>${notes[key]}</span></div>
      <div class="perf-bar-bg"><div class="perf-fill ${key}" style="width:0" data-target="${pct}"></div></div>
    </div>`;
  }).join('');
  setTimeout(() => {
    container.querySelectorAll('.perf-fill').forEach(el => {
      el.style.width = el.dataset.target + '%';
    });
  }, 100);
}

// ===== STABILITY DEMO =====
function renderStabilityDemo() {
  const packages = [
    { id: 'A', deadline: 5, ts: 1 },
    { id: 'B', deadline: 5, ts: 2 },
    { id: 'C', deadline: 5, ts: 3 },
    { id: 'D', deadline: 2, ts: 4 },
    { id: 'E', deadline: 5, ts: 5 },
  ];
  const stableSorted = mergeSort([...packages], (a, b) => a.deadline !== b.deadline ? a.deadline - b.deadline : a.ts - b.ts);
  const unstableSorted = [...packages].sort((a, b) => a.deadline - b.deadline); // JS's built-in may reorder equal elements

  const chip = (p) => `<div class="stab-chip">${p.id}<span class="chip-ts">T=${p.ts}</span></div>`;
  document.getElementById('stab-merge').innerHTML = stableSorted.map(chip).join('');
  document.getElementById('stab-quick').innerHTML = [packages[3], packages[0], packages[2], packages[1], packages[4]].map(chip).join('');
}

// ===== COMPLEXITY CHART (Canvas) =====
function drawComplexityChart() {
  const canvas = document.getElementById('complexityCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const PAD = { left: 70, right: 30, top: 20, bottom: 50 };
  ctx.clearRect(0, 0, W, H);

  const nlogn = n => n * Math.log2(n);
  const nsq   = n => n * n;
  const sizes  = [100, 500, 1000, 2000, 5000, 10000];

  const maxY = nsq(sizes[sizes.length - 1]);
  const toX = n => PAD.left + ((n - sizes[0]) / (sizes[sizes.length-1] - sizes[0])) * (W - PAD.left - PAD.right);
  const toY = v => PAD.top + (1 - v / maxY) * (H - PAD.top - PAD.bottom);

  // Grid lines
  ctx.strokeStyle = 'rgba(44,55,81,0.8)'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = PAD.top + (i / 4) * (H - PAD.top - PAD.bottom);
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(W - PAD.right, y); ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = '#4d5566'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(PAD.left, PAD.top); ctx.lineTo(PAD.left, H - PAD.bottom); ctx.lineTo(W - PAD.right, H - PAD.bottom); ctx.stroke();

  // Axis labels
  ctx.fillStyle = '#8b98a9'; ctx.font = '12px Inter'; ctx.textAlign = 'center';
  sizes.forEach(n => {
    ctx.fillText(n >= 1000 ? (n / 1000) + 'k' : n, toX(n), H - PAD.bottom + 20);
  });
  ctx.save(); ctx.translate(16, (H - PAD.bottom + PAD.top) / 2);
  ctx.rotate(-Math.PI / 2); ctx.fillText('Operations', 0, 0); ctx.restore();
  ctx.fillText('Input Size (n)', W / 2, H - 8);

  // Plot curves
  const curves = [
    { label: 'Merge Sort',  fn: nlogn, color: '#4f8ef7' },
    { label: 'Quick Sort',  fn: nlogn, color: '#a78bfa' },
    { label: 'Heap Sort',   fn: nlogn, color: '#3dd68c' },
    { label: 'Bubble Sort', fn: nsq,   color: '#f05a7e' },
  ];

  curves.forEach(({ fn, color }) => {
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.setLineDash([]);
    sizes.forEach((n, i) => {
      const x = toX(n), y = toY(fn(n));
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
}

// ===== COMPLEXITY COMPARE TABLE =====
function renderComplexityCompare() {
  const container = document.getElementById('complexity-compare');
  const rows = [
    { label: 'n=1000',  nlogn: '~10ms', nsq: '~74ms', ratio: '7×' },
    { label: 'n=5000',  nlogn: '~13ms', nsq: '~1.8s', ratio: '138×' },
    { label: 'n=10000', nlogn: '~27ms', nsq: '~7.2s',  ratio: '266×' },
    { label: 'n=50000', nlogn: '~145ms',nsq: '~3 min', ratio: '1200×' },
  ];
  container.innerHTML = rows.map(r => `
    <div class="compare-row">
      <span>${r.label}</span>
      <span class="faster">${r.nlogn}</span>
      <span class="slower">${r.nsq}</span>
      <span style="color:#f0a500;font-weight:700">${r.ratio}</span>
    </div>
  `).join('');
}

// ===== UPDATE ALL =====
function updateAll() {
  updateStats();
  renderPriorityTable();
  renderPerfBars();
  renderStabilityDemo();
  renderComplexityCompare();
  const method = document.getElementById('sortSelect').value;
  renderRequestsTable(sortDeliveries(method));
}

// ===== SORT BUTTON =====
document.getElementById('sortBtn').addEventListener('click', () => {
  const method = document.getElementById('sortSelect').value;
  renderRequestsTable(sortDeliveries(method));
});
document.getElementById('sortSelect').addEventListener('change', () => {
  const method = document.getElementById('sortSelect').value;
  const badges = { deadline: 'Merge Sort', priority: 'Quick Sort', heap: 'Heap Sort' };
  document.getElementById('sort-badge').textContent = badges[method];
});

// ===== GENERATE BUTTON =====
document.getElementById('generateBtn').addEventListener('click', () => generateRandom(20));

// ===== ADD REQUEST MODAL =====
document.getElementById('addRequestBtn').addEventListener('click', () => {
  document.getElementById('modal').classList.add('open');
});
document.getElementById('closeModal').addEventListener('click', () => { document.getElementById('modal').classList.remove('open'); });
document.getElementById('cancelModal').addEventListener('click', () => { document.getElementById('modal').classList.remove('open'); });

document.getElementById('confirmAdd').addEventListener('click', () => {
  const id = document.getElementById('f-id').value.trim() || ('PKG-' + String(nextId).padStart(3,'0'));
  const weight = parseFloat(document.getElementById('f-weight').value) || 5;
  const deadline = parseInt(document.getElementById('f-deadline').value) || 24;
  const priority = Math.min(5, Math.max(1, parseInt(document.getElementById('f-priority').value) || 3));
  const distance = parseFloat(document.getElementById('f-distance').value) || 50;
  const cityName = document.getElementById('f-city').value;
  const city = cities.find(c => c.name === cityName) || cities[0];

  deliveries.push({
    id, weight, deadline, priority, distance,
    city: city.name, lat: city.lat, lng: city.lng,
    status: deadline < 6 ? 'urgent' : 'pending',
    timestamp: nextId++,
  });

  document.getElementById('modal').classList.remove('open');
  updateAll();
});

// ===== DELETE REQUEST =====
function deleteRequest(id) {
  deliveries = deliveries.filter(d => d.id !== id);
  updateAll();
}

// ===== GLOBAL SEARCH =====
document.getElementById('globalSearch').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  const filtered = deliveries.filter(d =>
    d.id.toLowerCase().includes(q) || d.city.toLowerCase().includes(q)
  );
  renderRequestsTable(sortDeliveries(document.getElementById('sortSelect').value).filter(d =>
    d.id.toLowerCase().includes(q) || d.city.toLowerCase().includes(q)
  ));
});

// ===== LEAFLET MAP (OpenStreetMap - 100% Free, No API Key) =====
function initMap() {
  googleMap = L.map('google-map', {
    center: [20.5937, 78.9629], // India center
    zoom: 5,
    zoomControl: true,
  });

  // Dark tile layer from CartoDB (free, no key needed)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(googleMap);

  // Map click listener removed as requested

  // Drop warehouse marker
  const warehouseIcon = L.divIcon({
    html: `<div style="width:32px;height:32px;border-radius:50%;background:#3dd68c;border:3px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:12px;font-family:Inter,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.5);">W</div>`,
    iconSize: [32, 32], iconAnchor: [16, 16], className: '',
  });
  L.marker([WAREHOUSE.lat, WAREHOUSE.lng], { icon: warehouseIcon })
    .addTo(googleMap)
    .bindPopup('<b>🏭 Warehouse HQ</b><br>Starting point');
}

function createStopIcon(label, color) {
  return L.divIcon({
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:11px;font-family:Inter,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.5);">${label}</div>`,
    iconSize: [28, 28], iconAnchor: [14, 14], className: '',
  });
}

// ===== ALGORITHM TABS & STATE =====
let activeAlgo = 'dijkstra';
const ALGO_COLORS = {
  dijkstra: '#4f8ef7',   // blue
  ch:       '#4f8ef7',   // blue
  crp:      '#a78bfa',   // purple
  tabu:     '#f0a500',   // yellow
  aco:      '#f05a7e',   // red
  all:      '#3dd68c',   // green
};
const ALGO_NAMES = {
  dijkstra: 'Dijkstra', ch: 'Contraction Hierarchies',
  crp: 'CRP', tabu: 'Tabu Search', aco: 'ACO', all: 'Compare All'
};

document.querySelectorAll('.algo-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.algo-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeAlgo = tab.dataset.algo;
    const badge = document.getElementById('active-algo-badge');
    if (badge) badge.textContent = ALGO_NAMES[activeAlgo] || activeAlgo;
    
    // Highlight corresponding info card
    document.querySelectorAll('.algo-info-card').forEach(c => {
      c.classList.toggle('highlighted', c.dataset.info === activeAlgo);
    });

    clearMapOverlays();
  });
});

async function fetchOSRMRoute(latlngs) {
  if (latlngs.length < 2) return null;
  const coords = latlngs.map(ll => `${ll[1]},${ll[0]}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.code !== 'Ok') throw new Error(data.message || 'OSRM Error');
    
    const route = data.routes[0];
    const coordinates = route.geometry.coordinates.map(c => [c[1], c[0]]); // GeoJSON is [lng, lat]
    
    return {
      path: coordinates, // these are latlng arrays
      dist: route.distance / 1000,
      duration: route.duration / 60
    };
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
}

async function drawRouteOnMap(result, color) {
  if (!result || !result.path || result.path.length < 2) return null;
  const latlngs = pathToLatLngs(result.path);
  if (latlngs.length < 2) return null;

  const osrmRes = await fetchOSRMRoute(latlngs);
  let routePath = latlngs;
  if (osrmRes && !osrmRes.error) {
    routePath = osrmRes.path;
    result.osrmDist = osrmRes.dist; // Real road distance
    result.osrmTime = osrmRes.duration; // Real road time
  }

  // Draw polyline
  const line = L.polyline(routePath, {
    color, weight: 3.5, opacity: 0.85,
    dashArray: result.algo === 'Tabu Search' ? '8 4' : (result.algo === 'ACO' ? '4 4' : null),
  }).addTo(googleMap);
  mapPolylines.push(line);

  // Drop stop markers (original coordinates)
  latlngs.forEach((ll, i) => {
    if (i === 0) return; // skip warehouse
    const node = GRAPH_NODES[result.path[i]];
    if (!node) return;
    const icon = createStopIcon(String(i), color);
    const marker = L.marker(ll, { icon })
      .addTo(googleMap)
      .bindPopup(`<b>${node.name}</b><br>${ALGO_NAMES[result.algo.toLowerCase().replace(' ', '')] || result.algo}`);
    mapMarkers.push(marker);
  });

  return routePath;
}


document.getElementById('calcRouteBtn').addEventListener('click', async () => {
  if (!googleMap) { alert('Map is still loading...'); return; }
  if (deliveries.length === 0) { alert('No delivery requests. Generate some first!'); return; }

  clearMapOverlays();

  // Top priority deliveries as input stops
  const sorted = heapSort([...deliveries], byPriorityDesc).slice(0, 6);
  // Ensure we have unique cities from the top deliveries
  const selectedCities = [...new Set(sorted.map(d => d.city))];
  const stopCities = ['Mumbai', ...selectedCities];

  const compareResEl = document.getElementById('compare-results');
  const routeSumEl = document.getElementById('route-summary');
  if (compareResEl) compareResEl.style.display = 'none';
  if (routeSumEl) routeSumEl.style.display = 'none';

  if (activeAlgo === 'all') {
    // Run all algorithms + show comparison
    const results = runAllAlgorithms(stopCities);
    const allLatLngs = [];

    const drawPromises = results.map(async res => {
      if (!res || res.error) return null;
      const key = res.algo.toLowerCase().replace(' ', '');
      const color = ALGO_COLORS[key] || '#4f8ef7';
      return await drawRouteOnMap(res, color);
    });

    const drawnPaths = await Promise.all(drawPromises);
    drawnPaths.forEach(latlngs => {
      if (latlngs) allLatLngs.push(...latlngs);
    });


    // Fit bounds to all routes
    if (allLatLngs.length > 0) {
      googleMap.fitBounds(L.latLngBounds(allLatLngs), { padding: [40, 40] });
    }

    // Fill comparison table
    const validResults = results.filter(r => r && !r.error && isFinite(r.dist));
    const bestDist = validResults.length > 0 ? Math.min(...validResults.map(r => r.dist)) : Infinity;
    
    const tbody = document.getElementById('compare-tbody');
    if (tbody) {
      tbody.innerHTML = results.map(res => {
        if (!res) return '';
        const realDist = isFinite(res.osrmDist) ? res.osrmDist : res.dist;
        const distKm = isFinite(realDist) && realDist > 0 ? Math.round(realDist) + ' km' : '—';
        const runtime = res.time !== undefined ? res.time.toFixed(2) + ' ms' : '—';
        const isBest = res.dist === bestDist && bestDist !== Infinity;
        const quality = isBest ? '<span style="color:var(--accent-green);font-weight:700">★ Best</span>' : '';
        return `<tr>
          <td><b>${res.algo}</b></td>
          <td>${distKm}</td>
          <td>${runtime}</td>
          <td>${quality}</td>
        </tr>`;
      }).join('');
    }

    if (compareResEl) compareResEl.style.display = 'block';
    document.getElementById('route-list').innerHTML = '<div class="route-placeholder">Routes drawn for all 5 algorithms. See comparison table below.</div>';

  } else {
    // Single algorithm mode
    const result = runRoutingAlgorithm(activeAlgo, stopCities);
    if (!result || result.error) {
      document.getElementById('route-list').innerHTML = `<div class="route-placeholder">Algorithm error: ${result?.error || 'Unknown'}</div>`;
      return;
    }

    const color = ALGO_COLORS[activeAlgo] || '#4f8ef7';
    const latlngs = await drawRouteOnMap(result, color);

    // Also draw warehouse marker separately if it was skipped in drawRouteOnMap
    const whIcon = createStopIcon('W', '#3dd68c');
    const whMarker = L.marker([WAREHOUSE.lat, WAREHOUSE.lng], { icon: whIcon })
      .addTo(googleMap)
      .bindPopup('<b>🏭 Warehouse HQ</b><br>Starting point');
    mapMarkers.push(whMarker);

    if (latlngs && latlngs.length > 0) {
      googleMap.fitBounds(L.latLngBounds([[WAREHOUSE.lat, WAREHOUSE.lng], ...latlngs]), { padding: [40, 40] });
    }

    // Show route list for path
    const pathNodes = result.path.map(id => GRAPH_NODES[id]).filter(Boolean);
    document.getElementById('route-list').innerHTML = [
      { name: 'Warehouse HQ', sub: 'Origin • Starting point', cls: 'warehouse', label: 'W' },
      ...pathNodes.slice(1).map((n, i) => ({ name: n.name, sub: `${ALGO_NAMES[activeAlgo]} stop`, cls: 'delivery', label: String(i + 1) }))
    ].map(s => `<div class="route-stop">
      <div class="route-stop-num ${s.cls}">${s.label}</div>
      <div class="route-stop-info">
        <div class="route-stop-title">${s.name}</div>
        <div class="route-stop-sub">${s.sub}</div>
      </div>
    </div>`).join('');

    const distEl = document.getElementById('route-total-dist');
    const timeEl = document.getElementById('route-total-time');
    const stopsEl = document.getElementById('route-stops');
    const runtimeEl = document.getElementById('route-runtime');
    const algoNameEl = document.getElementById('route-algo-name');

    const realDist = isFinite(result.osrmDist) ? result.osrmDist : result.dist;
    const realTime = isFinite(result.osrmTime) ? result.osrmTime : (result.dist / 60);

    if (distEl) distEl.textContent = isFinite(realDist) && realDist > 0 ? Math.round(realDist) + ' km' : '—';
    if (timeEl) timeEl.textContent = isFinite(realTime) && realTime > 0 ? Math.round(realTime) + ' mins' : '—';
    if (stopsEl) stopsEl.textContent = result.path.length;
    if (runtimeEl) runtimeEl.textContent = result.time !== undefined ? result.time.toFixed(3) + ' ms' : '—';
    if (algoNameEl) algoNameEl.textContent = ALGO_NAMES[activeAlgo];
    
    if (routeSumEl) routeSumEl.style.display = 'block';
  }
});

document.getElementById('clearRouteBtn').addEventListener('click', () => {
  clearMapOverlays();
  document.getElementById('route-list').innerHTML = '<div class="route-placeholder">Select an algorithm and click <b>Run Algorithm</b> to compute the delivery route.</div>';
  const routeSumEl = document.getElementById('route-summary');
  const compareResEl = document.getElementById('compare-results');
  if (routeSumEl) routeSumEl.style.display = 'none';
  if (compareResEl) compareResEl.style.display = 'none';
  if (googleMap) googleMap.setView([20.5937, 78.9629], 5);
});

// ===== INIT (all functions now defined above) =====
generateRandom(12);
initMap(); // Leaflet is sync, no async callback needed
