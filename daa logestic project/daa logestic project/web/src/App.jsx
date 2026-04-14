import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [deliveries, setDeliveries] = useState([])
  const [formData, setFormData] = useState({
    id: '',
    destination: '',
    weight: '',
    deadline: '',
    priority: '3'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDeliveries = async () => {
      try {
        const response = await fetch('/api/deliveries')
        const data = await response.json()
        setDeliveries(data)
      } catch (err) {
        console.error('Failed to load deliveries', err)
        setError('Unable to reach the backend API')
      }
    }
    loadDeliveries()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const body = await response.json()
        throw new Error(body.error || 'Failed to add delivery')
      }

      const newDelivery = await response.json()
      setDeliveries((prev) => [...prev, newDelivery])
      setFormData({ id: '', destination: '', weight: '', deadline: '', priority: '3' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteDelivery = async (id) => {
    try {
      await fetch(`/api/deliveries/${id}`, { method: 'DELETE' })
      setDeliveries((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      setError('Failed to remove delivery')
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Logistics Delivery Manager</h1>
      </header>
      <main>
        <section className="form-section">
          <h2>Add New Delivery</h2>
          <form onSubmit={handleSubmit} className="delivery-form">
            <div className="form-group">
              <label htmlFor="id">Package ID (optional)</label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                placeholder="Auto-generated if empty"
              />
            </div>
            <div className="form-group">
              <label htmlFor="destination">Destination City</label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="Enter city name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="e.g. 12.5"
                step="0.1"
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="deadline">Deadline (hours)</label>
              <input
                type="number"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                placeholder="e.g. 24"
                min="1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority (1-5)</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="1">1 - Low</option>
                <option value="2">2</option>
                <option value="3">3 - Medium</option>
                <option value="4">4</option>
                <option value="5">5 - High</option>
              </select>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Add Delivery'}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </section>

        <section className="deliveries-section">
          <h2>Delivery Requests ({deliveries.length})</h2>
          {deliveries.length === 0 ? (
            <p>No deliveries added yet.</p>
          ) : (
            <div className="deliveries-list">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="delivery-card">
                  <div className="delivery-header">
                    <h3>{delivery.id}</h3>
                    <button
                      onClick={() => deleteDelivery(delivery.id)}
                      className="delete-btn"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="delivery-details">
                    <p><strong>Destination:</strong> {delivery.destination}</p>
                    <p><strong>Weight:</strong> {delivery.weight} kg</p>
                    <p><strong>Deadline:</strong> {delivery.deadline} hours</p>
                    <p><strong>Priority:</strong> {delivery.priority}/5</p>
                    <p><strong>Status:</strong> <span className={`status ${delivery.status}`}>{delivery.status}</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
