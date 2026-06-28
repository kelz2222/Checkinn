import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Revenue() {
  const { hotel } = useOutletContext()
  const [bookings, setBookings] = useState([])
  const [range, setRange] = useState('today')

  useEffect(() => {
    if (!hotel) return
    supabase.from('bookings').select('*').eq('hotel_id', hotel.id).in('status', ['confirmed', 'checked_in', 'checked_out']).then(({ data }) => setBookings(data || []))
  }, [hotel])

  const today = new Date().toISOString().split('T')[0]
  const thisMonth = today.slice(0, 7)

  const filtered = bookings.filter(b => {
    if (range === 'today') return b.check_in === today
    if (range === 'month') return b.check_in?.startsWith(thisMonth)
    return true
  })

  const total = filtered.reduce((sum, b) => sum + (b.amount || 0), 0)
  const totalAll = bookings.reduce((sum, b) => sum + (b.amount || 0), 0)

  return (
    <div>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Revenue</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {[['today', 'Today'], ['month', 'This Month'], ['all', 'All Time']].map(([val, label]) => (
          <button key={val} onClick={() => setRange(val)} style={{ padding: '8px 20px', borderRadius: 20, border: '1.5px solid #e2e8f0', background: range === val ? '#0A1628' : '#fff', color: range === val ? '#C9A84C' : '#4A5568', fontWeight: 500 }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20, marginBottom: 32 }}>
        <div className="card" style={{ borderTop: '4px solid #C9A84C' }}>
          <p style={{ color: '#4A5568', fontSize: 13, marginBottom: 8 }}>Revenue ({range})</p>
          <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 40, fontWeight: 700, color: '#0A1628' }}>GHS {total.toFixed(2)}</p>
        </div>
        <div className="card" style={{ borderTop: '4px solid #2D7A4F' }}>
          <p style={{ color: '#4A5568', fontSize: 13, marginBottom: 8 }}>Bookings ({range})</p>
          <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 40, fontWeight: 700, color: '#2D7A4F' }}>{filtered.length}</p>
        </div>
        <div className="card" style={{ borderTop: '4px solid #64748b' }}>
          <p style={{ color: '#4A5568', fontSize: 13, marginBottom: 8 }}>All-Time Revenue</p>
          <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 40, fontWeight: 700, color: '#64748b' }}>GHS {totalAll.toFixed(2)}</p>
        </div>
      </div>

      <h2 style={{ fontSize: 22, marginBottom: 16 }}>Booking Breakdown</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(b => (
          <div key={b.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 600 }}>{b.guest_name}</p>
              <p style={{ color: '#4A5568', fontSize: 13 }}>{b.check_in} → {b.check_out}</p>
            </div>
            <p style={{ color: '#C9A84C', fontWeight: 700, fontSize: 18 }}>GHS {b.amount}</p>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ color: '#4A5568', textAlign: 'center' }}>No revenue data for this period.</p>}
      </div>
    </div>
  )
}
