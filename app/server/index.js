import express from 'express'
import cors from 'cors'
import { pool } from './db.js'
import { jurnal } from './jurnal.js'
import statistici from './rute/statistici.js'
import rutaJurnal from './rute/jurnal.js'

const app = express()

// Middleware de afișare în terminal (Secțiunea 3.1)
app.use((req, res, next) => {
  console.log(req.method, req.originalUrl)
  next()
})

// La Exercițiul 4d vei muta app.use(jurnal) DEASUPRA lui app.use(cors())
app.use(cors())
app.use(jurnal)
app.use(express.json())

// Exercițiul 1c: Ruta de ecou
app.all('/api/ecou/:id', (req, res) => {
  res.json({ params: req.params, query: req.query, body: req.body })
})

// Exercițiul 1b: Toate destinațiile
app.get('/api/destinatii', async (req, res) => {
  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii ORDER BY id'
  )
  res.json(
    randuri.map((d) => ({
      ...d,
      id: String(d.id),
      vizitat: Boolean(d.vizitat),
    }))
  )
})

// Exercițiul 5a: Ruta de căutare exactă după oraș (trebuie pusă înainte de /:id dacă ar exista GET /:id)
app.get('/api/destinatii/caut', async (req, res) => {
  const oras = req.query.oras ?? ''
  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii WHERE oras = ?',
    [oras]
  )
  res.json(
    randuri.map((d) => ({
      ...d,
      id: String(d.id),
      vizitat: Boolean(d.vizitat),
    }))
  )
})

// Exercițiul 2: Adăugarea unei destinații cu validare
app.post('/api/destinatii', async (req, res) => {
  const { oras, tara, zile } = req.body

  if (
    typeof oras !== 'string' ||
    oras.trim() === '' ||
    typeof tara !== 'string' ||
    tara.trim() === '' ||
    typeof zile !== 'number' ||
    !Number.isInteger(zile) ||
    zile < 1 ||
    zile > 30
  ) {
    return res.status(400).json({ eroare: 'Date invalide.' })
  }

  const [rezultat] = await pool.query(
    'INSERT INTO destinatii (oras, tara, zile, vizitat) VALUES (?, ?, ?, ?)',
    [oras.trim(), tara.trim(), zile, false]
  )

  res.status(201).json({
    id: String(rezultat.insertId),
    oras: oras.trim(),
    tara: tara.trim(),
    zile,
    vizitat: false,
  })
})

// Exercițiul 3a: Marcarea ca vizitat / nevizitat
app.patch('/api/destinatii/:id', async (req, res) => {
  const { id } = req.params
  const { vizitat } = req.body

  if (typeof vizitat !== 'boolean') {
    return res.status(400).json({ eroare: 'Câmpul vizitat trebuie să fie boolean.' })
  }

  const [rezultat] = await pool.query(
    'UPDATE destinatii SET vizitat = ? WHERE id = ?',
    [vizitat, id]
  )

  if (rezultat.affectedRows === 0) {
    return res.status(404).json({ eroare: 'Destinația nu există.' })
  }

  const [randuri] = await pool.query(
    'SELECT id, oras, tara, zile, vizitat FROM destinatii WHERE id = ?',
    [id]
  )

  const d = randuri[0]
  res.json({
    ...d,
    id: String(d.id),
    vizitat: Boolean(d.vizitat),
  })
})

// Rute montate (Exercițiul 3c și 4b)
app.use('/api/statistici', statistici)
app.use('/api/jurnal', rutaJurnal)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`API pornit pe http://localhost:${PORT}`)
})