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
 * Restored original app structure but removed any runtime import/require of a missing './auth' module.
 * This version performs client-side checks (localStorage/sessionStorage/cookies) and falls back to a
 * server-side validation endpoint (/api/auth/me) if available. No import('./auth') or require() is used,
 * so the bundler will not attempt to resolve a non-existent module at build time and the browser will not
 * encounter "require is not defined".
 *
 * Customize:
 * - If you use a different token key, change AUTH_TOKEN_KEY.
 * - If you have an auth verification endpoint, keep or change /api/auth/me accordingly.
 */

const AUTH_TOKEN_KEY = 'auth_token';

function getCookie(name: string) {
  try {
    const re = new RegExp(
      '(^| )' +
        name.replace(/([.*+?^=!:${}()|[\]\\/\\])/g, '\\$1') +
        '=([^;]+)'
    );
    const match = document.cookie.match(re);
    return match ? decodeURIComponent(match[2]) : null;
  } catch {
    return null;
  }
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // 1) Fast client-side checks
        let token: string | null = null;
        try {
          token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
        } catch {
          token = null;
        }

        const sessionCookie = getCookie('session') || getCookie('connect.sid') || null;

        if (token || sessionCookie) {
          if (mounted) {
            setAuthed(true);
            setReady(true);
          }
          return;
        }

        // 2) Optional server-side session verification (safe: if endpoint doesn't exist we fallback)
        try {
          const resp = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include',
            headers: { Accept: 'application/json' },
          });

          if (!mounted) return;

          if (resp.ok) {
            const json = await resp.json();
            const isAuth =
              (typeof json === 'object' && json !== null && (json.authenticated === true || json.user)) ||
              json === true;
            setAuthed(Boolean(isAuth));
            setReady(true);
            return;
          }
          // Non-OK responses => treat as unauthenticated and continue to fallback
        } catch (err) {
          // Endpoint missing or network error — fall through to final fallback
          // eslint-disable-next-line no-console
          console.warn('AuthRoute: session verification failed or endpoint not present', err);
        }

        // 3) Final fallback: not authenticated
        if (mounted) {
          setAuthed(false);
          setReady(true);
        }
      } catch (err) {
        // Ensure no unhandled errors break the app
        // eslint-disable-next-line no-console
        console.error('AuthRoute unexpected error', err);
        if (mounted) {
          setAuthed(false);
          setReady(true);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return null; // you can replace with a spinner
  }

  if (!authed) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return <>{children}</>;
}

/* ---------- Restored app components (unchanged structure) ---------- */

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
        After successful sign-in, set localStorage/sessionStorage 'auth_token' (or adapt to your auth flow)
        and navigate to your protected area.
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

        {/* Protected route example — wrap with AuthRoute */}
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