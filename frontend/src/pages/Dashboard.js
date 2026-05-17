import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { AlertCircle, ArrowUpRight, CheckCircle2, CheckSquare, Clock, LayoutDashboard, TimerReset } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const tasks = await api.getTasks();
      setRecentTasks(tasks.slice(0, 5));

      const total = tasks.length;
      const completed = tasks.filter(t => t.status === 'completed').length;
      const pending = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
      const overdue = tasks.filter(t => {
        const dueDate = new Date(t.dueDate);
        return t.dueDate && dueDate < new Date() && t.status !== 'completed';
      }).length;

      setStats({ totalTasks: total, completedTasks: completed, pendingTasks: pending, overdueTasks: overdue });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-[#fbecee] text-[#B22234] ring-1 ring-[#f0b6bf]';
      case 'in-progress': return 'bg-[#eef2ff] text-[#243a73] ring-1 ring-[#c7d2fe]';
      case 'pending': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200';
      case 'overdue': return 'bg-red-50 text-red-700 ring-1 ring-red-200';
      default: return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 ring-1 ring-red-200';
      case 'medium': return 'bg-orange-50 text-orange-700 ring-1 ring-orange-200';
      case 'low': return 'bg-[#f7f1eb] text-[#6f4e37] ring-1 ring-[#dfcab8]';
      default: return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="panel px-6 py-4 text-sm font-medium text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  const completionRate = stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
  const activeRate = stats.totalTasks ? Math.round((stats.pendingTasks / stats.totalTasks) * 100) : 0;

  const statCards = [
    { label: 'Total tasks', value: stats.totalTasks, icon: CheckSquare, tone: 'bg-[#17213f] text-white', helper: 'All tracked work' },
    { label: 'Completed', value: stats.completedTasks, icon: CheckCircle2, tone: 'bg-[#B22234] text-white', helper: `${completionRate}% completion` },
    { label: 'In progress', value: stats.pendingTasks, icon: Clock, tone: 'bg-[#243a73] text-white', helper: `${activeRate}% currently active` },
    { label: 'Overdue', value: stats.overdueTasks, icon: AlertCircle, tone: 'bg-[#8f1b2a] text-white', helper: 'Needs attention' }
  ];

  return (
    <div className="app-shell">
      <div className="page-container">
        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <div className="page-kicker">
              <LayoutDashboard size={14} />
              Dashboard
            </div>
            <h1 className="section-title">Good to see you, {user?.username || 'there'}.</h1>
            <p className="muted-text mt-2 max-w-2xl">
              Your workspace summary is organized around active delivery, completion, and deadline risk.
            </p>
          </div>
          <div className="panel border-l-4 border-l-[#B22234] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Delivery health</p>
                <p className="muted-text">Completed work ratio</p>
              </div>
              <span className="text-3xl font-bold text-[#B22234]">{completionRate}%</span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-stone-100">
              <div className="h-2 rounded-full bg-[#B22234]" style={{ width: `${completionRate}%` }} />
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="panel p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">{stat.value}</p>
                    <p className="mt-2 text-xs font-medium text-slate-500">{stat.helper}</p>
                  </div>
                  <span className={`flex h-11 w-11 items-center justify-center rounded-md ${stat.tone}`}>
                    <Icon size={20} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="panel overflow-hidden">
            <div className="border-b border-stone-200 bg-stone-50/70 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">Recent tasks</h2>
                  <p className="muted-text">Latest work pulled from your task list.</p>
                </div>
                <ArrowUpRight className="text-slate-400" size={20} />
              </div>
            </div>
            {recentTasks.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <CheckSquare size={42} className="mx-auto text-slate-300" />
                <p className="mt-4 font-medium text-slate-700">No tasks found yet.</p>
                <p className="muted-text">Create your first task to populate the workspace.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentTasks.map((task) => (
                  <div key={task._id} className="px-5 py-4 transition hover:bg-stone-50 sm:px-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-950">{task.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{task.project?.name || 'No project assigned'}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`badge ${getStatusColor(task.status)}`}>{task.status}</span>
                        <span className={`badge ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                      </div>
                    </div>
                    {task.dueDate && (
                      <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                        <TimerReset size={15} />
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel p-5">
            <h2 className="text-lg font-semibold text-slate-950">Focus mix</h2>
            <p className="muted-text mt-1">A quick read on where the workload stands.</p>
            <div className="mt-6 space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">Complete</span>
                  <span className="text-slate-500">{stats.completedTasks}</span>
                </div>
                <div className="h-2 rounded-full bg-stone-100">
                  <div className="h-2 rounded-full bg-[#B22234]" style={{ width: `${completionRate}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">Active</span>
                  <span className="text-slate-500">{stats.pendingTasks}</span>
                </div>
                <div className="h-2 rounded-full bg-stone-100">
                  <div className="h-2 rounded-full bg-[#243a73]" style={{ width: `${activeRate}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">Overdue</span>
                  <span className="text-slate-500">{stats.overdueTasks}</span>
                </div>
                <div className="h-2 rounded-full bg-stone-100">
                  <div
                    className="h-2 rounded-full bg-[#8f1b2a]"
                    style={{ width: `${stats.totalTasks ? Math.round((stats.overdueTasks / stats.totalTasks) * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
