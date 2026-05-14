import { useState, useEffect } from 'react'
import api from '../api'

const Reports = () => {
  const [products, setProducts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsRes, transactionsRes] = await Promise.all([
          api.get('/api/stock/products/'),
          api.get('/api/transactions/')
        ])
        setProducts(productsRes.data)
        setTransactions(transactionsRes.data)
      } catch (error) {
        console.error('Error fetching reports data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Stock Summary by Category
  const categorySummary = products.reduce((acc, product) => {
    const category = product.category_name || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = { totalProducts: 0, totalValue: 0 }
    }
    acc[category].totalProducts += 1
    acc[category].totalValue += parseFloat(product.price || 0) * product.quantity
    return acc
  }, {})

  // Low Stock Items
  const lowStockItems = products
    .filter(p => p.quantity <= p.reorder_level)
    .map(p => ({
      sku: p.sku,
      name: p.name,
      quantity: p.quantity,
      reorder_level: p.reorder_level
    }))

  // Transaction Summary
  const transactionSummary = transactions.reduce((acc, t) => {
    const type = t.transaction_type
    if (!acc[type]) {
      acc[type] = { count: 0, totalUnits: 0 }
    }
    acc[type].count += 1
    acc[type].totalUnits += t.quantity
    return acc
  }, {})

  if (loading) {
    return <div className="empty-state">Loading reports...</div>
  }

  return (
    <div>
      <h1 className="page-title">Reports</h1>
      
      <div className="card">
        <h3 className="card-title">Stock Summary by Category</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th className="left">Category</th>
                <th className="right">Total Products</th>
                <th className="right">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categorySummary).map(([category, data]) => (
                <tr key={category}>
                  <td className="font-bold">{category}</td>
                  <td className="right">{data.totalProducts}</td>
                  <td className="right font-bold">${data.totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Low Stock Items</h3>
        {lowStockItems.length === 0 ? (
          <div className="empty-state">No low stock items.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th className="left">SKU</th>
                  <th className="left">Name</th>
                  <th className="right">Quantity</th>
                  <th className="right">Reorder Level</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item.sku} className="low-stock">
                    <td className="mono">{item.sku}</td>
                    <td>{item.name}</td>
                    <td className="right" style={{ color: 'var(--red)', fontWeight: 'bold' }}>{item.quantity}</td>
                    <td className="right">{item.reorder_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="card-title">Transaction Summary</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th className="left">Type</th>
                <th className="right">Count</th>
                <th className="right">Total Units</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(transactionSummary).map(([type, data]) => (
                <tr key={type}>
                  <td className="font-bold">{type}</td>
                  <td className="right">{data.count}</td>
                  <td className="right font-bold">{data.totalUnits.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


export default Reports

