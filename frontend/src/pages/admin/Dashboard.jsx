import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axiosClient from '../../api/axiosClient'

const StatCard = ({ icon, label, value, color }) => (
  <div style={styles.statCard}>
    <div style={{ ...styles.statIcon, background: color }}>{icon}</div>
    <div>
      <p style={styles.statLabel}>{label}</p>
      <h2 style={styles.statValue}>{value ?? '—'}</h2>
    </div>
  </div>
)

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axiosClient.get('/api/admin/dashboard')
      .then(res => setStats(res.data.data))
      .catch(() => setError('Failed to load dashboard stats'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={styles.center}>Loading dashboard...</div>

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Welcome back, {user?.name}! Here's what's happening.</p>
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <StatCard icon="👥" label="Total Users"      value={stats?.totalUsers}                                    color="#dbeafe" />
        <StatCard icon="📚" label="Total Books"      value={stats?.totalProducts}                                 color="#fce7f3" />
        <StatCard icon="📦" label="Total Orders"     value={stats?.totalOrders}                                   color="#e0e7ff" />
        <StatCard icon="💰" label="Revenue"          value={stats?.totalRevenue ? `₹${stats.totalRevenue}` : '₹0'} color="#fef3c7" />
        <StatCard icon="⏳" label="Pending Orders"   value={stats?.pendingOrders}                                 color="#fed7aa" />
        <StatCard icon="⚠️" label="Low Stock Books"  value={stats?.lowStockProducts}                              color="#fee2e2" />
      </div>

      {/* Quick Actions */}
      <h2 style={styles.sectionTitle}>⚡ Quick Actions</h2>
      <div style={styles.actionsGrid}>
        {[
          { icon: '📖', label: 'Manage Books',  path: '/admin/products' },
          { icon: '📋', label: 'View Orders',   path: '/admin/orders'   },
          { icon: '👥', label: 'Manage Users',  path: '/admin/users'    },
        ].map(({ icon, label, path }) => (
          <div key={path} style={styles.actionCard} onClick={() => navigate(path)}>
            <span style={{ fontSize: '2rem' }}>{icon}</span>
            <p style={styles.actionLabel}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  wrapper:      { maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' },
  header:       { marginBottom: '2rem' },
  title:        { fontSize: '1.8rem', fontWeight: '700', margin: 0 },
  subtitle:     { color: '#6b7280', margin: '0.25rem 0 0' },
  center:       { textAlign: 'center', marginTop: '4rem', color: '#666' },
  error:        { color: '#c0392b', marginBottom: '1rem' },
  statsGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' },
  statCard:     { background: '#fff', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '1rem' },
  statIcon:     { fontSize: '1.75rem', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', flexShrink: 0 },
  statLabel:    { color: '#6b7280', fontSize: '0.82rem', margin: 0 },
  statValue:    { margin: '0.2rem 0 0', fontSize: '1.6rem', fontWeight: '700', color: '#1a1a1a' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' },
  actionsGrid:  { display: 'flex', gap: '1.25rem', flexWrap: 'wrap' },
  actionCard:   { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', minWidth: '140px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s' },
  actionLabel:  { margin: 0, fontWeight: '600', fontSize: '0.9rem', color: '#374151' },
}

export default Dashboard
