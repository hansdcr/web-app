# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR, proxies /api → localhost:8000)
npm run build     # Production build → dist/
npm run preview   # Preview production build
npm run lint      # ESLint
```

No test framework is configured.

## Architecture

React 19 + Vite SPA with i18next (Chinese/English) and React Router v7.

**Entry**: `src/main.jsx` wraps `<App>` with `BrowserRouter`, `AuthProvider`, and i18n init.

**Auth flow**: `src/contexts/AuthContext.jsx` manages login/logout/register state. Tokens are stored in localStorage via `src/utils/storage.js`. The HTTP client (`src/services/api/client.js`) injects the Bearer token on every request and auto-logouts on 401.

**API layer** (`src/services/api/`):
- `config.js` — hardcoded base URLs: backend at `http://localhost:8000`, three agent microservices at ports 9001–9003
- `client.js` — `HttpClient` class with request/response interceptors
- `authService.js`, `userService.js`, `agentService.js` — thin wrappers over the client

**Agent microservices** (chat targets, defined in `config.js`):
- `agent_libai` → `localhost:9001`
- `agent_dufu` → `localhost:9002`
- `agent_baijuyi` → `localhost:9003`

**Routes**: `/login`, `/register`, `/home`, `/chat`, `/discover`, `/contacts`, `/create`

**localStorage keys**: `auth_token`, `refresh_token`, `user_info`, `auth_type` (`'user'`|`'agent'`), `agent_identity`, `current_friend_id`

The app supports two login modes: regular user and agent (AI persona). `auth_type` in storage determines which mode is active.
