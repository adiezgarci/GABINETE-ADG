import { useState } from 'react'

// Desplegable con el tablero "Emperadores que acuñaron denarios".
// La imagen va en /public/tablero-emperadores.jpg (Vite la sirve desde la raíz).
const IMG = '/tablero-emperadores.jpg'
const EN_TABLERO = 16
const TOTAL_TABLERO = 35

export default function TableroEmperadores() {
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(false)

  return (
    <section style={{ margin: '18px 0', border: '1px solid var(--gold-dim, #8a6d3b)', borderRadius: 6, background: 'rgba(200,169,110,.04)' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="tablero-emperadores"
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', textAlign: 'left' }}
      >
        <span>
          <span style={{ display: 'block', fontFamily: "'Cinzel', serif", fontSize: 16, letterSpacing: '.04em', color: 'var(--gold, #c8a96e)' }}>
            Tablero de emperadores
          </span>
          <span style={{ display: 'block', marginTop: 2, fontSize: 12, color: 'var(--text-muted, #9a8f7c)' }}>
            {EN_TABLERO} de {TOTAL_TABLERO} emperadores, de Augusto a Gordiano III
          </span>
        </span>
        <span aria-hidden="true" style={{ fontSize: 14, color: 'var(--gold, #c8a96e)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
      </button>

      {open && (
        <div id="tablero-emperadores" style={{ padding: '0 18px 18px' }}>
          <img
            src={IMG}
            alt="Tablero de denarios imperiales de la colección, de Augusto a Gordiano III, con huecos para los emperadores que faltan"
            onClick={() => setZoom(true)}
            loading="lazy"
            style={{ display: 'block', width: '100%', maxWidth: 720, margin: '0 auto', borderRadius: 4, cursor: 'zoom-in', boxShadow: '0 6px 24px rgba(0,0,0,.35)' }}
          />
          <div style={{ marginTop: 8, textAlign: 'center', fontSize: 12, color: 'var(--text-muted, #9a8f7c)' }}>
            Toca la imagen para verla a pantalla completa
          </div>
        </div>
      )}

      {zoom && (
        <div onClick={() => setZoom(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, cursor: 'zoom-out' }}>
          <img src={IMG} alt="Tablero de emperadores ampliado" style={{ maxWidth: '95vw', maxHeight: '95vh', borderRadius: 6 }} />
        </div>
      )}
    </section>
  )
}
