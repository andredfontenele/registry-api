require('dotenv').config();

const express = require('express');
const db = require('./db');
const recordsRouter = require('./routes/records');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/records', recordsRouter);

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Registry API is running' });
});

async function start() {
  try {
    await db.init();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting app:', error);
    process.exit(1);
  }
}

start();
