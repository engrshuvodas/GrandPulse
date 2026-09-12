import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { usePulse } from '../../context/PulseContext';

export default function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, showToast } = usePulse();
  const { login, register } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Full Stack Engineer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register({ username, email, password, role });
        showToast('Registered & Authenticated', `Welcome to GrandPulse, ${username}!`, 'success');
      } else {
        await login(username, password);
        showToast('Logged In', `Authenticated as ${username}`, 'success');
      }
      setIsAuthOpen(false);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userKey) => {
    setLoading(true);
    setError('');
    try {
      await login(userKey, 'password123');
      showToast('Quick Login Successful', `Logged in as ${userKey}`, 'success');
      setIsAuthOpen(false);
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isAuthOpen}
      onClose={() => setIsAuthOpen(false)}
      title={isRegisterMode ? 'Create GrandPulse Account' : 'GrandPulse Authentication'}
      subtitle="JWT-secured sessions for real-time attribution and ledger audits."
    >
      <div className="flex flex-col gap-4">
        {/* Quick Demo Logins Banner */}
        {!isRegisterMode && (
          <div className="p-3 bg-surface-container-lowest rounded-xl border border-surface-container-highest/60">
            <span className="text-xs text-outline font-semibold uppercase tracking-wider block mb-2">
              1-Click Demo Accounts (Pre-Seeded)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('shuvo')}
                className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-surface-container-highest text-left transition-colors"
              >
                <div className="text-xs font-bold text-on-surface">Shuvo Das</div>
                <div className="text-[10px] text-tertiary">Lead Architect</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('monami')}
                className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-surface-container-highest text-left transition-colors"
              >
                <div className="text-xs font-bold text-on-surface">Monami Sadhu</div>
                <div className="text-[10px] text-secondary">Backend Lead</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('setu')}
                className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-surface-container-highest text-left transition-colors"
              >
                <div className="text-xs font-bold text-on-surface">Setu Mondol</div>
                <div className="text-[10px] text-primary">UI/UX Lead</div>
              </button>
            </div>
          </div>
        )}

        {/* Tab selector */}
        <div className="flex border-b border-surface-container-highest">
          <button
            type="button"
            onClick={() => { setIsRegisterMode(false); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-colors ${
              !isRegisterMode
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-outline hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegisterMode(true); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold border-b-2 transition-colors ${
              isRegisterMode
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-outline hover:text-on-surface'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-error-container/40 border border-error/30 text-error text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">
              Username *
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. shuvo"
              className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface placeholder-outline font-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {isRegisterMode && (
            <>
              <div>
                <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@grandpulse.dev"
                  className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface placeholder-outline font-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">
                  Role Description
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Full Stack Architect"
                  className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface placeholder-outline font-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-on-surface placeholder-outline font-body-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-highest/50 mt-2">
            <button
              type="button"
              onClick={() => setIsAuthOpen(false)}
              className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isRegisterMode ? 'how_to_reg' : 'login'}
              </span>
              <span>{loading ? 'Authenticating...' : isRegisterMode ? 'Create Account' : 'Sign In'}</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
