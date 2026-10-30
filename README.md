# Maria Stitches

A premium tailoring atelier website for Maria Stitches, with a Vite + React frontend and a small Express API for consultation requests.

## Run locally

In one terminal:

```bash
cd backend
npm install
npm run dev
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend is at `http://localhost:5173`; the API health endpoint is `http://localhost:5000/api/health`.

The consultation endpoint currently validates and acknowledges requests. Connect an email provider or database before using it to retain or notify the studio about enquiries. Editorial photos are served by Unsplash and require an internet connection.
