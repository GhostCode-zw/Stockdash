import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const AddCategory = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name) {
      setError('Name is required')
      return
    }
    setLoading(true)
    setError('')
    try {
      await api.post('/api/stock/categories/', formData)
      navigate('/categories')
    } catch {
      setError('Failed to add category. Name must be unique.')
    } finally {
      setLoading(false)
    }
  }

  // No role check needed - backend permissions handle it

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '24px 0' }}>
      <h2>Add Category</h2>
      {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label>Name *</label><br />
          <input 
            name="name" 
            type="text" 
            value={formData.name}
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} 
            required 
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label>Description</label><br />
          <textarea 
            name="description" 
            value={formData.description}
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', minHeight: '80px', border: '1px solid #d1d5db', borderRadius: '4px' }} 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{
            padding: '10px 16px',
            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            fontSize: '16px'
          }}
        >
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </form>

      <button 
        onClick={() => navigate('/categories')}
        style={{
          marginTop: '16px',
          padding: '10px 16px',
          backgroundColor: 'white',
          color: '#374151',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%'
        }}
        disabled={loading}
      >
        Cancel
      </button>
    </div>
  )
}

export default AddCategory

