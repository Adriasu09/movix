# Flujo de autenticación — Clerk + Supabase

Este documento explica, paso a paso y con diagramas, cómo funciona la
autenticación en Movix. La decisión clave es que **usamos dos proveedores
distintos**:

- **Clerk** = identidad (quién eres). Maneja registro, login, sesiones, JWT.
- **Supabase** = datos personales (qué te pertenece). Guarda favoritos y
  ratings en una tabla con `user_id`.

El "pegamento" entre los dos es un **JWT que Clerk firma** y que **Supabase
valida** antes de devolver datos. Toda la magia está en ese token.

---

## Tabla de contenidos

- [1. Vista de alto nivel](#1-vista-de-alto-nivel)
- [2. Arranque de la app: providers](#2-arranque-de-la-app-providers)
- [3. ¿Por qué dos proveedores y no solo uno?](#3-por-qué-dos-proveedores-y-no-solo-uno)
- [4. Flujo completo: usuario anónimo intenta entrar a /favorites](#4-flujo-completo-usuario-anónimo-intenta-entrar-a-favorites)
- [5. ProtectedRoute: decisión paso a paso](#5-protectedroute-decisión-paso-a-paso)
- [6. Cómo cada petición a Supabase se autentica](#6-cómo-cada-petición-a-supabase-se-autentica)
- [7. Glosario rápido](#7-glosario-rápido)
- [8. Ficheros implicados](#8-ficheros-implicados)

---

## 1. Vista de alto nivel

Antes de los flujos, una foto fija de quién habla con quién:

```mermaid
flowchart LR
    subgraph Browser["🌐 Navegador (React app)"]
        UI["Componentes UI<br/>(MovieCard, FavoriteButton…)"]
        useSession["useSession()<br/><i>fachada</i>"]
        useSupabase["useSupabase()<br/><i>fachada</i>"]
        ClerkSDK["Clerk SDK<br/>(@clerk/clerk-react)"]
        SupaSDK["Supabase SDK<br/>(@supabase/supabase-js)"]
    end

    subgraph Clerk["🔐 Clerk (identidad)"]
        ClerkAuth["Servicio de auth<br/>login / registro / sesión"]
        ClerkJWT["Emisor de JWT<br/>firma tokens con su clave privada"]
    end

    subgraph Supabase["🗄️ Supabase (datos)"]
        SupaAPI["PostgREST API"]
        SupaRLS["Row Level Security<br/>(políticas por user_id)"]
        SupaDB[("Postgres<br/>tabla: favorites")]
    end

    UI --> useSession
    UI --> useSupabase
    useSession --> ClerkSDK
    useSupabase --> ClerkSDK
    useSupabase --> SupaSDK
    ClerkSDK <-->|"login / getToken()"| ClerkAuth
    ClerkAuth --> ClerkJWT
    SupaSDK -->|"request + JWT en header"| SupaAPI
    SupaAPI --> SupaRLS
    SupaRLS --> SupaDB
```

**Lectura rápida:**

- Los componentes **nunca** hablan con Clerk ni con Supabase directamente.
  Pasan siempre por dos hooks-fachada: `useSession()` y `useSupabase()`.
- Clerk firma el JWT con su clave privada. Supabase tiene configurada la
  clave pública de Clerk en su dashboard y por eso confía en esos tokens.
- Las políticas RLS de la tabla `favorites` comparan el `user_id` de cada
  fila con el `sub` (subject) del JWT → un usuario solo ve lo suyo.

---

## 2. Arranque de la app: providers

Cuando la app arranca (`main.jsx` → `App.jsx`), se montan **tres providers
anidados** en este orden exacto:

```mermaid
flowchart TB
    main["main.jsx"] --> App["App.jsx"]
    App --> AuthP["&lt;AuthProvider&gt;<br/>= &lt;ClerkProvider&gt;<br/>+ localización es-ES"]
    AuthP --> QueryP["&lt;QueryProvider&gt;<br/>= &lt;QueryClientProvider&gt;<br/>(TanStack Query)"]
    QueryP --> BR["&lt;BrowserRouter&gt;"]
    BR --> EB["&lt;ErrorBoundary&gt;"]
    EB --> Router["&lt;Router /&gt;<br/>(define todas las rutas)"]

    style AuthP fill:#fef3c7,stroke:#f59e0b
    style QueryP fill:#dbeafe,stroke:#3b82f6
```

¿Por qué **Clerk va el más externo**? Porque tanto el router como cualquier
hook de TanStack Query van a necesitar saber si hay sesión y poder pedir un
token. Si `ClerkProvider` estuviera por dentro, esos hooks fallarían al
arrancar (no encontrarían el contexto de Clerk).

> 📄 Ver: `src/app/App.jsx`, `src/app/providers/AuthProvider.jsx`

---

## 3. ¿Por qué dos proveedores y no solo uno?

Es legítimo preguntárselo — Supabase tiene su propio sistema de auth
(`supabase.auth`). ¿Por qué no usarlo y ahorrarse Clerk?

| Decisión       | Ventaja                                                                |
| -------------- | ---------------------------------------------------------------------- |
| Clerk = auth   | UI de login/registro ya construida y traducida; magic links, 2FA, etc. |
| Supabase = DB  | Postgres real con RLS — perfecto para guardar favoritos por usuario.   |
| **Separación** | Si mañana cambiamos de DB, la identidad sigue intacta (y al revés).    |

El **enlace** entre ambos es el campo `user_id` de la tabla `favorites`:
guarda el `clerkUserId` (un string tipo `user_2abc…`). Las políticas RLS de
Supabase comparan ese campo con el `sub` del JWT que llega en cada request.

---

## 4. Flujo completo: usuario anónimo intenta entrar a `/favorites`

Es el camino "feliz" más largo. Para que sea digerible lo dividimos en
**tres fases independientes** — cada una resuelve un problema concreto:

```mermaid
flowchart LR
    F1["Fase 1<br/>Bloqueo y redirect"] --> F2["Fase 2<br/>Login y vuelta"] --> F3["Fase 3<br/>Carga de favoritos"]
    style F1 fill:#fee2e2,stroke:#ef4444
    style F2 fill:#fef3c7,stroke:#f59e0b
    style F3 fill:#d1fae5,stroke:#10b981
```

---

### Fase 1 — La app bloquea el acceso y redirige al login

```mermaid
sequenceDiagram
    autonumber
    participant U as Usuario
    participant PR as ProtectedRoute
    participant CL as Clerk
    participant SI as SignInPage

    U->>PR: navega a /favorites
    PR->>CL: ¿hay sesión? (useSession)
    CL-->>PR: no
    PR->>SI: Navigate a /sign-in?from=%2Ffavorites
    SI-->>U: muestra formulario de login
```

- `ProtectedRoute` envuelve cada ruta privada y pregunta a Clerk vía
  `useSession()`. Si no hay sesión, redirige.
- El `from=%2Ffavorites` lleva codificada la ruta original (con
  `encodeURIComponent`) para poder volver a ella tras el login.

---

### Fase 2 — El usuario se loguea y Clerk lo devuelve a la ruta original

```mermaid
sequenceDiagram
    autonumber
    participant U as Usuario
    participant CL as Clerk
    participant PR as ProtectedRoute
    participant FP as FavoritesPage

    U->>CL: email + contraseña
    CL->>CL: valida, crea sesión, emite JWT
    CL-->>PR: redirect a /favorites (forceRedirectUrl)
    PR->>CL: ¿hay sesión?
    CL-->>PR: sí, user objeto
    PR->>FP: deja pasar (Outlet)
```

- `SignInPage` le pasa al componente `<SignIn>` de Clerk
  `forceRedirectUrl="/favorites"` (leído del `?from=…`). Clerk se
  encarga solo de volver al sitio original.
- `ProtectedRoute` se vuelve a montar tras el redirect — esta vez
  `useSession` ya devuelve `isSignedIn: true` y `<Outlet />` deja pasar
  a `FavoritesPage`.

---

### Fase 3 — La página carga los favoritos desde Supabase

```mermaid
sequenceDiagram
    autonumber
    participant FP as FavoritesPage
    participant Hook as useFavorites
    participant CL as Clerk
    participant SB as Supabase

    FP->>Hook: useFavorites()
    Hook->>CL: getToken()
    CL-->>Hook: JWT fresco
    Hook->>SB: SELECT favorites + Bearer JWT
    SB->>SB: valida JWT, aplica RLS
    SB-->>Hook: solo las filas del usuario
    Hook-->>FP: lista de favoritos
```

- `useFavorites` → `useSupabase` → cliente Supabase memoizado por
  `userId`. Si cambias de cuenta, se recrea solo.
- El SDK llama a `getToken()` **en cada request** (no una vez al
  arrancar): si Clerk rota el token, la siguiente petición ya lleva
  el nuevo.
- La política RLS de la tabla `favorites` compara
  `auth.jwt() ->> 'sub'` con `favorites.user_id` → el usuario solo ve
  lo suyo, aunque el frontend pidiera todo.

> 📄 Ver: `src/shared/components/layout/ProtectedRoute.jsx`,
> `src/features/auth/pages/SignInPage.jsx`,
> `src/api/useSupabase.js`,
> `src/features/favorites/hooks/useFavorites.js`

---

## 5. `ProtectedRoute`: decisión paso a paso

Esta es la lógica que decide si te deja pasar a una página privada.
Vive en `src/shared/components/layout/ProtectedRoute.jsx` y son **15
líneas**, pero pasa por tres estados que conviene tener claros:

```mermaid
flowchart TD
    Start(["Ruta protegida"]) --> Hook["useSession()"]
    Hook --> Q1{"¿isLoading?"}
    Q1 -->|sí| Load["LoadingState"]
    Q1 -->|no| Q2{"¿isSignedIn?"}
    Q2 -->|no| Redir["Navigate a<br/>/sign-in?from=…"]
    Q2 -->|sí| Out["Outlet<br/>(página privada)"]

    style Load fill:#fef3c7,stroke:#f59e0b
    style Redir fill:#fee2e2,stroke:#ef4444
    style Out fill:#d1fae5,stroke:#10b981
```

**Tres detalles importantes:**

- **`isLoading` no es lo mismo que "no autenticado"**. Cuando Clerk aún no
  ha respondido, no podemos asumir que el usuario no tiene sesión —
  redirigir aquí causaría un parpadeo (loginscreen flash) que se vería
  feo cada vez que recargas una página privada.
- **`replace` en `<Navigate>`** evita que el historial del navegador se
  llene de páginas privadas. Si pulsas "atrás" después de loguearte, no
  vuelves a la pantalla de login; vuelves a donde estabas antes.
- **El `from` se codifica con `encodeURIComponent`** porque puede contener
  `/`, `?`, `&` u otros caracteres que romperían la URL.

---

## 6. Cómo cada petición a Supabase se autentica

Esta es probablemente la parte más "mágica" y la que vale la pena entender
bien. Cada vez que llamas a `supabase.from('favorites').select()` pasa
esto por debajo:

```mermaid
sequenceDiagram
    autonumber
    participant Comp as Componente
    participant Hook as useFavorites
    participant SDK as Supabase SDK
    participant ClerkLib as Clerk en el navegador
    participant SupaAPI as Supabase API
    participant DB as Postgres + RLS

    Comp->>Hook: lee favorites
    Hook->>SDK: from(favorites).select.eq(user_id, userId)

    Note over SDK,ClerkLib: El SDK fue creado con accessToken async getToken
    SDK->>ClerkLib: getToken()
    ClerkLib-->>SDK: JWT fresco (string)

    SDK->>SupaAPI: GET /rest/v1/favorites con Authorization Bearer JWT

    SupaAPI->>SupaAPI: verifica firma del JWT con la clave pública de Clerk
    alt JWT inválido o expirado
        SupaAPI-->>SDK: 401 Unauthorized
    else JWT válido
        SupaAPI->>DB: ejecuta query
        DB->>DB: aplica política RLS - auth.jwt sub igual a favorites.user_id
        DB-->>SupaAPI: filas que pasan el filtro
        SupaAPI-->>SDK: 200 OK + JSON
    end

    SDK-->>Hook: data
    Hook-->>Comp: favorites, isLoading=false
```

**Las dos cosas no obvias:**

1. **`accessToken: async () => getToken()` es la integración nativa
   Clerk↔Supabase.** Antes (pre-abril 2025) había que crear un "JWT
   Template" en Clerk y configurarlo a mano. Ahora basta con pasarle la
   función `getToken` de Clerk al crear el cliente. El SDK la llama **en
   cada request**, así que si Clerk rota el token mientras estás usando
   la app, la siguiente petición ya lleva el token nuevo.

2. **Por eso `useSupabase` memoiza el cliente por `userId`**, no por
   nada más. El `getToken` siempre es el mismo objeto en memoria; lo que
   cambia es a quién devuelve token. Si cambias de cuenta (logout +
   login con otra), `userId` cambia, `useMemo` se recalcula y se crea
   un cliente nuevo. Esto evita que un cliente "viejo" siga devolviendo
   tokens de la cuenta anterior.

> 📄 Ver: `src/api/supabase.client.js`, `src/api/useSupabase.js`

---

## 7. Glosario rápido

| Término             | Qué es                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| **JWT**             | "JSON Web Token". Un string firmado que prueba quién eres sin tener que revalidar contraseña.   |
| **`sub`** del JWT   | "subject" — el ID del usuario dueño del token. En Clerk es el `clerkUserId` (`user_2abc…`).     |
| **RLS**             | "Row Level Security" — políticas SQL que filtran filas según quién pregunta. Vive en Postgres.  |
| **Clave publishable** de Clerk | Clave que va en el frontend. **No** firma tokens; solo identifica la app ante Clerk. |
| **anon key** de Supabase | Clave que va en el frontend. **No** salta RLS; con ella solo ves lo que RLS deje ver.      |
| **Fachada** (hook)  | Hook que envuelve otro SDK para que el resto del código no dependa directamente de él.          |

---

## 8. Ficheros implicados

| Fichero                                                  | Rol                                                                  |
| -------------------------------------------------------- | -------------------------------------------------------------------- |
| `src/app/App.jsx`                                        | Monta los providers en orden.                                        |
| `src/app/providers/AuthProvider.jsx`                     | Envuelve la app con `<ClerkProvider>` y la localización española.    |
| `src/config/envConfig.js`                                | Lee y valida `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_SUPABASE_*`.        |
| `src/features/auth/hooks/useSession.js`                  | Fachada de Clerk → devuelve `{ user, isLoading, isSignedIn }`.       |
| `src/features/auth/pages/SignInPage.jsx`                 | Monta `<SignIn>` de Clerk, lee `?from=...` y configura el redirect.  |
| `src/features/auth/pages/SignUpPage.jsx`                 | Igual pero para registro.                                            |
| `src/shared/components/layout/ProtectedRoute.jsx`        | Decide loading / redirect / outlet.                                  |
| `src/api/supabase.client.js`                             | `createSupabaseClient(getToken)` — cliente con `accessToken` nativo. |
| `src/api/useSupabase.js`                                 | Hook que crea el cliente Supabase memoizado por `userId`.            |
| `src/features/favorites/hooks/useFavorites.js`           | Ejemplo de consumo: TanStack Query + Supabase autenticado.           |
| `src/features/favorites/services/favorites.service.js`   | CRUD puro sobre la tabla `favorites`.                                |
