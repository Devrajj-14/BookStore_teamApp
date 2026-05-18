import { useState, useEffect } from 'react'

const StatCard = ({ icon, label, value, color }) => (
  <div style={{
    background: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    minWidth: '200px'
  }}>
    <div style={{
      fontSize: '2rem',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      background: color || '#f3f4f6'
    }}>
      {icon}
    </div>
    <div>
      <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>{label}</p>
      <h2 style={{ margin: '0.25rem 0 0', fontSize: '1.75rem', fontWeight: '700', color: '#1a1a1a' }}>
        {value ?? '—'}
      </h2>
    </div>
  </div>
)

const QuickActionCard = ({ icon, label, onClick }) => (
  <div 
    onClick={onClick}
    style={{
      background: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      minWidth: '140px'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
      e.currentTarget.style.transform = 'translateY(0)'
    }}
  >
    <div style={{ fontSize: '2.5rem' }}>{icon}</div>
    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500', color: '#374151', textAlign: 'center' }}>
      {label}
    </p>
  </div>
)

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/admin/dashboard')
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

  if (loading) return (
    <div className="container">
      <p style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading dashboard...</p>
    </div>
  )

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p className="subtitle">Welcome back, Admin! Here's what's happening</p>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '3rem' 
      }}>
        <StatCard 
          icon="👥" 
          label="Total Users" 
          value={stats?.totalUsers} 
          color="#dbeafe"
        />
        <StatCard 
          icon="📚" 
          label="Total Books" 
          value={stats?.totalProducts} 
          color="#fce7f3"
        />
        <StatCard 
          icon="📦" 
          label="Total Orders" 
          value={stats?.totalOrders} 
          color="#e0e7ff"
        />
        <StatCard 
          icon="💰" 
          label="Total Revenue" 
          value={stats?.totalRevenue ? `₹${stats.totalRevenue}` : '₹0'} 
          color="#fef3c7"
        />
        <StatCard 
          icon="⏳" 
          label="Pending Orders" 
          value={stats?.pendingOrders} 
          color="#fed7aa"
        />
        <StatCard 
          icon="✅" 
          label="Delivered Orders" 
          value={stats?.ordersByStatus?.DELIVERED || 0} 
          color="#d1fae5"
        />
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ⚡ Quick Actions
        </h2>
        <div style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          marginTop: '1rem',
          flexWrap: 'wrap'
        }}>
          <QuickActionCard 
            icon="📖" 
            label="Add New Book" 
            onClick={() => window.location.href = '/admin/products'}
          />
          <QuickActionCard 
            icon="📋" 
            label="View All Orders" 
            onClick={() => window.location.href = '/admin/orders'}
          />
          <QuickActionCard 
            icon="👥" 
            label="Manage Users" 
            onClick={() => window.location.href = '/admin/users'}
          />
          <QuickActionCard 
            icon="💳" 
            label="View Payments" 
            onClick={() => alert('Payments feature coming soon!')}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
