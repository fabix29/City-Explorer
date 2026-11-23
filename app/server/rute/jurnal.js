import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

router.get('/raport', async (req, res) => {
  const metoda = req.query.metoda ?? ''
  let sql = `
    SELECT metoda, cale, COUNT(*) AS cereri, ROUND(AVG(durata_ms), 1) AS medie_ms
    FROM jurnal
  `
  const valori = []

  if (metoda !== '') {
    // VARIANTA 1 (pentru testul inițial din fișă - SQL Injection):
     sql += ` WHERE metoda = '${metoda}'`

    // VARIANTA 2 (corectată, cu parametru):
    //sql += ' WHERE metoda = ?'
    valori.push(metoda)
  }

  sql += ' GROUP BY metoda, cale ORDER BY cereri DESC LIMIT 10'

  const [randuri] = await pool.query(sql, valori)
  res.json(
    randuri.map((r) => ({
      ...r,
      cereri: Number(r.cereri),
      medie_ms: Number(r.medie_ms),
    }))
  )
})

export default router