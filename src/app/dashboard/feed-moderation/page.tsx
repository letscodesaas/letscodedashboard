'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Loader2,
  CheckCircle,
  XCircle,
  EyeOff,
  Trash2,
  Flag,
  Clock,
  RefreshCw,
  ThumbsUp,
  Eye,
  Pin,
  PinOff,
  Search,
  UserX,
} from 'lucide-react';
import { toast } from 'sonner';

interface Report {
  userId: string;
  reason: string;
  createdAt: string;
}

interface FeedPost {
  _id: string;
  userId: string;
  userName: string;
  userImage?: string;
  content?: string;
  text?: string;
  body?: string;
  images?: string[];
  mediaUrls?: string[];
  likes?: string[];
  reports?: Report[];
  isApproved: boolean;
  reviewStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  isHidden?: boolean;
  hiddenReason?: string;
  hiddenAt?: string;
  isPinned?: boolean;
  isAnonymous?: boolean;
  createdAt: string;
}

type Tab = 'pending' | 'approved' | 'reported' | 'unavailable' | 'anonymous';
type Action = 'approve' | 'reject' | 'make_unavailable' | 'restore' | 'delete';

function UserAvatar({ name, image }: { name: string; image?: string }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-9 h-9 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0">
      {(name || '?')[0].toUpperCase()}
    </div>
  );
}

function ReasonModal({
  action,
  onConfirm,
  onCancel,
}: {
  action: Action;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState('');

  const config: Record<
    Action,
    { label: string; color: string; placeholder: string }
  > = {
    approve: { label: 'Approve', color: 'bg-green-600', placeholder: '' },
    reject: {
      label: 'Reject Post',
      color: 'bg-red-600',
      placeholder:
        'e.g. Violates community guidelines, inappropriate content...',
    },
    make_unavailable: {
      label: 'Make Unavailable',
      color: 'bg-orange-600',
      placeholder: 'e.g. Under review due to reported content...',
    },
    delete: {
      label: 'Delete Post',
      color: 'bg-red-700',
      placeholder: 'e.g. Severe violation, hate speech, illegal content...',
    },
    restore: { label: 'Restore', color: 'bg-green-600', placeholder: '' },
  };

  const c = config[action];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">{c.label}</h2>
        <p className="text-sm text-gray-500">
          This reason will be visible to the user on their dashboard so they
          understand why action was taken.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={c.placeholder}
          rows={3}
          autoFocus
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!reason.trim()) {
                toast.error('Please enter a reason');
                return;
              }
              onConfirm(reason.trim());
            }}
            className={`px-4 py-2 text-sm rounded-lg text-white font-medium ${c.color} hover:opacity-90`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function PostCard({
  post,
  tab,
  onAction,
  onPin,
}: {
  post: FeedPost;
  tab: Tab;
  onAction: (id: string, action: Action, reason?: string) => Promise<void>;
  onPin: (id: string, pin: boolean) => Promise<void>;
}) {
  const [pendingAction, setPendingAction] = useState<Action | null>(null);
  const [loading, setLoading] = useState<Action | null>(null);
  const [pinLoading, setPinLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const trigger = (action: Action) => {
    if (action === 'approve' || action === 'restore') {
      setLoading(action);
      onAction(post._id, action).finally(() => setLoading(null));
    } else if (action === 'delete') {
      setDeleteConfirm(true);
    } else {
      setPendingAction(action);
    }
  };

  const handleConfirm = async (reason: string) => {
    if (!pendingAction) return;
    const action = pendingAction;
    setPendingAction(null);
    setLoading(action);
    await onAction(post._id, action, reason);
    setLoading(null);
  };

  return (
    <>
      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Delete this post?
                </h2>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDeleteConfirm(false);
                  setPendingAction('delete');
                }}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingAction && pendingAction !== 'approve' && (
        <ReasonModal
          action={pendingAction}
          onConfirm={handleConfirm}
          onCancel={() => setPendingAction(null)}
        />
      )}

      <div className="bg-white rounded-lg border border-gray-100 p-4 space-y-3">
        {/* Author */}
        <div className="flex items-center gap-2.5">
          <UserAvatar name={post.userName} image={post.userImage} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-800">
              {post.userName || 'Unknown'}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
          {post.isAnonymous && (
            <span className="flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full shrink-0">
              <UserX className="w-3 h-3" />
              Anonymous
            </span>
          )}
          {post.isPinned && (
            <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full shrink-0">
              <Pin className="w-3 h-3" />
              Pinned
            </span>
          )}
          {tab === 'reported' && (
            <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full shrink-0">
              <Flag className="w-3 h-3" />
              {post.reports?.length ?? 0} report
              {(post.reports?.length ?? 0) !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Content */}
        {post.content || post.text || post.body ? (
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {post.content || post.text || post.body}
          </p>
        ) : (
          <p className="text-xs text-gray-400 italic">(no text content)</p>
        )}

        {/* Images */}
        {(() => {
          const imgs = [...(post.images ?? []), ...(post.mediaUrls ?? [])];
          return imgs.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {imgs.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className="h-28 rounded-lg object-cover border border-gray-100"
                />
              ))}
            </div>
          ) : null;
        })()}

        {/* Hidden reason (unavailable tab) */}
        {tab === 'unavailable' && post.hiddenReason && (
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">
              Reason Made Unavailable
            </p>
            <p className="text-xs text-orange-700">{post.hiddenReason}</p>
            {post.hiddenAt && (
              <p className="text-xs text-orange-400 mt-1">
                {new Date(post.hiddenAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Report reasons */}
        {tab === 'reported' && post.reports && post.reports.length > 0 && (
          <div className="bg-red-50 rounded-lg p-3 space-y-1">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">
              Report Reasons
            </p>
            {post.reports.map((r, i) => (
              <p key={i} className="text-xs text-red-700">
                • {r.reason || 'No reason given'}
              </p>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1 flex-wrap">
          {tab === 'pending' && (
            <>
              <button
                onClick={() => trigger('approve')}
                disabled={!!loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-semibold hover:bg-green-100 transition-colors disabled:opacity-50"
              >
                {loading === 'approve' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5" />
                )}
                Approve
              </button>
              <button
                onClick={() => trigger('reject')}
                disabled={!!loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {loading === 'reject' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                Reject
              </button>
            </>
          )}

          {tab === 'unavailable' && (
            <>
              <button
                onClick={() => trigger('restore')}
                disabled={!!loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-semibold hover:bg-green-100 transition-colors disabled:opacity-50"
              >
                {loading === 'restore' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
                Make Available
              </button>
              <button
                onClick={() => trigger('delete')}
                disabled={!!loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {loading === 'delete' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Delete
              </button>
            </>
          )}

          {(tab === 'reported' || tab === 'approved') && (
            <>
              {tab === 'approved' && (
                <button
                  onClick={async () => {
                    setPinLoading(true);
                    await onPin(post._id, !post.isPinned);
                    setPinLoading(false);
                  }}
                  disabled={pinLoading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors disabled:opacity-50 ${
                    post.isPinned
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {pinLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : post.isPinned ? (
                    <PinOff className="w-3.5 h-3.5" />
                  ) : (
                    <Pin className="w-3.5 h-3.5" />
                  )}
                  {post.isPinned ? 'Unpin' : 'Pin'}
                </button>
              )}
              {tab === 'reported' && (
                <button
                  onClick={() => trigger('approve')}
                  disabled={!!loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs font-semibold hover:bg-green-100 transition-colors disabled:opacity-50"
                >
                  {loading === 'approve' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )}
                  Keep (Dismiss Reports)
                </button>
              )}
              <button
                onClick={() => trigger('make_unavailable')}
                disabled={!!loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold hover:bg-orange-100 transition-colors disabled:opacity-50"
              >
                {loading === 'make_unavailable' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
                Make Unavailable
              </button>
              <button
                onClick={() => trigger('delete')}
                disabled={!!loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {loading === 'delete' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function BulkRejectForm({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState('');
  return (
    <div className="space-y-4">
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="e.g. Violates community guidelines..."
        rows={3}
        autoFocus
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (!reason.trim()) {
              toast.error('Please enter a reason');
              return;
            }
            onConfirm(reason.trim());
          }}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Rejecting...' : 'Reject all'}
        </button>
      </div>
    </div>
  );
}

function endpointFor(t: Tab) {
  if (t === 'pending') return '/api/admin/feed/pending';
  if (t === 'approved') return '/api/admin/feed/approved';
  if (t === 'unavailable') return '/api/admin/feed/unavailable';
  if (t === 'anonymous') return '/api/admin/feed/anonymous';
  return '/api/admin/feed/reported';
}

export default function FeedModerationPage() {
  const [tab, setTab] = useState<Tab>('pending');
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    reported: 0,
    unavailable: 0,
    anonymous: 0,
  });
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkRejectModal, setBulkRejectModal] = useState(false);

  const fetchCounts = useCallback(async () => {
    try {
      const [p, a, r, u, an] = await Promise.all([
        fetch('/api/admin/feed/pending').then((r) => r.json()),
        fetch('/api/admin/feed/approved').then((r) => r.json()),
        fetch('/api/admin/feed/reported').then((r) => r.json()),
        fetch('/api/admin/feed/unavailable').then((r) => r.json()),
        fetch('/api/admin/feed/anonymous').then((r) => r.json()),
      ]);
      setCounts({
        pending: p.total ?? p.posts?.length ?? 0,
        approved: a.total ?? a.posts?.length ?? 0,
        reported: r.total ?? r.posts?.length ?? 0,
        unavailable: u.total ?? u.posts?.length ?? 0,
        anonymous: an.total ?? an.posts?.length ?? 0,
      });
    } catch {}
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setSelected(new Set());
    try {
      const res = await fetch(endpointFor(tab));
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts ?? []);
        setTotal(data.total ?? data.posts?.length ?? 0);
        setCounts((prev) => ({
          ...prev,
          [tab]: data.total ?? data.posts?.length ?? 0,
        }));
      } else toast.error(data.message ?? 'Failed to load posts');
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await fetch(`${endpointFor(tab)}?skip=${posts.length}`);
      const data = await res.json();
      if (data.success) setPosts((prev) => [...prev, ...(data.posts ?? [])]);
    } catch {
      toast.error('Network error');
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);
  useEffect(() => {
    fetchPosts();
    setSearch('');
  }, [fetchPosts]);

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const toggleSelectAll = () =>
    setSelected((prev) =>
      prev.size === posts.length ? new Set() : new Set(posts.map((p) => p._id))
    );

  const handleBulkAction = async (
    action: 'approve' | 'reject',
    reason?: string
  ) => {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      const res = await fetch('/api/admin/feed/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected), action, reason }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          `${data.updated} post${data.updated !== 1 ? 's' : ''} ${action === 'approve' ? 'approved' : 'rejected'}`
        );
        setPosts((prev) => prev.filter((p) => !selected.has(p._id)));
        setCounts((prev) => ({
          ...prev,
          [tab]: Math.max(0, prev[tab] - selected.size),
        }));
        setSelected(new Set());
      } else {
        toast.error(data.message ?? 'Bulk action failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setBulkLoading(false);
      setBulkRejectModal(false);
    }
  };

  const handlePin = async (id: string, pin: boolean) => {
    try {
      const res = await fetch(`/api/admin/feed/posts/${id}/pin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(pin ? 'Post pinned to top of feed' : 'Post unpinned');
        setPosts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isPinned: pin } : p))
        );
      } else {
        toast.error(data.message ?? 'Failed to update pin');
      }
    } catch {
      toast.error('Network error');
    }
  };

  const handleAction = async (id: string, action: Action, reason?: string) => {
    try {
      const res = await fetch(`/api/feed/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      });
      const data = await res.json();
      if (data.success) {
        const labels: Record<Action, string> = {
          approve: 'approved',
          reject: 'rejected',
          make_unavailable: 'made unavailable',
          restore: 'restored and made available',
          delete: 'deleted',
        };
        toast.success(`Post ${labels[action]}`);
        setPosts((prev) => prev.filter((p) => p._id !== id));
        setTotal((prev) => Math.max(0, prev - 1));
        setCounts((prev) => ({ ...prev, [tab]: Math.max(0, prev[tab] - 1) }));
      } else {
        toast.error(data.message ?? 'Action failed');
      }
    } catch {
      toast.error('Network error');
    }
  };

  const q = search.trim().toLowerCase();
  const filtered =
    (tab === 'approved' || tab === 'reported' || tab === 'anonymous') && q
      ? posts.filter(
          (p) =>
            (p.userName ?? '').toLowerCase().includes(q) ||
            (p.content ?? p.text ?? p.body ?? '').toLowerCase().includes(q)
        )
      : posts;
  const sorted =
    tab === 'approved'
      ? [...filtered].sort(
          (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
        )
      : filtered;

  return (
    <div className="w-full p-6 space-y-6">
      {/* Bulk reject modal */}
      {bulkRejectModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              Reject {selected.size} posts
            </h2>
            <p className="text-sm text-gray-500">
              This reason will be visible to all selected users.
            </p>
            <BulkRejectForm
              onConfirm={(reason) => handleBulkAction('reject', reason)}
              onCancel={() => setBulkRejectModal(false)}
              loading={bulkLoading}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feed Moderation</h1>
          <p className="text-gray-500 text-sm mt-1">
            Review user posts and manage reported content
          </p>
        </div>
        <button
          onClick={() => {
            fetchPosts();
            fetchCounts();
          }}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(
          [
            {
              key: 'pending',
              label: 'Pending Approval',
              icon: <Clock className="w-4 h-4" />,
              badgeClass: 'bg-orange-100 text-orange-700',
            },
            {
              key: 'approved',
              label: 'Approved Posts',
              icon: <ThumbsUp className="w-4 h-4" />,
              badgeClass: 'bg-green-100 text-green-700',
            },
            {
              key: 'reported',
              label: 'Reported Posts',
              icon: <Flag className="w-4 h-4" />,
              badgeClass: 'bg-red-100 text-red-700',
            },
            {
              key: 'unavailable',
              label: 'Unavailable',
              icon: <EyeOff className="w-4 h-4" />,
              badgeClass: 'bg-orange-100 text-orange-700',
            },
            {
              key: 'anonymous',
              label: 'Anonymous',
              icon: <UserX className="w-4 h-4" />,
              badgeClass: 'bg-purple-100 text-purple-700',
            },
          ] as const
        ).map(({ key, label, icon, badgeClass }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {icon}
            {label}
            {counts[key] > 0 && (
              <span
                className={`ml-1 text-xs font-bold px-1.5 py-0.5 rounded-full ${badgeClass}`}
              >
                {counts[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search bar (approved + reported + anonymous) */}
      {(tab === 'approved' || tab === 'reported' || tab === 'anonymous') &&
        !loading &&
        posts.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by username or post content..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        )}

      {/* Bulk action bar (pending tab only) */}
      {tab === 'pending' && !loading && posts.length > 0 && (
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5">
          <input
            type="checkbox"
            checked={selected.size === posts.length && posts.length > 0}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded accent-slate-700 cursor-pointer"
          />
          <span className="text-sm text-gray-600">
            {selected.size > 0 ? `${selected.size} selected` : 'Select all'}
          </span>
          {selected.size > 0 && (
            <>
              <div className="h-4 w-px bg-gray-300" />
              <button
                onClick={() => handleBulkAction('approve')}
                disabled={bulkLoading}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {bulkLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5" />
                )}
                Approve all
              </button>
              <button
                onClick={() => setBulkRejectModal(true)}
                disabled={bulkLoading}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject all
              </button>
            </>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          {tab === 'pending' ? (
            <>
              <CheckCircle className="w-10 h-10 text-green-400 mb-3" />
              <p className="font-semibold text-gray-700">All caught up!</p>
              <p className="text-sm text-gray-400 mt-1">
                No posts pending review
              </p>
            </>
          ) : tab === 'approved' ? (
            <>
              <ThumbsUp className="w-10 h-10 text-gray-300 mb-3" />
              <p className="font-semibold text-gray-700">
                No approved posts yet
              </p>
            </>
          ) : tab === 'unavailable' ? (
            <>
              <Eye className="w-10 h-10 text-gray-300 mb-3" />
              <p className="font-semibold text-gray-700">
                No unavailable posts
              </p>
            </>
          ) : tab === 'anonymous' ? (
            <>
              <UserX className="w-10 h-10 text-gray-300 mb-3" />
              <p className="font-semibold text-gray-700">No anonymous posts</p>
              <p className="text-sm text-gray-400 mt-1">
                Posts submitted anonymously will appear here
              </p>
            </>
          ) : (
            <>
              <Flag className="w-10 h-10 text-gray-300 mb-3" />
              <p className="font-semibold text-gray-700">No reported posts</p>
              <p className="text-sm text-gray-400 mt-1">
                Community is behaving well
              </p>
            </>
          )}
        </div>
      ) : sorted.length === 0 && q ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="w-8 h-8 text-gray-300 mb-3" />
          <p className="font-semibold text-gray-600">
            No results for &ldquo;{q}&rdquo;
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sorted.map((post) => (
              <div key={post._id} className="relative">
                {tab === 'pending' && (
                  <input
                    type="checkbox"
                    checked={selected.has(post._id)}
                    onChange={() => toggleSelect(post._id)}
                    className="absolute top-3 right-3 z-10 w-4 h-4 rounded accent-slate-700 cursor-pointer"
                  />
                )}
                <PostCard
                  post={post}
                  tab={tab}
                  onAction={handleAction}
                  onPin={handlePin}
                />
              </div>
            ))}
          </div>

          {posts.length < total && (
            <div className="flex justify-center pt-2">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {loadingMore ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                {loadingMore
                  ? 'Loading...'
                  : `Load more (${total - posts.length} remaining)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
