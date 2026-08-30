# Site Tracker — System Documentation

> **Labor and Attendance Management System**
> A full-stack web application for managing construction site labor, attendance, projects, and users.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture](#3-architecture)
4. [Project Structure](#4-project-structure)
5. [Authentication System](#5-authentication-system)
6. [State Management](#6-state-management)
7. [Routing & Middleware](#7-routing--middleware)
8. [UI System & Design Tokens](#8-ui-system--design-tokens)
9. [API Communication Layer](#9-api-communication-layer)
10. [Security](#10-security)
11. [Environment Configuration](#11-environment-configuration)
12. [Implemented Features](#12-implemented-features)
13. [Planned Features](#13-planned-features-not-yet-implemented)
14. [Git Branch Strategy](#14-git-branch-strategy)

---

## 1. System Overview

Site Tracker is a monorepo-style project with two separate applications:

| App | Directory | Port |
|-----|-----------|------|
| **Frontend** (Next.js) | `site-tracker-web/` | `3000` |
| **Backend** (Node.js REST API) | `site-tracker-backend/` | `5000` |

The system follows a **BFF (Backend-For-Frontend)** pattern. The Next.js frontend acts as its own mini-server, handling authentication cookies, token management, and serving as a secure proxy between the browser and the backend API.

---

## 2. Technology Stack

### Frontend (`site-tracker-web`)

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js App Router | `16.3.2` |
| **Runtime** | React | `19.2.8` |
| **Language** | TypeScript | `^5` |
| **Styling** | Tailwind CSS | `^4` |
| **UI Components** | shadcn/ui + Radix UI | Latest |
| **Icons** | Lucide React | `^1.33.0` |
| **Forms** | React Hook Form | `^7.86.0` |
| **Validation** | Zod | `^4.4.3` |
| **State Management** | Zustand | `^5.0.15` |
| **Toasts** | Sonner | `^2.0.8` |
| **Env Validation** | @t3-oss/env-nextjs | `^0.13.11` |
| **Animations** | tw-animate-css | `^1.4.0` |
| **Fonts** | Inter (Google Fonts) | via next/font |

### Backend (`site-tracker-backend`)

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js |
| **Language** | TypeScript |
| **Framework** | Express.js |
| **ORM** | Prisma |
| **Authentication** | JWT (Access + Refresh Tokens) |
| **API Base URL** | `http://localhost:5000` |

---

## 3. Architecture

### BFF Pattern

`
BROWSER
  No tokens visible — all requests go to Next.js
      |
      v
NEXT.JS SERVER (Port 3000)
  proxy.ts      — route protection middleware
  Server Actions — reads httpOnly cookies, injects Bearer token
  fetchWithAuth  — auto refresh on 401
  Cookies: accessToken (15min) + refreshToken (7 days)
      |
      v
BACKEND API (Port 5000)
  Express + Prisma + JWT validation
`

### Token Lifecycle

`
Login -> Backend returns tokens
      -> Next.js stores in httpOnly cookies

Request -> Next.js injects accessToken in header
        -> 200 OK: return data
        -> 401: try refresh-token
               -> Success: update cookies, retry
               -> Failure: clear cookies, redirect /login?reason=session_expired
`

---

## 4. Project Structure

### Frontend File Tree

`
src/
+-- app/
|   +-- layout.tsx                   Root layout: fetches user, hydrates Zustand
|   +-- globals.css                  Design tokens + global styles
|   +-- (auth)/
|   |   +-- layout.tsx               Centered auth layout
|   |   +-- login/page.tsx
|   |   +-- forgot-password/page.tsx
|   |   +-- reset-password/page.tsx
|   +-- dashboard/
|       +-- layout.tsx               Dashboard shell: Sidebar + Header
|       +-- page.tsx                 Dashboard home (stats placeholder)
|       +-- error.tsx                Error boundary inside layout
|       +-- loading.tsx              Skeleton loader (Suspense)
|       +-- not-found.tsx            404 inside layout
|       +-- [...slug]/page.tsx       Catch-all: triggers not-found
+-- features/
|   +-- auth/
|   |   +-- api/                     Server Actions
|   |   |   +-- login.action.ts
|   |   |   +-- logout.action.ts
|   |   |   +-- forgot-password.action.ts
|   |   |   +-- reset-password.action.ts
|   |   |   +-- get-me.action.ts
|   |   +-- components/
|   |   |   +-- login-form.tsx
|   |   |   +-- forgot-password-form.tsx
|   |   |   +-- reset-password-form.tsx
|   |   +-- schemas/
|   |       +-- auth.schema.ts       Zod schemas
|   +-- dashboard/
|       +-- components/
|       |   +-- sidebar.tsx          Collapsible sidebar
|       |   +-- header.tsx           Sticky header + breadcrumbs
|       |   +-- breadcrumbs.tsx      Dynamic URL breadcrumb trail
|       +-- config/
|           +-- nav.config.ts        NAV_ITEMS + BOTTOM_NAV_ITEMS
+-- components/ui/                   shadcn/ui components
+-- hooks/
|   +-- use-has-permission.ts        RBAC hook
+-- lib/
|   +-- api-client.ts                fetchWithAuth (token + refresh logic)
|   +-- utils.ts                     cn() utility
+-- providers/
|   +-- auth-provider.tsx            Hydrates Zustand from server data
+-- store/
|   +-- auth.store.ts                { user, setUser, logout }
|   +-- ui.store.ts                  { sidebarOpen } persisted to localStorage
+-- types/
|   +-- index.ts                     User, Role, ActionResponse types
+-- env.ts                           Validated env (t3-oss)
+-- proxy.ts                         Next.js middleware
`

---

## 5. Authentication System

### Backend Auth Endpoints

| Method | Endpoint | Payload | Returns |
|--------|----------|---------|---------|
| POST | /api/auth/login | { email, password } | { tokens: { accessToken, refreshToken } } |
| POST | /api/auth/forgot-password | { email } | success message |
| POST | /api/auth/reset-password | { token, newPassword } | success message |
| POST | /api/auth/refresh-token | { refreshToken } | { tokens: { accessToken, refreshToken } } |
| POST | /api/auth/logout | { refreshToken } | success message |
| GET  | /api/auth/me | Bearer token | Full user object with permissions |

### /api/auth/me Response Shape

`json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Thisura Nipun",
    "email": "...",
    "phone": "...",
    "isActive": true,
    "roleId": 3,
    "createdAt": "...",
    "role": {
      "id": 3,
      "name": "Manager",
      "isActive": true,
      "isSystem": false,
      "permissions": [...]
    },
    "permissions": ["users:view"]
  }
}
`

### Zod Validation Schemas

| Schema | Fields | Rules |
|--------|--------|-------|
| loginSchema | email, password | valid email, min 6 chars |
| forgotPasswordSchema | email | valid email |
| resetPasswordSchema | newPassword, confirmPassword | min 6 chars, must match |

---

## 6. State Management

### auth.store.ts (in-memory, NOT persisted)

`	s
{ user: User | null, setUser(user), logout() }
`

### ui.store.ts (persisted to localStorage as "site-tracker-ui")

`	s
{ sidebarOpen: boolean, setSidebarOpen(open), toggleSidebar() }
`

### Server Hydration (no layout shift)

`
Root layout.tsx (Server)
  getMeAction() -> GET /api/auth/me (one call at page load)
    AuthProvider (Client)
      useAuthStore.setState({ user }) -> instant, no flicker
`

Client components then read from the store with zero API calls:

`	s
const user = useAuthStore((state) => state.user);
const canViewUsers = useHasPermission("users:view");
`

---

## 7. Routing & Middleware

### proxy.ts Rules

`
Protected routes: /dashboard, /users
Auth routes:      /login, /register, /forgot-password

No token on protected route  ->  redirect /login?reason=session_expired
Has token on auth route      ->  redirect /dashboard
Otherwise                    ->  pass through
`

---

## 8. UI System & Design Tokens

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| --primary | #2563EB | Buttons, active states |
| --primary-hover | #1D4ED8 | Hover |
| --secondary | #475569 | Secondary text |
| --background | #EEF2F7 | Page background |
| --card | #FFFFFF | Surfaces |
| --foreground | #0F172A | Main text |
| --muted-foreground | #64748B | Subtle text |
| --border | #E2E8F0 | Borders |
| --success | #16A34A | Success |
| --warning | #F59E0B | Warning |
| --destructive | #DC2626 | Error |

**Font**: Inter (400, 500, 600, 700) via next/font/google

---

## 9. API Communication Layer

### fetchWithAuth (lib/api-client.ts)

Used in all Server Actions for authenticated backend calls.

- Reads accessToken from httpOnly cookies
- Sets Authorization: Bearer <token>
- On 401: refreshes token, retries request
- On refresh failure: clears cookies, redirects to login
- Option requireAuth: false for public endpoints

---

## 10. Security

| Measure | Detail |
|---------|--------|
| httpOnly Cookies | Tokens invisible to JS (XSS-safe) |
| SameSite=Lax | CSRF protection |
| accessToken TTL | 15 minutes |
| refreshToken TTL | 7 days |
| Route protection | proxy.ts middleware |
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | camera=(), microphone=(), geolocation=() |
| HSTS | max-age=63072000 (production only) |
| Env validation | Startup crash on missing env vars |
| Zod | Client + server form validation |

---

## 11. Environment Configuration

### Frontend .env.local

`
NEXT_PUBLIC_API_URL=http://localhost:5000
`

Validated by @t3-oss/env-nextjs in src/env.ts at startup.

---

## 12. Implemented Features

### Authentication
- [x] Login with email + password
- [x] Forgot Password (email link)
- [x] Reset Password (token from email)
- [x] JWT httpOnly cookie management
- [x] Auto token refresh on 401
- [x] Secure logout (backend invalidation + cookie clear)
- [x] Session expiry toast on auto-logout

### Dashboard Shell
- [x] Collapsible sidebar (icon-only mode, state persisted)
- [x] Mobile overlay drawer with dark backdrop
- [x] Sticky header with dynamic breadcrumbs
- [x] User avatar + role in sidebar and header dropdown
- [x] Permission-gated navigation items
- [x] Error boundary inside layout
- [x] Loading skeleton (Suspense)
- [x] Custom 404 inside layout
- [x] Catch-all route for unimplemented pages

### Developer Experience
- [x] Type-safe env vars (@t3-oss/env-nextjs)
- [x] Zod + React Hook Form validation
- [x] Zustand global state with server hydration
- [x] useHasPermission() RBAC hook
- [x] fetchWithAuth API client
- [x] Dynamic breadcrumbs (UUID/ID graceful handling)
- [x] HTTP security headers
- [x] shadcn/ui component library

---

## 13. Planned Features (Not Yet Implemented)

### High Priority
- [ ] TanStack Query (data fetching + caching layer)
- [ ] Users Module (CRUD + data table)
- [ ] Projects Module
- [ ] Attendance Module
- [ ] Sites Module

### Medium Priority
- [ ] TanStack Table (sorting, filtering, pagination)
- [ ] E2E Tests (Playwright)
- [ ] Unit Tests (Vitest + React Testing Library)
- [ ] CI/CD (GitHub Actions)
- [ ] Sentry (error monitoring)

### Nice to Have
- [ ] Role-based page guards (redirect on insufficient permissions)
- [ ] Optimistic UI updates
- [ ] Debounced search inputs
- [ ] Settings page (profile edit, password change)

---

## 14. Git Branch Strategy

| Branch | Purpose |
|--------|---------|
| main | Production-ready |
| dev | Main development |
| feature/<name> | New features |
| update/<name> | Improvements |
| fix/<name> | Bug fixes |

Repository: https://github.com/ThisuraNipun/site-tracker-web

---

Last updated: 2026-08-29
