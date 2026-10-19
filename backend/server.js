require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const fields = (b) => [
  String(b.product_name || '').trim(),
  b.brand ?? null,
  b.category ?? null,
  Number(b.price ?? 0),
  parseInt(b.stock ?? 0, 10),
  b.description ?? null,
];
const valid = (b) => b && String(b.product_name || '').trim() !== '' && !isNaN(Number(b.price ?? 0));

// GET all
app.get('/api/products', (req, res) => {
  res.json(db.prepare('SELECT * FROM products ORDER BY id').all());
});

// GET one
app.get('/api/products/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Product not found' });
  res.json(row);
});

// POST create
app.post('/api/products', (req, res) => {
  if (!valid(req.body)) return res.status(400).json({ error: 'product_name is required and price must be a number' });
  const info = db.prepare(
    'INSERT INTO products (product_name, brand, category, price, stock, description) VALUES (?,?,?,?,?,?)'
  ).run(...fields(req.body));
  res.status(201).json(db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid));
});

// PUT update
app.put('/api/products/:id', (req, res) => {
  if (!valid(req.body)) return res.status(400).json({ error: 'product_name is required and price must be a number' });
  const info = db.prepare(
    'UPDATE products SET product_name=?, brand=?, category=?, price=?, stock=?, description=? WHERE id=?'
  ).run(...fields(req.body), req.params.id);
  if (!info.changes) return res.status(404).json({ error: 'Product not found' });
  res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id));
});

// DELETE
app.delete('/api/products/:id', (req, res) => {
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (!info.changes) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted', id: Number(req.params.id) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
