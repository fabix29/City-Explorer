import { useState, useEffect } from 'react'
import { getStatistici } from '../api/statistici.js'

export default function PanouStatistici() {
  const [prag, setPrag] = useState(3)
  const [tara, setTara] = useState('')
  const [rezultat, setRezultat] = useState({ destinatii: 0, zile: 0, medie: 0 })
  const [eroare, setEroare] = useState(null)

  useEffect(() => {
    getStatistici(prag, tara)
      .then((data) => {
        setRezultat(data)
        setEroare(null)
      })
      .catch((err) => {
        setEroare(err.message)
      })
  }, [prag, tara])

  return (
    <section className="panou-statistici" style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', background: '#fff' }}>
      <h3>Statistici</h3>
      
      {eroare && <p style={{ color: 'red' }}>Eroare: {eroare}</p>}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <label>
          Cel puțin{' '}
          <input
            type="number"
            value={prag}
            onChange={(e) => setPrag(Number(e.target.value))}
            min="1"
            style={{ width: '60px', padding: '0.2rem' }}
          />{' '}
          zile
        </label>

        <label>
          Țară:{' '}
          <input
            type="text"
            value={tara}
            onChange={(e) => setTara(e.target.value)}
            placeholder="toate"
            style={{ padding: '0.2rem' }}
          />
        </label>
      </div>

      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        <li>• Destinații: <strong>{rezultat.destinatii}</strong></li>
        <li>• Total zile: <strong>{rezultat.zile}</strong></li>
        <li>• Media: <strong>{rezultat.medie} zile</strong></li>
      </ul>
    </section>
  )
}