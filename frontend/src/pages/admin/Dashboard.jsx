import { useState, useEffect } from 'react'

const StatCard = ({ label, value }) => (
  <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', minWidth: '160px' }}>
    <p style={{ color: '#666', margin: 0 }}>{label}</p>
    <h2 style={{ margin: '0.5rem 0 0' }}>{value ?? '—'}</h2>
  </div>
)

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard')
        const json = await res.json()
        setStats(json.data)
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div className="container"><p>Loading dashboard...</p></div>

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        <StatCard label="Total Users" value={stats?.totalUsers} />
        <StatCard label="Total Products" value={stats?.totalProducts} />
        <StatCard label="Total Orders" value={stats?.totalOrders} />
        <StatCard label="Pending Orders" value={stats?.pendingOrders} />
        <StatCard label="Low Stock Products" value={stats?.lowStockProducts} />
        <StatCard label="Total Revenue" value={stats?.totalRevenue ? `₹${stats.totalRevenue}` : '₹0'} />
      </div>

      {stats?.ordersByStatus && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Orders by Status</h2>
          <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '400px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #ddd' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '0.5rem', borderBottom: '1px solid #ddd' }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                <tr key={status}>
                  <td style={{ padding: '0.5rem' }}>{status}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <a href="/admin/products"><button style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}>Manage Products</button></a>
        <a href="/admin/orders"><button style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}>Manage Orders</button></a>
        <a href="/admin/users"><button style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}>Manage Users</button></a>
      </div>
    </div>
  )
}

export default Dashboard
