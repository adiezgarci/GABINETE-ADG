import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'

const SEED_COINS = [
  { character: "Alejandro Magno (póstumo)", mint_year: "310–301 a.C.", weight: 4.08, buy_price: 75, market_value: 75, buy_date: "2024", buy_place: "Numismática Mayor 25", obverse: "Heracles con piel de león nemeo", reverse: "Zeus entronizado con águila", conservation: null, description: "Dracma de plata acuñada de forma póstuma en nombre de Alejandro III de Macedonia, el Grande (356–323 a.C.), el conquistador más célebre de la Antigüedad. Alejandro nunca se representó a sí mismo en vida en sus monedas, sino que usó la imagen de Heracles, héroe con el que se identificaba. El reverso muestra a Zeus Olímpico sentado en su trono. Esta pieza fue acuñada durante las Guerras de los Diádocos, el turbulento período en que los generales de Alejandro se disputaron su vasto imperio." },
  { character: "Domiciano (bajo Vespasiano)", mint_year: "77–78 d.C.", weight: null, buy_price: 90, market_value: 90, buy_date: "24/05/2026", buy_place: "Plaza Mayor, Madrid (Numismadrid)", obverse: "Retrato laureado de Domiciano con leyenda imperial", reverse: "Loba con inscripción COS V (quinto consulado)", conservation: null, description: "Denario de plata acuñado en nombre de Domiciano durante el reinado de su padre Vespasiano. La inscripción COS V confirma el quinto consulado de Domiciano, datando la pieza en el año 77-78 d.C. Domiciano acabaría siendo condenado a la damnatio memoriae tras su asesinato." },
  { character: "Nerva", mint_year: "96–98 d.C.", weight: 2.4, buy_price: 150, market_value: 150, buy_date: "Marzo 2026", buy_place: "Mercado de Cabildo, Sevilla", obverse: "Retrato laureado de Nerva con leyenda imperial", reverse: "Concordia sedente con cornucopia", conservation: null, description: "Denario de plata de Marco Coceyo Nerva, primer emperador de la dinastía Antonina. Reinado de apenas dieciséis meses. Su mayor legado fue la adopción de Trajano como sucesor, inaugurando el sistema de los emperadores adoptivos. Murió de forma natural en enero del 98 d.C." },
  { character: "Trajano", mint_year: "98–99 d.C.", weight: 3.19, buy_price: 85, market_value: 85, buy_date: "05/03/2021", buy_place: "Numismática Ogando, León", obverse: "Retrato laureado de Trajano, leyenda IMP NERVA TRAIAN AVG", reverse: "Figura triunfal en actitud de avance (Victoria o Marte)", conservation: "MBC+", description: "Denario de plata de Trajano, a quien el Senado otorgó el título de Optimus Princeps. Natural de Itálica (Hispania), fue el primer emperador nacido fuera de Italia. Bajo su mando Roma alcanzó su máxima extensión territorial conquistando Dacia y llegando hasta Mesopotamia." },
  { character: "Adriano", mint_year: "119–122 d.C.", weight: null, buy_price: 75, market_value: 75, buy_date: "Mayo 2023", buy_place: "Numismática Mayor 25", obverse: "Retrato laureado de Adriano, leyenda IMP CAES TRAIAN HADRIANVS AVG", reverse: "Figura femenina de pie (Aequitas o Salus)", conservation: null, description: "Denario de plata de Adriano, uno de los emperadores más cultos y viajeros de Roma. Mandó construir la célebre Muralla de Adriano en Britania. Esta pieza está recortada en los bordes. Curiosidad: el propietario comparte nombre con el emperador." },
  { character: "Antonino Pío", mint_year: "140–143 d.C.", weight: null, buy_price: 180, market_value: 180, buy_date: "22/10/2022", buy_place: "Numismática Mayor 25", obverse: "Retrato laureado y con barba de Antonino Pío, busto excepcional", reverse: "Figura femenina de pie (Pietas o Vesta) con pátera y cetro", conservation: "MBC+ / EBC-", description: "Denario de plata de Antonino Pío, uno de los gobernantes más pacíficos de Roma. Su reinado de casi veintitrés años fue un período de extraordinaria estabilidad. Fue maestro y padre adoptivo de Marco Aurelio. El retrato de este denario es de una calidad artística excepcional." },
  { character: "Marco Aurelio", mint_year: "161 d.C.", weight: 2.98, buy_price: 85, market_value: 85, buy_date: "05/03/2021", buy_place: "Numismática Ogando, León", obverse: "Retrato laureado y barbado de Marco Aurelio", reverse: "Figura femenina de pie (Providencia o Equidad)", conservation: "MBC+", description: "Denario de plata de Marco Aurelio, el último de los cinco buenos emperadores. Filósofo estoico, sus Meditaciones siguen siendo uno de los textos más leídos de la filosofía occidental. Murió en campaña en Vindobona (la actual Viena) en el 180 d.C." },
  { character: "Septimio Severo", mint_year: "209–210 d.C.", weight: 2.91, buy_price: 70, market_value: 70, buy_date: "03/03/2026", buy_place: "Numismática Pecium", obverse: "Retrato laureado de Septimio Severo, leyenda SEVERVS PIVS AVG", reverse: "Figura sedente (Providentia o Fortuna)", conservation: "MBC", description: "Denario de plata de Septimio Severo, fundador de la dinastía Severa y primer emperador africano. Murió en febrero del 211 d.C. en Eboracum (la actual York, Britania) mientras dirigía una campaña contra los caledonios." },
  { character: "Caracalla", mint_year: "211–217 d.C.", weight: 3.15, buy_price: 90, market_value: 90, buy_date: "2025", buy_place: "Numismática Mayor 25", obverse: "Retrato radiado con coraza militar de Caracalla", reverse: "Figura femenina de pie (Virtus o Venus Victrix)", conservation: "MBC", description: "Denario de plata de Caracalla. Asesinó a su hermano Geta en brazos de su madre. Promulgó la Constitutio Antoniniana del 212 d.C. concediendo ciudadanía romana a todos los hombres libres del Imperio. Fue asesinado en el 217 d.C. mientras orinaba al borde del camino." },
  { character: "Geta", mint_year: "196–198 d.C.", weight: 3.29, buy_price: 90, market_value: 90, buy_date: "19/01/2026", buy_place: "Numismática Mayor 25", obverse: "Retrato juvenil laureado de Geta", reverse: "Figura de pie (Minerva o Virtus) con lanza y escudo", conservation: "MBC", description: "Denario de plata de Geta, asesinado por su hermano Caracalla en brazos de su madre. Tenía veintidós años. Caracalla decretó su damnatio memoriae. Esta moneda sobrevivió a esa purga." },
  { character: "Heliogábalo", mint_year: "218–222 d.C.", weight: 2.81, buy_price: 75, market_value: 75, buy_date: "03/03/2026", buy_place: "Numismática Pecium", obverse: "Retrato juvenil laureado de Heliogábalo con coraza", reverse: "Figura militar de pie con lanza y trofeo", conservation: "MBC", description: "Denario de plata de Heliogábalo, el emperador más escandaloso de Roma. Proclamado a los catorce años, fue asesinado a los dieciocho y su cadáver arrojado al Tíber." },
  { character: "Alejandro Severo", mint_year: "223 d.C.", weight: 3.2, buy_price: 70, market_value: 70, buy_date: "13/03/2026", buy_place: "Catawiki (subasta online)", obverse: "Retrato juvenil laureado de Alejandro Severo", reverse: "Figura femenina de pie (Pax o Spes)", conservation: "MBC", description: "Denario de plata de Alejandro Severo, último emperador de la dinastía Severa. Gobernante moderado y culto, fue asesinado por sus soldados en el 235 d.C. Su muerte abrió la Crisis del Siglo III." },
]

const fmtD = n => n != null ? Number(n).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'

export default function Coins() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const emptyForm = { character: '', mint_year: '', weight: '', buy_price: '', market_value: '', buy_date: '', buy_place: '', obverse: '', reverse: '', conservation: '', description: '' }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { fetchCoins() }, [])

  const fetchCoins = async () => {
    setLoading(true)
    const { data } = await supabase.from('coins').select('*').order('id')
    if (data) { setCoins(data); if (data.length > 0 && !selected) setSelected(data[0]) }
    setLoading(false)
  }

  const seedCoins = async () => {
    setSeeding(true)
    await supabase.from('coins').insert(SEED_COINS)
    await fetchCoins()
    setSeeding(false)
  }

  const save = async () => {
    if (!form.character.trim()) return
    const entry = { ...form, weight: form.weight ? Number(form.weight) : null, buy_price: Number(form.buy_price), market_value: Number(form.market_value) }
    if (editing) {
      await supabase.from('coins').update(entry).eq('id', editing)
    } else {
      await supabase.from('coins').insert(entry)
    }
    await fetchCoins()
    setModal(false)
  }

  const remove = async (id) => {
    await supabase.from('coins').delete().eq('id', id)
    setCoins(coins.filter(c => c.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const tBuy = coins.reduce((a, c) => a + Number(c.buy_price), 0)
  const tMkt = coins.reduce((a, c) => a + Number(c.market_value), 0)
  const tPnl = tMkt - tBuy

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Colección de Monedas</div>
          <div className="section-sub">Numismática antigua · {coins.length} {coins.length === 1 ? 'pieza' : 'piezas'}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {coins.length === 0 && !loading && (
            <button className="btn-add" onClick={seedCoins} disabled={seeding}>
              {seeding ? 'Cargando...' : '⬆ Importar 12 monedas'}
            </button>
          )}
          <button className="btn-add" onClick={() => { setEditing(null); setForm(emptyForm); setModal(true) }}>+ Añadir moneda</button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card"><div className="stat-label">Piezas</div><div className="stat-value">{coins.length}</div></div>
        <div className="stat-card"><div className="stat-label">Invertido</div><div className="stat-value">{fmtD(tBuy)} €</div></div>
        <div className="stat-card"><div className="stat-label">Valor actual</div><div className="stat-value">{fmtD(tMkt)} €</div></div>
        <div className="stat-card"><div className="stat-label">P&L latente</div><div className="stat-value" style={{ color: tPnl >= 0 ? 'var(--green)' : 'var(--red)' }}>{tPnl >= 0 ? '+' : ''}{fmtD(tPnl)} €</div></div>
      </div>

      {selected && (
        <div className="detail-panel">
          <div>
            <div className="detail-title">{selected.character}</div>
            <div className="detail-period">🪙 {selected.mint_year} · {selected.weight ? selected.weight + 'g' : 'peso p/d'} · {selected.buy_place}</div>
            {(selected.obverse_url || selected.reverse_url) && (
              <div style={{ display: 'flex', gap: 16, margin: '14px 0' }}>
                {selected.obverse_url && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Anverso</div>
                    <img src={selected.obverse_url} alt="anverso" style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--gold-dim)' }} />
                  </div>
                )}
                {selected.reverse_url && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Reverso</div>
                    <img src={selected.reverse_url} alt="reverso" style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--gold-dim)' }} />
                  </div>
                )}
              </div>
            )}
            <div style={{ marginBottom: 10, fontSize: 12 }}>
              <span style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono',monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}>Anv: </span>
              <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>{selected.obverse}</span><br />
              <span style={{ color: 'var(--text-muted)', fontFamily: "'DM Mono',monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}>Rev: </span>
              <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>{selected.reverse}</span>
            </div>
            <div className="detail-description">{selected.description}</div>
          </div>
          <div className="detail-right">
            <div className="detail-row"><span className="detail-key">Período</span><span className="detail-val">{selected.mint_year}</span></div>
            <div className="detail-row"><span className="detail-key">Peso</span><span className="detail-val">{selected.weight ? selected.weight + ' g' : 'Por determinar'}</span></div>
            {selected.conservation && <div className="detail-row"><span className="detail-key">Conservación</span><span className="detail-val">{selected.conservation}</span></div>}
            <div className="detail-row"><span className="detail-key">Adquisición</span><span className="detail-val">{selected.buy_date}</span></div>
            <div className="detail-row"><span className="detail-key">Lugar</span><span className="detail-val">{selected.buy_place}</span></div>
            <div className="detail-row"><span className="detail-key">Precio compra</span><span className="detail-val gold">{fmtD(selected.buy_price)} €</span></div>
            <div className="detail-row"><span className="detail-key">Valor mercado</span><span className="detail-val gold">{fmtD(selected.market_value)} €</span></div>
            <div className="detail-row">
              <span className="detail-key">P&L</span>
              <span className={`detail-val ${selected.market_value - selected.buy_price >= 0 ? 'green' : 'red'}`}>
                {selected.market_value - selected.buy_price >= 0 ? '+' : ''}{fmtD(selected.market_value - selected.buy_price)} €
              </span>
            </div>
            <div className="detail-close" onClick={() => setSelected(null)}>✕ cerrar ficha</div>
          </div>
        </div>
      )}

      {loading ? <div className="loading">CARGANDO COLECCIÓN...</div> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Personaje / Emisor</th><th>Período</th><th>Peso</th><th>Adquisición</th><th>Precio</th><th>Valor</th><th>P&L</th><th></th></tr></thead>
            <tbody>
              {coins.map((c, i) => {
                const pnl = c.market_value - c.buy_price
                const pct = c.buy_price ? ((pnl / c.buy_price) * 100).toFixed(1) : 0
                return (
                  <tr key={c.id} onClick={() => setSelected(c)} style={{ cursor: 'pointer', background: selected?.id === c.id ? 'rgba(200,169,110,.06)' : '' }}>
                    <td className="mono dim">{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{c.character}</td>
                    <td className="mono dim">{c.mint_year}</td>
                    <td className="mono">{c.weight ? c.weight + ' g' : '—'}</td>
                    <td className="mono dim">{c.buy_date}</td>
                    <td className="gold">{fmtD(c.buy_price)} €</td>
                    <td className="gold">{fmtD(c.market_value)} €</td>
                    <td className={pnl >= 0 ? 'green' : 'red'}>{pnl >= 0 ? '+' : ''}{fmtD(pnl)} ({pct}%)</td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="btn-icon" onClick={() => { setEditing(c.id); setForm({ ...c, weight: c.weight ?? '', buy_price: String(c.buy_price), market_value: String(c.market_value), conservation: c.conservation ?? '' }); setModal(true) }}>✎</button>
                      <button className="btn-icon" onClick={() => remove(c.id)}>✕</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {coins.length === 0 && <div className="empty">Colección vacía · Importa tus monedas o añade una nueva</div>}
        </div>
      )}
      <div style={{ marginTop: 10, fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'var(--text-muted)', letterSpacing: '.05em' }}>↑ Haz clic en una fila para ver la ficha completa</div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{editing ? 'Editar moneda' : 'Añadir moneda'}</div>
            <div className="form-grid">
              <div className="form-group full"><label className="form-label">Personaje / Emisor</label><input className="form-input" value={form.character} onChange={e => setForm({ ...form, character: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Año acuñación</label><input className="form-input" value={form.mint_year} onChange={e => setForm({ ...form, mint_year: e.target.value })} placeholder="Ej: 98–99 d.C." /></div>
              <div className="form-group"><label className="form-label">Peso (g)</label><input className="form-input" type="number" step="0.01" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Precio compra (€)</label><input className="form-input" type="number" step="0.01" value={form.buy_price} onChange={e => setForm({ ...form, buy_price: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Valor mercado (€)</label><input className="form-input" type="number" step="0.01" value={form.market_value} onChange={e => setForm({ ...form, market_value: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Fecha adquisición</label><input className="form-input" value={form.buy_date} onChange={e => setForm({ ...form, buy_date: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Lugar de compra</label><input className="form-input" value={form.buy_place} onChange={e => setForm({ ...form, buy_place: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Conservación</label><input className="form-input" value={form.conservation} onChange={e => setForm({ ...form, conservation: e.target.value })} placeholder="Ej: MBC+" /></div>
              <div className="form-group full"><label className="form-label">Anverso</label><input className="form-input" value={form.obverse} onChange={e => setForm({ ...form, obverse: e.target.value })} /></div>
              <div className="form-group full"><label className="form-label">Reverso</label><input className="form-input" value={form.reverse} onChange={e => setForm({ ...form, reverse: e.target.value })} /></div>
              <div className="form-group full"><label className="form-label">Descripción histórica</label><textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={5} /></div>
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
