import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const STATUSES = ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled']

export default function Bookings() {
  const { hotel } = useOutletContext()
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('all')

  async function loadBookings() {
    if (!hotel) return
    const { data } = await supabase.from('bookings').select('*').eq('hotel_id', hotel.id).order('created_at', { ascending: false })
    setBookings(data || [])
  }

  useEffect(() => { loadBookings() }, [hotel])

  async function updateStatus(id, status) {
    await supabase.from('bookings').update({ status }).eq('id', id)
    loadBookings()
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Bookings</h1>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['all', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 18px', borderRadius: 20, border: '1.5px solid #e2e8f0', background: filter === s ? '#0A1628' : '#fff', color: filter === s ? '#C9A84C' : '#4A5568', fontWeight: 500, fontSize: 13 }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#4A5568', padding: 48 }}>No bookings found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(b => (
            <div key={b.id} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 18, fontFamily: 'Cormorant Garamond', fontWeight: 700 }}>{b.guest_name}</span>
                  <span className={`badge-${b.status}`}>{b.status}</span>
                  {b.source === 'online' && <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>Online</span>}
                </div>
                <p style={{ color: '#4A5568', fontSize: 14 }}>📞 {b.guest_phone}</p>
                <p style={{ color: '#4A5568', fontSize: 14 }}>📅 {b.check_in} → {b.check_out}</p>
                {b.amount && <p style={{ color: '#C9A84C', fontWeight: 600, marginTop: 4 }}>GHS {b.amount}</p>}
                {b.notes && <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>"{b.notes}"</p>}
              </div>
              <div>
                <select style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13 }} value={b.status} onChange={e => updateStatus(b.id, e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
