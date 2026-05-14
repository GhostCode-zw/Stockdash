import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const AddTransaction = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    product: '',
    transaction_type: '',
    quantity: '',
    reference_number: '',
    notes: ''
  })
  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getAvailableTypes = () => {
    if (user?.role === 'admin') 
      return ['purchase', 'sell', 'return', 'adjustment', 'transfer']
    if (user?.role === 'inventory_manager') 
      return ['purchase', 'return', 'adjustment', 'transfer']
    if (user?.role === 'staff') 
      return ['sell']
    if (user?.role === 'sales_manager')
      return ['sell']
    return []
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/stock/products/')
        setProducts(res.data)
      } catch {
        setError('Failed to load products')
      }
    }
    fetchProducts()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.product || !formData.transaction_type || !formData.quantity || !formData.reference_number) {
      setError('Please fill all required fields')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.post('/api/transactions/', {
        product: parseInt(formData.product),
        transaction_type: formData.transaction_type,
        quantity: parseInt(formData.quantity),
        reference_number: formData.reference_number,
        notes: formData.notes
      })
      navigate('/transactions')
    } catch {
      setError('Failed to add transaction. Check all fields and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Add Transaction</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>

        <div style={{ marginBottom: '16px' }}>
          <label>Product *</label><br />
          <select name="product" value={formData.product}
            onChange={handleChange} style={{ width: '100%', padding: '8px' }} required>
            <option value="">Select product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.sku} - {product.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Transaction Type *</label><br />
          <select name="transaction_type" value={formData.transaction_type}
            onChange={handleChange} style={{ width: '100%', padding: '8px' }} required>
            <option value="">Select type</option>
            {getAvailableTypes().map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Quantity *</label><br />
          <input name="quantity" type="number" min="1" value={formData.quantity}
            onChange={handleChange} style={{ width: '100%', padding: '8px' }} required />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Reference Number *</label><br />
          <input name="reference_number" type="text" value={formData.reference_number}
            onChange={handleChange} style={{ width: '100%', padding: '8px' }} required />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>Notes</label><br />
          <textarea name="notes" value={formData.notes}
            onChange={handleChange} style={{ width: '100%', padding: '8px', minHeight: '80px' }} />
        </div>

        <button type="submit" disabled={loading} style={{
          padding: '10px 16px',
          backgroundColor: loading ? '#9ca3af' : '#3b82f6',
          color: 'white', border: 'none', borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%'
        }}>
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>

      </form>
    </div>
  )
}

export default AddTransaction
