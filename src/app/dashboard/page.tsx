/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import StatCard from '@/components/ui/stat';
import { Pencil, Check, X } from 'lucide-react';

const SOCIAL_PLATFORMS = [
  {
    key: 'telegram',
    label: 'Telegram',
    url: 'https://t.me/offcampusjobsupdatess',
    emoji: '✈️',
    color: 'bg-sky-500',
    live: true,
    defaultLabel: 'members',
  },
  {
    key: 'discord',
    label: 'Discord',
    url: 'https://discord.gg/XRBheB9QF9',
    emoji: '🎮',
    color: 'bg-indigo-500',
    live: true,
    defaultLabel: 'members',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    url: 'https://www.youtube.com/@letscodewithavinash',
    emoji: '▶️',
    color: 'bg-red-500',
    live: false,
    defaultLabel: 'subscribers',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/company/lets-code-forever/',
    emoji: '💼',
    color: 'bg-blue-700',
    live: false,
    defaultLabel: 'followers',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/lets__code/',
    emoji: '📸',
    color: 'bg-pink-500',
    live: false,
    defaultLabel: 'followers',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    url: 'https://whatsapp.com/channel/0029Va9IblC7dmecjzkkn811',
    emoji: '💬',
    color: 'bg-green-500',
    live: false,
    defaultLabel: 'members',
  },
];

function SocialCard({
  platform,
  entry,
  loading,
  onSaved,
}: {
  platform: (typeof SOCIAL_PLATFORMS)[0];
  entry: any;
  loading: boolean;
  onSaved: () => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [inputCount, setInputCount] = React.useState('');
  const [inputLabel, setInputLabel] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const liveStats = entry?.stats;
  const manualStats = entry?.manual;

  const displayCount = platform.live
    ? (liveStats?.members ?? null)
    : (manualStats?.count ?? null);
  const displayLabel = platform.live
    ? platform.key === 'discord'
      ? `members · ${liveStats?.online ?? 0} online`
      : 'members'
    : (manualStats?.label ?? platform.defaultLabel);

  const startEdit = () => {
    setInputCount(String(manualStats?.count ?? ''));
    setInputLabel(manualStats?.label ?? platform.defaultLabel);
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await fetch('/api/dashboard/social-stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: platform.key,
          count: Number(inputCount),
          label: inputLabel,
        }),
      });
      setEditing(false);
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
      <a href={platform.url} target="_blank" rel="noopener noreferrer">
        <div
          className={`${platform.color} w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 hover:opacity-80 transition-opacity`}
        >
          {platform.emoji}
        </div>
      </a>

      <div className="flex-1 min-w-0">
        <a
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gray-800 hover:underline"
        >
          {platform.label}
        </a>

        {loading ? (
          <div className="mt-1 h-4 w-28 animate-pulse rounded bg-gray-200" />
        ) : editing ? (
          <div className="mt-1 flex items-center gap-1">
            <input
              type="number"
              value={inputCount}
              onChange={(e) => setInputCount(e.target.value)}
              placeholder="Count"
              className="w-24 border rounded px-2 py-0.5 text-sm"
              autoFocus
            />
            <input
              type="text"
              value={inputLabel}
              onChange={(e) => setInputLabel(e.target.value)}
              placeholder="label"
              className="w-24 border rounded px-2 py-0.5 text-sm"
            />
            <button
              onClick={save}
              disabled={saving}
              className="text-green-600 hover:text-green-700 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : displayCount != null ? (
          <p className="text-sm text-gray-500 truncate">
            {Number(displayCount).toLocaleString()} {displayLabel}
          </p>
        ) : (
          <p className="text-xs text-gray-400">No stats yet</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {platform.live && liveStats ? (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            Live
          </span>
        ) : !platform.live && !editing ? (
          <button
            onClick={startEdit}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Edit stats"
          >
            <Pencil className="w-4 h-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function DashboardPage() {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [social, setSocial] = React.useState<any>(null);
  const [socialLoading, setSocialLoading] = React.useState(true);

  const fetchStats = () => {
    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.data);
        else setError(`${data.message}${data.error ? ` — ${data.error}` : ''}`);
      })
      .catch((err) => setError(`Network error: ${err.message}`))
      .finally(() => setLoading(false));
  };

  const fetchSocial = () => {
    setSocialLoading(true);
    fetch('/api/dashboard/social-stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSocial(data.data);
      })
      .catch(() => {})
      .finally(() => setSocialLoading(false));
  };

  React.useEffect(() => {
    fetchStats();
    fetchSocial();
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

      {/* Social Media — shown first */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Social Media</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOCIAL_PLATFORMS.map((platform) => (
            <SocialCard
              key={platform.key}
              platform={platform}
              entry={social?.[platform.key]}
              loading={socialLoading}
              onSaved={fetchSocial}
            />
          ))}
        </div>
      </section>

      {/* Users */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Users</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Total Users"
            value={u?.total ?? 0}
            loading={loading}
          />
          <StatCard
            title="Users with Username"
            value={u?.withUsername ?? 0}
            loading={loading}
          />
          <StatCard
            title="Public Profiles"
            value={u?.publicProfiles ?? 0}
            loading={loading}
          />
          <StatCard
            title="Complete Profiles"
            value={u?.completeProfiles ?? 0}
            loading={loading}
          />
          <StatCard
            title="Total Profile Views"
            value={u?.totalProfileViews?.toLocaleString() ?? 0}
            loading={loading}
          />
        </div>
        {!loading && u?.byRole?.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {u.byRole.map((r: any) => (
              <div
                key={r.role}
                className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col"
              >
                <span className="text-xs text-gray-500 capitalize">
                  {r.role || 'Unknown'}
                </span>
                <span className="text-xl font-bold text-gray-800">
                  {r.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Interview Experiences */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Interview Experiences</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Submissions"
            value={ie?.total ?? 0}
            loading={loading}
          />
          <StatCard
            title="Pending Approval"
            value={ie?.pending ?? 0}
            loading={loading}
          />
          <StatCard
            title="Approved"
            value={ie?.approved ?? 0}
            loading={loading}
          />
          <StatCard
            title="Offer Rate"
            value={`${ie?.offerRate ?? 0}%`}
            loading={loading}
            sub="selected"
          />
        </div>
      </section>

      {/* Jobs */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Jobs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Jobs"
            value={j?.total ?? 0}
            loading={loading}
          />
          <StatCard
            title="Active Jobs"
            value={j?.active ?? 0}
            loading={loading}
          />
          <StatCard
            title="Inactive Jobs"
            value={j?.inactive ?? 0}
            loading={loading}
          />
        </div>
      </section>

      {/* Newsletter & Content */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Newsletter & Content</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Subscribers"
            value={nl?.subscribers ?? 0}
            loading={loading}
          />
          <StatCard
            title="Newsletters Sent"
            value={nl?.published ?? 0}
            loading={loading}
          />
          <StatCard
            title="Questions"
            value={c?.questions ?? 0}
            loading={loading}
          />
          <StatCard
            title="Products"
            value={c?.products ?? 0}
            loading={loading}
          />
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
