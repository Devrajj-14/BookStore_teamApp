import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyOrders } from '../api/orderApi'

// Badge color per order status
const statusColors = {
  PENDING: { bg: '#fff3cd', color: '#856404' },
  CONFIRMED: { bg: '#cce5ff', color: '#004085' },
  PROCESSING: { bg: '#d4edda', color: '#155724' },
  SHIPPED: { bg: '#d1ecf1', color: '#0c5460' },
  DELIVERED: { bg: '#d4edda', color: '#155724' },
  CANCELLED: { bg: '#f8d7da', color: '#721c24' },
  REFUNDED: { bg: '#e2e3e5', color: '#383d41' },
}

const Orders = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [showBanner, setShowBanner] = useState(location.state?.orderPlaced === true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [user])

  // Auto-dismiss the banner after 4 seconds
  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => setShowBanner(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [showBanner])

  const fetchOrders = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getMyOrders()
      setOrders(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  if (loading) return <div style={styles.center}>Loading orders...</div>

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>My Orders</h2>

      {/* Order Placed Banner */}
      {showBanner && (
        <div style={styles.banner}>
          <span style={styles.bannerIcon}>✓</span>
          <div>
            <p style={styles.bannerTitle}>Order Placed!</p>
            <p style={styles.bannerSub}>Your order has been placed successfully. We'll get it to you soon.</p>
          </div>
          <button style={styles.bannerClose} onClick={() => setShowBanner(false)}>✕</button>
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <p>You haven't placed any orders yet.</p>
          <button style={styles.btnPrimary} onClick={() => navigate('/books')}>
            Browse Books
          </button>
        </div>
      ) : (
        <div style={styles.orderList}>
          {orders.map((order) => {
            const statusStyle = statusColors[order.status] || { bg: '#eee', color: '#333' }
            const isExpanded = expandedId === order.id

            return (
              <div key={order.id} style={styles.orderCard}>
                {/* Order Header */}
                <div style={styles.orderHeader} onClick={() => toggleExpand(order.id)}>
                  <div style={styles.orderMeta}>
                    <span style={styles.orderId}>Order #{order.id}</span>
                    <span style={styles.orderDate}>{formatDate(order.createdAt)}</span>
                  </div>
                  <div style={styles.orderRight}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                      }}
                    >
                      {order.status}
                    </span>
                    <span style={styles.orderTotal}>₹{order.totalAmount.toFixed(2)}</span>
                    <span style={styles.chevron}>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {isExpanded && (
                  <div style={styles.orderDetails}>
                    {/* Delivery Address */}
                    <div style={styles.addressBlock}>
                      <p style={styles.detailLabel}>Delivery Address</p>
                      <p style={styles.addrLine}>{order.deliveryLine1}</p>
                      {order.deliveryLine2 && (
                        <p style={styles.addrLine}>{order.deliveryLine2}</p>
                      )}
                      <p style={styles.addrLine}>
                        {order.deliveryCity}, {order.deliveryState} — {order.deliveryPincode}
                      </p>
                    </div>

                    {/* Items */}
                    <p style={styles.detailLabel}>Items</p>
                    <div style={styles.itemList}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={styles.item}>
                          <div style={styles.itemInfo}>
                            {item.productImageUrl && (
                              <img
                                src={item.productImageUrl}
                                alt={item.productTitle}
                                style={styles.image}
                              />
                            )}
                            <div>
                              <p style={styles.itemTitle}>{item.productTitle}</p>
                              <p style={styles.itemMeta}>by {item.productAuthor}</p>
                              <p style={styles.itemMeta}>Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p style={styles.itemSubtotal}>₹{item.subtotal.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
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
  orderList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  orderCard: {
    border: '1px solid #e0e0e0', borderRadius: '8px',
    background: '#fff', overflow: 'hidden',
  },
  orderHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 1.25rem', cursor: 'pointer',
    borderBottom: '1px solid transparent',
  },
  orderMeta: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  orderId: { fontWeight: '700', fontSize: '1rem' },
  orderDate: { fontSize: '0.8rem', color: '#888' },
  orderRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  statusBadge: {
    padding: '0.25rem 0.65rem', borderRadius: '12px',
    fontSize: '0.78rem', fontWeight: '600',
  },
  orderTotal: { fontWeight: '700', fontSize: '1rem' },
  chevron: { fontSize: '0.75rem', color: '#888' },
  orderDetails: {
    padding: '1rem 1.25rem', borderTop: '1px solid #e0e0e0', background: '#fafafa',
  },
  addressBlock: { marginBottom: '1rem' },
  detailLabel: { fontWeight: '700', fontSize: '0.85rem', color: '#555', marginBottom: '0.4rem' },
  addrLine: { margin: '0 0 0.2rem 0', fontSize: '0.9rem' },
  itemList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  itemInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  image: { width: '45px', height: '60px', objectFit: 'cover', borderRadius: '4px' },
  itemTitle: { margin: 0, fontWeight: '600', fontSize: '0.9rem' },
  itemMeta: { margin: 0, color: '#888', fontSize: '0.8rem' },
  itemSubtotal: { fontWeight: '600', margin: 0 },
  btnPrimary: {
    padding: '0.75rem 1.5rem', background: '#333', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem',
    marginTop: '1rem',
  },
  banner: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px',
    padding: '1rem 1.25rem', marginBottom: '1.5rem',
    animation: 'fadeIn 0.3s ease',
  },
  bannerIcon: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: '#28a745', color: '#fff', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '1.1rem', fontWeight: '700', flexShrink: 0,
    lineHeight: '36px', textAlign: 'center',
  },
  bannerTitle: { margin: '0 0 0.2rem 0', fontWeight: '700', fontSize: '1rem', color: '#155724' },
  bannerSub: { margin: 0, fontSize: '0.85rem', color: '#155724' },
  bannerClose: {
    marginLeft: 'auto', background: 'none', border: 'none',
    cursor: 'pointer', fontSize: '1rem', color: '#155724', flexShrink: 0,
  },
}

export default Orders
