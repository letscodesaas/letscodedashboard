'use client';

import React, { useEffect, useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PeriodSelector } from '@/app/dashboard/component/PeriodSelector';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
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

interface CountItem {
  _id: string;
  count: number;
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
  statusDistribution: CountItem[];
  statusTransitions: TransitionItem[];
  topCompanies: CountItem[];
  appliedFromSources: CountItem[];
  dailyTrend: DailyTrendRaw[];
  topUsers: TopUser[];
}

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
];

const ACTION_COLORS: Record<string, string> = {
  job_added: '#10b981',
  status_changed: '#3b82f6',
  job_edited: '#f59e0b',
  job_deleted: '#ef4444',
};

function EmptyState({
  message = 'No data yet',
  small = false,
}: {
  message?: string;
  small?: boolean;
}) {
  return (
    <p
      className={`text-center text-gray-400 text-sm ${small ? 'py-8' : 'py-16'}`}
    >
      {message}
    </p>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function JobTrackerStats() {
  const [days, setDays] = useState(1);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-500">No data available</p>
      </div>
    );
  }

  const {
    summary,
    statusDistribution,
    statusTransitions,
    topCompanies,
    appliedFromSources,
    dailyTrend,
    topUsers,
  } = stats;

  // Pivot daily trend
  const trendMap: Record<string, DailyTrendItem> = {};
  dailyTrend.forEach((item) => {
    const { date, action } = item._id;
    if (!trendMap[date]) {
      trendMap[date] = {
        date,
        job_added: 0,
        status_changed: 0,
        job_edited: 0,
        job_deleted: 0,
      };
    }
    if (action in trendMap[date]) {
      (trendMap[date] as Record<string, number | string>)[action] = item.count;
    }
  });
  const trendData = Object.values(trendMap).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Job Tracker Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">
            Tracks job additions, status changes, edits and deletions
          </p>
        </div>
        <PeriodSelector value={days} onChange={setDays} />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Jobs Added"
          value={summary.jobsAdded}
          subtitle={`${summary.uniqueUsers} unique users`}
          icon={<Briefcase className="w-4 h-4 text-green-500" />}
          color="text-green-600"
        />
        <StatCard
          title="Status Changes"
          value={summary.statusChanges}
          subtitle="Pipeline movements"
          icon={<ArrowRightLeft className="w-4 h-4 text-blue-500" />}
          color="text-blue-600"
        />
        <StatCard
          title="Jobs Edited"
          value={summary.jobsEdited}
          subtitle="Details updated"
          icon={<PenLine className="w-4 h-4 text-yellow-500" />}
          color="text-yellow-600"
        />
        <StatCard
          title="Jobs Deleted"
          value={summary.jobsDeleted}
          subtitle={
            summary.jobsAdded > 0
              ? `${((summary.jobsDeleted / summary.jobsAdded) * 100).toFixed(1)}% deletion rate`
              : 'No jobs added yet'
          }
          icon={<Trash2 className="w-4 h-4 text-red-500" />}
          color="text-red-600"
        />
      </div>

      {/* Status Distribution + Applied From */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Application Status Distribution">
          {statusDistribution.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="count"
                  nameKey="_id"
                  label={({ _id, count }) => `${_id}: ${count}`}
                >
                  {statusDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Applied From Sources">
          {appliedFromSources.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={appliedFromSources} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="_id" type="category" width={100} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                  name="Jobs"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Top Companies */}
      <ChartCard title="Top Companies Applied To">
        {topCompanies.length === 0 ? (
          <EmptyState small />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topCompanies}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" angle={-30} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
                name="Applications"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Daily Trend */}
      <ChartCard title="Daily Activity Trend">
        {trendData.length === 0 ? (
          <EmptyState message="No trend data for this period" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="job_added"
                stroke={ACTION_COLORS.job_added}
                name="Added"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="status_changed"
                stroke={ACTION_COLORS.status_changed}
                name="Status Changed"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="job_edited"
                stroke={ACTION_COLORS.job_edited}
                name="Edited"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="job_deleted"
                stroke={ACTION_COLORS.job_deleted}
                name="Deleted"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Status Transitions + Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Transitions */}
        <Card>
          <CardHeader>
            <CardTitle>Top Status Transitions</CardTitle>
          </CardHeader>
          <CardContent>
            {statusTransitions.length === 0 ? (
              <EmptyState message="No transitions yet" small />
            ) : (
              <div className="space-y-2">
                {statusTransitions.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">
                        {t._id.from || '—'}
                      </span>
                      <ArrowRightLeft className="w-3 h-3 text-gray-400" />
                      <span className="px-2 py-0.5 bg-blue-50 rounded text-blue-700 font-medium">
                        {t._id.to || '—'}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      {t.count}×
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Active Users */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="w-4 h-4" />
            <CardTitle>Most Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            {topUsers.length === 0 ? (
              <EmptyState message="No users yet" small />
            ) : (
              <div className="space-y-2">
                {topUsers.map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {user.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">{user._id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        {user.jobsAdded}
                      </p>
                      <p className="text-xs text-gray-500">jobs added</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
