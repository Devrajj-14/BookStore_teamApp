import { useState, useEffect } from 'react'

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const url = filterStatus
        ? `/api/orders/admin?status=${filterStatus}`
        : '/api/orders/admin'
      const res = await fetch(url)
      const json = await res.json()
      setOrders(json.data || [])
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [filterStatus])

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await fetch(`/api/orders/admin/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchOrders()
    } catch (err) {
      console.error('Status update failed:', err)
    }
  }

  const statusColor = (status) => {
    const colors = {
      PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PROCESSING: '#8b5cf6',
      SHIPPED: '#06b6d4', DELIVERED: '#10b981', CANCELLED: '#ef4444', REFUNDED: '#6b7280',
    }
    return colors[status] || '#000'
  }

  return (
    <div className="container">
      <h1>Order Management</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>Filter by status: </label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '0.4rem', marginLeft: '0.5rem' }}>
          <option value="">All</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Order ID</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>User</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Amount</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.75rem' }}>#{order.id}</td>
                <td style={{ padding: '0.75rem' }}>{order.userName || order.userId}</td>
                <td style={{ padding: '0.75rem' }}>₹{order.totalAmount}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ color: statusColor(order.status), fontWeight: 'bold' }}>{order.status}</span>
                </td>
                <td style={{ padding: '0.75rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '0.75rem' }}>
                  <select
                    defaultValue={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    style={{ padding: '0.3rem' }}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default OrderManagement
