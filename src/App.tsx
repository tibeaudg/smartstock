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
 * This implementation avoids any runtime `require(...)` or dynamic import that
 * would make the bundler try to resolve a missing `./auth` module at build time.
 *
 * Strategy:
 * 1. First use a fast client-side check (localStorage / sessionStorage / cookie).
 * 2. If client-side check is inconclusive, optionally call a server endpoint
 *    (/api/auth/me) to verify the session. This fetch is optional and safe:
 *    - If you do not have an endpoint, the code will gracefully fallback and treat
 *      the user as unauthenticated.
 * 3. No require() or import('./auth') is used, so bundlers won't fail when a file
 *    named ./auth is not present.
 *
 * Customize:
 * - If your app uses a different token key, change AUTH_TOKEN_KEY.
 * - If you have a server endpoint to validate sessions, keep /api/auth/me or
 *   change to the correct path.
 */

const AUTH_TOKEN_KEY = 'auth_token'; // adjust if your app uses a different key

function getCookie(name: string) {
  try {
    const match = document.cookie.match(
      new RegExp('(^| )' + name.replace(/([.*+?^=!:${}()|[\]\\/\\])/g, '\\$1') + '=([^;]+)')
    );
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
        // 1) Quick client-side checks
        let token = null;
        try {
          token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
        } catch {
          token = null;
        }

        // Also allow cookie-based session detection (optional)
        const sessionCookie = getCookie('session') || getCookie('connect.sid') || null;

        if (token || sessionCookie) {
          if (mounted) {
            setAuthed(true);
            setReady(true);
          }
          return;
        }

        // 2) Fallback: call server endpoint to validate session (if available).
        //    If you don't have this endpoint, the fetch will likely 404/500 and we'll treat user as unauthenticated.
        try {
          const resp = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
            },
          });

          if (!mounted) return;

          if (resp.ok) {
            // Expect a JSON response like { authenticated: true } or user data
            const json = await resp.json();
            // If the endpoint returns an object/user, treat as authenticated
            const isAuth =
              (typeof json === 'object' && json !== null && (json.authenticated === true || json.user)) ||
              json === true;
            setAuthed(Boolean(isAuth));
            setReady(true);
            return;
          }
          // not ok (401/403/404/etc) => treat as not authenticated
        } catch (err) {
          // network / endpoint not present: silent fallback below
          // eslint-disable-next-line no-console
          console.warn('AuthRoute: session verification failed or endpoint missing', err);
        }

        // 3) Final fallback: treat as unauthenticated
        if (mounted) {
          setAuthed(false);
          setReady(true);
        }
      } catch (err) {
        // Catch-all: ensure we never throw inside the browser render path
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
    // Render a minimal placeholder; replace with spinner if you like.
    return null;
  }

  if (!authed) {
    // Redirect to your auth page. Keep query param if your app expects it.
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