import { useState, useEffect } from 'react'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products?page=${page}&size=10`)
      const json = await res.json()
      setProducts(json.data?.content || [])
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [page])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      fetchProducts()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Product Management</h1>
        <a href="/admin/products/new">
          <button style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>+ Add Product</button>
        </a>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Title</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Author</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Price</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Stock</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '0.75rem' }}>{p.title}</td>
                <td style={{ padding: '0.75rem' }}>{p.author}</td>
                <td style={{ padding: '0.75rem' }}>₹{p.price}</td>
                <td style={{ padding: '0.75rem', color: p.stockQuantity < 10 ? 'red' : 'inherit' }}>
                  {p.stockQuantity}
                </td>
                <td style={{ padding: '0.75rem' }}>{p.categoryName}</td>
                <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <a href={`/admin/products/${p.id}/edit`}>
                    <button style={{ cursor: 'pointer' }}>Edit</button>
                  </a>
                  <button onClick={() => handleDelete(p.id)} style={{ cursor: 'pointer', color: 'red' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>Previous</button>
        <span>Page {page + 1}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={products.length < 10}>Next</button>
      </div>
    </div>
  )
}

export default ProductManagement
