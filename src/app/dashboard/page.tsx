/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import StatCard from '@/components/ui/stat';
import { VistorComponent } from '@/components/ui/vistor-chart';

const SOCIAL_PLATFORMS = [
  {
    key: 'telegram',
    label: 'Telegram',
    emoji: '✈️',
    color: 'bg-sky-500',
    metric: (s: any) => s?.members != null ? `${s.members.toLocaleString()} members` : null,
  },
  {
    key: 'discord',
    label: 'Discord',
    emoji: '🎮',
    color: 'bg-indigo-500',
    metric: (s: any) =>
      s?.members != null
        ? `${s.members.toLocaleString()} members · ${s.online} online`
        : null,
  },
  {
    key: 'youtube',
    label: 'YouTube',
    emoji: '▶️',
    color: 'bg-red-500',
    metric: (s: any) =>
      s?.subscribers != null
        ? `${s.subscribers.toLocaleString()} subscribers · ${s.videos} videos`
        : null,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    emoji: '💼',
    color: 'bg-blue-700',
    metric: () => null,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    emoji: '📸',
    color: 'bg-pink-500',
    metric: () => null,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    emoji: '💬',
    color: 'bg-green-500',
    metric: () => null,
  },
];

function DashboardPage() {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [social, setSocial] = React.useState<any>(null);
  const [socialLoading, setSocialLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.data);
        else setError(`${data.message}${data.error ? ` — ${data.error}` : ''}`);
      })
      .catch((err) => setError(`Network error: ${err.message}`))
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    fetch('/api/dashboard/social-stats')
      .then((res) => res.json())
      .then((data) => { if (data.success) setSocial(data.data); })
      .catch(() => {})
      .finally(() => setSocialLoading(false));
  }, []);

  const u = stats?.users;
  const ie = stats?.interviewExperiences;
  const j = stats?.jobs;
  const nl = stats?.newsletter;
  const c = stats?.content;

  return (
    <div className="p-6 space-y-8 bg-gray-100 min-h-screen dark:bg-gray-900 w-full">
      <h1 className="text-center font-bold text-4xl">Analytics Dashboard</h1>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Users */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Users</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={u?.total ?? 0} loading={loading} />
          <StatCard title="Public Profiles" value={u?.publicProfiles ?? 0} loading={loading} />
          <StatCard title="Complete Profiles" value={u?.completeProfiles ?? 0} loading={loading} />
          <StatCard title="Total Profile Views" value={u?.totalProfileViews?.toLocaleString() ?? 0} loading={loading} />
        </div>

        {/* Role Breakdown */}
        {!loading && u?.byRole?.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {u.byRole.map((r: any) => (
              <div
                key={r.role}
                className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col"
              >
                <span className="text-xs text-gray-500 capitalize">{r.role || 'Unknown'}</span>
                <span className="text-xl font-bold text-gray-800">{r.count}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Interview Experiences */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Interview Experiences</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Submissions" value={ie?.total ?? 0} loading={loading} />
          <StatCard title="Pending Approval" value={ie?.pending ?? 0} loading={loading} />
          <StatCard title="Approved" value={ie?.approved ?? 0} loading={loading} />
          <StatCard title="Offer Rate" value={`${ie?.offerRate ?? 0}%`} loading={loading} sub="selected" />
        </div>
      </section>

      {/* Jobs */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Jobs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Jobs" value={j?.total ?? 0} loading={loading} />
          <StatCard title="Active Jobs" value={j?.active ?? 0} loading={loading} />
          <StatCard title="Inactive Jobs" value={j?.inactive ?? 0} loading={loading} />
        </div>
      </section>

      {/* Newsletter & Content */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Newsletter & Content</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Subscribers" value={nl?.subscribers ?? 0} loading={loading} />
          <StatCard title="Newsletters Sent" value={nl?.published ?? 0} loading={loading} />
          <StatCard title="Questions" value={c?.questions ?? 0} loading={loading} />
          <StatCard title="Products" value={c?.products ?? 0} loading={loading} />
        </div>
      </section>

      {/* Social Media */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Social Media</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOCIAL_PLATFORMS.map((platform) => {
            const entry = social?.[platform.key];
            const metric = platform.metric(entry?.stats);
            const isYoutubeNoKey = platform.key === 'youtube' && entry?.needsKey;
            return (
              <a
                key={platform.key}
                href={entry?.url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className={`${platform.color} w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0`}>
                  {platform.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{platform.label}</p>
                  {socialLoading ? (
                    <div className="mt-1 h-4 w-28 animate-pulse rounded bg-gray-200" />
                  ) : metric ? (
                    <p className="text-sm text-gray-500 truncate">{metric}</p>
                  ) : isYoutubeNoKey ? (
                    <p className="text-xs text-amber-500">Add YOUTUBE_API_KEY to .env</p>
                  ) : (
                    <p className="text-xs text-gray-400">Live stats unavailable</p>
                  )}
                </div>
                {metric && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full shrink-0">
                    Live
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </section>

      {/* Visitor Chart */}
      <section>
        <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Visitor Statistics
          </h2>
          <VistorComponent />
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
