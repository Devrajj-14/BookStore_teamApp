import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const categories = [
    { id: 1, name: 'Fiction' },
    { id: 2, name: 'Non-Fiction' },
    { id: 3, name: 'Science' },
    { id: 4, name: 'History' },
    { id: 5, name: 'Technology' }
  ]

  const handleCategoryClick = (categoryId) => {
    navigate(`/books?category=${categoryId}`)
  }

  return (
    <div className="container">
      <section style={{ padding: '2rem 0' }}>
        <h1>Welcome to BookStore</h1>
        <p>Discover your next favourite book.</p>
        <a href="/books">
          <button style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
            Browse Books
          </button>
        </a>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Featured Categories</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              style={{
                padding: '1rem 1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0'
                e.currentTarget.style.borderColor = '#999'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = '#ddd'
              }}
            >
              {cat.name}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
