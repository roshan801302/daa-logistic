const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'logistics.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS deliveries (
      id TEXT PRIMARY KEY,
      weight REAL DEFAULT 5.0,
      deadline INTEGER DEFAULT 24,
      priority INTEGER DEFAULT 3,
      distance REAL DEFAULT 50.0,
      city TEXT DEFAULT 'Mumbai',
      lat REAL DEFAULT 19.0760,
      lng REAL DEFAULT 72.8777,
      status TEXT DEFAULT 'pending',
      timestamp INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('Error creating deliveries table:', err.message);
    } else {
      console.log('Deliveries table ready.');
    }
  });
}

// Database operations
const databaseOperations = {
  // Get all deliveries
  getAllDeliveries: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM deliveries ORDER BY timestamp ASC', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // Add new delivery
  addDelivery: (delivery) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO deliveries (id, weight, deadline, priority, distance, city, lat, lng, status, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        delivery.id,
        delivery.weight,
        delivery.deadline,
        delivery.priority,
        delivery.distance,
        delivery.city,
        delivery.lat,
        delivery.lng,
        delivery.status,
        delivery.timestamp
      ];

      db.run(sql, values, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ ...delivery, id: delivery.id });
        }
      });
    });
  },

  // Delete delivery by ID
  deleteDelivery: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM deliveries WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  },

  // Get delivery by ID
  getDeliveryById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM deliveries WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Update delivery status
  updateDeliveryStatus: (id, status) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE deliveries SET status = ? WHERE id = ?',
        [status, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ updated: this.changes > 0 });
          }
        }
      );
    });
  },

  // Clear all deliveries
  clearAllDeliveries: () => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM deliveries', [], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes });
        }
      });
    });
  }
};

module.exports = databaseOperations;