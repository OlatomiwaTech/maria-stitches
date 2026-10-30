import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', studio: 'Maria Stitches' }));

app.post('/api/appointments', (req, res) => {
  const { name, email, service, message = '' } = req.body || {};
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

  const appointment = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    service: service.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };
  console.info('New Maria Stitches consultation request', { id: appointment.id, service: appointment.service });
  return res.status(201).json({ message: 'Consultation request received.', appointmentId: appointment.id });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

app.listen(port, () => console.log(`Maria Stitches API listening on http://localhost:${port}`));
