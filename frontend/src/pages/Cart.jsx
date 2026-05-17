import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart, updateCartItem, removeCartItem, clearCart } from '../api/cartApi'
import { useAuth } from '../context/AuthContext'

const Cart = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [user])

  const fetchCart = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getCart()
      setCart(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return
    try {
      const res = await updateCartItem(itemId, newQty)
      setCart(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item')
    }
  }

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId)
      fetchCart()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item')
    }
  }

  const handleClear = async () => {
    try {
      await clearCart()
      fetchCart()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart')
    }
  }

  if (loading) return <div style={styles.center}>Loading cart...</div>

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Your Cart</h2>

      {error && <p style={styles.error}>{error}</p>}

      {!cart || cart.items.length === 0 ? (
        <div style={styles.empty}>
          <p>Your cart is empty.</p>
          <button style={styles.btnPrimary} onClick={() => navigate('/books')}>
            Browse Books
          </button>
        </div>
      ) : (
        <>
          <div style={styles.itemList}>
            {cart.items.map((item) => (
              <div key={item.id} style={styles.item}>
                <div style={styles.itemInfo}>
                  {item.productImage && (
                    <img src={item.productImage} alt={item.productTitle} style={styles.image} />
                  )}
                  <div>
                    <p style={styles.itemTitle}>{item.productTitle}</p>
                    <p style={styles.itemPrice}>₹{item.unitPrice.toFixed(2)} each</p>
                  </div>
                </div>

                <div style={styles.itemActions}>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span style={styles.qty}>{item.quantity}</span>
                  <button
                    style={styles.qtyBtn}
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <span style={styles.subtotal}>₹{item.subtotal.toFixed(2)}</span>
                  <button style={styles.removeBtn} onClick={() => handleRemove(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.summary}>
            <p style={styles.total}>Total: ₹{cart.totalAmount.toFixed(2)}</p>
            <div style={styles.summaryActions}>
              <button style={styles.btnSecondary} onClick={handleClear}>
                Clear Cart
              </button>
              <button style={styles.btnPrimary} onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const styles = {
  wrapper: { maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' },
  title: { fontSize: '1.8rem', marginBottom: '1.5rem' },
  center: { textAlign: 'center', marginTop: '4rem', fontSize: '1rem', color: '#666' },
  error: { color: '#c0392b', marginBottom: '1rem', fontSize: '0.9rem' },
  empty: { textAlign: 'center', padding: '3rem 0', color: '#666' },
  itemList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  item: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '8px',
    background: '#fff', flexWrap: 'wrap', gap: '1rem',
  },
  itemInfo: { display: 'flex', alignItems: 'center', gap: '1rem' },
  image: { width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' },
  itemTitle: { fontWeight: '600', margin: 0, marginBottom: '0.25rem' },
  itemPrice: { margin: 0, color: '#666', fontSize: '0.9rem' },
  itemActions: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  qtyBtn: {
    width: '28px', height: '28px', border: '1px solid #ccc', borderRadius: '4px',
    background: '#f5f5f5', cursor: 'pointer', fontSize: '1rem', lineHeight: 1,
  },
  qty: { minWidth: '24px', textAlign: 'center', fontWeight: '600' },
  subtotal: { fontWeight: '600', minWidth: '80px', textAlign: 'right' },
  removeBtn: {
    padding: '0.3rem 0.75rem', background: 'transparent', border: '1px solid #e74c3c',
    color: '#e74c3c', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem',
  },
  summary: {
    marginTop: '2rem', padding: '1.5rem', border: '1px solid #e0e0e0',
    borderRadius: '8px', background: '#fafafa',
  },
  total: { fontSize: '1.3rem', fontWeight: '700', margin: '0 0 1rem 0' },
  summaryActions: { display: 'flex', gap: '1rem', justifyContent: 'flex-end' },
  btnPrimary: {
    padding: '0.75rem 1.5rem', background: '#333', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem',
  },
  btnSecondary: {
    padding: '0.75rem 1.5rem', background: 'transparent', color: '#333',
    border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem',
  },
}

export default Cart
