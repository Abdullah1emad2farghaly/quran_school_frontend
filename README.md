# Noor Al-Huda — Quran Academy Admin Dashboard

A complete bilingual (Arabic/English, RTL/LTR) admin dashboard for managing a
Quran memorization school: students, parents, teachers, groups & schedules,
attendance, memorization tracking, competitions, subscriptions, collectors,
users/roles, and settings.

Built with **React 19 + Vite + Tailwind CSS**, using **React Router** for
navigation and an **Axios-based API service layer** that currently runs
against realistic in-memory mock data and is structured to be swapped for a
real backend with minimal changes.

## Stack

- React 19 + Vite 7
- Tailwind CSS 3 (custom design tokens — see `tailwind.config.js`)
- React Router v6
- Axios (HTTP client, currently backed by a mock adapter)
- Recharts (dashboard charts)
- lucide-react (icons)

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

```bash
npm run build      # production build to /dist
npm run preview    # preview the production build locally
```

## Project structure

```
src/
  api/
    httpClient.js          axios instance (auth header + error normalization)
    mockAdapter.js          simulated latency/pagination/filtering primitives
    services/                one file per resource (students, teachers, ...)
    index.js                 barrel export of all services
  i18n/
    en.js / ar.js             translation dictionaries (kept in sync key-for-key)
    I18nContext.jsx           language state, dir switching, date/number formatting
  context/
    ToastContext.jsx          success/error toast notifications
    ConfirmContext.jsx        promise-based confirm() dialog for destructive actions
  components/
    common/                   Button, Modal, DataTable, Pagination, Badge, etc.
    layout/                   AppShell, Sidebar, Topbar
    charts/                   small chart wrappers (Recharts)
  pages/
    dashboard/, students/, parents/, teachers/, groups/, attendance/,
    memorization/, competitions/, subscriptions/, collectors/, users/, settings/
  mock/
    seedData.js               connected mock dataset (students↔groups↔teachers↔parents, etc.)
```

## Connecting a real backend

Each file under `src/api/services/` exports plain async functions
(`listStudents`, `createStudent`, `updateGroup`, ...) consumed directly by
pages — there is no leaky abstraction in between. Every function already
contains the intended `httpClient` call, commented into an `if (USE_MOCK)`
branch.

To go live:

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to your backend.
2. Set `VITE_USE_MOCK_API=false`.
3. Implement matching REST endpoints on your backend (the calls already show
   the expected method, path, and payload shape per resource).
4. Remove the mock branch in each service file once verified (optional —
   leaving it in place lets you flip back to demo mode anytime).

Auth: `httpClient.js` reads `localStorage.getItem("auth_token")` and attaches
it as a Bearer token automatically. Wire your login flow to set that key.

## Internationalization & RTL

- Toggle language via the globe icon in the top bar.
- `<html dir>` and `<html lang>` update automatically; Tailwind's `rtl:`
  variant is used for any layout exceptions that don't mirror for free via
  logical properties (`ps-`, `pe-`, `ms-`, `me-`, flex direction, etc.).
- All copy lives in `src/i18n/en.js` and `src/i18n/ar.js` with identical key
  structure — add a new string in both files when extending the UI.
- Numbers, dates, and currency stay LTR-isolated inside RTL contexts via the
  `.nums-ltr` utility class so phone numbers/IDs don't get bidi-reordered.

## Notes on the mock data layer

`src/mock/seedData.js` generates a connected dataset on module load (students
assigned to real groups, groups assigned to real teachers, parents linked to
their children, attendance/memorization/subscription history, competition
registrations, etc.) so every screen has realistic, cross-referenced data
without needing a backend running.
"# quran_school_frontend" 
