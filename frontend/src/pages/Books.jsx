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
          url = `/api/products/search?keyword=${search}&page=${page}`
        } else if (categoryId) {
          url = `/api/products/category/${categoryId}?page=${page}&size=10`
        } else {
          url = `/api/products?page=${page}&size=10`
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
      <h1>Books</h1>

      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          style={{ padding: '0.5rem', width: '100%', maxWidth: '400px' }}
        />
        {(categoryId || search) && (
          <button 
            onClick={clearFilters}
            style={{ marginLeft: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {books.map((book) => (
            <div
              key={book.id}
              style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}
            >
              {book.imageUrl && (
                <img src={book.imageUrl} alt={book.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              )}
              <h3 style={{ fontSize: '1rem', margin: '0.5rem 0' }}>{book.title}</h3>
              <p style={{ color: '#666', fontSize: '0.875rem' }}>{book.author}</p>
              <p style={{ fontWeight: 'bold' }}>₹{book.price}</p>
              <a href={`/books/${book.id}`}>
                <button style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                  View Details
                </button>
              </a>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={books.length < 10}>
          Next
        </button>
      </div>
    </div>
  )
}

export default Books
