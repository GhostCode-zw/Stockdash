import { useState, useEffect } from 'react'
import api from '../api'

const Dashboard = () => {
  const [products, setProducts] = useState([])
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    api.get('/api/stock/products/').then(res => setProducts(res.data))
    api.get('/api/transactions/').then(res => setTransactions(res.data))
  }, [])

  // derive stats from data
  const lowStock = products.filter(p => p.is_low_stock)

  const getTypeBadge = (type) => {
    const cls = ['purchase','return'].includes(type) ? 'badge-green' :
                type === 'sale' ? 'badge-red' : 'badge-amber'
    const label = type.charAt(0).toUpperCase() + type.slice(1)
    return <span className={`badge ${cls}`}>{label}</span>
  }

  return (
    <div>
<h2 className="page-title">Dashboard</h2>
<div className="stat-grid">
<div className="stat-card info">
          <p className="stat-label">Total Products</p>
<p className="stat-value">{products.length}</p>
        </div>
<div className="stat-card success">
          <p className="stat-label">Total Transactions</p>
<p className="stat-value">{transactions.length}</p>
        </div>
<div className="stat-card danger">
          <p className="stat-label">Low Stock Items</p>
<p className="stat-value">{lowStock.length}</p>
        </div>
      </div>
<div className="card">
  <h3 className="card-title">Recent Transactions</h3>
  <div className="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Type</th>
          <th>Quantity</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {transactions.slice(0, 5).map(t => (
          <tr key={t.id}>
            <td>{t.product_name}</td>
            <td>{getTypeBadge(t.transaction_type)}</td>
            <td>{t.quantity}</td>
            <td>{new Date(t.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
        {transactions.length === 0 && (
          <tr>
            <td colSpan="4" className="empty-state">No transactions yet.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
    </div>
    
  )
}

export default Dashboard; 