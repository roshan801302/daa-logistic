# Logistics Optimization Platform

A pure **JavaScript/HTML/CSS** web application for logistics optimization, delivery routing, and performance analysis of sorting algorithms in real-time.

## 🎯 Features

- **Delivery Management**: Add, view, and manage delivery requests
- **Sorting Algorithms**: Compare Merge Sort, Quick Sort, Heap Sort, and Bubble Sort in action
- **Route Planner**: Optimized route planning using multiple algorithms (Dijkstra, Tabu Search, ACO, etc.)
- **Performance Analysis**: Real-time metrics and complexity analysis
- **Interactive Map**: Leaflet-based OpenStreetMap integration for route visualization
- **Stability Testing**: Demonstrate stable vs. unstable sorting algorithms

## 📋 Tech Stack

- **Frontend**: Pure JavaScript (ES6+) with HTML5 and CSS3
- **Backend**: Node.js + Express.js
- **Database**: SQLite3 for data persistence
- **Routing**: OSRM (Open Source Routing Machine) API
- **Mapping**: Leaflet + OpenStreetMap
- **No External Dependencies**: Uses only standard web APIs and open-source libraries

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The platform will be available at [http://localhost:8000](http://localhost:8000)

### Alternative: Using run.sh Script

```bash
chmod +x run.sh
./run.sh
```

## 📁 Project Structure

```
daa logestic project/
├── frontend/                 # Web UI files
│   ├── index.html           # Main HTML interface
│   ├── app.js              # Core sorting & delivery logic
│   ├── routing_algorithms.js # Route planning algorithms
│   └── style.css           # Styling
├── server.js               # Express.js web server
├── package.json            # Node.js dependencies
├── run.sh                  # Startup script
└── README.md              # This file
```

## 🎮 How to Use

1. **Generate Deliveries**: Click "Generate Random" to create sample delivery requests
2. **Add Deliveries**: Use the form to manually add delivery requests
3. **Select Sorting Method**: Choose between Merge, Quick, or Heap Sort
4. **View Route**: Click "Run Algorithm" to see optimized delivery routes
5. **Analyze Performance**: Check the dashboard for complexity and performance metrics

## 🔬 Sorting Algorithms Included

- **Merge Sort**: O(n log n) - Stable ✅
- **Quick Sort**: O(n log n) - Unstable ❌
- **Heap Sort**: O(n log n) - Unstable ❌
- **Bubble Sort**: O(n²) - Stable ✅

## 🗺️ Routing Algorithms

- **Dijkstra**: Shortest path algorithm
- **Contraction Hierarchies**: Fast shortest path
- **CRP**: Customizable Route Planning
- **Tabu Search**: Metaheuristic optimization
- **ACO**: Ant Colony Optimization

## 💾 Database

The application uses SQLite3 for data persistence. The database file `logistics.db` is automatically created in the project root directory.

### Database Schema

**deliveries table:**
- `id` (TEXT, PRIMARY KEY) - Unique delivery identifier
- `weight` (REAL) - Package weight in kg
- `deadline` (INTEGER) - Delivery deadline in hours
- `priority` (INTEGER) - Priority level (1-5)
- `distance` (REAL) - Delivery distance in km
- `city` (TEXT) - Destination city
- `lat` (REAL) - Latitude coordinate
- `lng` (REAL) - Longitude coordinate
- `status` (TEXT) - Delivery status (pending, in-transit, delivered)
- `timestamp` (INTEGER) - Creation timestamp
- `created_at` (DATETIME) - Automatic creation timestamp

## 🎨 Customization

Modify `frontend/app.js` to adjust:
- Algorithm implementations
- UI behavior
- Default parameters
- Color schemes and styling

## 📊 Performance Metrics

The platform displays:
- Runtime complexity (O-notation)
- Actual execution time (milliseconds)
- Distance calculations (Haversine formula)
- Route optimization results

## 🔗 External APIs

- **OSRM**: Open Source Routing Machine for real-world distance calculations
- **OpenStreetMap**: Map tiles and geographic data (free, no API key)

## 📝 License

Open source project for educational and commercial use.

## 🤝 Support

For issues or questions, refer to the code comments in:
- `frontend/app.js` - Main application logic
- `frontend/routing_algorithms.js` - Route planning implementations
- `server.js` - Backend API

---

**Built with ❤️ using pure JavaScript, HTML, and CSS**
