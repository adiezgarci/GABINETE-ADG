import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'

const SEED_BOOKS = [
  {title:"El infinito en un junco",author:"Irene Vallejo",genre:"Ensayo",year:2023,rating:8.0},
  {title:"La piel del tambor",author:"Arturo Pérez-Reverte",genre:"Novela",year:2023,rating:7.0},
  {title:"Rebelión en la granja",author:"George Orwell",genre:"Distopía",year:2023,rating:8.2},
  {title:"Los peligros de la moralidad",author:"Pablo Malo",genre:"Filosofía",year:2023,rating:7.0},
  {title:"La bibliotecaria de Auschwitz",author:"Dita Kraus",genre:"Biografía",year:2023,rating:5.0},
  {title:"Crónica de una muerte anunciada",author:"Gabriel García Márquez",genre:"Novela",year:2023,rating:7.2},
  {title:"Factfulness",author:"Hans Rosling",genre:"Ensayo",year:2023,rating:8.0},
  {title:"El pintor de batallas",author:"Arturo Pérez-Reverte",genre:"Novela",year:2023,rating:8.0},
  {title:"El mundo de ayer",author:"Stefan Zweig",genre:"Biografía",year:2023,rating:9.5},
  {title:"Mensajes de un mundo olvidado",author:"Stefan Zweig",genre:"Artículos",year:2023,rating:7.5},
  {title:"¿Por qué dormimos?",author:"Matthew Walker",genre:"Salud",year:2023,rating:8.5},
  {title:"Seis piezas fáciles",author:"Richard P. Feynman",genre:"Ciencia",year:2023,rating:6.0},
  {title:"El camino",author:"Miguel Delibes",genre:"Clásico",year:2023,rating:8.0},
  {title:"How to Live",author:"Derek Sivers",genre:"Filosofía",year:2023,rating:7.5},
  {title:"Cuatro mil semanas",author:"Oliver Burkeman",genre:"Filosofía",year:2023,rating:8.0},
  {title:"El extranjero",author:"Albert Camus",genre:"Clásico",year:2023,rating:7.5},
  {title:"La conjura de los necios",author:"John Kennedy Toole",genre:"Clásico",year:2023,rating:6.0},
  {title:"Pensar en sistemas",author:"Donella Meadows",genre:"Ensayo",year:2023,rating:8.5},
  {title:"Revolución",author:"Arturo Pérez-Reverte",genre:"Novela",year:2023,rating:8.75},
  {title:"Los girasoles ciegos",author:"Alberto Méndez",genre:"Novela",year:2023,rating:8.0},
  {title:"The Outsiders",author:"William Thorndike",genre:"Inversión",year:2023,rating:8.0},
  {title:"El derecho a disentir",author:"Mauricio Wiesenthal",genre:"Memorias",year:2023,rating:7.0},
  {title:"Nido de Piratas",author:"Jesús Fernández Úbeda",genre:"Periodismo",year:2023,rating:5.6},
  {title:"Prohibido Nacer",author:"Trevor Noah",genre:"Biografía",year:2023,rating:8.0},
  {title:"Magallanes",author:"Stefan Zweig",genre:"Biografía",year:2023,rating:9.0},
  {title:"Situación límite",author:"Joseph Conrad",genre:"Novela",year:2023,rating:5.8},
  {title:"Doing Good Better",author:"William Macaskill",genre:"Ensayo",year:2023,rating:8.5},
  {title:"Behavioural Economics",author:"David Orden",genre:"Psicología",year:2023,rating:6.3},
  {title:"Tu dinero y tu cerebro",author:"Jason Zweig",genre:"Inversión",year:2023,rating:8.0},
  {title:"El problema final",author:"Arturo Pérez-Reverte",genre:"Novela policiaca",year:2023,rating:8.0},
  {title:"Africanus",author:"Santiago Posteguillo",genre:"Novela histórica",year:2023,rating:8.5},
  {title:"Ruido",author:"Daniel Kahneman",genre:"Psicología",year:2023,rating:6.0},
  {title:"Invicto",author:"Marcos Vázquez",genre:"Estoicismo",year:2023,rating:8.0},
  {title:"Hijos de la adversidad",author:"Antonio Valenzuela",genre:"Salud",year:2023,rating:9.0},
  {title:"Fouché",author:"Stefan Zweig",genre:"Biografía",year:2023,rating:9.0},
  {title:"Pensar rápido, pensar despacio",author:"Daniel Kahneman",genre:"Psicología",year:2023,rating:9.3},
  {title:"La psicología del dinero",author:"Morgan Housel",genre:"Inversión",year:2023,rating:8.0},
  {title:"Las legiones malditas",author:"Santiago Posteguillo",genre:"Novela histórica",year:2023,rating:8.5},
  {title:"Cómo ganar amigos e influir sobre las personas",author:"Dale Carnegie",genre:"Psicología",year:2023,rating:9.5},
  {title:"Los ingratos",author:"Pedro Simón",genre:"Novela",year:2023,rating:9.0},
  {title:"A propósito de nada",author:"Woody Allen",genre:"Autobiografía",year:2023,rating:8.0},
  {title:"Aventuras de Sherlock Holmes",author:"Arthur Conan Doyle",genre:"Novela policiaca",year:2024,rating:7.0},
  {title:"O apelo da Tribu",author:"Mario Vargas Llosa",genre:"Política",year:2024,rating:7.0},
  {title:"La Traición de Roma",author:"Santiago Posteguillo",genre:"Novela histórica",year:2024,rating:8.2},
  {title:"El Almanaque de Naval Ravikant",author:"Eric Jorgenson",genre:"Filosofía",year:2024,rating:9.0},
  {title:"La sombra del águila",author:"Arturo Pérez-Reverte",genre:"Novela",year:2024,rating:6.0},
  {title:"Railroader",author:"Howard Green",genre:"Biografía",year:2024,rating:7.0},
  {title:"Honrarás a tu padre",author:"Gay Talese",genre:"Ensayo",year:2024,rating:9.3},
  {title:"¿Dónde vamos a bailar esta noche?",author:"Javier Aznar",genre:"Artículos",year:2024,rating:9.0},
  {title:"Yo fui médico del diablo",author:"K. Von Vereiter",genre:"Novela histórica",year:2024,rating:6.5},
  {title:"Vive más",author:"Marcos Vázquez",genre:"Salud",year:2024,rating:8.0},
  {title:"A sangre fría",author:"Truman Capote",genre:"True Crime",year:2024,rating:8.0},
  {title:"Rendimientos del capital",author:"Edward Chancellor",genre:"Inversión",year:2024,rating:7.0},
  {title:"El asesinato de Sócrates",author:"Marcos Chicot",genre:"Novela histórica",year:2024,rating:9.0},
  {title:"El húsar",author:"Arturo Pérez-Reverte",genre:"Novela",year:2024,rating:7.0},
  {title:"Trece Runas",author:"Michael Penkofer",genre:"Novela",year:2024,rating:6.75},
  {title:"Antifragil",author:"Nassim Nicholas Taleb",genre:"Ensayo",year:2024,rating:9.3},
  {title:"Los Vencejos",author:"Fernando Aramburu",genre:"Novela",year:2024,rating:7.0},
  {title:"Bartleby y yo",author:"Gay Talese",genre:"Crónicas",year:2024,rating:6.5},
  {title:"Robinson Crusoe",author:"Daniel Defoe",genre:"Clásico",year:2024,rating:9.5},
  {title:"Rompe la Barrera del No",author:"Chris Voss",genre:"Psicología",year:2024,rating:8.0},
  {title:"Roma soy yo",author:"Santiago Posteguillo",genre:"Novela histórica",year:2024,rating:8.5},
  {title:"Brooklyn Follies",author:"Paul Auster",genre:"Novela",year:2024,rating:7.75},
  {title:"Lo que el viento se llevó",author:"Jose Luis Garci",genre:"Cine",year:2024,rating:6.5},
  {title:"La Isla de la Mujer Dormida",author:"Arturo Pérez-Reverte",genre:"Novela",year:2024,rating:6.7},
  {title:"El Padrino",author:"Mario Puzo",genre:"Novela",year:2024,rating:9.25},
  {title:"Victoria",author:"Paloma Sánchez-Garnica",genre:"Novela",year:2024,rating:8.0},
  {title:"Maldita Roma II",author:"Santiago Posteguillo",genre:"Novela histórica",year:2025,rating:8.0},
  {title:"Los Pilares de la Tierra",author:"Ken Follett",genre:"Novela",year:2025,rating:8.5},
  {title:"Cien años de Soledad",author:"Gabriel García Márquez",genre:"Clásico",year:2025,rating:8.5},
  {title:"La trilogía de Nueva York",author:"Paul Auster",genre:"Novela",year:2025,rating:6.8},
  {title:"El coronel no tiene quien le escriba",author:"Gabriel García Márquez",genre:"Clásico",year:2025,rating:8.0},
  {title:"Tres poetas de sus vidas",author:"Stefan Zweig",genre:"Biografía",year:2025,rating:9.0},
  {title:"La fiesta del Chivo",author:"Mario Vargas Llosa",genre:"Novela",year:2025,rating:9.3},
  {title:"Tiempos Recios",author:"Mario Vargas Llosa",genre:"Novela",year:2025,rating:8.0},
  {title:"Mil ojos esconde la noche",author:"Juan Manuel de Prada",genre:"Novela",year:2025,rating:7.0},
  {title:"Almendra",author:"Won-pyung Sohn",genre:"Novela",year:2025,rating:9.5},
  {title:"El Impulso",author:"Won-pyung Sohn",genre:"Novela",year:2025,rating:7.5},
  {title:"El Capitán Alatriste 1",author:"Arturo Pérez-Reverte",genre:"Novela aventuras",year:2025,rating:7.0},
  {title:"Buena estrategia mala estrategia",author:"R. Rumelt",genre:"Negocios",year:2025,rating:7.0},
  {title:"El Capitán Alatriste 2: Limpieza de Sangre",author:"Arturo Pérez-Reverte",genre:"Novela aventuras",year:2025,rating:7.0},
  {title:"El Capitán Alatriste 3: El sol de Breda",author:"Arturo Pérez-Reverte",genre:"Novela aventuras",year:2025,rating:6.5},
  {title:"El Arte de Correr",author:"Andrea Marcolongo",genre:"Deporte",year:2025,rating:8.0},
  {title:"El asesinato de Platón",author:"Marcos Chicot",genre:"Novela histórica",year:2025,rating:7.5},
  {title:"Respira",author:"James Nestor",genre:"Salud",year:2025,rating:8.8},
  {title:"Cosas que los nietos deberían saber",author:"Mark Everett",genre:"Biografía",year:2025,rating:8.0},
  {title:"Mis días en la librería Morisaki",author:"Satoshi Yagisawa",genre:"Novela",year:2025,rating:8.5},
  {title:"Algo pasa con Baum",author:"Woody Allen",genre:"Novela",year:2025,rating:8.5},
  {title:"Ikigai",author:"Héctor García y Francesc Miralles",genre:"Filosofía",year:2025,rating:6.3},
  {title:"El Principito",author:"Antoine de Saint-Exupéry",genre:"Clásico",year:2025,rating:8.5},
  {title:"El Almanaque del Pobre Charlie",author:"Charlie Munger",genre:"Filosofía",year:2026,rating:8.25},
  {title:"Los Tres Mundos",author:"Santiago Posteguillo",genre:"Novela histórica",year:2026,rating:7.9},
  {title:"Un día de cólera",author:"Arturo Pérez-Reverte",genre:"Novela histórica",year:2026,rating:6.7},
  {title:"Mis días en el café Torunka",author:"Satoshi Yagisawa",genre:"Novela",year:2026,rating:8.0},
]

const RatingBar = ({ rating }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <div style={{ position: 'relative', width: 60, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${rating * 10}%`, background: 'var(--gold)', borderRadius: 3 }} />
    </div>
    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--gold)' }}>{rating.toFixed(1)}</span>
  </div>
)

export default function Books() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('Todos')
  const [yr, setYr] = useState('Todos')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', author: '', year: 2026, rating: 8.0, genre: 'Novela' })

  useEffect(() => { fetchBooks() }, [])

  const fetchBooks = async () => {
    setLoading(true)
    const { data } = await supabase.from('books').select('*').order('year', { ascending: false })
    if (data) setBooks(data)
    setLoading(false)
  }

  const seedBooks = async () => {
    setSeeding(true)
    await supabase.from('books').insert(SEED_BOOKS)
    await fetchBooks()
    setSeeding(false)
  }

  const save = async () => {
    if (!form.title.trim()) return
    const entry = { ...form, year: Number(form.year), rating: Number(form.rating) }
    if (editing) {
      await supabase.from('books').update(entry).eq('id', editing)
    } else {
      await supabase.from('books').insert(entry)
    }
    await fetchBooks()
    setModal(false)
  }

  const remove = async (id) => {
    await supabase.from('books').delete().eq('id', id)
    setBooks(books.filter(b => b.id !== id))
  }

  const genres = ['Todos', ...Array.from(new Set(books.map(b => b.genre))).sort()]
  const years = ['Todos', ...Array.from(new Set(books.map(b => b.year))).sort((a, b) => b - a).map(String)]

  const filtered = books.filter(b =>
    (b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())) &&
    (genre === 'Todos' || b.genre === genre) &&
    (yr === 'Todos' || String(b.year) === yr)
  )

  const avg = books.length ? (books.reduce((a, b) => a + Number(b.rating), 0) / books.length).toFixed(1) : 0
  const best = books.length ? [...books].sort((a, b) => b.rating - a.rating)[0] : null

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Biblioteca</div>
          <div className="section-sub">Lecturas personales · {books.length} libros</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {books.length === 0 && !loading && (
            <button className="btn-add" onClick={seedBooks} disabled={seeding}>
              {seeding ? 'Cargando...' : '⬆ Importar 94 libros'}
            </button>
          )}
          <button className="btn-add" onClick={() => { setEditing(null); setForm({ title: '', author: '', year: 2026, rating: 8.0, genre: 'Novela' }); setModal(true) }}>
            + Añadir libro
          </button>
        </div>
      </div>

      <div className="stats-row">
        {[
          ['Total leídos', books.length],
          ['Nota media', avg + ' / 10'],
          ['Este año', books.filter(b => b.year === 2026).length],
          ['Géneros', genres.length - 1],
        ].map(([l, v]) =>
          <div className="stat-card" key={l}><div className="stat-label">{l}</div><div className="stat-value">{v}</div></div>
        )}
      </div>

      {best && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 16px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Mejor valorado:</span>
          <span style={{ color: 'var(--gold)', fontSize: 13 }}>{best.title}</span>
          <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>— {best.author}</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'var(--gold)', marginLeft: 'auto' }}>{Number(best.rating).toFixed(1)} / 10</span>
        </div>
      )}

      <div className="filters">
        <input className="search-input" placeholder="Buscar título o autor..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-btn" value={genre} onChange={e => setGenre(e.target.value)} style={{ cursor: 'pointer' }}>
          {genres.map(g => <option key={g}>{g}</option>)}
        </select>
        <select className="filter-btn" value={yr} onChange={e => setYr(e.target.value)} style={{ cursor: 'pointer' }}>
          {years.map(y => <option key={y}>{y}</option>)}
        </select>
      </div>

      {loading ? <div className="loading">CARGANDO BIBLIOTECA...</div> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Título</th><th>Autor</th><th>Género</th><th>Año</th><th>Nota</th><th></th></tr></thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id}>
                  <td className="mono dim">{i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{b.title}</td>
                  <td className="dim">{b.author}</td>
                  <td><span className="badge badge-gold">{b.genre}</span></td>
                  <td className="mono">{b.year}</td>
                  <td><RatingBar rating={Number(b.rating)} /></td>
                  <td>
                    <button className="btn-icon" onClick={() => { setEditing(b.id); setForm({ title: b.title, author: b.author, year: b.year, rating: b.rating, genre: b.genre }); setModal(true) }}>✎</button>
                    <button className="btn-icon" onClick={() => remove(b.id)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="empty">Sin resultados</div>}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{editing ? 'Editar libro' : 'Añadir libro'}</div>
            <div className="form-grid">
              <div className="form-group full"><label className="form-label">Título</label><input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="form-group full"><label className="form-label">Autor</label><input className="form-input" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Género</label><input className="form-input" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Año leído</label><input className="form-input" type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Nota (0–10)</label><input className="form-input" type="number" step="0.1" min="0" max="10" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} /></div>
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
