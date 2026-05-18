import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCart, clearCart } from '../api/cartApi'
import { getCustomerDetails, addAddress } from '../api/profileApi'
import { placeOrder } from '../api/orderApi'

const EMPTY_ADDR = { line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false }

const Checkout = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [cart, setCart] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  const [showNewForm, setShowNewForm] = useState(false)
  const [addrForm, setAddrForm] = useState(EMPTY_ADDR)
  const [addrSaving, setAddrSaving] = useState(false)
  const [addrError, setAddrError] = useState('')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchData()
  }, [user])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const [cartRes, profileRes] = await Promise.all([getCart(), getCustomerDetails()])
      const cartData = cartRes.data.data
      if (!cartData || cartData.items.length === 0) { navigate('/cart'); return }
      setCart(cartData)
      loadAddresses(profileRes.data.data?.addresses || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load checkout data')
    } finally {
      setLoading(false)
    }
  }

  const loadAddresses = (addrs) => {
    setAddresses(addrs)
    const def = addrs.find((a) => a.isDefault)
    if (def) setSelectedAddressId(def.id)
    else if (addrs.length > 0) setSelectedAddressId(addrs[0].id)
  }

  const refreshAddresses = async () => {
    const res = await getCustomerDetails()
    loadAddresses(res.data.data?.addresses || [])
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    setAddrSaving(true)
    setAddrError('')
    try {
      const res = await addAddress(addrForm)
      const newAddr = res.data.data
      setAddrForm(EMPTY_ADDR)
      setShowNewForm(false)
      await refreshAddresses()
      setSelectedAddressId(newAddr.id)
    } catch (err) {
      setAddrError(err.response?.data?.message || 'Failed to add address')
    } finally {
      setAddrSaving(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) { setError('Please select a delivery address'); return }
    const items = cart.items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
    setPlacing(true)
    setError('')
    try {
      await placeOrder({ deliveryAddressId: selectedAddressId, items })
      await clearCart()
      navigate('/orders', { state: { orderPlaced: true } })
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

          {addresses.map((addr) => (
            <label key={addr.id} style={styles.addressCard}>
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedAddressId === addr.id}
                onChange={() => setSelectedAddressId(addr.id)}
                style={{ marginRight: '0.75rem', flexShrink: 0 }}
              />
              <div>
                <p style={styles.addrLine}>{addr.line1}</p>
                {addr.line2 && <p style={styles.addrLine}>{addr.line2}</p>}
                <p style={styles.addrLine}>{addr.city}, {addr.state} — {addr.pincode}</p>
                {addr.isDefault && <span style={styles.defaultBadge}>Default</span>}
              </div>
            </label>
          ))}

          {addresses.length === 0 && !showNewForm && (
            <p style={styles.muted}>No saved addresses. Add one below to continue.</p>
          )}

          {/* Inline add-address */}
          {!showNewForm ? (
            <button style={styles.addAddrBtn} onClick={() => setShowNewForm(true)}>
              + Add a new address
            </button>
          ) : (
            <div style={styles.newAddrBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '0.95rem' }}>New Address</strong>
                <button style={styles.cancelBtn} onClick={() => { setShowNewForm(false); setAddrForm(EMPTY_ADDR); setAddrError('') }}>
                  Cancel
                </button>
              </div>
              <form onSubmit={handleAddAddress} style={styles.form}>
                {addrError && <p style={styles.addrErrMsg}>{addrError}</p>}
                <label style={styles.label}>Line 1 *</label>
                <input style={styles.input} value={addrForm.line1} onChange={(e) => setAddrForm({ ...addrForm, line1: e.target.value })} required autoFocus />
                <label style={styles.label}>Line 2</label>
                <input style={styles.input} value={addrForm.line2} onChange={(e) => setAddrForm({ ...addrForm, line2: e.target.value })} />
                <div style={styles.row}>
                  <div style={styles.col}>
                    <label style={styles.label}>City *</label>
                    <input style={styles.input} value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} required />
                  </div>
                  <div style={styles.col}>
                    <label style={styles.label}>State *</label>
                    <input style={styles.input} value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} required />
                  </div>
                  <div style={styles.col}>
                    <label style={styles.label}>Pincode *</label>
                    <input style={styles.input} value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })} required pattern="^[1-9][0-9]{5}$" title="6-digit pincode" />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={addrForm.isDefault} onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })} />
                  Save as default address
                </label>
                <button style={styles.saveAddrBtn} type="submit" disabled={addrSaving}>
                  {addrSaving ? 'Saving...' : 'Save & Select'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right — Order Summary */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Order Summary</h3>
          <div style={styles.itemList}>
            {cart.items.map((item) => (
              <div key={item.id} style={styles.item}>
                <div style={styles.itemInfo}>
                  {item.productImage && <img src={item.productImage} alt={item.productTitle} style={styles.image} />}
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
            style={{ ...styles.btnPrimary, opacity: placing || !selectedAddressId ? 0.6 : 1 }}
            onClick={handlePlaceOrder}
            disabled={placing || !selectedAddressId}
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { maxWidth: '960px', margin: '2rem auto', padding: '0 1rem' },
  title: { marginBottom: '1.5rem' },
  layout: { display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' },
  section: { flex: 1, minWidth: '280px', background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' },
  sectionTitle: { marginTop: 0, marginBottom: '1rem' },
  addressCard: { display: 'flex', alignItems: 'flex-start', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '0.6rem', cursor: 'pointer' },
  addrLine: { margin: '0 0 0.15rem 0', fontSize: '0.9rem' },
  defaultBadge: { background: '#333', color: '#fff', borderRadius: '3px', padding: '0 6px', fontSize: '0.72rem', marginTop: '0.25rem', display: 'inline-block' },
  muted: { color: '#888', fontSize: '0.9rem' },
  addAddrBtn: { background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline', padding: '0.4rem 0', marginTop: '0.25rem' },
  newAddrBox: { marginTop: '0.75rem', padding: '1rem', background: '#f9f9f9', borderRadius: '6px', border: '1px solid #e0e0e0' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.55rem' },
  label: { fontWeight: '600', fontSize: '0.82rem' },
  input: { padding: '0.55rem 0.75rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.95rem' },
  row: { display: 'flex', gap: '0.6rem' },
  col: { display: 'flex', flexDirection: 'column', flex: 1, gap: '0.35rem' },
  saveAddrBtn: { alignSelf: 'flex-start', padding: '0.5rem 1.2rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' },
  cancelBtn: { background: 'none', border: '1px solid #ccc', borderRadius: '4px', padding: '0.2rem 0.65rem', cursor: 'pointer', fontSize: '0.82rem' },
  addrErrMsg: { color: '#c0392b', fontSize: '0.82rem', margin: 0 },
  itemList: { marginBottom: '1rem' },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid #f0f0f0' },
  itemInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  image: { width: '44px', height: '60px', objectFit: 'cover', borderRadius: '3px' },
  itemTitle: { margin: 0, fontWeight: '600', fontSize: '0.9rem' },
  itemMeta: { margin: 0, color: '#888', fontSize: '0.82rem' },
  itemSubtotal: { margin: 0, fontWeight: '600' },
  totalRow: { display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '2px solid #333', marginBottom: '1rem', fontWeight: '600' },
  totalAmount: { fontSize: '1.1rem' },
  btnPrimary: { width: '100%', padding: '0.8rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' },
  error: { color: '#c0392b', marginBottom: '1rem' },
  center: { textAlign: 'center', marginTop: '4rem', color: '#666' },
}

export default Checkout
