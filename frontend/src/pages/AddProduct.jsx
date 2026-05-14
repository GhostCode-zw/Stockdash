import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const AddProduct = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    reorder_level: '',
    risk_level: 'low',
    order_priority: 'normal'
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/stock/categories/')
        setCategories(res.data)
      } catch {
        setError('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.sku || !formData.name || !formData.category || !formData.price || !formData.quantity || !formData.reorder_level) {
      setError('Please fill all required fields')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.post('/api/stock/products/', {
        sku: formData.sku,
        name: formData.name,
        description: formData.description,
        category: parseInt(formData.category),   // FK must be integer
        price: parseFloat(formData.price),        // decimal field
        quantity: parseInt(formData.quantity),    // integer field
        reorder_level: parseInt(formData.reorder_level),
        risk_level: formData.risk_level,
        order_priority: formData.order_priority
      })
      navigate('/products')
    } catch {
      setError('Failed to add product. Check all fields and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Add Product</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: '16px' }}>
          <label>SKU *</label><br />
          <input name="sku" type="text" value={formData.sku}
            onChange={handleChange} style={{ width: '100%', padding: '8px' }} required />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Name *</label><br />
          <input name="name" type="text" value={formData.name}
            onChange={handleChange} style={{ width: '100%', padding: '8px' }} required />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Description</label><br />
          <textarea name="description" value={formData.description}
            onChange={handleChange} style={{ width: '100%', padding: '8px', minHeight: '80px' }} />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Category *</label><br />
          <select name="category" value={formData.category}
            onChange={handleChange} style={{ width: '100%', padding: '8px' }} required>
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Price *</label><br />
          <input name="price" type="number" step="0.01" min="0" value={formData.price}
            onChange={handleChange} style={{ width: '100%', padding: '8px' }} required />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Quantity *</label><br />
          <input name="quantity" type="number" min="0" value={formData.quantity}
            onChange={handleChange} style={{ width: '100%', padding: '8px' }} required />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Reorder Level *</label><br />
          <input name="reorder_level" type="number" min="0" value={formData.reorder_level}
            onChange={handleChange} style={{ width: '100%', padding: '8px' }} required />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Risk Level</label><br />
          <select name="risk_level" value={formData.risk_level}
            onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Order Priority</label><br />
          <select name="order_priority" value={formData.order_priority}
            onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <button type="submit" disabled={loading} style={{
          padding: '10px 16px',
          backgroundColor: loading ? '#9ca3af' : '#3b82f6',
          color: 'white', border: 'none', borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%'
        }}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>

      </form>
    </div>
  )
}

export default AddProduct