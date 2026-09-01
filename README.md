# Project-1
Good stuff resides here

## Winter Arc

A single-file, local-only habit tracker for a winter self-improvement sprint. Everything — habits, streaks, journal entries, and settings — is stored in your browser's `localStorage`; there is no backend or account.

**Run it:** open `index.html` directly in a browser, or serve the folder locally for the most reliable behavior (some browsers restrict clipboard/storage APIs on `file://` pages):

```
npx serve .
```

Features: onboarding with a custom arc date range and daily habits, a daily checklist with per-habit streaks, a countdown/progress arc toward your end date, stats with a completion-rate chart, a searchable journal with photo attachments, rotating daily motivation, browser reminders (Notifications API) plus a copyable `.ics` calendar reminder, and JSON export for backup.
