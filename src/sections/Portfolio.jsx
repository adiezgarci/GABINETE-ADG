import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'

const SEED_PORTFOLIO = [
  { ticker: 'YU.L', name: 'Yü Group', currency: 'GBP', shares: 0, buy_price: 0, current_price: 0, invested: 12194, current_value: 12194 },
  { ticker: 'NWL.MI', name: 'NewPrinces', currency: 'EUR', shares: 0, buy_price: 0, current_price: 0, invested: 12518, current_value: 12518 },
  { ticker: 'WED.V', name: 'Westaim', currency: 'CAD', shares: 0, buy_price: 0, current_price: 0, invested: 10623, current_value: 10623 },
  { ticker: 'MSCI', name: 'MSCI World ETF', currency: 'EUR', shares: 0, buy_price: 0, current_price: 0, invested: 20000, current_value: 20000 },
  { ticker: 'DMX.V', name: 'District Metals', currency: 'CAD', shares: 0, buy_price: 0, current_price: 0, invested: 8770, current_value: 8770 },
  { ticker: 'CNO.V', name: 'California Nanotechnologies', currency: 'CAD', shares: 0, buy_price: 0, current_price: 0, invested: 5418, current_value: 5418 },
  { ticker: 'YGR.TO', name: 'Yangarra Resources', currency: 'CAD', shares: 0, buy_price: 0, current_price: 0, invested: 4002, current_value: 4002 },
  { ticker: 'NA9', name: 'Nagarro', currency: 'EUR', shares: 0, buy_price: 0, current_price: 0, invested: 4834, current_value: 4834 },
  { ticker: 'BABA', name: 'Alibaba', currency: 'USD', shares: 0, buy_price: 0, current_price: 0, invested: 3500, current_value: 3500 },
  { ticker: 'MODD', name: 'Modular Medical', currency: 'USD', shares: 0, buy_price: 0, current_price: 0, invested: 1736, current_value: 1736 },
  { ticker: 'REG.V', name: 'Regulus Resources', currency: 'CAD', shares: 0, buy_price: 0, current_price: 0, invested: 1322, current_value: 1322 },
  { ticker: 'JD', name: 'JD.com', currency: 'USD', shares: 0, buy_price: 0, current_price: 0, invested: 500, current_value: 500 },
]

const fmt = n => n != null ? Number(n).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '—'
const fmtD = n => n != null ? Number(n).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'

export default function Portfolio() {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ticker: '', name: '', currency: 'EUR', shares: '', buy_price: '', current_price: '', invested: '', current_value: '' })

  useEffect(() => { fetchPortfolio() }, [])

  const fetchPortfolio = async () => {
    setLoading(true)
    const { data } = await supabase.from('portfolio').select('*').order('invested', { ascending: false })
    if (data) setPositions(data)
    setLoading(false)
  }

  const seedPortfolio = async () => {
    setSeeding(true)
    await supabase.from('portfolio').insert(SEED_PORTFOLIO)
    await fetchPortfolio()
    setSeeding(false)
  }

  const save = async () => {
    if (!form.ticker.trim()) return
    const entry = { ...form, shares: Number(form.shares || 0), buy_price: Number(form.buy_price || 0), current_price: Number(form.current_price || 0), invested: Number(form.invested || 0), current_value: Number(form.current_value || 0) }
    if (editing) {
      await supabase.from('portfolio').update(entry).eq('id', editing)
    } else {
      await supabase.from('portfolio').insert(entry)
    }
    await fetchPortfolio()
    setModal(false)
  }

  const remove = async (id) => {
    await supabase.from('portfolio').delete().eq('id', id)
    setPositions(positions.filter(p => p.id !== id))
  }

  const filtered = positions.filter(p =>
    p.ticker.toLowerCase().includes(search.toLowerCase()) ||
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const tInv = positions.reduce((a, p) => a + Number(p.invested), 0)
  const tCur = positions.reduce((a, p) => a + Number(p.current_value), 0)
  const tPnl = tCur - tInv
  const tPct = tInv ? ((tPnl / tInv) * 100).toFixed(1) : 0

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Portfolio</div>
          <div className="section-sub">Renta variable · {positions.length} posiciones</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {positions.length === 0 && !loading && (
            <button className="btn-add" onClick={seedPortfolio} disabled={seeding}>
              {seeding ? 'Cargando...' : '⬆ Importar posiciones'}
            </button>
          )}
          <button className="btn-add" onClick={() => { setEditing(null); setForm({ ticker: '', name: '', currency: 'EUR', shares: '', buy_price: '', current_price: '', invested: '', current_value: '' }); setModal(true) }}>+ Añadir</button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card"><div className="stat-label">Invertido</div><div className="stat-value">{fmt(tInv)} €</div></div>
        <div className="stat-card"><div className="stat-label">Valor actual</div><div className="stat-value">{fmt(tCur)} €</div></div>
        <div className="stat-card"><div className="stat-label">P&L latente</div><div className="stat-value" style={{ color: tPnl >= 0 ? 'var(--green)' : 'var(--red)' }}>{tPnl >= 0 ? '+' : ''}{fmt(tPnl)} €</div></div>
        <div className="stat-card"><div className="stat-label">Rentabilidad</div><div className="stat-value" style={{ color: tPnl >= 0 ? 'var(--green)' : 'var(--red)' }}>{tPnl >= 0 ? '+' : ''}{tPct}%</div></div>
      </div>

      <div className="filters">
        <input className="search-input" placeholder="Buscar ticker o empresa..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? <div className="loading">CARGANDO PORTFOLIO...</div> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Ticker</th><th>Empresa</th><th>FX</th><th>Acciones</th><th>P.Compra</th><th>P.Actual</th><th>Invertido €</th><th>Valor €</th><th>P&L</th><th>Peso</th><th></th></tr></thead>
            <tbody>
              {filtered.map(p => {
                const pnl = p.current_value - p.invested
                const pct = p.invested ? ((pnl / p.invested) * 100).toFixed(1) : 0
                const w = tCur ? ((p.current_value / tCur) * 100).toFixed(1) : 0
                return (
                  <tr key={p.id}>
                    <td className="mono" style={{ fontWeight: 600, color: 'var(--gold)' }}>{p.ticker}</td>
                    <td>{p.name}</td>
                    <td><span className="badge badge-blue">{p.currency}</span></td>
                    <td className="mono dim">{p.shares || '—'}</td>
                    <td className="mono dim">{p.buy_price ? fmtD(p.buy_price) : '—'}</td>
                    <td className="mono dim">{p.current_price ? fmtD(p.current_price) : '—'}</td>
                    <td className="gold">{fmt(p.invested)}</td>
                    <td className="gold">{fmt(p.current_value)}</td>
                    <td className={pnl >= 0 ? 'green' : 'red'}>{pnl >= 0 ? '+' : ''}{fmt(pnl)} ({pct}%)</td>
                    <td className="mono dim">{w}%</td>
                    <td>
                      <button className="btn-icon" onClick={() => { setEditing(p.id); setForm({ ...p, shares: String(p.shares || ''), buy_price: String(p.buy_price || ''), current_price: String(p.current_price || ''), invested: String(p.invested || ''), current_value: String(p.current_value || '') }); setModal(true) }}>✎</button>
                      <button className="btn-icon" onClick={() => remove(p.id)}>✕</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty">Sin posiciones · Importa tu portfolio o añade una</div>}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{editing ? 'Editar posición' : 'Nueva posición'}</div>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Ticker</label><input className="form-input" value={form.ticker} onChange={e => setForm({ ...form, ticker: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Moneda</label>
                <select className="form-select" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                  {['EUR', 'USD', 'GBP', 'CAD'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group full"><label className="form-label">Nombre empresa</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Acciones</label><input className="form-input" type="number" value={form.shares} onChange={e => setForm({ ...form, shares: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Precio compra</label><input className="form-input" type="number" step="0.01" value={form.buy_price} onChange={e => setForm({ ...form, buy_price: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Precio actual</label><input className="form-input" type="number" step="0.01" value={form.current_price} onChange={e => setForm({ ...form, current_price: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Invertido (€)</label><input className="form-input" type="number" value={form.invested} onChange={e => setForm({ ...form, invested: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Valor actual (€)</label><input className="form-input" type="number" value={form.current_value} onChange={e => setForm({ ...form, current_value: e.target.value })} /></div>
            </div>
            <div className="btn-row">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={save}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
