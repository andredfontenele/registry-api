const { Router } = require('express');
const db = require('../db');

const router = Router();

// GET /logs
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM logs ORDER BY created_at DESC LIMIT 200');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
