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

let deliveries = [];
let nextId = 1;
let googleMap = null;
let mapMarkers = [];
let mapPolylines = [];
let selectedMapLocation = null;
let selectedMapCity = null;
let destinationMarker = null;

// Use main warehouse as hub instead of WAREHOUSE
const PRIMARY_HUB = MAIN_WAREHOUSES[0]; // Mumbai Main Hub

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
    const titles = { dashboard:'Dashboard Overview', requests:'Delivery Requests', routes:'Route Planner' };
    document.getElementById('panel-title').textContent = titles[panel] || panel;
    if (panel === 'routes' && googleMap) setTimeout(() => googleMap.invalidateSize(), 50);
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

// ===== UPDATE ALL =====
function updateAll() {
  updateStats();
  renderPriorityTable();
  renderPerfBars();
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
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('modal').classList.remove('open');
  selectedMapLocation = null;
  selectedMapCity = null;
  document.getElementById('f-destination').value = '';
});
document.getElementById('cancelModal').addEventListener('click', () => {
  document.getElementById('modal').classList.remove('open');
  selectedMapLocation = null;
  selectedMapCity = null;
  document.getElementById('f-destination').value = '';
});

document.getElementById('confirmAdd').addEventListener('click', () => {
  const id = document.getElementById('f-id').value.trim() || ('PKG-' + String(nextId).padStart(3,'0'));
  const weight = parseFloat(document.getElementById('f-weight').value) || 5;
  const deadline = parseInt(document.getElementById('f-deadline').value) || 24;
  const priority = Math.min(5, Math.max(1, parseInt(document.getElementById('f-priority').value) || 3));
  const distance = parseFloat(document.getElementById('f-distance').value) || 50;
  const destinationText = document.getElementById('f-destination').value.trim();
  const city = cities.find(c => c.name.toLowerCase() === destinationText.toLowerCase()) || selectedMapCity || cities[0];

  const lat = selectedMapLocation ? selectedMapLocation.lat : city.lat;
  const lng = selectedMapLocation ? selectedMapLocation.lng : city.lng;
  const cityName = city.name || destinationText || 'Unknown';

  deliveries.push({
    id, weight, deadline, priority, distance,
    city: cityName, lat, lng,
    status: deadline < 6 ? 'urgent' : 'pending',
    timestamp: nextId++,
  });

  selectedMapLocation = null;
  selectedMapCity = null;
  if (destinationMarker) { googleMap.removeLayer(destinationMarker); destinationMarker = null; }

  document.getElementById('modal').classList.remove('open');
  document.getElementById('f-destination').value = '';
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

  googleMap.on('click', onMapClick);

  // Drop main warehouse markers
  const mainHubIcon = L.divIcon({
    html: `<div style="width:32px;height:32px;border-radius:50%;background:#3dd68c;border:3px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:12px;font-family:Inter,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.5);">W</div>`,
    iconSize: [32, 32], iconAnchor: [16, 16], className: '',
  });
  
  // Add all main warehouses
  MAIN_WAREHOUSES.forEach(wh => {
    L.marker([wh.lat, wh.lng], { icon: mainHubIcon })
      .addTo(googleMap)
      .bindPopup(`<b>🏭 ${wh.name}</b><br>Region: ${wh.region}<br>Main Hub`);
  });
  
  // Add all regional warehouse markers
  const regionalIcon = L.divIcon({
    html: `<div style="width:18px;height:18px;border-radius:50%;background:#4f8ef7;border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:10px;font-family:Inter,sans-serif;box-shadow:0 2px 4px rgba(0,0,0,.3);">R</div>`,
    iconSize: [18, 18], iconAnchor: [9, 9], className: '',
  });
  REGIONAL_WAREHOUSES.forEach(wh => {
    L.marker([wh.lat, wh.lng], { icon: regionalIcon })
      .addTo(googleMap)
      .bindPopup(`<b>${wh.name}</b><br>Regional Hub<br>Parent: ${wh.parent}`);
  });

  // Add all sub-regional warehouse markers
  const subIcon = L.divIcon({
    html: `<div style="width:10px;height:10px;border-radius:50%;background:#a855f7;border:1px solid #fff;box-shadow:0 1px 2px rgba(0,0,0,.2);"></div>`,
    iconSize: [10, 10], iconAnchor: [5, 5], className: '',
  });
  SUB_WAREHOUSES.forEach(wh => {
    L.marker([wh.lat, wh.lng], { icon: subIcon })
      .addTo(googleMap)
      .bindPopup(`<b>${wh.name}</b><br>Sub-Regional Hub<br>Parent: ${wh.parent}`);
  });
}

function createStopIcon(label, color) {
  return L.divIcon({
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:11px;font-family:Inter,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.5);">${label}</div>`,
    iconSize: [28, 28], iconAnchor: [14, 14], className: '',
  });
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distanceKm(a, b) {
  const R = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const sinHalfLat = Math.sin(dLat / 2);
  const sinHalfLng = Math.sin(dLng / 2);
  const aa = sinHalfLat * sinHalfLat + Math.cos(lat1) * Math.cos(lat2) * sinHalfLng * sinHalfLng;
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return R * c;
}

function findNearestCity(lat, lng) {
  let best = null;
  let bestDist = Infinity;
  cities.forEach(city => {
    const d = distanceKm({ lat, lng }, city);
    if (d < bestDist) {
      bestDist = d;
      best = city;
    }
  });
  return best;
}

function onMapClick(e) {
  const { lat, lng } = e.latlng;
  selectedMapLocation = { lat, lng };
  selectedMapCity = findNearestCity(lat, lng);

  const destName = selectedMapCity ? selectedMapCity.name : `Lat ${lat.toFixed(3)}, Lon ${lng.toFixed(3)}`;
  const destField = document.getElementById('f-destination');
  if (destField) {
    destField.value = destName;
  }

  if (destinationMarker) {
    googleMap.removeLayer(destinationMarker);
  }

  destinationMarker = L.marker([lat, lng], { icon: createStopIcon('D', '#f05a7e') })
    .addTo(googleMap)
    .bindPopup(`<b>Destination</b><br>${destName}`)
    .openPopup();
}

// ===== ALGORITHM TABS & STATE =====
// Single algorithm mode - only Dijkstra (Best algorithm)

// ===== CLEAR MAP OVERLAYS =====
function clearMapOverlays() {
  // Remove all polylines (routes)
  mapPolylines.forEach(line => {
    try { googleMap.removeLayer(line); } catch (e) {}
  });
  mapPolylines = [];

  // Remove all markers (except warehouse)
  mapMarkers.forEach(marker => {
    try { googleMap.removeLayer(marker); } catch (e) {}
  });
  mapMarkers = [];

  // Re-add warehouse marker
  const warehouseIcon = L.divIcon({
    html: `<div style="width:32px;height:32px;border-radius:50%;background:#3dd68c;border:3px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:12px;font-family:Inter,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.5);">W</div>`,
    iconSize: [32, 32], iconAnchor: [16, 16], className: '',
  });
  L.marker([PRIMARY_HUB.lat, PRIMARY_HUB.lng], { icon: warehouseIcon })
    .addTo(googleMap)
    .bindPopup(`<b>🏭 ${PRIMARY_HUB.name}</b><br>Primary Distribution Hub`);
}

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

  const line = L.polyline(routePath, {
    color, weight: 3.5, opacity: 0.85,
    dashArray: result.algo === 'Tabu Search' ? '8 4' : (result.algo === 'ACO' ? '4 4' : null),
  }).addTo(googleMap);
  mapPolylines.push(line);

  return routePath;
}

function findNearestSubWarehouse(lat, lng) {
  let nearest = null;
  let bestDist = Infinity;

  SUB_WAREHOUSES.forEach(wh => {
    const d = distanceKm({ lat, lng }, { lat: wh.lat, lng: wh.lng });
    if (d < bestDist) {
      bestDist = d;
      nearest = wh;
    }
  });

  return nearest;
}

function buildHierarchicalRoutePoints(sortedDeliveries) {
  const routePoints = [{
    id: PRIMARY_HUB.id,
    name: PRIMARY_HUB.name,
    lat: PRIMARY_HUB.lat,
    lng: PRIMARY_HUB.lng,
    type: 'main'
  }];

  sortedDeliveries.forEach(delivery => {
    const subHub = findNearestSubWarehouse(delivery.lat, delivery.lng);
    const regionalHub = subHub && WAREHOUSE_MAP[subHub.parent];

    if (regionalHub && routePoints[routePoints.length - 1].id !== regionalHub.id) {
      routePoints.push({
        id: regionalHub.id,
        name: regionalHub.name,
        lat: regionalHub.lat,
        lng: regionalHub.lng,
        type: 'regional'
      });
    }

    if (subHub && routePoints[routePoints.length - 1].id !== subHub.id) {
      routePoints.push({
        id: subHub.id,
        name: subHub.name,
        lat: subHub.lat,
        lng: subHub.lng,
        type: 'sub-regional'
      });
    }

    routePoints.push({
      id: delivery.id,
      name: `${delivery.id} (${delivery.city})`,
      lat: delivery.lat,
      lng: delivery.lng,
      type: 'delivery'
    });
  });

  return routePoints;
}

function normalizeRoutePoints(points) {
  const normalized = [];
  const seen = new Set();

  points.forEach(point => {
    const key = `${point.type || 'unknown'}-${point.id}`;
    if (!seen.has(key)) {
      normalized.push(point);
      seen.add(key);
    }
  });

  return normalized;
}

function routePointLabel(point, index) {
  if (point.type === 'main') return `W`;
  if (point.type === 'regional') return `R`;
  if (point.type === 'sub-regional') return `S`;
  return String(index);
}


document.getElementById('calcRouteBtn').addEventListener('click', async () => {
  if (!googleMap) { alert('Map is still loading...'); return; }
  if (deliveries.length === 0) { alert('No delivery requests. Generate some first!'); return; }

  clearMapOverlays();

  // Get top 6 priority deliveries (actual delivery locations, not cities)
  const sorted = heapSort([...deliveries], byPriorityDesc).slice(0, 6);
  
  // Build waypoints list: warehouse + delivery locations  
  const deliveryStops = sorted.map(d => ({ name: d.id + ' (' + d.city + ')', lat: d.lat, lng: d.lng }));
  const allStops = [{ lat: PRIMARY_HUB.lat, lng: PRIMARY_HUB.lng }, ...deliveryStops.map(s => ({ lat: s.lat, lng: s.lng }))];

  // Draw delivery markers on map
  sorted.forEach((d, i) => {
    const icon = createStopIcon(String(i + 1), '#f59e0b');
    const marker = L.marker([d.lat, d.lng], { icon })
      .addTo(googleMap)
      .bindPopup(`<b>${d.id}</b><br>Priority: ${d.priority}★<br>Deadline: ${d.deadline}h`);
    mapMarkers.push(marker);
  });

  // Build hierarchical route points through main → regional → sub-regional → delivery
  const routePoints = normalizeRoutePoints(buildHierarchicalRoutePoints(sorted));
  const routeCoords = routePoints.map(point => ({ lat: point.lat, lng: point.lng }));

  try {
    const osrmRes = await fetchOSRMRoute(routeCoords.map(s => [s.lat, s.lng]));
    if (osrmRes && !osrmRes.error) {
      const line = L.polyline(osrmRes.path, {
        color: '#4f8ef7',
        weight: 3.5, opacity: 0.85,
      }).addTo(googleMap);
      mapPolylines.push(line);

      if (osrmRes.path.length > 0) {
        googleMap.fitBounds(L.latLngBounds(osrmRes.path), { padding: [40, 40] });
      }

      document.getElementById('route-list').innerHTML = routePoints.map((point, index) => {
        const labels = {
          main: 'Primary Hub • Start',
          regional: 'Regional Hub',
          'sub-regional': 'Sub-Regional Warehouse',
          delivery: 'Final Delivery'
        };
        return `<div class="route-stop">
          <div class="route-stop-num ${point.type || 'delivery'}">${routePointLabel(point, index)}</div>
          <div class="route-stop-info">
            <div class="route-stop-title">${point.name}</div>
            <div class="route-stop-sub">${labels[point.type] || 'Delivery Stop'}</div>
          </div>
        </div>`;
      }).join('');

      const distEl = document.getElementById('route-total-dist');
      const timeEl = document.getElementById('route-total-time');
      const stopsEl = document.getElementById('route-stops');
      const algoNameEl = document.getElementById('route-algo-name');

      if (distEl) distEl.textContent = Math.round(osrmRes.dist) + ' km';
      if (timeEl) timeEl.textContent = Math.round(osrmRes.duration) + ' mins';
      if (stopsEl) stopsEl.textContent = routePoints.length;
      if (algoNameEl) algoNameEl.textContent = 'Dijkstra (Hierarchical)';

      const routeSumEl = document.getElementById('route-summary');
      if (routeSumEl) routeSumEl.style.display = 'block';
    }
  } catch (err) {
    document.getElementById('route-list').innerHTML = '<div class="route-placeholder">Error calculating route: ' + err.message + '</div>';
  }
});

document.getElementById('clearRouteBtn').addEventListener('click', () => {
  clearMapOverlays();
  document.getElementById('route-list').innerHTML = '<div class="route-placeholder">Click <b>Calculate Route</b> to compute optimal delivery route.</div>';
  const routeSumEl = document.getElementById('route-summary');
  if (routeSumEl) routeSumEl.style.display = 'none';
  if (googleMap) googleMap.setView([20.5937, 78.9629], 5);
});

// ===== INIT (all functions now defined above) =====
generateRandom(12);
initMap(); // Leaflet is sync, no async callback needed
