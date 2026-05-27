# Movix

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8-646cff.svg)](https://vite.dev/)
[![TanStack Query v5](https://img.shields.io/badge/TanStack%20Query-v5-ff4154.svg)](https://tanstack.com/query)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8.svg)](https://tailwindcss.com/)

> A movie exploration SPA with infinite scroll, search, filters, favorites and personal ratings.

Movix is a single-page application for browsing the public TMDB catalog (movies, actors, directors) and keeping a personal area with favorites and 1–10 ratings. Public data comes from [TMDB](https://www.themoviedb.org/), authentication is handled by [Clerk](https://clerk.com/), and personal data lives in [Supabase](https://supabase.com/). The UI is in Spanish; the codebase is in English.

The project is structured in three levels: **(I)** exploration and detail pages, **(II)** favorites and personal ranking, **(III)** authentication and protected personal area.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Routing](#routing)
- [Testing](#testing)
- [Deployment](#deployment)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Background

Movix was built as a learning project to consolidate a modern React stack around three concerns most catalog apps share:

- **Server state** for a third-party REST API (TMDB), including pagination, search and filtering.
- **Authentication** decoupled from the data store (Clerk for identity, Supabase for personal data).
- **Design system discipline**: every visual value lives behind a Tailwind v4 token, and every user-facing string lives in a single JSON copy file.

The architecture is deliberately **feature-based**: each domain (`movies`, `people`, `favorites`, `auth`, `profile`) owns its components, hooks, services and pages. Genuinely cross-cutting code lives under `shared/`. The intent is to keep the cost of adding a new feature constant, regardless of how many already exist.

## Install

### Prerequisites

- **Node.js** 20.19+ or 22.12+ (required by Vite 8)
- **pnpm** 9+ (the project ships a `pnpm-lock.yaml`; using npm or yarn is not supported)
- Accounts and API keys for:
  - **TMDB** — a v4 _Read Access Token_ (not the v3 API key). Get one at <https://www.themoviedb.org/settings/api>.
  - **Clerk** — a publishable key from <https://dashboard.clerk.com/>.
  - **Supabase** — a project URL and anon key from <https://supabase.com/dashboard>.

### Setup

```sh
git clone https://github.com/Adriasu09/movix.git
cd movix
pnpm install
cp .env.example .env.local
```

Then open `.env.local` and fill in the values:

```ini
# TMDB — public movie data
VITE_TMDB_TOKEN=your_tmdb_v4_read_access_token
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Clerk — authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Supabase — personal data (favorites, ratings)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

`.env.local` is gitignored and must never be committed. All reads from `import.meta.env` go through `src/config/envConfig.js`, which throws at startup if a variable is missing.

## Usage

Start the development server:

```sh
pnpm dev
```

The app is served at <http://localhost:5173>.

### Scripts

| Script              | Description                                       |
| ------------------- | ------------------------------------------------- |
| `pnpm dev`          | Start Vite in development mode (HMR enabled).     |
| `pnpm build`        | Production build (output in `dist/`).             |
| `pnpm preview`      | Locally preview the production build.             |
| `pnpm lint`         | Run ESLint over the codebase.                     |
| `pnpm format`       | Format the codebase with Prettier (writes files). |
| `pnpm format:check` | Check formatting without writing.                 |
| `pnpm test`         | Run the test suite in watch mode (Vitest).        |
| `pnpm test:run`     | Run the test suite once (CI mode).                |

### Running a single test

```sh
pnpm test src/features/movies/adapters/tmdbMovie.adapter.test.js
pnpm test -- --reporter=verbose -t "shows empty state"
```

## Project Structure

```
src/
├── api/                  # Shared HTTP layer
│   ├── tmdb.client.js    # fetch wrapper for TMDB (Bearer v4, timeout, abort)
│   └── supabase.client.js
├── app/                  # Application bootstrap
│   ├── App.jsx           # Provider composition
│   ├── Router.jsx        # All routes (React Router v7)
│   └── providers/        # QueryProvider, AuthProvider
├── features/             # Domain modules
│   ├── auth/             # Sign in / sign up (Clerk)
│   ├── movies/           # Exploration, detail, infinite scroll, filters
│   ├── people/           # Actor and director pages
│   ├── favorites/        # Favorites toggle and 1–10 rating
│   └── profile/          # Personal area
├── pages/                # App-level pages (Welcome, NotFound)
├── shared/               # Reusable across features
│   ├── components/       # ui/ (primitives), feedback/, layout/
│   ├── hooks/            # useDebounce, useIntersectionObserver
│   └── utils/            # parseApiError, tmdbImage
├── config/               # envConfig.js, routesConfig.js, copy.json
├── styles/               # variables.css (@theme tokens) + index.css
├── main.jsx              # Entry point
└── setupTests.js         # Vitest + jest-dom setup
```

Each feature folder follows the same internal layout: `components/`, `hooks/`, `pages/`, `services/`, `adapters/`, `test/`.

## Architecture

### Data flow

Every request follows the same five-layer pipeline:

```
endpoint → service → adapter → hook (TanStack Query) → component
```

- **Endpoint** — defined inside the service as a path string.
- **Service** (`features/<feature>/services/`) — calls `tmdbFetch` or `supabase`, forwards `{ signal }`, runs results through an adapter.
- **Adapter** (`features/<feature>/adapters/`) — converts the third-party shape (`poster_path`, `vote_average`) into the internal model (`poster`, `rating`).
- **Hook** (`features/<feature>/hooks/`) — wraps `useQuery`, `useInfiniteQuery` or `useMutation`. Always the only abstraction components consume.
- **Component** — renders `isLoading` / `isError` / `data` explicitly. Components never call `fetch`, `tmdbFetch` or `supabase` directly.

### State management

| Layer               | Tool                                 |
| ------------------- | ------------------------------------ |
| Server state        | TanStack Query v5                    |
| Search & filters    | URL query params (`useSearchParams`) |
| Global client state | Context API (`AuthProvider` only)    |
| Local UI state      | `useState` / `useReducer`            |

Search and filter state lives in the URL, not in React state — this satisfies the "unique URL per view" requirement and makes searches shareable via link.

### Styling

Tailwind CSS v4 with a token-first approach: every color, spacing value, radius and breakpoint comes from `src/styles/variables.css` (`@theme` block). Hardcoded values in JSX or arbitrary Tailwind utilities (`text-[22px]`) are not allowed — extending the design system means adding a token first, then using the generated utility.

Breakpoints:

| Prefix | Width  | Target                           |
| ------ | ------ | -------------------------------- |
| —      | mobile | Default (mobile-first)           |
| `sm:`  | 768px  | Tablet portrait                  |
| `md:`  | 1024px | **Desktop** (primary breakpoint) |
| `lg:`  | 1440px | Large desktop                    |
| `xl:`  | 1920px | Extra large screens              |

### Internationalisation

All user-facing strings live in `src/config/copy.json`. Components import the JSON and render `{copy.section.key}`; literal text in JSX is not allowed.

## Routing

Routes are declared once in `src/app/Router.jsx`, with path constants centralised in `src/config/routesConfig.js`.

| Path          | Page               | Access    |
| ------------- | ------------------ | --------- |
| `/`           | `WelcomePage`      | Public    |
| `/explore`    | `ExplorePage`      | Public    |
| `/movies/:id` | `MovieDetailPage`  | Public    |
| `/people/:id` | `PersonDetailPage` | Public    |
| `/sign-in/*`  | `SignInPage`       | Public    |
| `/sign-up/*`  | `SignUpPage`       | Public    |
| `/favorites`  | `FavoritesPage`    | Protected |
| `/profile`    | `ProfilePage`      | Protected |
| `/404`, `*`   | `NotFoundPage`     | Public    |

Protected routes are wrapped in `<ProtectedRoute>` and redirect unauthenticated users to `/sign-in?from=<current-route>` so they return to the original page after authenticating.

Search and filters are passed as query params, e.g. `/explore?q=batman&genre=28&minRating=8&sort=trending`.

## Testing

- **Stack:** Vitest + React Testing Library + `@testing-library/jest-dom` + jsdom.
- **Location:** tests sit next to source files or inside a `test/` subfolder within each feature.
- **Approach:** test user-visible behavior via roles and accessible names (`getByRole`), not internal state.
- **Mocks:** network is mocked at the `tmdb.client.js` / `supabase.client.js` layer.
- **Scenarios** are written in Gherkin as a comment above each `it`.

```sh
pnpm test          # watch mode
pnpm test:run      # single run (CI)
```

## Deployment

The app is deployed to Vercel. The included `vercel.json` rewrites every path to `index.html` so client-side routing works on refresh:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

To deploy elsewhere (Netlify, GitHub Pages, etc.), reproduce the same SPA fallback to `index.html` and set the environment variables listed in [Install](#install) on the hosting platform.

```sh
pnpm build
pnpm preview      # smoke-test the production build locally
```

## Maintainers

- [@Adriasu09](https://github.com/Adriasu09) — Adriana Suárez

## Contributing

Issues and pull requests are welcome. Please open an issue first to discuss any non-trivial change before sending a PR.

- Branching follows **Git Flow**: `main`, `develop`, `feature/<name>`, `fix/<name>`, `release/x.y.z`.
- PRs target `develop`; `main` is reserved for releases.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`).
- Run `pnpm lint`, `pnpm format:check` and `pnpm test:run` before pushing.
- Every new user-facing string must be added to `src/config/copy.json`; every new visual value must become a token in `src/styles/variables.css`.

## License

UNLICENSED © Adriana Suárez
