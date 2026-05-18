import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>📚 BookStore</Link>
        <ul style={styles.navList}>
          <li>
            <Link 
              to="/books" 
              style={{...styles.link, ...(isActive('/books') ? styles.activeLink : {})}}
            >
              Books
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link 
                  to="/wishlist" 
                  style={{...styles.link, ...(isActive('/wishlist') ? styles.activeLink : {})}}
                >
                  ♡ Wishlist
                </Link>
              </li>
              <li>
                <Link 
                  to="/cart" 
                  style={{...styles.link, ...(isActive('/cart') ? styles.activeLink : {})}}
                >
                  🛒 Cart
                </Link>
              </li>
              <li>
                <Link 
                  to="/orders" 
                  style={{...styles.link, ...(isActive('/orders') ? styles.activeLink : {})}}
                >
                  📦 Orders
                </Link>
              </li>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <li>
              <Link 
                to="/admin/dashboard" 
                style={{
                  ...styles.link, 
                  ...(location.pathname.startsWith('/admin') ? styles.adminLink : {})
                }}
              >
                🔴 Admin
              </Link>
            </li>
          )}
        </ul>
        <div style={styles.rightSection}>
          {user ? (
            <>
              <span style={styles.userLabel}>👤 {user.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: { 
    backgroundColor: '#ffffff', 
    borderBottom: '1px solid #e5e7eb',
    padding: '0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  container: { 
    maxWidth: '1200px', 
    margin: '0 auto', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '0 2rem',
    height: '60px'
  },
  logo: { 
    color: '#1f2937', 
    fontSize: '1.25rem', 
    fontWeight: '700', 
    textDecoration: 'none',
    letterSpacing: '-0.5px'
  },
  navList: { 
    display: 'flex', 
    listStyle: 'none', 
    gap: '2rem', 
    alignItems: 'center', 
    margin: 0, 
    padding: 0,
    flex: 1,
    justifyContent: 'center'
  },
  link: { 
    color: '#6b7280', 
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'color 0.2s'
  },
  activeLink: {
    color: '#1a1a1a',
    fontWeight: '600'
  },
  adminLink: {
    color: '#dc2626',
    fontWeight: '600'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  userLabel: {
    color: '#6b7280',
    fontSize: '0.9rem'
  },
  logoutBtn: { 
    background: 'white', 
    border: '1px solid #d1d5db', 
    color: '#374151', 
    padding: '0.4rem 1rem', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
}

export default Navbar
