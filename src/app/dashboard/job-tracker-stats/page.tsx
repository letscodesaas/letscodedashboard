'use client';

import React, { useEffect, useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PeriodSelector } from '@/app/dashboard/component/PeriodSelector';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Loader2,
  Briefcase,
  ArrowRightLeft,
  PenLine,
  Trash2,
  Users,
} from 'lucide-react';

interface Summary {
  jobsAdded: number;
  statusChanges: number;
  jobsEdited: number;
  jobsDeleted: number;
  totalEvents: number;
  uniqueUsers: number;
}

interface TransitionItem {
  _id: { from: string; to: string };
  count: number;
}

interface TopUser {
  _id: string;
  name: string;
  jobsAdded: number;
}

interface DailyTrendRaw {
  _id: { date: string; action: string };
  count: number;
}

interface DailyTrendItem {
  date: string;
  job_added: number;
  status_changed: number;
  job_edited: number;
  job_deleted: number;
}

interface StatsData {
  summary: Summary;
  statusTransitions: TransitionItem[];
  dailyTrend: DailyTrendRaw[];
  topUsers: TopUser[];
}

interface UserJob {
  jobId?: string;
  company: string;
  role?: string;
  status: string;
  appliedFrom: string;
  addedAt: string;
}

interface UserPipeline {
  email: string;
  userName: string;
  totalJobs: number;
  jobs: UserJob[];
}

const ACTION_COLORS: Record<string, string> = {
  job_added: '#10b981',
  status_changed: '#3b82f6',
  job_edited: '#f59e0b',
  job_deleted: '#ef4444',
};

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; header: string }> = {
  Applied:    { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   header: 'bg-blue-100' },
  'In Review':{ bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', header: 'bg-orange-100' },
  Interview:  { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', header: 'bg-yellow-100' },
  Offer:      { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  header: 'bg-green-100' },
  Rejected:   { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    header: 'bg-red-100' },
  Withdrawn:  { bg: 'bg-gray-50',   text: 'text-gray-600',   border: 'border-gray-200',   header: 'bg-gray-100' },
  Saved:      { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', header: 'bg-purple-100' },
  Wishlist:   { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', header: 'bg-purple-100' },
};

const STATUS_ORDER = ['Applied', 'In Review', 'Interview', 'Offer', 'Rejected', 'Withdrawn', 'Saved', 'Wishlist'];

function getStatusStyle(status: string) {
  return STATUS_STYLES[status] ?? { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', header: 'bg-slate-100' };
}

function StatusBadge({ status }: { status: string }) {
  const s = getStatusStyle(status);
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}>
      {status}
    </span>
  );
}

function KanbanBoard({ user }: { user: UserPipeline }) {
  const byStatus: Record<string, UserJob[]> = {};
  user.jobs.forEach((job) => {
    const s = job.status || 'Applied';
    if (!byStatus[s]) byStatus[s] = [];
    byStatus[s].push(job);
  });

  const statusKeys = [
    ...STATUS_ORDER.filter((s) => byStatus[s]),
    ...Object.keys(byStatus).filter((s) => !STATUS_ORDER.includes(s)),
  ];

  return (
    <div className="h-full flex flex-col">
      {/* User header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold shrink-0">
          {(user.userName || user.email || '?')[0].toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-base">{user.userName || 'Unknown User'}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <span className="ml-auto text-sm text-gray-500 font-medium">{user.totalJobs} jobs</span>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-3 overflow-x-auto pb-2 flex-1">
        {statusKeys.map((status) => {
          const s = getStatusStyle(status);
          return (
            <div key={status} className={`min-w-[180px] w-[180px] rounded-lg border ${s.border} flex flex-col`}>
              <div className={`px-3 py-2 rounded-t-lg ${s.header}`}>
                <p className={`text-xs font-bold uppercase tracking-wide ${s.text}`}>{status}</p>
                <p className={`text-xl font-bold ${s.text}`}>{byStatus[status].length}</p>
              </div>
              <div className={`p-2 space-y-2 overflow-y-auto flex-1 ${s.bg}`} style={{ maxHeight: 340 }}>
                {byStatus[status].map((job, i) => (
                  <div key={i} className="bg-white rounded-md border border-gray-100 px-3 py-2 shadow-sm">
                    <p className="text-xs font-semibold text-gray-800 truncate">{job.company || '—'}</p>
                    {job.role && <p className="text-xs text-gray-500 truncate mt-0.5">{job.role}</p>}
                    {job.appliedFrom && (
                      <p className="text-xs text-gray-400 mt-1">via {job.appliedFrom}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(job.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  title, value, subtitle, icon, color,
}: {
  title: string; value: number; subtitle: string; icon: React.ReactNode; color: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

export default function JobTrackerStats() {
  const [days, setDays] = useState(1);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [pipeline, setPipeline] = useState<UserPipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [pipelineDays, setPipelineDays] = useState(30);
  const [pipelineLoading, setPipelineLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserPipeline | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await trpc.stats.getJobTrackerStats.query({ days });
        setStats(data as StatsData);
      } catch (error) {
        console.error('Failed to fetch job tracker stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [days]);

  useEffect(() => {
    async function fetchPipeline() {
      try {
        setPipelineLoading(true);
        const data = await trpc.stats.getUserJobPipeline.query({ days: pipelineDays });
        const users = data as UserPipeline[];
        setPipeline(users);
        setSelectedUser(users[0] ?? null);
      } catch (error) {
        console.error('Failed to fetch pipeline:', error);
      } finally {
        setPipelineLoading(false);
      }
    }
    fetchPipeline();
  }, [pipelineDays]);

  const trendMap: Record<string, DailyTrendItem> = {};
  (stats?.dailyTrend ?? []).forEach((item) => {
    const { date, action } = item._id;
    if (!trendMap[date]) {
      trendMap[date] = { date, job_added: 0, status_changed: 0, job_edited: 0, job_deleted: 0 };
    }
    if (action in trendMap[date]) {
      (trendMap[date] as Record<string, number | string>)[action] = item.count;
    }
  });
  const trendData = Object.values(trendMap).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Job Tracker Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">
            Tracks job additions, status changes, edits and deletions
          </p>
        </div>
        <PeriodSelector value={days} onChange={setDays} />
      </div>

      {/* Summary stat cards */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Jobs Added"
            value={stats.summary.jobsAdded}
            subtitle={`${stats.summary.uniqueUsers} unique users`}
            icon={<Briefcase className="w-4 h-4 text-green-500" />}
            color="text-green-600"
          />
          <StatCard
            title="Status Changes"
            value={stats.summary.statusChanges}
            subtitle="Pipeline movements"
            icon={<ArrowRightLeft className="w-4 h-4 text-blue-500" />}
            color="text-blue-600"
          />
          <StatCard
            title="Jobs Edited"
            value={stats.summary.jobsEdited}
            subtitle="Details updated"
            icon={<PenLine className="w-4 h-4 text-yellow-500" />}
            color="text-yellow-600"
          />
          <StatCard
            title="Jobs Deleted"
            value={stats.summary.jobsDeleted}
            subtitle={
              stats.summary.jobsAdded > 0
                ? `${((stats.summary.jobsDeleted / stats.summary.jobsAdded) * 100).toFixed(1)}% deletion rate`
                : 'No jobs added yet'
            }
            icon={<Trash2 className="w-4 h-4 text-red-500" />}
            color="text-red-600"
          />
        </div>
      ) : null}

      {/* User Job Pipelines — split panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              <CardTitle>User Job Pipelines</CardTitle>
              {!pipelineLoading && pipeline.length > 0 && (
                <span className="text-sm text-gray-400 font-normal">({pipeline.length} users)</span>
              )}
            </div>
            <PeriodSelector value={pipelineDays} onChange={setPipelineDays} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {pipelineLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
            </div>
          ) : pipeline.length === 0 ? (
            <p className="text-center text-gray-400 py-20 text-sm">
              No job tracker data for this period
            </p>
          ) : (
            <div className="flex border-t" style={{ minHeight: 420 }}>
              {/* Left: user list */}
              <div className="w-56 shrink-0 border-r overflow-y-auto" style={{ maxHeight: 480 }}>
                {pipeline.map((user) => {
                  const isSelected = selectedUser?.email === user.email;
                  return (
                    <button
                      key={user.email}
                      onClick={() => setSelectedUser(user)}
                      className={`w-full text-left px-4 py-3 border-b flex items-center gap-2.5 transition-colors ${
                        isSelected ? 'bg-slate-900 text-white' : 'hover:bg-gray-50 text-gray-800'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? 'bg-white text-slate-900' : 'bg-slate-800 text-white'
                        }`}
                      >
                        {(user.userName || user.email || '?')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : ''}`}>
                          {user.userName || 'Unknown'}
                        </p>
                        <p className={`text-xs truncate ${isSelected ? 'text-slate-300' : 'text-gray-500'}`}>
                          {user.totalJobs} jobs
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right: kanban board */}
              <div className="flex-1 p-5 overflow-hidden">
                {selectedUser ? (
                  <KanbanBoard user={selectedUser} />
                ) : (
                  <p className="text-center text-gray-400 pt-16 text-sm">Select a user</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Activity Trend */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {trendData.length === 0 ? (
              <p className="text-center text-gray-400 py-16 text-sm">No trend data for this period</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="job_added" stroke={ACTION_COLORS.job_added} name="Added" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="status_changed" stroke={ACTION_COLORS.status_changed} name="Status Changed" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="job_edited" stroke={ACTION_COLORS.job_edited} name="Edited" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="job_deleted" stroke={ACTION_COLORS.job_deleted} name="Deleted" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status Transitions + Top Users */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Status Transitions</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.statusTransitions.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">No transitions yet</p>
              ) : (
                <div className="space-y-2">
                  {stats.statusTransitions.map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-2 text-sm">
                        <StatusBadge status={t._id.from || '—'} />
                        <ArrowRightLeft className="w-3 h-3 text-gray-400" />
                        <StatusBadge status={t._id.to || '—'} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{t.count}×</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Users className="w-4 h-4" />
              <CardTitle>Most Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.topUsers.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">No users yet</p>
              ) : (
                <div className="space-y-2">
                  {stats.topUsers.map((user, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">{user.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{user._id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">{user.jobsAdded}</p>
                        <p className="text-xs text-gray-500">jobs added</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
