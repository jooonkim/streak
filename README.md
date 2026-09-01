# Streak

A simple daily habit tracker I built for myself.

[Use Streak](https://joon-streak.vercel.app/)

There is no account or backend. Your habits are saved in your browser on the device you are using.

## Why I built it

Streak is based on **Don't Break the Chain**, also known as the **Seinfeld Strategy**.

The idea:

1. Pick something you want to do every day.
2. Do it.
3. Mark the day on a calendar.
4. Keep the chain going.

Watching the chain grow gives you a reason to show up again tomorrow. The point is not to build a perfect record. It is to spend less time deciding whether to do the work. If you miss a day, start a new chain the next day.

The method is often credited to Jerry Seinfeld, though Seinfeld has said he did not invent it. His name stuck anyway.

I wanted the same idea on my phone without turning it into a big habit-tracking system. Tap once when you finish a habit. The grid shows the chain.

## Add it to your iPhone

1. Open [joon-streak.vercel.app](https://joon-streak.vercel.app/) in Safari.
2. Tap the Share button (the square with the upward arrow).
3. Tap **Add to Home Screen**.
4. Turn on **Open as Web App** if you see the option.
5. Tap **Add**.

If **Add to Home Screen** is missing, scroll to the bottom of the Share menu, tap **Edit Actions**, and add it. [Apple has screenshots here](https://support.apple.com/en-sa/guide/iphone/iphea86e5236/ios).

No Apple Developer account or App Store download is needed.

## Features

- Multiple daily habits
- One-tap completion and undo
- Current and best streaks
- A 12-week grid on the home screen
- A one-year grid for each habit
- Habit renaming
- Backdating for days you forgot to log
- Local calendar dates

There are no accounts, notifications, schedules, notes, tags, points, or social features.

## Your data

The app stores its data in `localStorage` under the key `streak.habits.v1`.

Data does not sync between devices or browsers. Safari and Chrome have separate copies. Your iPhone and laptop have separate copies. A Vercel preview URL and the production URL also have separate copies.

Clearing the site's browser data deletes your habits. There is no backup or account recovery.

Everyone who opens the public app gets their own local copy. Other visitors cannot see your habits.

## Run it locally

You need Node.js 20 or newer and npm.

```bash
git clone https://github.com/jooonkim/streak.git
cd streak
npm install
npm run dev
```

Vite will print a local URL, usually `http://localhost:5173`.

The repository is private, so you need collaborator access to clone it. The hosted app is public.

Before deploying a change:

```bash
npm run lint
npm run build
npm run preview
```

## Deploy your own copy

### Vercel dashboard

1. Put the project in a GitHub repository.
2. In Vercel, choose **Add New → Project**.
3. Import the repository.
4. Use these settings:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
5. Deploy.

No environment variables are needed. Once the GitHub repository is connected, pushing to the production branch starts a new deployment.

[Vercel Git deployment docs](https://vercel.com/docs/git) · [Vite deployment docs](https://vite.dev/guide/static-deploy)

### Vercel CLI

```bash
npm install
npx vercel
```

For a production deployment:

```bash
npx vercel --prod
```

Deploying new code does not remove anyone's habits as long as the domain and `localStorage` key stay the same.

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

The app uses React, TypeScript, and Vite. `manifest.webmanifest` makes it installable. `sw.js` handles the offline cache.

## Troubleshooting

**My habits are missing on another device.**

There is no sync. Each device and browser has its own copy.

**My habits disappeared after I changed domains.**

Go back to the exact URL where you created them. Browser storage does not move between domains.

**I still see the old version after a deployment.**

Close and reopen the installed app. If that does not work, open the site in Safari and refresh it.
