import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWishlist, removeFromWishlist } from '../api/wishlistApi'
import { useAuth } from '../context/AuthContext'

const Wishlist = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchWishlist()
  }, [user])

  const fetchWishlist = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getWishlist()
      setWishlist(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId)
      fetchWishlist()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item')
    }
  }

  if (loading) return <div style={styles.center}>Loading wishlist...</div>

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>My Wishlist</h2>

      {error && <p style={styles.error}>{error}</p>}

      {!wishlist || wishlist.items.length === 0 ? (
        <div style={styles.empty}>
          <p>Your wishlist is empty.</p>
          <button style={styles.btnPrimary} onClick={() => navigate('/books')}>
            Browse Books
          </button>
        </div>
      ) : (
        <>
          <p style={styles.count}>{wishlist.totalItems} item{wishlist.totalItems !== 1 ? 's' : ''}</p>
          <div style={styles.grid}>
            {wishlist.items.map((item) => (
              <div key={item.id} style={styles.card}>
                {item.productImage && (
                  <img
                    src={item.productImage}
                    alt={item.productTitle}
                    style={styles.image}
                  />
                )}
                <div style={styles.cardBody}>
                  <p style={styles.bookTitle}>{item.productTitle}</p>
                  <p style={styles.author}>{item.productAuthor}</p>
                  <p style={styles.price}>₹{item.productPrice.toFixed(2)}</p>
                  <span style={item.inStock ? styles.inStock : styles.outOfStock}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div style={styles.cardActions}>
                  <button
                    style={styles.btnPrimary}
                    onClick={() => navigate(`/books/${item.productId}`)}
                  >
                    View
                  </button>
                  <button
                    style={styles.removeBtn}
                    onClick={() => handleRemove(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const styles = {
  wrapper: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
  title: { fontSize: '1.8rem', marginBottom: '0.5rem' },
  count: { color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' },
  center: { textAlign: 'center', marginTop: '4rem', fontSize: '1rem', color: '#666' },
  error: { color: '#c0392b', marginBottom: '1rem', fontSize: '0.9rem' },
  empty: { textAlign: 'center', padding: '3rem 0', color: '#666' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    border: '1px solid #e0e0e0', borderRadius: '8px', background: '#fff',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  image: { width: '100%', height: '180px', objectFit: 'cover' },
  cardBody: { padding: '0.75rem 1rem', flex: 1 },
  bookTitle: { fontWeight: '600', margin: '0 0 0.25rem 0', fontSize: '0.95rem' },
  author: { color: '#666', fontSize: '0.85rem', margin: '0 0 0.5rem 0' },
  price: { fontWeight: '700', margin: '0 0 0.5rem 0' },
  inStock: {
    fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px',
    background: '#e8f5e9', color: '#2e7d32',
  },
  outOfStock: {
    fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px',
    background: '#fce4ec', color: '#c62828',
  },
  cardActions: {
    display: 'flex', gap: '0.5rem', padding: '0.75rem 1rem',
    borderTop: '1px solid #f0f0f0',
  },
  btnPrimary: {
    flex: 1, padding: '0.5rem', background: '#333', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem',
  },
  removeBtn: {
    flex: 1, padding: '0.5rem', background: 'transparent',
    border: '1px solid #e74c3c', color: '#e74c3c',
    borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem',
  },
}

export default Wishlist
