# STUDY ROOM — Course Enrollment Website

Modern, responsive website for SSC / HSC / Medical & Engineering admission courses.

**Features**
- Fully responsive (PC + Mobile)
- 3D firefly particles that follow mouse (PC) / finger (Mobile)
- Premium Enroll & Course Details dialogs
- Telegram bot integration: **@STUDY_ROOM_MY_bot**
- Admin panel at `/admin` (password protected)
- Dark / Light theme

## Admin Panel
- URL: `/admin`
- Default password: `studyroom2026`
- Change password in `src/routes/admin.tsx` (`ADMIN_PASS`)

Admin can edit course titles, fees, schedules, faculty. Data saves to browser localStorage.

## Telegram
Enrollments open Telegram chat with **@STUDY_ROOM_MY_bot** and pre-filled student details. Just press Send.

## Local Development
```sh
npm install
npm run dev
```

## Deploy to Cloudflare Pages (Free)

1. Push this project to a GitHub repository.
2. Go to [Cloudflare Dashboard → Pages](https://dash.cloudflare.com) → Create project → Connect to Git.
3. Build settings:
   - **Framework preset**: None / Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist` (or whatever Nitro outputs — check after first build)
4. Deploy.

Alternatively with Wrangler:
```sh
npm run build
npx wrangler pages deploy dist
```

## Change Telegram bot
Edit `src/lib/courses.ts`:
```ts
export const TELEGRAM_USERNAME = "STUDY_ROOM_MY_bot";
```

## Tech
- React 19 + TanStack Start / Router
- Tailwind CSS 4
- Three.js / React Three Fiber (3D hero)
- Framer Motion
- Radix UI
