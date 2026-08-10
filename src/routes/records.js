const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM records ORDER BY id');
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM records WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Record not found' });
  }

  res.json(result.rows[0]);
});

router.post('/', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const result = await db.query(
    'INSERT INTO records (name, email) VALUES ($1, $2) RETURNING *',
    [name, email]
  );

  res.status(201).json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const result = await db.query(
    'UPDATE records SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id = $3 RETURNING *',
    [name, email, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Record not found' });
  }

  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.query('DELETE FROM records WHERE id = $1 RETURNING *', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Record not found' });
  }

  res.json({ deleted: true });
});

module.exports = router;
