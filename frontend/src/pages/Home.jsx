const Home = () => {
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
          {['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology'].map((cat) => (
            <div
              key={cat}
              style={{
                padding: '1rem 1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
