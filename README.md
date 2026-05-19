# 🎬 Movix

SPA de exploración de cine. Datos públicos desde **TMDB**; datos personales
(favoritos, ratings, perfil) en **Supabase**.

## Stack

- **React 19 + Vite 8** (JavaScript, sin TypeScript)
- **React Router v7** — routing y query params para búsqueda/filtros
- **TanStack Query v5** — estado de servidor (cache, infinite scroll, retries)
- **Tailwind CSS v4** + design tokens en `src/styles/variables.css`
- **Supabase** — auth + base de datos personal
- **Vitest + React Testing Library** — tests
- **Gestor de paquetes:** pnpm · **Alias:** `@/` → `src/`

## Comandos

```bash
pnpm dev           # desarrollo (localhost:5173)
pnpm build         # build de producción
pnpm preview       # previsualizar el build
pnpm lint          # ESLint
pnpm format        # Prettier (escribe)
pnpm format:check  # Prettier (solo comprueba)
pnpm test          # tests (Vitest)
```

## Variables de entorno

Copia `.env.example` a `.env.local` y rellena los valores. `.env.local` está
en `.gitignore` y nunca se sube. Toda lectura de `import.meta.env` pasa por
`src/config/env.js`.

## Arquitectura — feature-based (modular)

Cada dominio funcional vive en su carpeta con sus componentes, hooks,
servicios y páginas. Lo reutilizable entre features va a `shared/`.

```
src/
├── api/            # Capa HTTP compartida (tmdb.client.js, supabase.client.js)
├── app/            # Bootstrap: App, Router, providers (Query, Auth)
├── features/       # Dominios: movies, people, favorites, auth
│   └── <feature>/  #   components/ hooks/ pages/ services/ adapters/
├── pages/          # Excepción aceptada: páginas app-level (Welcome, NotFound)
├── shared/         # Reutilizable entre features
│   ├── components/  #   ui/ (primitivos) feedback/ (estados) layout/
│   ├── hooks/ utils/ constants/
├── config/         # env.js (lectura validada de variables de entorno)
└── styles/         # variables.css (tokens @theme) + index.css
```

### Reglas

- Una feature **no** importa de otra feature directamente; lo común va a
  `shared/` (excepción: `auth` para saber si hay sesión).
- `shared/components/ui` solo primitivos sin lógica de negocio.
- `src/pages/` solo para páginas que no pertenecen a ningún dominio.
- Flujo de datos: **endpoint → service → adapter → hook (TanStack Query) →
  componente**. Ningún componente llama a `fetch`/`supabase` directamente.
- Estilos: solo utilidades de Tailwind respaldadas por los tokens de
  `variables.css`. Nunca valores hardcodeados.
- Las carpetas de cada feature se crean cuando su épica empieza (no se
  pre-crean vacías para evitar abstracciones prematuras).

> Guía de trabajo detallada para Claude Code: `CLAUDE.md` (local, no versionado).
