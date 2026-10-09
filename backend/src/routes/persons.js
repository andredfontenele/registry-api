const { Router } = require('express');
const { body, param, validationResult } = require('express-validator');
const db = require('../db');

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

const personRules = [
  body('first_name').trim().notEmpty().withMessage('first_name é obrigatório'),
  body('last_name').trim().notEmpty().withMessage('last_name é obrigatório'),
  body('email').isEmail().withMessage('email inválido'),
  body('document_number')
    .matches(/^\d{11}$/)
    .withMessage('document_number deve ter 11 dígitos numéricos'),
  body('date_of_birth').isISO8601().withMessage('date_of_birth deve ser YYYY-MM-DD'),
];

// GET /persons
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT p.*,
        COALESCE(json_agg(DISTINCT a.*) FILTER (WHERE a.id IS NOT NULL), '[]') AS addresses,
        COALESCE(json_agg(DISTINCT ph.*) FILTER (WHERE ph.id IS NOT NULL), '[]') AS phone_numbers
      FROM persons p
      LEFT JOIN addresses a ON a.person_id = p.id
      LEFT JOIN phone_numbers ph ON ph.person_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /persons/:id
router.get('/:id', param('id').isUUID(), validate, async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT p.*,
        COALESCE(json_agg(DISTINCT a.*) FILTER (WHERE a.id IS NOT NULL), '[]') AS addresses,
        COALESCE(json_agg(DISTINCT ph.*) FILTER (WHERE ph.id IS NOT NULL), '[]') AS phone_numbers
      FROM persons p
      LEFT JOIN addresses a ON a.person_id = p.id
      LEFT JOIN phone_numbers ph ON ph.person_id = p.id
      WHERE p.id = $1
      GROUP BY p.id
    `, [req.params.id]);

    if (!result.rows.length) return res.status(404).json({ error: 'Pessoa não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /persons
router.post('/', personRules, validate, async (req, res, next) => {
  const { first_name, last_name, email, document_number, date_of_birth } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO persons (first_name, last_name, email, document_number, date_of_birth)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [first_name, last_name, email, document_number, date_of_birth]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email ou documento já cadastrado' });
    next(err);
  }
});

// PUT /persons/:id
router.put('/:id', [param('id').isUUID(), ...personRules], validate, async (req, res, next) => {
  const { first_name, last_name, email, document_number, date_of_birth } = req.body;
  try {
    const result = await db.query(
      `UPDATE persons
       SET first_name = $1, last_name = $2, email = $3,
           document_number = $4, date_of_birth = $5, updated_at = now()
       WHERE id = $6 RETURNING *`,
      [first_name, last_name, email, document_number, date_of_birth, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Pessoa não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email ou documento já cadastrado' });
    next(err);
  }
});

// DELETE /persons/:id
router.delete('/:id', param('id').isUUID(), validate, async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM persons WHERE id = $1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Pessoa não encontrada' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
