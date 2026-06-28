import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    setUser(data.user)
    navigate('/dashboard')
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 8,
    border: '1.5px solid #e2e8f0', fontSize: 15, marginBottom: 16,
    background: '#fff', color: '#0A1628'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A1628', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ marginBottom: 32 }}><Logo size={52} /></div>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, maxWidth: 420, width: '100%' }}>
        <h2 style={{ fontSize: 28, marginBottom: 8 }}>Staff Sign In</h2>
        <p style={{ color: '#4A5568', fontSize: 14, marginBottom: 28 }}>Access your hotel dashboard</p>
        {error && <p style={{ color: '#C0392B', fontSize: 14, marginBottom: 16 }}>{error}</p>}
        <input style={inputStyle} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={inputStyle} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn-primary" style={{ width: '100%' }} onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}
