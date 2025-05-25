# POS React Admin Dashboard – Project Overview

## 1. Purpose

A Point‑of‑Sale (POS) admin dashboard built with **React 19, Vite, TypeScript** and **Material‑UI v6**.  It ships with a modern component library, state‑management via **Redux‑Toolkit**, and is pre‑wired for deployment on **Firebase Hosting**.

---

## 2. Tech Stack

| Layer             | Library / Tool                   | Notes                                   |
| ----------------- | -------------------------------- | --------------------------------------- |
| **Frontend**      | React 19 (RC) + Vite 6           | Hot‑module reload, fast build           |
| Styling           | Material‑UI v6 + Emotion         | RTL support via `stylis-plugin-rtl`     |
| State Management  | Redux‑Toolkit 2 + React‑Redux 9  | Persisted with `redux‑persist`          |
| Forms             | Formik + Yup                     | Re‑usable form controls                 |
| Charts            | ApexCharts + MUI X Charts        | KPI & sales analytics                   |
| Drag & Drop       | `@dnd-kit` + `@hello-pangea/dnd` | Re‑orderable lists and Kanban           |
| Rich Text         | Tiptap Editor                    | Product descriptions, notes             |
| Auth & Deployment | Firebase v11                     | `.firebaserc`, `firebase.json` present  |
| i18n              | i18next + react‑i18next          | EN / AR translations                    |
| Testing           | — (not yet configured)           | Jest/React‑Testing‑Library can be added |

---

## 3. Package.json Scripts

```json
"dev":    "vite",
"build":  "tsc && vite build",
"preview":"vite preview",
"lint":   "eslint --ext ts,tsx ..."
```

> **Node 20+ required** – earlier warnings appear if Node 18 is used.

---

## 4. Directory Structure (high‑level)

```
src/
 ├─ App.tsx              # ThemeProvider + Router wrapper
 ├─ main.tsx             # ReactDOM createRoot
 ├─ assets/              # Static images & SVGs
 ├─ theme/               # MUI palette & shape overrides
 ├─ layouts/             # Full/Blank layouts, AppBar, Sidebar
 ├─ components/          # Reusable UI widgets (Buttons, Cards, LoadingBar)
 ├─ pages/
 │   ├─ dashboard/       # Sales, Inventory, Analytics widgets
 │   ├─ products/        # CRUD tables & dialogs
 │   └─ auth/            # Login / Register
 ├─ routes/Router.tsx    # `react-router v7` nested routes
 ├─ store/               # Redux slices & root store
 ├─ hooks/               # Custom React hooks (auth, media‑query)
 ├─ utils/               # helpers: axios instance, formatters, guards
 └─ types/               # Global TS types & interfaces
```

*(Tree based on repository inspection; we can drill into any path you need.)*

---

## 5. State Management

* Global store in `src/store/Store.ts`
* Feature slices (e.g., `productSlice`, `authSlice`)
* Persistence layer configured to `localStorage` via `redux‑persist`.

---

## 6. Theming & RTL

`ThemeSettings()` centralises palette, typography and component overrides, auto‑switching RTL when the `customizer.direction` flag toggles.

---

## 7. Routing Guards

Route file exports a lazy‑loaded tree.  A simple **AuthGuard** wrapper redirects unauthenticated users to `/auth/login`.

---

## 8. Firebase Hosting

`firebase.json` defines two rewrites:

```json
{"source":"/**","destination":"/index.html"}
```

Run `firebase deploy` after `yarn build` to push the `dist/` folder.

---

## 9. Outstanding Items / Potential Enhancements

1. **Backend API integration** – axios base URL currently points to a mock adapter.
2. **Unit tests** – Jest & RTL not yet configured.
3. **CI/CD** – GitHub Actions workflow missing.
4. **PWA** – Optional (service worker, manifest).

---

## 10. Next Steps Together

1. **Clarify Scope** – Which module do you want to tackle first (e.g., Products CRUD, Sales report, Auth flow)?
2. **Environment Check** – Confirm Node version ≥ 20 and Firebase CLI configured.
3. **Road‑map** – Define sprint tasks; I can generate issue templates and starter PRs.

Let me know which area you’d like to dive into, and I’ll prepare concrete tasks or code samples.
