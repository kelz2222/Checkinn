import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Settings() {
  const { hotel } = useOutletContext()
  const [form, setForm] = useState({ name: '', location: '', description: '', phone: '', whatsapp: '', slug: '', cover_image: '' })
  const [roomTypes, setRoomTypes] = useState([])
  const [newType, setNewType] = useState({ name: '', price: '', description: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (hotel) {
      setForm({ name: hotel.name || '', location: hotel.location || '', description: hotel.description || '', phone: hotel.phone || '', whatsapp: hotel.whatsapp || '', slug: hotel.slug || '', cover_image: hotel.cover_image || '' })
      supabase.from('room_types').select('*').eq('hotel_id', hotel.id).then(({ data }) => setRoomTypes(data || []))
    }
  }, [hotel])

  async function saveHotel() {
    await supabase.from('hotels').update(form).eq('id', hotel.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function addRoomType() {
    if (!newType.name || !newType.price) return
    await supabase.from('room_types').insert({ ...newType, hotel_id: hotel.id, price: parseFloat(newType.price) })
    setNewType({ name: '', price: '', description: '' })
    const { data } = await supabase.from('room_types').select('*').eq('hotel_id', hotel.id)
    setRoomTypes(data || [])
  }

  async function deleteRoomType(id) {
    await supabase.from('room_types').delete().eq('id', id)
    setRoomTypes(roomTypes.filter(r => r.id !== id))
  }

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 15, marginBottom: 16, background: '#fff', color: '#0A1628' }
  const labelStyle = { fontSize: 13, fontWeight: 600, color: '#4A5568', display: 'block', marginBottom: 4 }

  return (
    <div style={{ maxWidth: 700 }}>
      <h1 style={{ fontSize: 32, marginBottom: 28 }}>Hotel Settings</h1>

      <div className="card" style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, marginBottom: 20 }}>Hotel Information</h2>
        <label style={labelStyle}>Hotel Name</label>
        <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <label style={labelStyle}>Location</label>
        <input style={inputStyle} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, height: 90, resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Phone</label>
            <input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>WhatsApp</label>
            <input style={inputStyle} value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
          </div>
        </div>
        <label style={labelStyle}>URL Slug (e.g. awaso-royal)</label>
        <input style={inputStyle} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
        <label style={labelStyle}>Cover Image URL</label>
        <input style={inputStyle} value={form.cover_image} onChange={e => setForm({ ...form, cover_image: e.target.value })} />
        <button className="btn-primary" onClick={saveHotel}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 22, marginBottom: 20 }}>Room Types & Pricing</h2>
        {roomTypes.map(rt => (
          <div key={rt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <p style={{ fontWeight: 600 }}>{rt.name}</p>
              <p style={{ color: '#C9A84C', fontSize: 14 }}>GHS {rt.price}/night</p>
              <p style={{ color: '#4A5568', fontSize: 13 }}>{rt.description}</p>
            </div>
            <button onClick={() => deleteRoomType(rt.id)} style={{ color: '#C0392B', background: 'none', padding: '6px 12px', fontSize: 13 }}>Remove</button>
          </div>
        ))}
        <div style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Add Room Type</h3>
          <input style={inputStyle} placeholder="Type name (e.g. Standard, Deluxe)" value={newType.name} onChange={e => setNewType({ ...newType, name: e.target.value })} />
          <input style={inputStyle} placeholder="Price per night (GHS)" type="number" value={newType.price} onChange={e => setNewType({ ...newType, price: e.target.value })} />
          <input style={inputStyle} placeholder="Description" value={newType.description} onChange={e => setNewType({ ...newType, description: e.target.value })} />
          <button className="btn-primary" onClick={addRoomType}>Add Room Type</button>
        </div>
      </div>
    </div>
  )
}
