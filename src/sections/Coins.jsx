import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'

const SEED_COINS = [
  { character: "Alejandro Magno (póstumo)", mint_year: "310–301 a.C.", weight: 4.08, buy_price: 75, market_value: 75, buy_date: "2024", buy_place: "Numismática Mayor 25", obverse: "Heracles con piel de león nemeo", reverse: "Zeus entronizado con águila", conservation: null, description: "Dracma de plata acuñada de forma póstuma en nombre de Alejandro III de Macedonia, el Grande (356–323 a.C.), el conquistador más célebre de la Antigüedad. Alejandro nunca se representó a sí mismo en vida en sus monedas —por respeto a la tradición griega que reservaba ese honor a los dioses—, sino que usó la imagen de Heracles, héroe con el que se identificaba y del que reclamaba descendencia a través del linaje argéada. El reverso muestra a Zeus Olímpico sentado en su trono, sosteniendo un águila y un cetro, símbolo de poder universal. Tras la muerte de Alejandro en Babilonia (323 a.C.), sus sucesores —los diádocos— continuaron acuñando con estos tipos durante décadas, pues la moneda alejandrina era la divisa más reconocida y confiable del mundo helenístico. Esta pieza fue acuñada durante las Guerras de los Diádocos, el turbulento período en que los generales de Alejandro se disputaron su vasto imperio a sangre y fuego." },
  { character: "Domiciano (bajo Vespasiano)", mint_year: "77–78 d.C.", weight: null, buy_price: 90, market_value: 90, buy_date: "24/05/2026", buy_place: "Plaza Mayor, Madrid (Numismadrid)", obverse: "Retrato laureado de Domiciano con leyenda imperial", reverse: "Loba con inscripción COS V (quinto consulado)", conservation: null, description: "Denario de plata acuñado en nombre de Tito Flavio Domiciano (51–96 d.C.) durante el reinado de su padre, el emperador Vespasiano (69–79 d.C.), fundador de la dinastía Flavia. En el momento de esta acuñación Domiciano era César —heredero designado— pero aún no augusto, pues su hermano mayor Tito era el sucesor oficial. La inscripción COS V del reverso confirma el quinto consulado de Domiciano, datando la pieza con precisión en el año 77-78 d.C. El reverso muestra una loba, símbolo fundacional de Roma que remite al mito de Rómulo y Remo, evocando la legitimidad y la continuidad dinástica flavia. Vespasiano había llegado al poder tras el caótico Año de los Cuatro Emperadores (69 d.C.) y necesitaba proyectar estabilidad: acuñar con la imagen de su hijo era un mensaje político claro. Domiciano acabaría reinando entre el 81 y el 96 d.C., siendo uno de los emperadores más controvertidos de Roma —brillante administrador y constructor, pero temido por el Senado, que lo condenó a la damnatio memoriae tras su asesinato." },
  { character: "Nerva", mint_year: "96–98 d.C.", weight: 2.4, buy_price: 150, market_value: 150, buy_date: "Marzo 2026", buy_place: "Mercado de Cabildo, Sevilla", obverse: "Retrato laureado de Nerva con leyenda imperial", reverse: "Concordia sedente con cornucopia", conservation: null, description: "Denario de plata de Marco Coceyo Nerva (30–98 d.C.), el primer emperador de la dinastía Antonina y uno de los reinados más breves de la historia imperial romana: apenas dieciséis meses. Nerva llegó al poder tras el asesinato de Domiciano en el 96 d.C., elegido por el Senado —del que era miembro veterano— precisamente por su avanzada edad y carácter conciliador. Su misión era borrar el trauma del terror domicianeo y restituir la dignidad senatorial. La Concordia del reverso no era un símbolo vacío: era el programa político de su reinado. Nerva anuló las condenas de los exiliados, prohibió los procesos por traición y devolvió bienes confiscados. Su mayor legado fue la adopción de Trajano como sucesor en el 97 d.C., inaugurando el sistema de los emperadores adoptivos que llevaría a Roma a su cenit bajo los Antoninos. Murió de forma natural en enero del 98 d.C., siendo uno de los poquísimos emperadores romanos en hacerlo. El peso reducido de esta pieza (2,4 g frente al estándar de ~3,4 g) refleja la progresiva devaluación del denario iniciada en el siglo I d.C." },
  { character: "Trajano", mint_year: "98–99 d.C.", weight: 3.19, buy_price: 85, market_value: 85, buy_date: "05/03/2021", buy_place: "Numismática Ogando, León", obverse: "Retrato laureado de Trajano, leyenda IMP NERVA TRAIAN AVG", reverse: "Figura triunfal en actitud de avance (Victoria o Marte)", conservation: "MBC+", description: "Denario de plata de Marco Ulpio Trajano (53–117 d.C.), uno de los emperadores más queridos y exitosos de Roma, a quien el Senado otorgó el título de Optimus Princeps — el Mejor de los Príncipes. Esta pieza pertenece a sus primeras acuñaciones como emperador: la leyenda IMP NERVA TRAIAN refleja aún su adopción reciente por Nerva, legitimidad dinástica que Trajano exhibía con orgullo. Natural de Itálica (Hispania, la actual Sevilla), fue el primer emperador nacido fuera de Italia, abriendo la puerta a la provincialización del poder imperial. Bajo su mando Roma alcanzó su máxima extensión territorial: conquistó Dacia (actual Rumanía) en dos campañas épicas y llegó hasta Mesopotamia en Oriente. La columna de Trajano en Roma, aún en pie, narra en espiral esas campañas dacias con un detalle asombroso. Fue también un extraordinario administrador: construyó el Foro de Trajano, el mercado de Trajano y reformó el sistema de alimentación pública. Murió en campaña en Selino (Cilicia) en el 117 d.C. La conservación MBC+ de esta pieza es excepcional para una moneda del siglo I-II d.C." },
  { character: "Adriano", mint_year: "119–122 d.C.", weight: null, buy_price: 75, market_value: 75, buy_date: "Mayo 2023", buy_place: "Numismática Mayor 25", obverse: "Retrato laureado de Adriano, leyenda IMP CAES TRAIAN HADRIANVS AVG", reverse: "Figura femenina de pie (Aequitas o Salus) con atributos imperiales", conservation: null, description: "Denario de plata de Publio Elio Adriano (76–138 d.C.), uno de los emperadores más cultos, viajeros y fascinantes de toda la historia romana. Hispano de origen como Trajano —también nacido en Itálica—, Adriano representó un giro radical en la política imperial: abandonó las conquistas de su antecesor y apostó por consolidar y humanizar el Imperio en lugar de expandirlo. Su reinado es famoso por sus constantes viajes: recorrió casi todas las provincias del Imperio en persona, algo sin precedentes. En Britania mandó construir la célebre muralla que lleva su nombre (Hadrian's Wall). Esta pieza está recortada en los bordes, práctica habitual en la Antigüedad: los particulares limaban las orillas de las monedas para acumular polvo de plata. Curiosidad inevitable: el propietario de esta moneda comparte nombre con el emperador que la acuñó." },
  { character: "Antonino Pío", mint_year: "140–143 d.C.", weight: null, buy_price: 180, market_value: 180, buy_date: "22/10/2022", buy_place: "Numismática Mayor 25", obverse: "Retrato laureado y con barba de Antonino Pío, busto excepcional", reverse: "Figura femenina de pie (Pietas o Vesta) con pátera y cetro, leyenda TR POT COS", conservation: "MBC+ / EBC-", description: "Denario de plata de Tito Aurelio Antonino Pío (86–161 d.C.), el cuarto de los llamados «cinco buenos emperadores» y uno de los gobernantes más queridos y pacíficos de Roma. Su reinado de casi veintitrés años fue un período de extraordinaria estabilidad: no hubo guerras de conquista, no hubo terror político, no hubo inflación desbocada. Antonino adoptó el sobrenombre Pius —Piadoso— por haber persuadido al Senado de divinizar a Adriano tras su muerte. Fue maestro y padre adoptivo de Marco Aurelio, a quien preparó concienzudamente para sucederle. El retrato de este denario es de una calidad artística excepcional, con el busto barbado característico de los Antoninos, y justifica su posición como pieza destacada de la colección." },
  { character: "Marco Aurelio", mint_year: "161 d.C.", weight: 2.98, buy_price: 85, market_value: 85, buy_date: "05/03/2021", buy_place: "Numismática Ogando, León", obverse: "Retrato laureado y barbado de Marco Aurelio, rizo denso característico", reverse: "Figura femenina de pie (Providencia o Equidad) con atributos imperiales, leyenda TR P COS", conservation: "MBC+", description: "Denario de plata de Marco Aurelio Antonino (121–180 d.C.), el último de los cinco buenos emperadores y quizás el más admirado de todos los gobernantes romanos por la posteridad. Filósofo estoico de formación, sus Meditaciones —escritas en griego durante las campañas militares, nunca pensadas para ser publicadas— siguen siendo uno de los textos más leídos de la filosofía occidental casi dos milenios después. El año 161 d.C., fecha de esta acuñación, fue precisamente el de su acceso al trono. Marco Aurelio murió en campaña en Vindobona (la actual Viena) en el 180 d.C., y cometió el que muchos historiadores consideran su único error grave: dejar el Imperio a su hijo biológico Cómodo, rompiendo la tradición adoptiva que había dado a Roma su mejor siglo." },
  { character: "Septimio Severo", mint_year: "209–210 d.C.", weight: 2.91, buy_price: 70, market_value: 70, buy_date: "03/03/2026", buy_place: "Numismática Pecium", obverse: "Retrato laureado y barbado de Septimio Severo, leyenda SEVERVS PIVS AVG", reverse: "Figura sedente (Providentia o Fortuna) con atributos, leyenda TR P... COS PP", conservation: "MBC", description: "Denario de plata de Lucio Septimio Severo (145–211 d.C.), fundador de la dinastía Severa y uno de los emperadores más enérgicos y militarizados de Roma. Natural de Leptis Magna (actual Libia), fue el primer emperador africano de la historia. Su reinado marcó un giro decisivo: militarizó abiertamente el poder y debilitó estructuralmente al Senado. Su último consejo a sus hijos fue: 'Enriqueced a los soldados e ignorad al resto.' Esta pieza data de los últimos meses de su vida: murió en febrero del 211 d.C. en Eboracum (la actual York, Britania), mientras dirigía una campaña contra los caledonios." },
  { character: "Caracalla", mint_year: "211–217 d.C.", weight: 3.15, buy_price: 90, market_value: 90, buy_date: "2025", buy_place: "Numismática Mayor 25", obverse: "Retrato radiado con coraza militar de Caracalla, leyenda ANTONINVS PIVS AVG", reverse: "Figura femenina de pie (Virtus o Venus Victrix) con atributos militares", conservation: "MBC", description: "Denario de plata de Marco Aurelio Severo Antonino, conocido como Caracalla (188–217 d.C.). Asesinó a su hermano Geta en brazos de su propia madre. A pesar de su crueldad, tomó una de las decisiones más trascendentales de la historia romana: la Constitutio Antoniniana del 212 d.C., por la que concedió la ciudadanía romana a todos los hombres libres del Imperio. Su otro gran legado son las monumentales Termas de Caracalla en Roma. Fue asesinado en el 217 d.C. por un soldado mientras orinaba al borde del camino durante una campaña en Oriente." },
  { character: "Geta", mint_year: "196–198 d.C.", weight: 3.29, buy_price: 90, market_value: 90, buy_date: "19/01/2026", buy_place: "Numismática Mayor 25", obverse: "Retrato juvenil laureado de Geta, leyenda P SEPTIMIVS GETA CAES", reverse: "Figura de pie (Minerva o Virtus) con lanza y escudo", conservation: "MBC", description: "Denario de plata de Publio Septimio Geta (189–211 d.C.), hijo menor de Septimio Severo y hermano de Caracalla. Geta compartió el trono con su hermano durante apenas unos meses, hasta que Caracalla lo atrajo a una reunión de reconciliación en los aposentos de su madre Julia Domna y lo asesinó allí mismo, en sus brazos. Tenía veintidós años. Caracalla decretó su damnatio memoriae: el nombre de Geta fue borrado de todas las inscripciones y sus monedas retiradas de circulación. Esta pieza sobrevivió a esa purga." },
  { character: "Heliogábalo", mint_year: "218–222 d.C.", weight: 2.81, buy_price: 75, market_value: 75, buy_date: "03/03/2026", buy_place: "Numismática Pecium", obverse: "Retrato juvenil laureado de Heliogábalo con coraza, leyenda IMP ANTONINVS PIVS AVG", reverse: "Figura militar de pie con lanza y trofeo (Marte Ultor o Virtus Militum)", conservation: "MBC", description: "Denario de plata de Vario Avito Basiano, conocido como Heliogábalo (203–222 d.C.), el emperador más escandaloso de toda la historia romana. Sacerdote del dios solar sirio El-Gabal, fue proclamado emperador a los catorce años. Introdujo el culto a su dios solar como religión oficial por encima de Júpiter y transgredió todas las normas de su época. Fue asesinado junto a su madre por la Guardia Pretoriana en el 222 d.C. Su cadáver fue arrastrado por las calles de Roma y arrojado al Tíber. 14 años al llegar al poder, 18 al morir." },
  { character: "Alejandro Severo", mint_year: "223 d.C.", weight: 3.2, buy_price: 70, market_value: 70, buy_date: "13/03/2026", buy_place: "Catawiki (subasta online, incluye fees y envío)", obverse: "Retrato juvenil laureado con coraza de Alejandro Severo, leyenda IMP C M AVR SEV ALEXAND AVG", reverse: "Figura femenina de pie (Pax o Spes) con atributos de paz", conservation: "MBC", description: "Denario de plata de Marco Aurelio Severo Alejandro (208–235 d.C.), último emperador de la dinastía Severa. Representó el polo opuesto a Heliogábalo: moderado, culto y respetuoso con el Senado. Su política de negociación con los enemigos exteriores fue considerada cobardía por sus soldados, quienes lo asesinaron junto a su madre en el 235 d.C. Su muerte abrió el llamado período de la Crisis del Siglo III, cincuenta años de anarquía militar. Esta moneda cierra en la colección la secuencia completa de la dinastía Severa: cinco emperadores en plata." },
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
