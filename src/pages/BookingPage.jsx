import { useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

export default function BookingPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const roomTypeId = params.get('type')
  const price = params.get('price')
  const roomName = params.get('room')

  const [form, setForm] = useState({ guest_name: '', guest_phone: '', check_in: '', check_out: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleBook() {
    if (!form.guest_name || !form.guest_phone || !form.check_in || !form.check_out) {
      setError('Please fill all required fields.')
      return
    }
    setLoading(true)
    setError('')
    const { data: hotel } = await supabase.from('hotels').select('id').eq('slug', slug).single()
    if (!hotel) { setError('Hotel not found.'); setLoading(false); return }

    const nights = Math.max(1, (new Date(form.check_out) - new Date(form.check_in)) / 86400000)
    const total = nights * parseFloat(price)

    const { error: err } = await supabase.from('bookings').insert({
      hotel_id: hotel.id,
      guest_name: form.guest_name,
      guest_phone: form.guest_phone,
      check_in: form.check_in,
      check_out: form.check_out,
      amount: total,
      notes: form.notes,
      status: 'pending',
      source: 'online'
    })

    if (err) { setError('Booking failed. Try again.'); setLoading(false); return }
    setSubmitted(true)
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 8,
    border: '1.5px solid #e2e8f0', fontSize: 15, marginBottom: 16,
    background: '#fff', color: '#0A1628'
  }

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, maxWidth: 440, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 32, marginBottom: 12 }}>Booking Received!</h2>
        <p style={{ color: '#4A5568', marginBottom: 8 }}>Thank you, <strong>{form.guest_name}</strong>.</p>
        <p style={{ color: '#4A5568', marginBottom: 24 }}>The hotel will confirm your reservation via WhatsApp or call on <strong>{form.guest_phone}</strong>. Payment is made on arrival.</p>
        <Link to={`/hotel/${slug}`}><button className="btn-primary">Back to Hotel</button></Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F8F4ED' }}>
      <div style={{ background: '#0A1628', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/"><Logo size={36} /></Link>
      </div>
      <div style={{ maxWidth: 500, margin: '40px auto', padding: '0 24px' }}>
        <div className="card">
          <div style={{ background: '#0A1628', margin: '-24px -24px 24px', padding: '24px', borderRadius: '10px 10px 0 0' }}>
            <h2 style={{ color: '#F8F4ED', fontSize: 26 }}>Book Your Room</h2>
            <p style={{ color: '#C9A84C', marginTop: 4 }}>{roomName} — GHS {price}/night</p>
          </div>
          {error && <p style={{ color: '#C0392B', marginBottom: 16, fontSize: 14 }}>{error}</p>}
          <label style={{ fontSize: 13, fontWeight: 600, color: '#4A5568', display: 'block', marginBottom: 4 }}>Full Name *</label>
          <input style={inputStyle} placeholder="Your full name" value={form.guest_name} onChange={e => setForm({ ...form, guest_name: e.target.value })} />
          <label style={{ fontSize: 13, fontWeight: 600, color: '#4A5568', display: 'block', marginBottom: 4 }}>Phone / WhatsApp *</label>
          <input style={inputStyle} placeholder="+233..." value={form.guest_phone} onChange={e => setForm({ ...form, guest_phone: e.target.value })} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#4A5568', display: 'block', marginBottom: 4 }}>Check-in *</label>
              <input type="date" style={inputStyle} value={form.check_in} onChange={e => setForm({ ...form, check_in: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#4A5568', display: 'block', marginBottom: 4 }}>Check-out *</label>
              <input type="date" style={inputStyle} value={form.check_out} onChange={e => setForm({ ...form, check_out: e.target.value })} />
            </div>
          </div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#4A5568', display: 'block', marginBottom: 4 }}>Special Requests</label>
          <textarea style={{ ...inputStyle, height: 80, resize: 'vertical' }} placeholder="Any special requests..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <button className="btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={handleBook} disabled={loading}>
            {loading ? 'Submitting...' : 'Confirm Booking'}
          </button>
          <p style={{ fontSize: 12, color: '#4A5568', marginTop: 12, textAlign: 'center' }}>Payment is made on arrival. The hotel will contact you to confirm.</p>
        </div>
      </div>
    </div>
  )
}
