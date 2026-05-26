import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient.js'

const SEED_BOOKS = [
  {title:"El mundo de ayer",author:"Stefan Zweig",year:2023,rating:5,genre:"Biografía"},
  {title:"Pensar rápido, pensar despacio",author:"Daniel Kahneman",year:2023,rating:5,genre:"Economía conductual"},
  {title:"Antifrágil",author:"Nassim Taleb",year:2023,rating:5,genre:"Filosofía"},
  {title:"Los pilares de la Tierra",author:"Ken Follett",year:2023,rating:5,genre:"Ficción histórica"},
  {title:"El nombre de la rosa",author:"Umberto Eco",year:2023,rating:5,genre:"Ficción histórica"},
  {title:"Sapiens",author:"Yuval Noah Harari",year:2023,rating:4,genre:"Historia"},
  {title:"El inversor inteligente",author:"Benjamin Graham",year:2023,rating:5,genre:"Inversión"},
  {title:"La psicología del dinero",author:"Morgan Housel",year:2023,rating:5,genre:"Economía conductual"},
  {title:"Estoicismo",author:"Epicteto",year:2023,rating:4,genre:"Filosofía"},
  {title:"Meditaciones",author:"Marco Aurelio",year:2023,rating:5,genre:"Filosofía"},
  {title:"Africanus: El hijo del cónsul",author:"Santiago Posteguillo",year:2023,rating:5,genre:"Ficción histórica"},
  {title:"Las legiones malditas",author:"Santiago Posteguillo",year:2023,rating:5,genre:"Ficción histórica"},
  {title:"La traición de Roma",author:"Santiago Posteguillo",year:2023,rating:5,genre:"Ficción histórica"},
  {title:"Yo, Julia",author:"Santiago Posteguillo",year:2023,rating:4,genre:"Ficción histórica"},
  {title:"El capitán Alatriste",author:"Arturo Pérez-Reverte",year:2023,rating:4,genre:"Ficción histórica"},
  {title:"Limpieza de sangre",author:"Arturo Pérez-Reverte",year:2023,rating:4,genre:"Ficción histórica"},
  {title:"El sol de Breda",author:"Arturo Pérez-Reverte",year:2023,rating:4,genre:"Ficción histórica"},
  {title:"El oro del rey",author:"Arturo Pérez-Reverte",year:2023,rating:4,genre:"Ficción histórica"},
  {title:"El caballero del jubón amarillo",author:"Arturo Pérez-Reverte",year:2024,rating:4,genre:"Ficción histórica"},
  {title:"Corsarios de Levante",author:"Arturo Pérez-Reverte",year:2024,rating:4,genre:"Ficción histórica"},
  {title:"El puente de los Asesinos",author:"Arturo Pérez-Reverte",year:2024,rating:4,genre:"Ficción histórica"},
  {title:"El maestro de esgrima",author:"Arturo Pérez-Reverte",year:2024,rating:4,genre:"Ficción histórica"},
  {title:"La tabla de Flandes",author:"Arturo Pérez-Reverte",year:2024,rating:4,genre:"Ficción"},
  {title:"El club Dumas",author:"Arturo Pérez-Reverte",year:2024,rating:4,genre:"Ficción"},
  {title:"Una carta de España",author:"Stefan Zweig",year:2024,rating:4,genre:"Biografía"},
  {title:"Novela de ajedrez",author:"Stefan Zweig",year:2024,rating:5,genre:"Ficción"},
  {title:"Carta de una desconocida",author:"Stefan Zweig",year:2024,rating:4,genre:"Ficción"},
  {title:"El jugador",author:"Fiódor Dostoyevski",year:2024,rating:4,genre:"Clásicos"},
  {title:"Crimen y castigo",author:"Fiódor Dostoyevski",year:2024,rating:5,genre:"Clásicos"},
  {title:"El idiota",author:"Fiódor Dostoyevski",year:2024,rating:4,genre:"Clásicos"},
  {title:"El proceso",author:"Franz Kafka",year:2024,rating:4,genre:"Clásicos"},
  {title:"La metamorfosis",author:"Franz Kafka",year:2024,rating:4,genre:"Clásicos"},
  {title:"1984",author:"George Orwell",year:2024,rating:5,genre:"Ficción"},
  {title:"Rebelión en la granja",author:"George Orwell",year:2024,rating:4,genre:"Ficción"},
  {title:"Un mundo feliz",author:"Aldous Huxley",year:2024,rating:4,genre:"Ficción"},
  {title:"El gran Gatsby",author:"F. Scott Fitzgerald",year:2024,rating:4,genre:"Clásicos"},
  {title:"El viejo y el mar",author:"Ernest Hemingway",year:2024,rating:4,genre:"Clásicos"},
  {title:"Por quién doblan las campanas",author:"Ernest Hemingway",year:2024,rating:4,genre:"Clásicos"},
  {title:"El lobo estepario",author:"Hermann Hesse",year:2024,rating:4,genre:"Clásicos"},
  {title:"Siddhartha",author:"Hermann Hesse",year:2024,rating:4,genre:"Filosofía"},
  {title:"Demian",author:"Hermann Hesse",year:2024,rating:4,genre:"Clásicos"},
  {title:"El alquimista",author:"Paulo Coelho",year:2024,rating:3,genre:"Ficción"},
  {title:"Padre rico, padre pobre",author:"Robert Kiyosaki",year:2024,rating:3,genre:"Inversión"},
  {title:"El hombre más rico de Babilonia",author:"George Clason",year:2024,rating:4,genre:"Inversión"},
  {title:"Roma soy yo",author:"Santiago Posteguillo",year:2024,rating:5,genre:"Ficción histórica"},
  {title:"La noche en que Frankenstein leyó el Quijote",author:"Santiago Posteguillo",year:2024,rating:4,genre:"Ensayo"},
  {title:"El médico",author:"Noah Gordon",year:2024,rating:5,genre:"Ficción histórica"},
  {title:"El rabino",author:"Noah Gordon",year:2024,rating:4,genre:"Ficción histórica"},
  {title:"Shogun",author:"James Clavell",year:2024,rating:5,genre:"Ficción histórica"},
  {title:"El señor de los anillos: La comunidad del anillo",author:"J.R.R. Tolkien",year:2024,rating:5,genre:"Fantasía"},
  {title:"El señor de los anillos: Las dos torres",author:"J.R.R. Tolkien",year:2024,rating:5,genre:"Fantasía"},
  {title:"El señor de los anillos: El retorno del rey",author:"J.R.R. Tolkien",year:2024,rating:5,genre:"Fantasía"},
  {title:"El hobbit",author:"J.R.R. Tolkien",year:2024,rating:4,genre:"Fantasía"},
  {title:"Dune",author:"Frank Herbert",year:2024,rating:5,genre:"Ciencia ficción"},
  {title:"Dune Mesías",author:"Frank Herbert",year:2024,rating:4,genre:"Ciencia ficción"},
  {title:"Los hijos de Dune",author:"Frank Herbert",year:2025,rating:4,genre:"Ciencia ficción"},
  {title:"Guns, Germs and Steel",author:"Jared Diamond",year:2025,rating:4,genre:"Historia"},
  {title:"El hombre en busca de sentido",author:"Viktor Frankl",year:2025,rating:5,genre:"Filosofía"},
  {title:"Alejandro Magno",author:"Robin Lane Fox",year:2025,rating:4,genre:"Biografía"},
  {title:"Julio César",author:"Adrian Goldsworthy",year:2025,rating:5,genre:"Biografía"},
  {title:"Augusto",author:"Adrian Goldsworthy",year:2025,rating:5,genre:"Biografía"},
  {title:"El arte de la guerra",author:"Sun Tzu",year:2025,rating:4,genre:"Filosofía"},
  {title:"El príncipe",author:"Nicolás Maquiavelo",year:2025,rating:4,genre:"Filosofía"},
  {title:"El cisne negro",author:"Nassim Taleb",year:2025,rating:5,genre:"Filosofía"},
  {title:"Engañado por el azar",author:"Nassim Taleb",year:2025,rating:4,genre:"Economía conductual"},
  {title:"El lecho de Procusto",author:"Nassim Taleb",year:2025,rating:4,genre:"Filosofía"},
  {title:"¿Qué nos jugamos?",author:"Nassim Taleb",year:2025,rating:4,genre:"Filosofía"},
  {title:"Common Stocks and Uncommon Profits",author:"Philip Fisher",year:2025,rating:5,genre:"Inversión"},
  {title:"One Up On Wall Street",author:"Peter Lynch",year:2025,rating:5,genre:"Inversión"},
  {title:"Beating the Street",author:"Peter Lynch",year:2025,rating:4,genre:"Inversión"},
  {title:"The Warren Buffett Way",author:"Robert Hagstrom",year:2025,rating:4,genre:"Inversión"},
  {title:"Security Analysis",author:"Benjamin Graham & David Dodd",year:2025,rating:4,genre:"Inversión"},
  {title:"La Odisea",author:"Homero",year:2025,rating:5,genre:"Clásicos"},
  {title:"La Ilíada",author:"Homero",year:2025,rating:5,genre:"Clásicos"},
  {title:"Las vidas de los doce césares",author:"Suetonio",year:2025,rating:4,genre:"Historia"},
  {title:"El conde de Montecristo",author:"Alexandre Dumas",year:2025,rating:5,genre:"Clásicos"},
  {title:"Los tres mosqueteros",author:"Alexandre Dumas",year:2025,rating:4,genre:"Clásicos"},
  {title:"Nerón. El dominio del mundo",author:"Santiago Posteguillo",year:2026,rating:4,genre:"Ficción histórica"},
  {title:"La legión perdida",author:"Santiago Posteguillo",year:2026,rating:4,genre:"Ficción histórica"},
  {title:"Thinking in Bets",author:"Annie Duke",year:2026,rating:4,genre:"Economía conductual"},
  {title:"The Outsiders",author:"William Thorndike",year:2026,rating:5,genre:"Inversión"},
  {title:"Poor Charlie's Almanack",author:"Charlie Munger",year:2026,rating:5,genre:"Inversión"},
  {title:"Gallia. La guerra de las Galias",author:"Santiago Posteguillo",year:2026,rating:4,genre:"Ficción histórica"},
  {title:"El poder del ahora",author:"Eckhart Tolle",year:2026,rating:3,genre:"Filosofía"},
]

const Stars = ({ rating }) => (
  <span className="stars">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
)

export default function Books() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('Todos')
  const [yr, setYr] = useState('Todos')
  const [rat, setRat] = useState('Todos')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', author: '', year: 2026, rating: 5, genre: 'Ficción histórica' })

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
    (yr === 'Todos' || String(b.year) === yr) &&
    (rat === 'Todos' || b.rating === Number(rat))
  )

  const avg = books.length ? (books.reduce((a, b) => a + b.rating, 0) / books.length).toFixed(1) : 0

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Biblioteca</div>
          <div className="section-sub">Lecturas personales</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {books.length === 0 && !loading && (
            <button className="btn-add" onClick={seedBooks} disabled={seeding}>
              {seeding ? 'Cargando...' : '⬆ Importar 84 libros'}
            </button>
          )}
          <button className="btn-add" onClick={() => { setEditing(null); setForm({ title: '', author: '', year: 2026, rating: 5, genre: 'Ficción histórica' }); setModal(true) }}>
            + Añadir libro
          </button>
        </div>
      </div>

      <div className="stats-row">
        {[['Total leídos', books.length], ['Valoración media', avg + ' ★'], ['Este año', books.filter(b => b.year === 2026).length], ['Géneros', genres.length - 1]].map(([l, v]) =>
          <div className="stat-card" key={l}><div className="stat-label">{l}</div><div className="stat-value">{v}</div></div>
        )}
      </div>

      <div className="filters">
        <input className="search-input" placeholder="Buscar título o autor..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-btn" value={genre} onChange={e => setGenre(e.target.value)} style={{ cursor: 'pointer' }}>
          {genres.map(g => <option key={g}>{g}</option>)}
        </select>
        <select className="filter-btn" value={yr} onChange={e => setYr(e.target.value)} style={{ cursor: 'pointer' }}>
          {years.map(y => <option key={y}>{y}</option>)}
        </select>
        {['Todos', '5', '4', '3', '2', '1'].map(r => (
          <button key={r} className={`filter-btn ${rat === r ? 'active' : ''}`} onClick={() => setRat(r)}>
            {r === 'Todos' ? '⭐ Todos' : '★'.repeat(Number(r))}
          </button>
        ))}
      </div>

      {loading ? <div className="loading">CARGANDO BIBLIOTECA...</div> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Título</th><th>Autor</th><th>Género</th><th>Año</th><th>Valoración</th><th></th></tr></thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id}>
                  <td className="mono dim">{i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{b.title}</td>
                  <td className="dim">{b.author}</td>
                  <td><span className="badge badge-gold">{b.genre}</span></td>
                  <td className="mono">{b.year}</td>
                  <td><Stars rating={b.rating} /></td>
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
              <div className="form-group"><label className="form-label">Valoración</label>
                <select className="form-select" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })}>
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{'★'.repeat(r)} ({r})</option>)}
                </select>
              </div>
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
