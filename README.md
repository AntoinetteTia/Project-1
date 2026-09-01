# Workout Tracker

A mobile-friendly workout tracking single-page app. No backend, no login —
everything is saved to your browser's `localStorage`.

## Features

- **Log Workout** — record exercises (sets/reps/weight) by date, with a
  quick-select row to pre-fill from a saved template right in the log flow.
  Picking a template that has a warm-up attached surfaces it automatically.
- **History** — past workouts grouped by date, most recent first, with
  edit/delete.
- **Body Weight** — log entries by date, view them as a list and a trend
  line chart, edit/delete past entries.
- **Templates** — reusable routines (e.g. "Push Day") with a saved exercise
  list and an optional attached warm-up/stretch routine.
- **Stretches & Warm-ups** — a visually distinct section for creating and
  managing warm-up/stretch routines (name, description, duration, target
  muscle group) independently of any template.
- **Dashboard** — workouts this week, most-logged exercises, and recent
  activity at a glance.
- **Backup** — export all data as JSON or CSV, and re-import a JSON backup.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (defaults to http://localhost:5173).

## Build

```bash
npm run build
```

Outputs a static build to `dist/`, which can be hosted anywhere (no server
required — it's a static site that reads/writes `localStorage`).

## Tech

React + TypeScript + Vite, plain CSS (no UI framework), and a hand-rolled
inline SVG chart for the body weight trend. All persistence is
`localStorage` — there's no backend.
