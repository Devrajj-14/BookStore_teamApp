import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCart, clearCart } from '../api/cartApi'
import { getCustomerDetails } from '../api/profileApi'
import { placeOrder } from '../api/orderApi'

const Checkout = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [cart, setCart] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const [cartRes, profileRes] = await Promise.all([
        getCart(),
        getCustomerDetails(),
      ])

      const cartData = cartRes.data.data
      if (!cartData || cartData.items.length === 0) {
        navigate('/cart')
        return
      }
      setCart(cartData)

      const addrs = profileRes.data.data?.addresses || []
      setAddresses(addrs)

      // Pre-select default address if available
      const defaultAddr = addrs.find((a) => a.isDefault)
      if (defaultAddr) setSelectedAddressId(defaultAddr.id)
      else if (addrs.length > 0) setSelectedAddressId(addrs[0].id)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load checkout data')
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address')
      return
    }

    const items = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }))

    setPlacing(true)
    setError('')
    try {
      await placeOrder({ deliveryAddressId: selectedAddressId, items })
      await clearCart()
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (loading) return <div style={styles.center}>Loading checkout...</div>

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Checkout</h2>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.layout}>
        {/* Left — Delivery Address */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Delivery Address</h3>

          {addresses.length === 0 ? (
            <div>
              <p style={styles.muted}>No saved addresses found.</p>
              <button style={styles.btnSecondary} onClick={() => navigate('/profile')}>
                Add Address in Profile
              </button>
            </div>
          ) : (
            addresses.map((addr) => (
              <label key={addr.id} style={styles.addressCard}>
                <input
                  type="radio"
                  name="address"
                  value={addr.id}
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                  style={{ marginRight: '0.75rem' }}
                />
                <div>
                  <p style={styles.addrLine}>{addr.line1}</p>
                  {addr.line2 && <p style={styles.addrLine}>{addr.line2}</p>}
                  <p style={styles.addrLine}>
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  {addr.isDefault && <span style={styles.defaultBadge}>Default</span>}
                </div>
              </label>
            ))
          )}
        </div>

        {/* Right — Order Summary */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Order Summary</h3>

          <div style={styles.itemList}>
            {cart.items.map((item) => (
              <div key={item.id} style={styles.item}>
                <div style={styles.itemInfo}>
                  {item.productImage && (
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      style={styles.image}
                    />
                  )}
                  <div>
                    <p style={styles.itemTitle}>{item.productTitle}</p>
                    <p style={styles.itemMeta}>Qty: {item.quantity}</p>
                  </div>
                </div>
                <p style={styles.itemSubtotal}>₹{item.subtotal.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div style={styles.totalRow}>
            <span>Total</span>
            <span style={styles.totalAmount}>₹{cart.totalAmount.toFixed(2)}</span>
          </div>

          <button
            style={{
              ...styles.btnPrimary,
              opacity: placing || addresses.length === 0 ? 0.6 : 1,
            }}
            onClick={handlePlaceOrder}
            disabled={placing || addresses.length === 0}
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' },
  title: { fontSize: '1.8rem', marginBottom: '1.5rem' },
  center: { textAlign: 'center', marginTop: '4rem', fontSize: '1rem', color: '#666' },
  error: { color: '#c0392b', marginBottom: '1rem', fontSize: '0.9rem' },
  layout: { display: 'flex', gap: '2rem', flexWrap: 'wrap' },
  section: {
    flex: 1, minWidth: '280px', padding: '1.5rem',
    border: '1px solid #e0e0e0', borderRadius: '8px', background: '#fff',
  },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' },
  muted: { color: '#888', fontSize: '0.9rem', marginBottom: '0.75rem' },
  addressCard: {
    display: 'flex', alignItems: 'flex-start', padding: '0.75rem',
    border: '1px solid #e0e0e0', borderRadius: '6px', marginBottom: '0.75rem',
    cursor: 'pointer', background: '#fafafa',
  },
  addrLine: { margin: '0 0 0.2rem 0', fontSize: '0.9rem' },
  defaultBadge: {
    fontSize: '0.75rem', background: '#333', color: '#fff',
    padding: '0.1rem 0.5rem', borderRadius: '4px', marginTop: '0.25rem',
    display: 'inline-block',
  },
  itemList: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  itemInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  image: { width: '45px', height: '60px', objectFit: 'cover', borderRadius: '4px' },
  itemTitle: { margin: 0, fontWeight: '600', fontSize: '0.9rem' },
  itemMeta: { margin: 0, color: '#888', fontSize: '0.8rem' },
  itemSubtotal: { fontWeight: '600', margin: 0 },
  totalRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.75rem 0', borderTop: '1px solid #e0e0e0', marginBottom: '1rem',
  },
  totalAmount: { fontSize: '1.2rem', fontWeight: '700' },
  btnPrimary: {
    width: '100%', padding: '0.85rem', background: '#333', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem',
  },
  btnSecondary: {
    padding: '0.6rem 1.2rem', background: 'transparent', color: '#333',
    border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem',
  },
}

export default Checkout
