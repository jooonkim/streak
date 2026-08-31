# Streak

A deliberately small, local-first habit-chain app for doing the important things every day.

**Use it now:** [joon-streak.vercel.app](https://joon-streak.vercel.app/)

No account, subscription, backend, notification system, or App Store install is required. Each browser keeps its own private copy of the data on that device.

## Why I built this

Streak is based on the productivity idea commonly called **Don't Break the Chain** or the **Seinfeld Strategy**.

The idea is intentionally simple:

1. Choose one small, concrete action that moves something important forward.
2. Do it every day.
3. Mark that day on a calendar.
4. As the completed days form a visible chain, use the chain as motivation to keep going.

The method shifts attention away from distant outcomes and toward a repeatable daily process. A long chain is not the goal by itself; it is immediate evidence that you keep showing up. If the chain breaks, the useful response is not to rewrite history or abandon the habit—it is to begin the next chain today.

The story is widely attributed to comedian Jerry Seinfeld, although Seinfeld has said he did not invent it. “Seinfeld Strategy” remains the familiar name for the principle; the app is about the principle, not the attribution.

Streak turns that paper-calendar idea into the smallest useful digital version: one tap records today, the contribution grid makes consistency visible, and there are no extra systems competing for attention.

## Add Streak to an iPhone Home Screen

You do not need an Apple Developer account or the App Store.

1. On your iPhone, open **Safari** and visit [joon-streak.vercel.app](https://joon-streak.vercel.app/).
2. Tap the **Share** button (the square with an upward arrow).
3. Scroll down and tap **Add to Home Screen**.
4. Turn on **Open as Web App** if your iPhone shows that option.
5. Tap **Add**.

Streak will appear on the Home Screen with its own icon and open like a standalone app. If **Add to Home Screen** is missing, scroll to the bottom of the Share sheet, tap **Edit Actions**, and add it. See [Apple's official instructions](https://support.apple.com/en-sa/guide/iphone/iphea86e5236/ios).

Important: use the same production URL every time. Browser storage is separated by origin, so data saved on a preview deployment or a different domain will not appear at the production URL.

## What it does

- Tracks multiple daily, yes-or-no habits.
- Opens directly to Today.
- Marks or undoes today's completion with one tap.
- Uses the device's local calendar date—not a rolling 24-hour timer.
- Shows current streak and best streak only.
- Shows a compact 12-week, GitHub-style binary history for each habit.
- Opens a habit to a larger full-history view.
- Distinguishes completed, missed, future, and today's outlined cells.
- Adds habits by name and deletes them with confirmation.
- Does not allow historical editing or custom schedules.

There are deliberately no notes, tags, categories, colors, icons, folders, social features, points, achievements, accounts, notifications, or backend.

## How storage works

Habit data is JSON stored in the browser under the `streak.habits.v1` `localStorage` key.

That makes the data:

- **Device-bound:** your iPhone and laptop have separate histories.
- **Browser/profile-bound:** Safari and Chrome on the same device have separate histories.
- **Origin-bound:** `joon-streak.vercel.app` and a custom domain have separate histories.
- **Private by default:** nothing is sent to a server by this app.

It also means there is no sync, account recovery, export, import, or cloud backup in this version. Clearing browser/site data, removing the web app and its stored data, or losing the device can permanently remove the history.

Every visitor to the hosted URL gets their own independent local dataset. One person's habits are never visible to another person.

## Run locally

### Prerequisites

- Node.js 20 or newer
- npm

### Start the development server

```bash
git clone https://github.com/jooonkim/streak.git
cd streak
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

The GitHub repository is private, so cloning it requires collaborator access. Anyone without repository access can still use the public hosted app, or deploy from a copy of the source provided to them.

### Production check

```bash
npm run lint
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Deploy your own copy with Vercel

### From the Vercel dashboard

1. Fork or copy the project into a Git repository you can access.
2. Sign in to [Vercel](https://vercel.com/) and choose **Add New → Project**.
3. Import the GitHub repository.
4. Confirm these settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Leave environment variables empty; the app does not use any.
6. Select **Deploy**.

Vercel normally detects Vite automatically. Once Git is connected, pushes to the production branch create production deployments and other branches or pull requests create previews. See [Vercel's Git deployment documentation](https://vercel.com/docs/git) and [Vite's static deployment guide](https://vite.dev/guide/static-deploy).

### From the command line

```bash
npm install
npx vercel
```

Follow the prompts for the first deployment, then publish production with:

```bash
npx vercel --prod
```

### Updating a deployment

For a Git-connected Vercel project, commit and push changes to the production branch. Vercel will build and deploy them automatically.

Because data lives in the browser rather than the deployment, ordinary UI and code updates do not erase habit history as long as the site keeps the same domain and storage key.

## Project structure

```text
streak/
├── index.html
├── public/
│   ├── icon-180.png
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── manifest.webmanifest
│   ├── og.png
│   └── sw.js
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── package.json
├── tsconfig.json
└── vite.config.ts
```

The app is a small React + TypeScript + Vite project. The web app manifest and service worker make it installable and cache the application shell for repeat visits.

## Troubleshooting

### My habits are missing on another device

This is expected. Storage is local to one browser profile on one device. There is no sync in v1.

### My habits disappeared after changing domains

Browser storage does not move between domains. Return to the exact URL where the habits were originally created.

### I deployed an update but still see the old version

Close and reopen the installed web app. If necessary, refresh it in Safari. The service worker is intentionally small, but an already-open copy can continue showing cached files briefly.

### Add to Home Screen is not visible

Open the site in Safari, use the Share sheet, then choose **Edit Actions** and enable **Add to Home Screen**.

## Privacy and limitations

The application code has no analytics, advertising, accounts, cookies, or network API for habit data. Vercel still serves the website and may retain ordinary infrastructure request logs according to its own policies.

This minimal architecture is excellent for private, frictionless use, but it intentionally trades away multi-device sync, collaborative use, recovery, and server-side backups.
