import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const STATUSES = ['vacant', 'occupied', 'reserved', 'maintenance']

export default function Rooms() {
  const { hotel } = useOutletContext()
  const [rooms, setRooms] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [newRoom, setNewRoom] = useState({ room_number: '', status: 'vacant' })

  async function loadRooms() {
    if (!hotel) return
    const { data } = await supabase.from('rooms').select('*, room_types(name, price)').eq('hotel_id', hotel.id).order('room_number')
    setRooms(data || [])
  }

  useEffect(() => { loadRooms() }, [hotel])

  async function updateStatus(id, status) {
    await supabase.from('rooms').update({ status }).eq('id', id)
    loadRooms()
  }

  async function addRoom() {
    if (!newRoom.room_number) return
    await supabase.from('rooms').insert({ ...newRoom, hotel_id: hotel.id })
    setNewRoom({ room_number: '', status: 'vacant' })
    setShowAdd(false)
    loadRooms()
  }

  const counts = STATUSES.reduce((a, s) => ({ ...a, [s]: rooms.filter(r => r.status === s).length }), {})

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 32 }}>Room Overview</h1>
        <button className="btn-primary" onClick={() => setShowAdd(!showAdd)}>+ Add Room</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
        {[['Vacant', counts.vacant, '#2D7A4F'], ['Occupied', counts.occupied, '#C0392B'], ['Reserved', counts.reserved, '#d97706'], ['Maintenance', counts.maintenance, '#64748b']].map(([label, count, color]) => (
          <div key={label} className="card" style={{ textAlign: 'center', borderTop: `4px solid ${color}` }}>
            <div style={{ fontSize: 36, fontFamily: 'Cormorant Garamond', fontWeight: 700, color }}>{count}</div>
            <div style={{ color: '#4A5568', fontSize: 13, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Add Room Form */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#4A5568', display: 'block', marginBottom: 4 }}>Room Number</label>
            <input style={{ padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 15 }} placeholder="e.g. 101" value={newRoom.room_number} onChange={e => setNewRoom({ ...newRoom, room_number: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#4A5568', display: 'block', marginBottom: 4 }}>Status</label>
            <select style={{ padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 15 }} value={newRoom.status} onChange={e => setNewRoom({ ...newRoom, status: e.target.value })}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button className="btn-primary" onClick={addRoom}>Save Room</button>
        </div>
      )}

      {/* Room Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
        {rooms.map(room => (
          <div key={room.id} className="card" style={{ borderLeft: `5px solid ${room.status === 'vacant' ? '#2D7A4F' : room.status === 'occupied' ? '#C0392B' : room.status === 'reserved' ? '#d97706' : '#64748b'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 22, fontFamily: 'Cormorant Garamond', fontWeight: 700 }}>Room {room.room_number}</span>
              <span className={`badge-${room.status}`}>{room.status}</span>
            </div>
            {room.room_types && <p style={{ fontSize: 13, color: '#4A5568', marginBottom: 10 }}>{room.room_types.name} — GHS {room.room_types.price}</p>}
            <select style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1.5px solid #e2e8f0', fontSize: 13 }} value={room.status} onChange={e => updateStatus(room.id, e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
