# Streak

A minimal, local-first daily habit tracker. Every browser profile stores its own habits locally; there is no account or backend.

## Run locally

```bash
npm install
npm run dev
```

## Deploy with Vercel

Import this GitHub repository into Vercel. The framework preset is **Vite**, the build command is `npm run build`, and the output directory is `dist`.

Each push to the production branch deploys automatically. To install on iPhone, open the production URL in Safari, tap **Share**, then **Add to Home Screen**.

## Storage behavior

Habit data is stored under the `streak.habits.v1` key in `localStorage`. It is isolated by domain and browser profile, so different people and devices never share habit data. Clearing site data removes the history.
