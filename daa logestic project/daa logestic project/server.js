/**
 * Logistics Optimization Platform - Web Server
 * Pure JavaScript/HTML/CSS Implementation with SQLite Database
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Logistics Platform Server Running with Database' });
});

// API routes for delivery management
let nextId = 1;

app.get('/api/deliveries', async (req, res) => {
  try {
    const deliveries = await db.getAllDeliveries();
    res.json(deliveries);
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});

app.post('/api/deliveries', async (req, res) => {
  try {
    const { id, weight, deadline, priority, distance, city, lat, lng, status } = req.body;
    const delivery = {
      id: id || `PKG-${String(nextId).padStart(3, '0')}`,
      weight: weight || 5,
      deadline: deadline || 24,
      priority: priority || 3,
      distance: distance || 50,
      city: city || 'Mumbai',
      lat: lat || 19.0760,
      lng: lng || 72.8777,
      status: status || 'pending',
      timestamp: nextId++
    };

    const result = await db.addDelivery(delivery);
    res.json(result);
  } catch (error) {
    console.error('Error adding delivery:', error);
    res.status(500).json({ error: 'Failed to add delivery' });
  }
});

app.delete('/api/deliveries/:id', async (req, res) => {
  try {
    const result = await db.deleteDelivery(req.params.id);
    if (result.deleted) {
      res.json({ message: 'Delivery deleted successfully' });
    } else {
      res.status(404).json({ error: 'Delivery not found' });
    }
  } catch (error) {
    console.error('Error deleting delivery:', error);
    res.status(500).json({ error: 'Failed to delete delivery' });
  }
});

// Additional API endpoints for database operations
app.put('/api/deliveries/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await db.updateDeliveryStatus(req.params.id, status);
    if (result.updated) {
      res.json({ message: 'Delivery status updated successfully' });
    } else {
      res.status(404).json({ error: 'Delivery not found' });
    }
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
});

app.delete('/api/deliveries', async (req, res) => {
  try {
    const result = await db.clearAllDeliveries();
    res.json({ message: `Cleared ${result.deleted} deliveries` });
  } catch (error) {
    console.error('Error clearing deliveries:', error);
    res.status(500).json({ error: 'Failed to clear deliveries' });
  }
});

// Serve index.html for all non-API routes (SPA support)
app.get('*', (req, res) => {
  if (!req.url.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Logistics Optimization Platform Running with SQLite Database`);
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🗺️  Frontend: http://localhost:${PORT}`);
  console.log(`⚡ API Health: http://localhost:${PORT}/health`);
  console.log(`💾 Database: logistics.db\n`);
});
