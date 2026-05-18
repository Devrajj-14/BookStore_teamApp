import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  const categories = [
    { id: 1, name: 'Fiction', icon: '📖', color: '#dbeafe' },
    { id: 2, name: 'Non-Fiction', icon: '📚', color: '#fce7f3' },
    { id: 3, name: 'Science', icon: '🔬', color: '#e0e7ff' },
    { id: 4, name: 'History', icon: '🏛️', color: '#fef3c7' },
    { id: 5, name: 'Technology', icon: '💻', color: '#d1fae5' }
  ]

  const handleCategoryClick = (categoryId) => {
    navigate(`/books?category=${categoryId}`)
  }

  return (
    <div className="container">
      {/* Hero Section */}
      <section style={{ 
        padding: '4rem 0 3rem', 
        textAlign: 'center',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '3rem'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '700', 
          marginBottom: '1rem',
          color: '#1f2937'
        }}>
          Welcome to BookStore
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#6b7280', 
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}>
          Discover your next favorite book from our curated collection of programming and technology books.
        </p>
        <button
          onClick={() => navigate('/books')}
          className="btn-primary"
          style={{ 
            padding: '1rem 2.5rem',
            fontSize: '1.1rem'
          }}
        >
          Browse All Books →
        </button>
      </section>

      {/* Categories Section */}
      <section>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>
          📚 Browse by Category
        </h2>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              style={{
                background: 'white',
                padding: '2rem 1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                background: cat.color,
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                {cat.icon}
              </div>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0
              }}>
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ 
        marginTop: '4rem',
        padding: '3rem 0',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚚</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Fast Delivery
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              Get your books delivered within 3-5 business days
            </p>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💳</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Secure Payment
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              Multiple payment options with secure checkout
            </p>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Wide Selection
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              Curated collection of programming books
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
