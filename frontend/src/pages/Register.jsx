import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api/authApi'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await registerUser(form)
      login(res.data.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <label style={styles.label}>Name</label>
        <input
          style={styles.input}
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          autoFocus
        />

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
        />

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p style={styles.footer}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  card: { background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  title: { margin: 0, marginBottom: '0.5rem', fontSize: '1.5rem' },
  label: { fontWeight: '600', fontSize: '0.9rem' },
  input: { padding: '0.6rem 0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' },
  button: { marginTop: '0.5rem', padding: '0.75rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' },
  error: { color: '#c0392b', margin: 0, fontSize: '0.9rem' },
  footer: { textAlign: 'center', fontSize: '0.9rem', margin: 0 },
}

export default Register
