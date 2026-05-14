
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const Categories = () => {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/stock/categories/')
      setCategories(res.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading categories...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Categories</h2>
        {['admin', 'inventory_manager'].includes(user?.role) && (
          <Link 
            to="/categories/add" 
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Add Category
          </Link>
        )}
      </div>

      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        marginTop: '12px',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f1f5f9' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Name</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Description</th>
            <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Created</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr 
              key={category.id}
              style={{
                borderBottom: '1px solid #f1f5f9',
                backgroundColor: 'white'
              }}
            >
              <td style={{ padding: '12px', fontWeight: '500' }}>{category.name}</td>
              <td style={{ padding: '12px' }}>{category.description || '-'}</td>
              <td style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontSize: '14px' }}>
                {new Date(category.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {categories.length === 0 && (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>
          No categories found.
        </p>
      )}
    </div>
  )
}

export default Categories

