'use client';

import { useEffect, useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Loader2 } from 'lucide-react';

interface ToolUsageStat {
  _id: string;
  count: number;
  successCount: number;
  avgResponseTime: number;
}

interface SuccessRateStat {
  tool: string;
  total: number;
  success: number;
  successRate: number;
}

interface UsageTrend {
  _id: string;
  count: number;
  successCount: number;
}

interface ActionStat {
  _id: string;
  count: number;
  successCount: number;
}

interface OverallStats {
  totalUsage: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  avgResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  uniqueUsers: number;
}

interface StatsData {
  toolUsageByType: ToolUsageStat[];
  successRateByTool: SuccessRateStat[];
  usageTrends: UsageTrend[];
  actionBreakdown: ActionStat[];
  overallStats: OverallStats;
}

const COLORS = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
];

const TOOL_NAMES: Record<string, string> = {
  resume_optimizer: 'Resume Optimizer',
  cover_letter: 'Cover Letter',
  job_finder: 'Job Finder',
  linkedin_optimizer: 'LinkedIn Optimizer',
  job_ready_score: 'Job Ready Score',
  mock_test: 'Mock Test',
};

export default function AIToolsStats() {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await trpc.stats.getToolUsageStats.query({ days });
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
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

  const overall = stats.overallStats;

  const toolChartData = stats.toolUsageByType.map((item) => ({
    name: TOOL_NAMES[item._id] || item._id,
    value: item.count,
    success: item.successCount,
  }));

  const successRateData = stats.successRateByTool.map((item) => ({
    name: TOOL_NAMES[item.tool] || item.tool,
    rate: item.successRate,
    total: item.total,
  }));

  const trendData = stats.usageTrends.map((item) => ({
    date: item._id,
    usage: item.count,
    success: item.successCount,
  }));

  const actionData = stats.actionBreakdown.map((item) => ({
    action: item._id,
    count: item.count,
    success: item.successCount,
  }));

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Tools Analytics</h1>
        <Select
          value={days.toString()}
          onValueChange={(val) => setDays(parseInt(val))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Today</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overall.totalUsage}</div>
            <p className="text-xs text-gray-500 mt-1">
              {overall.uniqueUsers} unique users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {overall.successRate}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {overall.successCount} successful
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {overall.avgResponseTime}ms
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Max: {overall.maxResponseTime}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Failed Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {overall.failureCount}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {((overall.failureCount / overall.totalUsage) * 100).toFixed(2)}%
              failure rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Tool Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={toolChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Total Usage" />
                <Bar dataKey="success" fill="#10b981" name="Successful" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Success Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Success Rate by Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={successRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="rate" fill="#ef4444" name="Success Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Usage Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Trend Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="usage"
                stroke="#3b82f6"
                name="Total Usage"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="success"
                stroke="#10b981"
                name="Successful"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Action Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Action Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={actionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ action, count }) => `${action}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {actionData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Tool Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.toolUsageByType.map((tool) => (
                <div
                  key={tool._id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-medium">
                      {TOOL_NAMES[tool._id] || tool._id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {tool.count} total uses
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {((tool.successCount / tool.count) * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">
                      Avg: {tool.avgResponseTime.toFixed(0)}ms
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Action Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Action Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-semibold">Action</th>
                  <th className="text-left py-2 px-4 font-semibold">
                    Total Count
                  </th>
                  <th className="text-left py-2 px-4 font-semibold">Success</th>
                  <th className="text-left py-2 px-4 font-semibold">
                    Success Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {actionData.map((action) => (
                  <tr key={action.action} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{action.action}</td>
                    <td className="py-2 px-4">{action.count}</td>
                    <td className="py-2 px-4">{action.success}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`font-semibold ${(action.success / action.count) * 100 >= 90 ? 'text-green-600' : 'text-orange-600'}`}
                      >
                        {((action.success / action.count) * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
