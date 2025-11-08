import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from 'react-router-dom';

/**
 * AuthRoute (in-file)
 *
 * Prevents any runtime `require(...)` from running in the browser by dynamically
 * importing the auth module only at runtime. This avoids "ReferenceError: require is not defined".
 *
 * Notes:
 * - Adjust the import path ('./auth') below if your auth helper lives elsewhere
 *   (e.g. '../auth' or './lib/auth').
 * - The implementation supports several export shapes:
 *   - named export: export function isAuthenticated() { ... }
 *   - default export function: export default function isAuthenticated() { ... }
 *   - export const isAuthenticated = true|false
 * - If the dynamic import fails (for example the module uses Node-only APIs),
 *   the route treats the user as unauthenticated and redirects to /auth?mode=login.
 */
function AuthRoute({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // IMPORTANT: change this path if your auth module lives somewhere else.
        const mod: any = await import('./auth');

        // Determine the exported "isAuthenticated" thing:
        // - named export isAuthenticated (function or boolean)
        // - default export may be a function or an object with isAuthenticated
        const exportedIsAuth =
          typeof mod.isAuthenticated === 'function'
            ? mod.isAuthenticated
            : mod.default && typeof mod.default.isAuthenticated === 'function'
            ? mod.default.isAuthenticated
            : typeof mod.default === 'function'
            ? mod.default
            : mod.isAuthenticated;

        let result = false;
        if (typeof exportedIsAuth === 'function') {
          // support sync or async functions
          result = Boolean(await exportedIsAuth());
        } else {
          result = Boolean(exportedIsAuth);
        }

        if (mounted) {
          setAuthed(result);
          setReady(true);
        }
      } catch (err) {
        // If import fails, log and fallback to a safe client-only heuristic.
        // eslint-disable-next-line no-console
        console.error('AuthRoute: failed to load auth module', err);

        // Fallback: try a lightweight client-side check so pages that rely on
        // simple tokens still work. Customize this to match your app's auth.
        const token = (() => {
          try {
            return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
          } catch {
            return null;
          }
        })();

        if (mounted) {
          setAuthed(Boolean(token));
          setReady(true);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    // Render nothing while checking auth. You can replace this with a spinner.
    return null;
  }

  if (!authed) {
    // Redirect to login page. Keep the query param used by your app.
    return <Navigate to="/auth?mode=login" replace />;
  }

  return <>{children}</>;
}

/* ---------- Example app components below (replace with your real components) ---------- */

function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Home</h1>
      <p>
        <Link to="/dashboard">Go to dashboard (protected)</Link>
      </p>
      <p>
        <Link to="/auth?mode=login">Sign in</Link>
      </p>
    </div>
  );
}

function Login() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const mode = params.get('mode') || 'login';

  return (
    <div style={{ padding: 24 }}>
      <h1>{mode === 'login' ? 'Sign in' : 'Auth'}</h1>
      <p>This is a placeholder login page. Implement your real login UI here.</p>
      <p>
        After successful sign-in, set localStorage/sessionStorage 'auth_token' (or adapt
        to your auth flow) and navigate to your protected area.
      </p>
      <p>
        <Link to="/">Back home</Link>
      </p>
    </div>
  );
}

function Dashboard() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard (protected)</h1>
      <p>Only visible when authenticated.</p>
      <p>
        <Link to="/">Home</Link>
      </p>
    </div>
  );
}

/* ---------- App + routing ---------- */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth route (login/signup) */}
        <Route path="/auth" element={<Login />} />

        {/* Protected route example — wrap with AuthRoute to prevent runtime require */}
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <Dashboard />
            </AuthRoute>
          }
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}