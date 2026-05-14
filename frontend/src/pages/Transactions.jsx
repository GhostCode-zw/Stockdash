import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const Transactions = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/transactions/')
      setTransactions(res.data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const getTypeBadgeClass = (type) => {
    const classes = {
      'purchase': 'badge-green',
      'return': 'badge-green',
      'sale': 'badge-red',
      'adjustment': 'badge-amber',
      'transfer': 'badge-amber'
    }
    return `badge ${classes[type] || 'badge-gray'}`
  }

  if (loading) {
    return <div className="empty-state">Loading transactions...</div>
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Transactions</h2>
        {['admin', 'inventory_manager', 'staff', 'sales_manager'].includes(user?.role) && (
          <Link to="/transactions/add" className="btn btn-blue">
            Add Transaction
          </Link>
        )}
      </div>

      <div className="card">
        <h3 className="card-title">All Transactions</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th className="text-left">Product</th>
                <th className="text-center">Type</th>
                <th className="right">Quantity</th>
                <th className="text-left">By</th>
                <th className="text-left">Ref#</th>
                <th className="text-left">Date</th>
                <th className="text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="mono">{transaction.id}</td>
                    <td>{transaction.product_name}</td>
                    <td className="text-center">
                      <span className={getTypeBadgeClass(transaction.transaction_type)}>
                        {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                      </span>
                    </td>
                    <td className="right" style={{ fontWeight: 600 }}>
                      {transaction.quantity}
                    </td>
                    <td>{transaction.performed_by_username}</td>
                    <td>{transaction.reference_number || '-'}</td>
                    <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                    <td>
                      {transaction.notes ? 
                        (transaction.notes.length > 50 ? transaction.notes.substring(0, 50) + '...' : transaction.notes) : 
                        '-'
                      }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Transactions

