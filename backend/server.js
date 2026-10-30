import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = new Set((process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean));

app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)) }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', studio: 'Maria Stitches' }));

app.post('/api/appointments', (req, res) => {
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
  const { name, email, service, message = '' } = body;
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
    return res.status(400).json({ message: 'Please enter your name.' });
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }
  if (typeof service !== 'string' || service.trim().length < 2 || service.length > 100) {
    return res.status(400).json({ message: 'Please choose a service.' });
  }
  if (typeof message !== 'string' || message.length > 2000) {
    return res.status(400).json({ message: 'Please keep your note under 2,000 characters.' });
  }

  return res.status(503).json({ message: 'Consultation requests are not connected to storage yet. Please contact Maria Stitches through WhatsApp.' });
});

app.use((err, _req, res, _next) => {
  if (err?.type === 'entity.too.large') return res.status(413).json({ message: 'The request is too large.' });
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ message: 'The request must contain valid JSON.' });
  console.error('Maria Stitches API request failed', err?.message || 'Unknown error');
  return res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

app.listen(port, () => console.log(`Maria Stitches API listening on http://localhost:${port}`));
