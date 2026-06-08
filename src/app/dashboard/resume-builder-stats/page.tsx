'use client';

import { useEffect, useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PeriodSelector } from '@/app/dashboard/component/PeriodSelector';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
  FileText,
  Download,
  Save,
  RefreshCw,
  Users,
} from 'lucide-react';

interface Summary {
  opens: number;
  downloads: number;
  saves: number;
  updates: number;
  total: number;
  downloadRate: number;
  saveRate: number;
  uniqueUsers: number;
}

interface DailyTrendRaw {
  _id: { date: string; action: string };
  count: number;
}

interface UserBreakdown {
  _id: string;
  count: number;
}

interface StatsData {
  summary: Summary;
  dailyTrend: DailyTrendRaw[];
  userBreakdown: UserBreakdown[];
}

interface DailyTrendItem {
  date: string;
  open: number;
  download: number;
  save: number;
  update: number;
}

const ACTION_COLORS: Record<string, string> = {
  open: '#3b82f6',
  download: '#10b981',
  save: '#f59e0b',
  update: '#8b5cf6',
};

const PIE_COLORS = ['#3b82f6', '#10b981'];

export default function ResumeBuilderStats() {
  const [days, setDays] = useState(1);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await trpc.stats.getResumeBuilderStats.query({ days });
        setStats(data as StatsData);
      } catch (error) {
        console.error('Failed to fetch resume builder stats:', error);
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

  const { summary, dailyTrend, userBreakdown } = stats;

  // Pivot daily trend: [{date, open, download, save, update}]
  const trendMap: Record<string, DailyTrendItem> = {};
  dailyTrend.forEach((item) => {
    const { date, action } = item._id;
    if (!trendMap[date]) {
      trendMap[date] = { date, open: 0, download: 0, save: 0, update: 0 };
    }
    if (action in trendMap[date]) {
      (trendMap[date] as Record<string, number | string>)[action] = item.count;
    }
  });
  const trendData = Object.values(trendMap).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  // Action distribution bar data
  const actionBarData = [
    { action: 'Opens', count: summary.opens, fill: ACTION_COLORS.open },
    {
      action: 'Downloads',
      count: summary.downloads,
      fill: ACTION_COLORS.download,
    },
    { action: 'Saves', count: summary.saves, fill: ACTION_COLORS.save },
    { action: 'Updates', count: summary.updates, fill: ACTION_COLORS.update },
  ];

  // Funnel data
  const funnelData = [
    { stage: 'Opened', value: summary.opens },
    { stage: 'Saved', value: summary.saves },
    { stage: 'Downloaded', value: summary.downloads },
  ];

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Resume Builder Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">
            Tracks opens, downloads, saves and updates
          </p>
        </div>
        <PeriodSelector value={days} onChange={setDays} />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Opens
            </CardTitle>
            <FileText className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {summary.opens}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {summary.uniqueUsers} unique users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Downloads
            </CardTitle>
            <Download className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {summary.downloads}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {summary.downloadRate}% download rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Saves (New)
            </CardTitle>
            <Save className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {summary.saves}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {summary.saveRate}% save rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Updates
            </CardTitle>
            <RefreshCw className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {summary.updates}
            </div>
            <p className="text-xs text-gray-500 mt-1">Resume edits saved</p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel + User Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Guest vs Authenticated */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="w-4 h-4" />
            <CardTitle>Guest vs Authenticated</CardTitle>
          </CardHeader>
          <CardContent>
            {userBreakdown.length === 0 ? (
              <p className="text-center text-gray-400 py-16 text-sm">
                No data yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={userBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="count"
                    nameKey="_id"
                    label={({ _id, count }) => `${_id}: ${count}`}
                  >
                    {userBreakdown.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {trendData.length === 0 ? (
            <p className="text-center text-gray-400 py-16 text-sm">
              No trend data for this period
            </p>
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
                  dataKey="open"
                  stroke={ACTION_COLORS.open}
                  name="Opens"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="download"
                  stroke={ACTION_COLORS.download}
                  name="Downloads"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="save"
                  stroke={ACTION_COLORS.save}
                  name="Saves"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="update"
                  stroke={ACTION_COLORS.update}
                  name="Updates"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Action Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Action Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={actionBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="action" />
              <YAxis />
              <Tooltip />
              {actionBarData.map((item) => (
                <Bar
                  key={item.action}
                  dataKey="count"
                  data={[item]}
                  fill={item.fill}
                  name={item.action}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
