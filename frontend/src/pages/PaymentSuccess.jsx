import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [paymentDetails, setPaymentDetails] = useState(null)

  useEffect(() => {
    // Get payment details from location state or generate mock data
    const details = location.state || {
      amount: 1198,
      transactionId: 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase(),
      paymentMethod: 'UPI',
      status: 'CONFIRMED'
    }
    setPaymentDetails(details)
  }, [location])

  if (!paymentDetails) return null

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '3rem 2.5rem',
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center'
      }}>
        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: '#10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          animation: 'scaleIn 0.3s ease-out'
        }}>
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#1a1a1a',
          margin: '0 0 1rem'
        }}>
          Payment Successful!
        </h1>

        {/* Amount */}
        <div style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#374151',
          margin: '0 0 2rem'
        }}>
          ₹{paymentDetails.amount}
        </div>

        {/* Payment Details */}
        <div style={{
          background: '#f9fafb',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Transaction ID</span>
              <span style={{ 
                color: '#1a1a1a', 
                fontSize: '0.9rem', 
                fontWeight: '500',
                fontFamily: 'monospace'
              }}>
                {paymentDetails.transactionId}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Payment Method</span>
              <span style={{ color: '#1a1a1a', fontSize: '0.9rem', fontWeight: '500' }}>
                {paymentDetails.paymentMethod}
              </span>
            </div>
          </div>

          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Status</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                background: '#d1fae5',
                color: '#065f46',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                <span style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: '#10b981' 
                }}></span>
                {paymentDetails.status}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={() => navigate('/orders')}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#1f2937'}
            onMouseLeave={(e) => e.target.style.background = '#374151'}
          >
            View My Orders →
          </button>

          <button
            onClick={() => navigate('/books')}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white'
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default PaymentSuccess
