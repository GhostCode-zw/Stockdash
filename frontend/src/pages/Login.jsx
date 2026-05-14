import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(username, password)
      navigate('/')
    } catch {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-wrapper {
          display: flex;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
        }

        .login-left {
          width: 420px;
          min-height: 100vh;
          background: #0f172a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          flex-shrink: 0;
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .login-brand-icon {
          width: 36px;
          height: 36px;
          background: #3b82f6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.3px;
        }

        .login-left-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 0;
        }

        .login-tagline {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: white;
          line-height: 1.15;
          letter-spacing: -0.5px;
          margin-bottom: 16px;
        }

        .login-tagline span {
          color: #3b82f6;
        }

        .login-subtitle {
          font-size: 15px;
          color: #94a3b8;
          line-height: 1.6;
          font-weight: 300;
        }

        .login-stats {
          display: flex;
          gap: 32px;
        }

        .login-stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: white;
        }

        .login-stat-label {
          font-size: 12px;
          color: #64748b;
          margin-top: 2px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          padding: 48px;
        }

        .login-form-card {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 16px;
          padding: 48px 40px;
          border: 1px solid #e2e8f0;
        }

        .login-form-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
          letter-spacing: -0.3px;
        }

        .login-form-desc {
          font-size: 14px;
          color: #94a3b8;
          margin-bottom: 36px;
        }

        .login-field {
          margin-bottom: 20px;
        }

        .login-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
          letter-spacing: 0.1px;
        }

        .login-input {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #0f172a;
          background: white;
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none;
        }

        .login-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .login-input::placeholder {
          color: #cbd5e1;
        }

        .login-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .login-btn {
          width: 100%;
          padding: 12px;
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          margin-top: 8px;
          letter-spacing: 0.1px;
        }

        .login-btn:hover:not(:disabled) {
          background: #1e293b;
        }

        .login-btn:active:not(:disabled) {
          transform: scale(0.99);
        }

        .login-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right { padding: 24px; background: white; }
          .login-form-card { border: none; padding: 32px 0; box-shadow: none; }
        }
      `}</style>

      <div className="login-wrapper">

        {/* Left Panel */}
        <div className="login-left">
          <div className="login-brand">
            <div className="login-brand-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
                <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.6"/>
                <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.3"/>
              </svg>
            </div>
            <span className="login-brand-name">Stock Dash</span>
          </div>

          <div className="login-left-content">
            <h1 className="login-tagline">
              Inventory<br />
              <span>under control.</span>
            </h1>
            <p className="login-subtitle">
              Real-time stock management for teams that move fast. Track, manage, and report — all in one place.
            </p>
          </div>

          <div className="login-stats">
            <div>
              <div className="login-stat-value">100%</div>
              <div className="login-stat-label">Role-based</div>
            </div>
            <div>
              <div className="login-stat-value">Live</div>
              <div className="login-stat-label">Stock data</div>
            </div>
            <div>
              <div className="login-stat-value">Full</div>
              <div className="login-stat-label">Audit trail</div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right">
          <div className="login-form-card">
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-desc">Sign in to your account to continue</p>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label">Username</label>
                <input
                  className="login-input"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="login-field">
                <label className="login-label">Password</label>
                <input
                  className="login-input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                className="login-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </>
  )
}

export default Login