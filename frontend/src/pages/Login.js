import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, UserPlus } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="app-shell grid min-h-screen place-items-center px-4 py-10">
      <div className="auth-card lg:grid-cols-[1.05fr_0.95fr]">
        <div className="auth-showcase">
          <div>
            <div className="mb-10 inline-flex rounded-md border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
              Atlas Project Office
            </div>
            <h1 className="max-w-sm text-4xl font-bold tracking-normal">
              Professional project control for focused delivery teams.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
              Coordinate work, deadlines, and team ownership in a mature command center built for daily operations.
            </p>
          </div>
          <div className="grid gap-3 rounded-lg border border-white/10 bg-black/10 p-3">
            {['Live task visibility', 'Project status at a glance', 'Role aware access'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/8 px-4 py-3">
                <CheckCircle2 className="text-[#ffcad0]" size={18} />
                <span className="text-sm font-medium text-slate-100">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#B22234]">Welcome back</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950">Sign in to your workspace</h2>
            <p className="mt-2 text-sm text-slate-500">Use your team credentials to continue.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="field-label">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="field-input pl-11"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="field-input pl-11"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary-button w-full"
            >
              <span>{loading ? 'Signing in...' : 'Sign in'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-7 rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-center text-sm text-slate-600">
            Need an account?{' '}
            <Link to="/signup" className="inline-flex items-center gap-1 font-bold text-[#B22234] hover:text-[#8f1b2a]">
              <UserPlus size={15} />
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
