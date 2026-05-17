import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>BookStore</Link>
        <ul style={styles.navList}>
          <li><Link to="/" style={styles.link}>Home</Link></li>
          <li><Link to="/books" style={styles.link}>Books</Link></li>
          {user && <li><Link to="/cart" style={styles.link}>Cart</Link></li>}
          {user && <li><Link to="/orders" style={styles.link}>Orders</Link></li>}
          {user ? (
            <>
              <li><Link to="/profile" style={styles.link}>Profile</Link></li>
              <li>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" style={styles.link}>Login</Link></li>
              <li><Link to="/register" style={styles.link}>Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

const styles = {
  nav: { backgroundColor: '#333', padding: '1rem 0' },
  container: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
  logo: { color: 'white', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' },
  navList: { display: 'flex', listStyle: 'none', gap: '20px', alignItems: 'center', margin: 0, padding: 0 },
  link: { color: 'white', textDecoration: 'none' },
  logoutBtn: { background: 'none', border: '1px solid white', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.95rem' },
}

export default Navbar
