import { useState } from 'react'
import Books from './sections/Books.jsx'
import Coins from './sections/Coins.jsx'
import './App.css'

const NAV = [
  { id: 'books', label: 'Biblioteca', icon: '📚' },
  { id: 'coins', label: 'Monedas', icon: '🪙' },
]

export default function App() {
  const [active, setActive] = useState('books')
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="monogram">A</div>
          <div className="sidebar-title">
            Gabinete Adrián
            <span>Colección personal</span>
          </div>
        </div>
        <nav className="nav">
          <div className="nav-section-label">Colecciones</div>
          {NAV.map(item => (
            <button
              key={item.id}
              className={`nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => setActive(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-footer-text">Gabinete Personal · v1.0</div>
          <div className="sidebar-footer-url">gabinete-adg.vercel.app</div>
        </div>
      </aside>
      <main className="main">
        {active === 'books' && <Books />}
        {active === 'coins' && <Coins />}
      </main>
    </div>
  )
}
