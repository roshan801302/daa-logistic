import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());

let deliveries = [];

app.get('/api/deliveries', (req, res) => {
  return res.json(deliveries);
});

app.post('/api/deliveries', (req, res) => {
  const { id, destination, weight, deadline, priority } = req.body;
  if (!destination) return res.status(400).json({ error: 'Destination is required' });
  const newDelivery = {
    id: id || `PKG-${String(deliveries.length + 1).padStart(3, '0')}`,
    destination,
    weight: parseFloat(weight) || 0,
    deadline: parseInt(deadline, 10) || 24,
    priority: parseInt(priority, 10) || 3,
    status: 'pending',
  };
  deliveries.push(newDelivery);
  return res.status(201).json(newDelivery);
});

app.delete('/api/deliveries/:id', (req, res) => {
  const { id } = req.params;
  deliveries = deliveries.filter((d) => d.id !== id);
  return res.status(204).send();
});

app.get('/api/status', (req, res) => {
  return res.json({ healthy: true, count: deliveries.length });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API server listening on http://localhost:${port}`));
