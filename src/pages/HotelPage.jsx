import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

export default function HotelPage() {
  const { slug } = useParams()
  const [hotel, setHotel] = useState(null)
  const [roomTypes, setRoomTypes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: h } = await supabase.from('hotels').select('*').eq('slug', slug).single()
      if (h) {
        setHotel(h)
        const { data: rt } = await supabase.from('room_types').select('*').eq('hotel_id', h.id)
        setRoomTypes(rt || [])
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#C9A84C', fontFamily: 'Cormorant Garamond', fontSize: 24 }}>Loading...</div>
  if (!hotel) return <div style={{ padding: 40, textAlign: 'center' }}>Hotel not found.</div>

  return (
    <div style={{ minHeight: '100vh', background: '#F8F4ED' }}>
      <div style={{ background: '#0A1628', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/"><Logo size={36} /></Link>
      </div>

      {hotel.cover_image && (
        <div style={{ height: 280, overflow: 'hidden' }}>
          <img src={hotel.cover_image} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 42, marginBottom: 8 }}>{hotel.name}</h1>
        <p style={{ color: '#C9A84C', fontWeight: 600, marginBottom: 8 }}>📍 {hotel.location}</p>
        <p style={{ color: '#4A5568', marginBottom: 8 }}>📞 {hotel.phone}</p>
        <p style={{ color: '#4A5568', marginBottom: 32, lineHeight: 1.7 }}>{hotel.description}</p>

        <h2 style={{ fontSize: 28, marginBottom: 24 }}>Available Room Types</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
          {roomTypes.map(rt => (
            <div key={rt.id} className="card" style={{ borderTop: '4px solid #C9A84C' }}>
              {rt.image && <img src={rt.image} alt={rt.name} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />}
              <h3 style={{ fontSize: 20, marginBottom: 6 }}>{rt.name}</h3>
              <p style={{ color: '#4A5568', fontSize: 14, marginBottom: 12 }}>{rt.description}</p>
              <p style={{ color: '#C9A84C', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>GHS {rt.price}<span style={{ color: '#4A5568', fontSize: 13, fontWeight: 400 }}>/night</span></p>
              <Link to={`/hotel/${slug}/book?type=${rt.id}&price=${rt.price}&room=${encodeURIComponent(rt.name)}`}>
                <button className="btn-primary" style={{ width: '100%' }}>Book This Room</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
