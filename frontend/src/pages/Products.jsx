import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const Products = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/stock/products/')
      setProducts(res.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await api.delete(`/api/stock/products/${id}/`)
      fetchProducts() // refetch after delete
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  if (loading) {
    return <div className="empty-state">Loading products...</div>
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Products</h2>
        {['admin', 'inventory_manager'].includes(user?.role) && (
          <Link to="/products/add" className="btn btn-blue">
            Add Product
          </Link>
        )}
      </div>

      <div className="card">
        <h3 className="card-title">All Products</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Low Stock</th>
                {user?.role === 'admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td 
                    colSpan={user?.role === 'admin' ? 7 : 6} 
                    className="empty-state"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr 
                    key={product.id}
                    className={product.is_low_stock ? 'low-stock' : ''}
                  >
                    <td className="mono">{product.sku}</td>
                    <td>{product.name}</td>
                    <td>{product.category_name}</td>
                    <td style={product.quantity === 0 ? { color: 'var(--red)', fontWeight: '700' } : {}}>
                      {product.quantity}
                    </td>
                    <td>${parseFloat(product.price || 0).toFixed(2)}</td>
                    <td className="text-center">
                      {product.is_low_stock && <span className="badge badge-red">Low</span>}
                    </td>
                    {user?.role === 'admin' && (
                      <td className="text-center">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    )}
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

export default Products

