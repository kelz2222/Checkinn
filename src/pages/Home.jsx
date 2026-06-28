import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

export default function Home() {
  const [hotels, setHotels] = useState([])

  useEffect(() => {
    supabase.from('hotels').select('*').then(({ data }) => setHotels(data || []))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628' }}>
      {/* Hero */}
      <div style={{ padding: '32px 24px 0' }}>
        <Logo size={48} />
      </div>
      <div style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: 'clamp(36px,7vw,72px)', color: '#F8F4ED', lineHeight: 1.1, marginBottom: 20 }}>
          Find Your Perfect<br /><span style={{ color: '#C9A84C' }}>Room Tonight</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 480, margin: '0 auto 40px' }}>
          Browse and book rooms at the best hotels in your area — instantly.
        </p>
        <Link to="/login">
          <button className="btn-outline">Hotel Owner? Sign In →</button>
        </Link>
      </div>

      {/* Hotels */}
      <div style={{ background: '#F8F4ED', borderRadius: '32px 32px 0 0', padding: '48px 24px', minHeight: '60vh' }}>
        <h2 style={{ fontSize: 32, marginBottom: 32, textAlign: 'center' }}>Available Hotels</h2>
        {hotels.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#4A5568' }}>No hotels listed yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
            {hotels.map(h => (
              <Link to={`/hotel/${h.slug}`} key={h.id}>
                <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s', borderTop: '4px solid #C9A84C' }}>
                  {h.cover_image && <img src={h.cover_image} alt={h.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />}
                  <h3 style={{ fontSize: 22, marginBottom: 6 }}>{h.name}</h3>
                  <p style={{ color: '#C9A84C', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📍 {h.location}</p>
                  <p style={{ color: '#4A5568', fontSize: 14 }}>{h.description?.slice(0, 100)}...</p>
                  <div style={{ marginTop: 16, color: '#C9A84C', fontWeight: 600, fontSize: 14 }}>View Rooms →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
