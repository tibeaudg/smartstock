import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

/**
 * AuthRoute (in-file)
 *
 * Restored original app structure but removed any runtime import/require of a missing './auth' module.
 * This version performs client-side checks (localStorage/sessionStorage/cookies) and falls back to a
 * server-side validation endpoint (/api/auth/me) if available. No import('./auth') or require() is used,
 * so the bundler will not attempt to resolve a non-existent module at build time and the browser will not
 * encounter "require is not defined".
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

/* ---------- Restored app components with working Login UI ---------- */

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
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const mode = params.get('mode') || 'login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || 'Login failed');
      }

      const data = await resp.json();
      // Expect the backend to return { token: string } or { authenticated: true, token }
      const token = data?.token || (data?.authenticated && data?.token) || null;

      if (token) {
        try {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
        } catch {
          // ignore storage errors
        }
      }

      // Redirect to originally requested page or dashboard
      const redirectTo = params.get('redirect') || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>{mode === 'login' ? 'Sign in' : 'Auth'}</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 360 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>
        )}

        <div>
          <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
            {loading ? 'Signing...' : 'Sign in'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ marginLeft: 8, padding: '8px 12px' }}
          >
            Back
          </button>
        </div>
      </form>

      <p style={{ marginTop: 16 }}>
        If your backend uses cookie-based auth only, no token will be returned and the server-side session
        will be used. Make sure /api/auth/login sets a cookie when appropriate.
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