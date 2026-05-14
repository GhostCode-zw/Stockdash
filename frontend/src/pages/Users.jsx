import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const Users = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api.get('/api/accounts/users/')
      setUsers(res.data)
    } catch (e) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleToggleActive = async (userId, nextActive) => {
    try {
      await api.patch(`/api/accounts/users/${userId}/`, { is_active: nextActive })
      await fetchUsers()
    } catch {
      setError('Failed to update user')
    }
  }

  if (loading) return <div className="empty-state">Loading users...</div>

  if (!['admin', 'inventory_manager', 'staff', 'sales_manager'].includes(user?.role || '')) {
    return <div className="empty-state">Access denied.</div>
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Users</h2>
        {user?.role === 'admin' && (
          <Link to="/users/add" className="btn btn-blue">
            Add User
          </Link>
        )}
      </div>

      <div className="card">
        <h3 className="card-title">All Accounts</h3>

        {error && <div className="form-error">{error}</div>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                {user?.role === 'admin' && <th className="text-left">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 5 : 4} className="empty-state">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const roleLabel = u.role ? u.role.replace('_', ' ') : '—'
                  return (
                    <tr key={u.id} className={!u.is_active ? 'low-stock' : ''}>
                      <td>{u.username}</td>
                      <td>{u.email || '—'}</td>
                      <td>
                        <span className="badge badge-blue">{roleLabel}</span>
                      </td>
                      <td>
                        {u.is_active ? (
                          <span className="badge badge-green">Active</span>
                        ) : (
                          <span className="badge badge-red">Inactive</span>
                        )}
                      </td>
                      {user?.role === 'admin' && (
                        <td>
                          <button
                            className="btn btn-ghost"
                            type="button"
                            onClick={() => handleToggleActive(u.id, !u.is_active)}
                          >
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Users;


