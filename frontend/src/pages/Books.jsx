import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const Books = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryId = searchParams.get('category')

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        let url
        if (search) {
          url = `http://localhost:8080/api/products/search?keyword=${search}&page=${page}`
        } else if (categoryId) {
          url = `http://localhost:8080/api/products/category/${categoryId}?page=${page}&size=10`
        } else {
          url = `http://localhost:8080/api/products?page=${page}&size=10`
        }
        const res = await fetch(url)
        const json = await res.json()
        setBooks(json.data?.content || [])
      } catch (err) {
        console.error('Failed to fetch books:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [search, page, categoryId])

  const clearFilters = () => {
    setSearch('')
    setSearchParams({})
    setPage(0)
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>📚</span>
        <h1 style={{ margin: 0 }}>Books</h1>
      </div>
      <p className="subtitle">Browse our collection of programming books</p>

      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          style={{ 
            padding: '0.75rem 1rem', 
            width: '100%', 
            maxWidth: '400px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '0.95rem'
          }}
        />
        {(categoryId || search) && (
          <button 
            onClick={clearFilters}
            className="btn-secondary"
            style={{ marginLeft: '1rem' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading...</p>
      ) : books.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>No books found.</p>
      ) : (
        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Image</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>
                    {book.imageUrl ? (
                      <img 
                        src={book.imageUrl} 
                        alt={book.title}
                        style={{
                          width: '50px',
                          height: '70px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid #e5e7eb'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div style={{
                      width: '50px',
                      height: '70px',
                      background: '#f3f4f6',
                      borderRadius: '4px',
                      display: book.imageUrl ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      📚
                    </div>
                  </td>
                  <td style={{ fontWeight: '500', color: '#1a1a1a' }}>{book.title}</td>
                  <td style={{ color: '#6b7280' }}>{book.author}</td>
                  <td>
                    <span className="badge badge-blue">
                      {book.category?.name || 'Programming'}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', color: '#1a1a1a' }}>₹{book.price}</td>
                  <td style={{ color: book.stockQuantity < 10 ? '#dc2626' : '#059669' }}>
                    {book.stockQuantity}
                  </td>
                  <td>
                    <a href={`/books/${book.id}`}>
                      <button 
                        className="btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      >
                        View Details
                      </button>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', alignItems: 'center', justifyContent: 'center' }}>
        <button 
          onClick={() => setPage((p) => Math.max(0, p - 1))} 
          disabled={page === 0}
          className="btn-secondary"
          style={{ opacity: page === 0 ? 0.5 : 1, cursor: page === 0 ? 'not-allowed' : 'pointer' }}
        >
          Previous
        </button>
        <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>Page {page + 1}</span>
        <button 
          onClick={() => setPage((p) => p + 1)} 
          disabled={books.length < 10}
          className="btn-secondary"
          style={{ opacity: books.length < 10 ? 0.5 : 1, cursor: books.length < 10 ? 'not-allowed' : 'pointer' }}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Books
