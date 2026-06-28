import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Logo from '../../components/Logo'

export default function Dashboard({ user }) {
  const [hotel, setHotel] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('hotels').select('*').limit(1).single().then(({ data }) => setHotel(data))
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const navStyle = ({ isActive }) => ({
    display: 'block', padding: '12px 20px', borderRadius: 8, fontWeight: 500,
    color: isActive ? '#0A1628' : '#F8F4ED',
    background: isActive ? '#C9A84C' : 'transparent',
    marginBottom: 4, transition: 'all 0.15s'
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: '#0A1628', padding: '28px 16px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ marginBottom: 32 }}><Logo size={36} /></div>
        {hotel && (
          <div style={{ background: '#162032', borderRadius: 8, padding: '12px 16px', marginBottom: 24 }}>
            <p style={{ color: '#C9A84C', fontWeight: 600, fontSize: 14 }}>{hotel.name}</p>
            <p style={{ color: '#94a3b8', fontSize: 12 }}>{hotel.location}</p>
          </div>
        )}
        <nav style={{ flex: 1 }}>
          <NavLink to="/dashboard" end style={navStyle}>🏠 Rooms</NavLink>
          <NavLink to="/dashboard/bookings" style={navStyle}>📋 Bookings</NavLink>
          <NavLink to="/dashboard/revenue" style={navStyle}>💰 Revenue</NavLink>
          <NavLink to="/dashboard/settings" style={navStyle}>⚙️ Settings</NavLink>
        </nav>
        {hotel && (
          <a href={`/hotel/${hotel.slug}`} target="_blank" rel="noreferrer" style={{ display: 'block', padding: '10px 20px', color: '#C9A84C', fontSize: 13, marginBottom: 8 }}>
            🔗 View Booking Page
          </a>
        )}
        <button onClick={handleLogout} style={{ padding: '10px 20px', color: '#94a3b8', background: 'transparent', textAlign: 'left', fontSize: 14 }}>
          → Sign Out
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '32px 28px', background: '#F8F4ED', overflow: 'auto' }}>
        <Outlet context={{ hotel }} />
      </div>
    </div>
  )
}
