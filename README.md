# Ascent

**Hacklahoma 2026** — A skill learning platform that helps users "Reach New Heights" through structured learning roadmaps (guides) and progress tracking.

---

## What is Ascent?

Ascent is a web application where users follow step-by-step learning roadmaps. Each roadmap is a structured path made of ordered sub-skills or steps—like "Holding the guitar and pick" → "Tuning" → "Basic chords" → "Strumming patterns" for Guitar, or a custom guide you or others create. Built-in skills (e.g., Guitar, Web Development, Photography) and user-created guides are supported, with progress tracking, optional resources, and a timeline of what you’ve completed.

## Why is it useful?

- **Structured learning** — Clear, ordered paths instead of ad-hoc learning so you know what to do next.
- **Progress and timeline** — See what you’ve completed and when, on your profile timeline and in the dashboard.
- **Create and share guides** — Build your own guides, publish them, and share to the feed so others can follow.
- **Learn with others** — Add friends, see who’s on the same path, compete on the leaderboard, and stay motivated.
- **Accessible** — Multilingual (English, Spanish) and responsive on desktop and mobile.

---

## Features

- **Structured learning roadmaps** — Built-in skills and user-created guides with ordered sub-skills and steps
- **Progress tracking** — Mark steps complete, see progress bars, and track skills learned
- **Learning timeline** — Profile timeline of completed skills and guides
- **Achievements and streaks** — Badges and streak tracking for consistency
- **Create, edit, publish, and delete guides** — Full guide lifecycle from your profile
- **Social** — Friends, social feed, and leaderboard
- **Profile, settings, and privacy** — Customize profile and control visibility
- **Internationalization** — English and Spanish
- **Responsive UI** — Themed dashboard (e.g., day/night, mountain theme), mobile-friendly

---

## Tech stack

- **Stack:** React, Node.js, Express, MongoDB (MERN). Docker for MongoDB (and optional full stack).
- **Notable libraries:** Framer Motion, i18next, JWT auth, Mongoose, Axios, React Router.

See [TECH_STACK.md](TECH_STACK.md) for a full breakdown.

---

## Gallery

<img width="1919" height="909" alt="Screenshot 2026-02-20 182208" src="https://github.com/user-attachments/assets/c628934f-2e62-464c-9ec0-a96f3c622fdd" />

<img width="1919" height="910" alt="Screenshot 2026-02-20 183110" src="https://github.com/user-attachments/assets/48cc2331-0fcb-4fff-a41b-4f96c0366797" />

<img width="1919" height="910" alt="Screenshot 2026-02-20 183138" src="https://github.com/user-attachments/assets/3e7f5b37-a92a-431f-bb51-a06e860f8f44" />

<img width="1919" height="910" alt="Screenshot 2026-02-20 183304" src="https://github.com/user-attachments/assets/9e5c3ee1-84a0-44db-8339-aca16e21348d" />

<img width="1919" height="913" alt="Screenshot 2026-02-20 183351" src="https://github.com/user-attachments/assets/7de31777-b443-4ec6-83ce-6a95ba797771" />

---

## Getting started

### Prerequisites

- Node.js and npm
- Docker (for MongoDB)

### Quick start

1. **Recommended:** Follow [LOCAL-DEV-SETUP.md](LOCAL-DEV-SETUP.md) for step-by-step instructions.
2. **One command:** Run `scripts/start-all.bat` (Windows) or `./scripts/start-all.sh` (Mac/Linux) to start MongoDB, backend, and frontend.
3. **TL;DR:** Use Docker only for MongoDB. Run the backend with `npm start` in `backend/` and the frontend with `npm start` in `frontend/`. The frontend proxies API requests to the backend on port 5000.

### One-time setup

```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

---

## Project structure

```
frontend/     # React app (pages, components, services, context)
backend/      # Express API (controllers, routes, models, middlewares)
scripts/      # Start and setup scripts
docs/         # Architecture, API spec, auth flow, Docker setup
```

For details, see [TECH_STACK.md](TECH_STACK.md) and [docs/architecture.md](docs/architecture.md).

---

## Documentation

- [LOCAL-DEV-SETUP.md](LOCAL-DEV-SETUP.md) — Recommended local development setup
- [TECH_STACK.md](TECH_STACK.md) — Full tech stack and architecture
- [docs/](docs/) — Architecture, API spec, auth flow, Docker setup

---

## Acknowledgments

Built for **Hacklahoma 2026**.
