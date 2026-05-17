import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getCustomerDetails,
  updateCustomerDetails,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from '../api/profileApi'

const Profile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detailsForm, setDetailsForm] = useState({ phone: '', preferenceNotes: '' })
  const [detailsSaving, setDetailsSaving] = useState(false)
  const [detailsMsg, setDetailsMsg] = useState('')
  const [addrForm, setAddrForm] = useState({ line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false })
  const [addrSaving, setAddrSaving] = useState(false)
  const [addrMsg, setAddrMsg] = useState('')

  const fetchProfile = async () => {
    try {
      const res = await getCustomerDetails()
      const data = res.data.data
      setProfile(data)
      setDetailsForm({ phone: data.phone || '', preferenceNotes: data.preferenceNotes || '' })
    } catch {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProfile() }, [])

  const handleDetailsSubmit = async (e) => {
    e.preventDefault()
    setDetailsSaving(true)
    setDetailsMsg('')
    try {
      await updateCustomerDetails(detailsForm)
      setDetailsMsg('Saved!')
      fetchProfile()
    } catch {
      setDetailsMsg('Failed to save')
    } finally {
      setDetailsSaving(false)
    }
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    setAddrSaving(true)
    setAddrMsg('')
    try {
      await addAddress({ ...addrForm, isDefault: addrForm.isDefault })
      setAddrMsg('Address added!')
      setAddrForm({ line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false })
      fetchProfile()
    } catch (err) {
      setAddrMsg(err.response?.data?.message || 'Failed to add address')
    } finally {
      setAddrSaving(false)
    }
  }

  const handleDelete = async (id) => {
    await deleteAddress(id)
    fetchProfile()
  }

  const handleSetDefault = async (id) => {
    await setDefaultAddress(id)
    fetchProfile()
  }

  if (loading) return <div style={styles.center}>Loading...</div>
  if (error) return <div style={styles.center}>{error}</div>

  return (
    <div style={styles.page}>
      <h2>My Profile</h2>
      <p style={styles.meta}>{user?.name} &middot; {user?.email}</p>

      {/* Details */}
      <section style={styles.section}>
        <h3>Contact & Preferences</h3>
        <form onSubmit={handleDetailsSubmit} style={styles.form}>
          <label style={styles.label}>Phone</label>
          <input
            style={styles.input}
            value={detailsForm.phone}
            onChange={(e) => setDetailsForm({ ...detailsForm, phone: e.target.value })}
            placeholder="10-digit mobile number"
          />
          <label style={styles.label}>Preference Notes</label>
          <textarea
            style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }}
            value={detailsForm.preferenceNotes}
            onChange={(e) => setDetailsForm({ ...detailsForm, preferenceNotes: e.target.value })}
            placeholder="E.g. prefer paperback, gift wrap, etc."
          />
          <button style={styles.btn} type="submit" disabled={detailsSaving}>
            {detailsSaving ? 'Saving...' : 'Save'}
          </button>
          {detailsMsg && <span style={styles.msg}>{detailsMsg}</span>}
        </form>
      </section>

      {/* Addresses */}
      <section style={styles.section}>
        <h3>Saved Addresses</h3>
        {profile?.addresses?.length === 0 && <p style={styles.meta}>No addresses yet.</p>}
        {profile?.addresses?.map((addr) => (
          <div key={addr.id} style={{ ...styles.addrCard, border: addr.isDefault ? '2px solid #333' : '1px solid #ddd' }}>
            <p style={styles.addrLine}>
              {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
              {addr.isDefault && <span style={styles.badge}>Default</span>}
            </p>
            <div style={styles.addrActions}>
              {!addr.isDefault && (
                <button style={styles.linkBtn} onClick={() => handleSetDefault(addr.id)}>Set as default</button>
              )}
              <button style={{ ...styles.linkBtn, color: '#c0392b' }} onClick={() => handleDelete(addr.id)}>Delete</button>
            </div>
          </div>
        ))}

        <h4 style={{ marginTop: '1.5rem' }}>Add New Address</h4>
        <form onSubmit={handleAddAddress} style={styles.form}>
          <label style={styles.label}>Line 1 *</label>
          <input style={styles.input} value={addrForm.line1} onChange={(e) => setAddrForm({ ...addrForm, line1: e.target.value })} required />
          <label style={styles.label}>Line 2</label>
          <input style={styles.input} value={addrForm.line2} onChange={(e) => setAddrForm({ ...addrForm, line2: e.target.value })} />
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>City *</label>
              <input style={styles.input} value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} required />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>State *</label>
              <input style={styles.input} value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} required />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Pincode *</label>
              <input style={styles.input} value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })} required pattern="^[1-9][0-9]{5}$" title="6-digit pincode" />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={addrForm.isDefault} onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })} />
            Set as default address
          </label>
          <button style={styles.btn} type="submit" disabled={addrSaving}>
            {addrSaving ? 'Adding...' : 'Add Address'}
          </button>
          {addrMsg && <span style={styles.msg}>{addrMsg}</span>}
        </form>
      </section>
    </div>
  )
}

const styles = {
  page: { maxWidth: '720px', margin: '2rem auto', padding: '0 1rem' },
  section: { background: '#fff', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  label: { fontWeight: '600', fontSize: '0.85rem' },
  input: { padding: '0.6rem 0.8rem', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' },
  btn: { alignSelf: 'flex-start', padding: '0.6rem 1.4rem', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.95rem' },
  msg: { fontSize: '0.85rem', color: '#27ae60' },
  meta: { color: '#666', fontSize: '0.9rem' },
  addrCard: { padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '0.75rem' },
  addrLine: { margin: 0, marginBottom: '0.4rem' },
  addrActions: { display: 'flex', gap: '1rem' },
  linkBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#333', padding: 0, textDecoration: 'underline' },
  badge: { marginLeft: '0.5rem', background: '#333', color: '#fff', borderRadius: '3px', padding: '0 6px', fontSize: '0.75rem' },
  row: { display: 'flex', gap: '0.75rem' },
  col: { display: 'flex', flexDirection: 'column', flex: 1, gap: '0.4rem' },
  center: { textAlign: 'center', marginTop: '4rem', color: '#666' },
}

export default Profile
