import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const AddUser = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'staff'
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user?.role !== 'admin') {
    return <div className="empty-state">Access denied. Admin only.</div>
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Register serializer hashes password + creates user
      await api.post('/api/accounts/register/', formData)
      navigate('/users')
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Add New User</h2>
      </div>

      <div className="card">
        <h3 className="card-title">Create User Account</h3>
        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-wrap">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="user@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter secure password"
              minLength="8"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
            >
              <option value="staff">Staff</option>
              <option value="inventory_manager">Inventory Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-blue" disabled={loading}>
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/users')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUser;


