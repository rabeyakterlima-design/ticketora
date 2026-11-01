import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/common/BrandLogo';
import { UserRole } from '../../types';
import { Lock, Mail, ArrowRight, Sparkles, Store, Bus, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, loginWithGoogle, loginAs } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    }
  };

  const handleQuickDemoLogin = (role: UserRole, targetPath: string) => {
    loginAs(role);
    navigate(targetPath);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-md">
        <div className="text-center space-y-2">
          <BrandLogo size="lg" className="mx-auto" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to Ticketora
          </h2>
          <p className="text-xs text-slate-500">
            Access your bookings, counter POS, or management dashboard
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Google Federated Identity / Social Sign-In */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-3 shadow-xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.27-2.09 3.645-5.18 3.645-9.15z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.09-6.68-4.91H1.28v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.28C.46 8.19 0 10.03 0 12s.46 3.81 1.28 5.44l4.04-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.28 6.56l4.04 3.15c.94-2.82 3.58-4.96 6.68-4.96z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Or sign in with email
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] text-teal-600 font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Roles Quick Login */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Instant Demo Logins (Click to Evaluate):</span>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('customer', '/dashboard')}
              className="p-2 rounded-xl border border-slate-200 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/50 text-left text-xs flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-600" />
                <span className="font-semibold text-slate-800">Passenger (Anik Sen)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-teal-100 text-teal-800">Customer</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('counter_staff', '/counter')}
              className="p-2 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 text-left text-xs flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-800">Counter Staff (Gabtoli Counter #1)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-blue-100 text-blue-800">POS Terminal</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('operator_admin', '/operator')}
              className="p-2 rounded-xl border border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/50 text-left text-xs flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-amber-600" />
                <span className="font-semibold text-slate-800">Operator Admin (Green Line Paribahan)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-amber-100 text-amber-800">Fleet Portal</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('super_admin', '/admin')}
              className="p-2 rounded-xl border border-slate-200 hover:border-purple-500 bg-slate-50 hover:bg-purple-50/50 text-left text-xs flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-slate-800">Super Admin (Platform Head)</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-purple-100 text-purple-800">Central Admin</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-teal-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
