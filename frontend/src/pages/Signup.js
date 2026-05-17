import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, LockKeyhole, LogIn, Mail, Shield, User, UserPlus } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'member'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
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

    const result = await signup(formData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="app-shell grid min-h-screen place-items-center px-4 py-10">
      <div className="auth-card lg:grid-cols-[0.95fr_1.05fr]">
        <div className="auth-showcase">
          <div>
            <div className="mb-10 inline-flex rounded-md border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
              New workspace
            </div>
            <h1 className="max-w-sm text-4xl font-bold tracking-normal">
              Set up a composed command center for your delivery team.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
              Create an account and start managing projects, priorities, and ownership from one professional workspace.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">Designed for</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <span>Operations</span>
              <span>Product</span>
              <span>Engineering</span>
              <span>Delivery</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#B22234]">Get started</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950">Create your account</h2>
            <p className="mt-2 text-sm text-slate-500">Set up access for your team workspace.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="field-label">Username</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="field-input pl-11"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="field-label">Role</label>
              <div className="relative">
                <Shield className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="field-input pl-11"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="primary-button w-full"
            >
              <UserPlus size={18} />
              <span>{loading ? 'Creating account...' : 'Create account'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-7 rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="inline-flex items-center gap-1 font-bold text-[#B22234] hover:text-[#8f1b2a]">
              <LogIn size={15} />
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
