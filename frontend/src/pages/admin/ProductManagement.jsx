import { useState, useEffect } from 'react'
import axiosClient from '../../api/axiosClient'
import { getCategories } from '../../api/productApi'

const EMPTY_FORM = {
  title: '', author: '', isbn: '', price: '', stockQuantity: '',
  imageUrl: '', categoryId: '', description: '',
}

const ProductManagement = () => {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [page, setPage]             = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')

  // Modal state
  const [showModal, setShowModal]   = useState(false)
  const [editId, setEditId]         = useState(null)
  const [form, setForm]             = useState(EMPTY_FORM)
  const [saving, setSaving]         = useState(false)
  const [formError, setFormError]   = useState('')

  useEffect(() => {
    getCategories().then(res => setCategories(res.data.data || []))
  }, [])

  useEffect(() => { fetchProducts() }, [page])

  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axiosClient.get(`/api/products?page=${page}&size=10&sortBy=id&sortDir=ASC`)
      const data = res.data.data
      setProducts(data?.content || [])
      setTotalPages(data?.totalPages || 0)
    } catch {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditId(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (p) => {
    setEditId(p.id)
    setForm({
      title: p.title || '', author: p.author || '', isbn: p.isbn || '',
      price: p.price || '', stockQuantity: p.stockQuantity || '',
      imageUrl: p.imageUrl || '', categoryId: p.categoryId || '',
      description: p.description || '',
    })
    setFormError('')
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditId(null); setForm(EMPTY_FORM) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stockQuantity: parseInt(form.stockQuantity),
      categoryId: parseInt(form.categoryId),
    }
    try {
      if (editId) {
        await axiosClient.put(`/api/products/${editId}`, payload)
        setSuccess('Book updated successfully')
      } else {
        await axiosClient.post('/api/products', payload)
        setSuccess('Book added successfully')
      }
      closeModal()
      fetchProducts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save book')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    try {
      await axiosClient.delete(`/api/products/${id}`)
      setSuccess('Book deleted')
      fetchProducts()
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to delete book')
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h1 style={styles.title}>📚 Book Management</h1>
        <button style={styles.addBtn} onClick={openAdd}>+ Add Book</button>
      </div>

      {error   && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      {loading ? (
        <p style={styles.center}>Loading books...</p>
      ) : (
        <>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Cover</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Author</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={styles.tr}>
                    <td style={styles.td}>
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt={p.title} style={styles.cover} />
                        : <div style={styles.noImg}>📖</div>}
                    </td>
                    <td style={{ ...styles.td, fontWeight: '600', maxWidth: '200px' }}>{p.title}</td>
                    <td style={styles.td}>{p.author}</td>
                    <td style={styles.td}>₹{p.price}</td>
                    <td style={{ ...styles.td, color: p.stockQuantity < 10 ? '#dc2626' : '#16a34a', fontWeight: '600' }}>
                      {p.stockQuantity}
                    </td>
                    <td style={styles.td}>{p.categoryName}</td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button style={styles.editBtn} onClick={() => openEdit(p)}>Edit</button>
                        <button style={styles.deleteBtn} onClick={() => handleDelete(p.id, p.title)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={styles.pagination}>
            <button style={styles.pageBtn} onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>← Prev</button>
            <span style={styles.pageInfo}>Page {page + 1} of {totalPages || 1}</span>
            <button style={styles.pageBtn} onClick={() => setPage(p => p + 1)} disabled={page + 1 >= totalPages}>Next →</button>
          </div>
        </>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editId ? 'Edit Book' : 'Add New Book'}</h2>
              <button style={styles.closeBtn} onClick={closeModal}>✕</button>
            </div>

            {formError && <p style={styles.error}>{formError}</p>}

            <form onSubmit={handleSave} style={styles.form}>
              <div style={styles.row}>
                <div style={styles.col}>
                  <label style={styles.label}>Title *</label>
                  <input style={styles.input} value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                </div>
                <div style={styles.col}>
                  <label style={styles.label}>Author *</label>
                  <input style={styles.input} value={form.author} onChange={e => setForm({...form, author: e.target.value})} required />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.col}>
                  <label style={styles.label}>Price (₹) *</label>
                  <input style={styles.input} type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                </div>
                <div style={styles.col}>
                  <label style={styles.label}>Stock *</label>
                  <input style={styles.input} type="number" min="0" value={form.stockQuantity} onChange={e => setForm({...form, stockQuantity: e.target.value})} required />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.col}>
                  <label style={styles.label}>Category *</label>
                  <select style={styles.input} value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={styles.col}>
                  <label style={styles.label}>ISBN</label>
                  <input style={styles.input} value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} />
                </div>
              </div>

              <label style={styles.label}>Cover Image URL</label>
              <input style={styles.input} value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." />

              <label style={styles.label}>Description</label>
              <textarea style={{...styles.input, height: '80px', resize: 'vertical'}} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />

              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                <button type="submit" style={styles.saveBtn} disabled={saving}>
                  {saving ? 'Saving...' : editId ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper:      { maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title:        { fontSize: '1.6rem', fontWeight: '700', margin: 0 },
  addBtn:       { padding: '0.6rem 1.4rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' },
  center:       { textAlign: 'center', color: '#666', padding: '2rem' },
  error:        { color: '#dc2626', fontSize: '0.9rem', marginBottom: '0.75rem' },
  success:      { color: '#16a34a', fontSize: '0.9rem', marginBottom: '0.75rem', background: '#f0fdf4', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #bbf7d0' },
  tableWrap:    { overflowX: 'auto' },
  table:        { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  thead:        { background: '#f9fafb' },
  th:           { padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.82rem', fontWeight: '700', color: '#374151', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap' },
  tr:           { borderBottom: '1px solid #f3f4f6' },
  td:           { padding: '0.75rem 1rem', fontSize: '0.9rem', color: '#374151', verticalAlign: 'middle' },
  cover:        { width: '40px', height: '55px', objectFit: 'cover', borderRadius: '3px' },
  noImg:        { width: '40px', height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '3px', fontSize: '1.2rem' },
  actions:      { display: 'flex', gap: '0.5rem' },
  editBtn:      { padding: '0.3rem 0.8rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.82rem' },
  deleteBtn:    { padding: '0.3rem 0.8rem', background: 'transparent', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '4px', cursor: 'pointer', fontSize: '0.82rem' },
  pagination:   { display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' },
  pageBtn:      { padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '0.9rem' },
  pageInfo:     { color: '#6b7280', fontSize: '0.9rem' },
  // Modal
  overlay:      { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modal:        { background: '#fff', borderRadius: '10px', padding: '1.75rem', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  modalTitle:   { margin: 0, fontSize: '1.2rem', fontWeight: '700' },
  closeBtn:     { background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#6b7280' },
  form:         { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  row:          { display: 'flex', gap: '0.75rem' },
  col:          { flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label:        { fontSize: '0.82rem', fontWeight: '600', color: '#374151' },
  input:        { padding: '0.55rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' },
  modalActions: { display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' },
  cancelBtn:    { padding: '0.6rem 1.2rem', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  saveBtn:      { padding: '0.6rem 1.4rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' },
}

export default ProductManagement
