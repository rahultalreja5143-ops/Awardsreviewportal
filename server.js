const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'feedback.json');
const AWARDS_FILE = path.join(DATA_DIR, 'awards.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '{}', 'utf8');
if (!fs.existsSync(AWARDS_FILE)) fs.writeFileSync(AWARDS_FILE, 'null', 'utf8');

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/feedback', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json(data);
  } catch {
    res.json({});
  }
});

app.post('/api/feedback', (req, res) => {
  const { key, entry } = req.body;
  if (!key || !entry) return res.status(400).json({ error: 'key and entry required' });
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data[key] = entry;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

app.get('/api/awards', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(AWARDS_FILE, 'utf8'));
    res.json(data);
  } catch {
    res.json(null);
  }
});

app.post('/api/awards', (req, res) => {
  try {
    fs.writeFileSync(AWARDS_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save awards' });
  }
});

app.listen(PORT, () => {
  console.log(`Award Review Portal running at http://localhost:${PORT}`);
});
