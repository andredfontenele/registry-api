require('dotenv').config();

const express = require('express');
const personsRouter = require('./routes/persons');
const logsRouter = require('./routes/logs');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/persons', personsRouter);
app.use('/logs', logsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(port, () => console.log(`Backend rodando na porta ${port}`));
