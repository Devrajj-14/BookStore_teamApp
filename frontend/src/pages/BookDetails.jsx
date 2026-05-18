import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProductById } from '../api/productApi'
import { addToCart } from '../api/cartApi'
import { getProductFeedback, getRatingSummary, submitFeedback, updateFeedback, deleteFeedback } from '../api/feedbackApi'
import { addToWishlist, checkInWishlist } from '../api/wishlistApi'

// Star display helper
const Stars = ({ rating, size = '1rem' }) => {
  return (
    <span style={{ fontSize: size, color: '#f39c12' }}>
      {[1, 2, 3, 4, 5].map((s) => (s <= rating ? '★' : '☆')).join('')}
    </span>
  )
}

const BookDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Cart
  const [cartMsg, setCartMsg] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)

  // Wishlist
  const [inWishlist, setInWishlist] = useState(false)
  const [wishlistMsg, setWishlistMsg] = useState('')
  const [wishlistLoading, setWishlistLoading] = useState(false)

  // Review form
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formRating, setFormRating] = useState(5)
  const [formComment, setFormComment] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [id])

  const fetchAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [bookRes, reviewsRes, summaryRes] = await Promise.all([
        getProductById(id),
        getProductFeedback(id),
        getRatingSummary(id),
      ])
      setBook(bookRes.data.data)
      setReviews(reviewsRes.data.data || [])
      setSummary(summaryRes.data.data)

      // Check wishlist status if logged in
      if (user) {
        try {
          const wishlistRes = await checkInWishlist(id)
          setInWishlist(wishlistRes.data.data)
        } catch {
          setInWishlist(false)
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load book details')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return }
    setAddingToCart(true)
    setCartMsg('')
    try {
      await addToCart(book.id, 1)
      setCartMsg('Added to cart!')
    } catch (err) {
      setCartMsg(err.response?.data?.message || 'Failed to add to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWishlist = async () => {
    if (!user) { navigate('/login'); return }
    setWishlistLoading(true)
    setWishlistMsg('')
    try {
      await addToWishlist(book.id)
      setInWishlist(true)
      setWishlistMsg('Added to wishlist!')
    } catch (err) {
      setWishlistMsg(err.response?.data?.message || 'Failed to add to wishlist')
    } finally {
      setWishlistLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    try {
      if (editingId) {
        await updateFeedback(editingId, { productId: Number(id), rating: formRating, comment: formComment })
      } else {
        await submitFeedback({ productId: Number(id), rating: formRating, comment: formComment })
      }
      setShowForm(false)
      setEditingId(null)
      setFormRating(5)
      setFormComment('')
      fetchAll()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditReview = (review) => {
    setEditingId(review.id)
    setFormRating(review.rating)
    setFormComment(review.comment || '')
    setShowForm(true)
    setFormError('')
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return
    try {
      await deleteFeedback(reviewId)
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review')
    }
  }

  const myReview = user ? reviews.find((r) => r.userId === user.id) : null

  if (loading) return <div style={styles.center}>Loading...</div>
  if (error) return <div style={styles.center}><p style={styles.error}>{error}</p></div>
  if (!book) return null

  return (
    <div style={styles.wrapper}>
      {/* Book Info */}
      <div style={styles.bookSection}>
        {book.imageUrl && (
          <img src={book.imageUrl} alt={book.title} style={styles.cover} />
        )}
        <div style={styles.bookInfo}>
          <h2 style={styles.bookTitle}>{book.title}</h2>
          <p style={styles.bookAuthor}>by {book.author}</p>
          {book.category && (
            <p style={styles.bookMeta}>Category: {book.category.name}</p>
          )}
          {book.isbn && <p style={styles.bookMeta}>ISBN: {book.isbn}</p>}
          <p style={styles.price}>₹{book.price?.toFixed(2)}</p>
          <p style={book.stockQuantity > 0 ? styles.inStock : styles.outOfStock}>
            {book.stockQuantity > 0 ? `In Stock (${book.stockQuantity})` : 'Out of Stock'}
          </p>

          {cartMsg && <p style={styles.cartMsg}>{cartMsg}</p>}
          {wishlistMsg && (
            <p style={{ ...styles.cartMsg, color: inWishlist ? '#27ae60' : '#e74c3c' }}>
              {wishlistMsg}
            </p>
          )}

          <div style={styles.btnGroup}>
            <button
              style={{
                ...styles.btnPrimary,
                opacity: book.stockQuantity === 0 || addingToCart ? 0.6 : 1,
              }}
              onClick={handleAddToCart}
              disabled={book.stockQuantity === 0 || addingToCart}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>

            <button
              style={{
                ...styles.btnWishlist,
                opacity: inWishlist || wishlistLoading ? 0.6 : 1,
              }}
              onClick={handleWishlist}
              disabled={inWishlist || wishlistLoading}
            >
              {inWishlist ? '♥ In Wishlist' : wishlistLoading ? 'Adding...' : '♡ Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Rating Summary */}
      {summary && summary.totalReviews > 0 && (
        <div style={styles.summaryBox}>
          <div style={styles.avgBlock}>
            <span style={styles.avgNumber}>{summary.averageRating}</span>
            <Stars rating={Math.round(summary.averageRating)} size="1.4rem" />
            <span style={styles.totalReviews}>{summary.totalReviews} review{summary.totalReviews !== 1 ? 's' : ''}</span>
          </div>
          <div style={styles.barChart}>
            {[
              { label: '5★', count: summary.fiveStar },
              { label: '4★', count: summary.fourStar },
              { label: '3★', count: summary.threeStar },
              { label: '2★', count: summary.twoStar },
              { label: '1★', count: summary.oneStar },
            ].map(({ label, count }) => (
              <div key={label} style={styles.barRow}>
                <span style={styles.barLabel}>{label}</span>
                <div style={styles.barTrack}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: summary.totalReviews > 0
                        ? `${(count / summary.totalReviews) * 100}%`
                        : '0%',
                    }}
                  />
                </div>
                <span style={styles.barCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div style={styles.reviewsSection}>
        <div style={styles.reviewsHeader}>
          <h3 style={styles.sectionTitle}>Customer Reviews</h3>
          {user && !myReview && !showForm && (
            <button style={styles.btnSecondary} onClick={() => { setShowForm(true); setEditingId(null); setFormRating(5); setFormComment('') }}>
              Write a Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showForm && (
          <form onSubmit={handleSubmitReview} style={styles.reviewForm}>
            <h4 style={{ margin: '0 0 1rem 0' }}>{editingId ? 'Edit Review' : 'Write a Review'}</h4>

            {formError && <p style={styles.error}>{formError}</p>}

            <div style={styles.formGroup}>
              <label style={styles.label}>Rating</label>
              <div style={styles.starPicker}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    style={{ ...styles.starOption, color: s <= formRating ? '#f39c12' : '#ccc' }}
                    onClick={() => setFormRating(s)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Comment (optional)</label>
              <textarea
                style={styles.textarea}
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Share your thoughts about this book..."
              />
            </div>

            <div style={styles.formActions}>
              <button type="button" style={styles.btnSecondary} onClick={() => { setShowForm(false); setEditingId(null) }}>
                Cancel
              </button>
              <button type="submit" style={styles.btnPrimary} disabled={submitting}>
                {submitting ? 'Submitting...' : editingId ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}

        {/* Review List */}
        {reviews.length === 0 ? (
          <p style={styles.muted}>No reviews yet. Be the first to review this book.</p>
        ) : (
          <div style={styles.reviewList}>
            {reviews.map((review) => (
              <div key={review.id} style={styles.reviewCard}>
                <div style={styles.reviewTop}>
                  <div>
                    <span style={styles.reviewerName}>{review.userName}</span>
                    <Stars rating={review.rating} size="0.95rem" />
                  </div>
                  <span style={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>
                {review.comment && <p style={styles.reviewComment}>{review.comment}</p>}

                {/* Edit/Delete for own review */}
                {user && user.id === review.userId && (
                  <div style={styles.reviewActions}>
                    <button style={styles.linkBtn} onClick={() => handleEditReview(review)}>Edit</button>
                    <button style={{ ...styles.linkBtn, color: '#e74c3c' }} onClick={() => handleDeleteReview(review.id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  wrapper: { maxWidth: '860px', margin: '2rem auto', padding: '0 1rem' },
  center: { textAlign: 'center', marginTop: '4rem', color: '#666' },
  error: { color: '#c0392b', fontSize: '0.9rem' },
  bookSection: { display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' },
  cover: { width: '160px', height: '220px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 },
  bookInfo: { flex: 1, minWidth: '220px' },
  bookTitle: { fontSize: '1.6rem', margin: '0 0 0.4rem 0' },
  bookAuthor: { color: '#555', margin: '0 0 0.5rem 0' },
  bookMeta: { color: '#888', fontSize: '0.85rem', margin: '0 0 0.3rem 0' },
  price: { fontSize: '1.4rem', fontWeight: '700', margin: '0.75rem 0 0.25rem 0' },
  inStock: { color: '#27ae60', fontSize: '0.9rem', margin: '0 0 1rem 0' },
  outOfStock: { color: '#e74c3c', fontSize: '0.9rem', margin: '0 0 1rem 0' },
  cartMsg: { fontSize: '0.85rem', color: '#27ae60', margin: '0 0 0.5rem 0' },
  summaryBox: {
    display: 'flex', gap: '2rem', padding: '1.5rem',
    border: '1px solid #e0e0e0', borderRadius: '8px',
    background: '#fafafa', marginBottom: '2rem', flexWrap: 'wrap',
  },
  avgBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', minWidth: '100px' },
  avgNumber: { fontSize: '2.5rem', fontWeight: '700', lineHeight: 1 },
  totalReviews: { fontSize: '0.8rem', color: '#888' },
  barChart: { flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.4rem', justifyContent: 'center' },
  barRow: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  barLabel: { width: '24px', fontSize: '0.8rem', color: '#555', textAlign: 'right' },
  barTrack: { flex: 1, height: '10px', background: '#e0e0e0', borderRadius: '5px', overflow: 'hidden' },
  barFill: { height: '100%', background: '#f39c12', borderRadius: '5px', transition: 'width 0.3s' },
  barCount: { width: '20px', fontSize: '0.8rem', color: '#888' },
  reviewsSection: { marginTop: '1rem' },
  reviewsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: '700', margin: 0 },
  reviewForm: {
    padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px',
    background: '#fff', marginBottom: '1.5rem',
  },
  formGroup: { marginBottom: '1rem' },
  label: { display: 'block', fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.4rem' },
  starPicker: { display: 'flex', gap: '0.4rem', cursor: 'pointer' },
  starOption: { fontSize: '1.8rem', cursor: 'pointer' },
  textarea: {
    width: '100%', padding: '0.6rem', border: '1px solid #ccc',
    borderRadius: '4px', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box',
  },
  formActions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' },
  reviewList: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  reviewCard: {
    padding: '1rem 1.25rem', border: '1px solid #e0e0e0',
    borderRadius: '8px', background: '#fff',
  },
  reviewTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' },
  reviewerName: { fontWeight: '600', marginRight: '0.5rem', fontSize: '0.95rem' },
  reviewDate: { fontSize: '0.8rem', color: '#aaa' },
  reviewComment: { margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#444', lineHeight: 1.5 },
  reviewActions: { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
  linkBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#333', padding: 0 },
  muted: { color: '#888', fontSize: '0.9rem' },
  btnPrimary: {
    padding: '0.75rem 1.5rem', background: '#333', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem',
  },
  btnWishlist: {
    padding: '0.75rem 1.5rem', background: 'transparent', color: '#e74c3c',
    border: '1px solid #e74c3c', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem',
  },
  btnGroup: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' },
  btnSecondary: {
    padding: '0.6rem 1.2rem', background: 'transparent', color: '#333',
    border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem',
  },
}

export default BookDetails
