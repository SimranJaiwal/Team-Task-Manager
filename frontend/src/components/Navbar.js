import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FolderKanban, CheckSquare, Briefcase } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-stone-300 bg-[#17213f] text-white shadow-lg shadow-stone-900/10">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 rounded-md pr-2 text-left"
            aria-label="Go to dashboard"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#B22234] text-white shadow-sm">
              <Briefcase size={19} />
            </span>
            <span>
              <span className="block text-base font-bold tracking-normal text-white">Atlas Project Office</span>
              <span className="block text-xs font-bold uppercase tracking-[0.16em] text-stone-300">Delivery suite</span>
            </span>
          </button>

          <div className="flex rounded-md border border-white/10 bg-white/5 p-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex h-9 items-center gap-2 rounded px-3 text-sm font-semibold transition ${
                    active
                      ? 'bg-white text-[#17213f] shadow-sm'
                      : 'text-stone-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={17} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <div className="min-w-0 text-sm">
            <p className="truncate font-semibold text-white">{user?.username}</p>
            <p className="capitalize text-stone-300">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 text-sm font-bold text-white transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-white/10"
          >
            <LogOut size={17} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
