/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { DB } from '@/utils/db';
import { SocialStats } from '@/models/SocialStats.model';

DB();

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function fetchTelegram(): Promise<{ members: number } | null> {
  try {
    const res = await fetch('https://t.me/offcampusjobsupdatess', {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(7000),
    });
    const html = await res.text();
    // Use indexOf to locate "subscribers" — no regex backtracking risk.
    // Then slice a small fixed window before it and extract digits.
    const idx = html.toLowerCase().indexOf('subscribers');
    if (idx === -1) return null;
    const window = html.slice(Math.max(0, idx - 30), idx);
    const numStr = window.match(/[\d][0-9\s,]*/);
    if (!numStr) return null;
    return { members: parseInt(numStr[0].replace(/[\s,]/g, ''), 10) };
  } catch {
    return null;
  }
}

async function fetchDiscord(): Promise<{
  members: number;
  online: number;
} | null> {
  try {
    const res = await fetch(
      'https://discord.com/api/v9/invites/XRBheB9QF9?with_counts=true',
      { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(7000) }
    );
    const data = await res.json();
    if (!data.approximate_member_count) return null;
    return {
      members: data.approximate_member_count,
      online: data.approximate_presence_count ?? 0,
    };
  } catch {
    return null;
  }
}

// GET — returns live stats + manual stats from DB
export const GET = async () => {
  const [telegram, discord, manualStats] = await Promise.all([
    fetchTelegram(),
    fetchDiscord(),
    SocialStats.find({}).lean(),
  ]);

  const manual: Record<string, any> = {};
  for (const s of manualStats as any[]) {
    manual[s.platform] = { count: s.count, label: s.label };
  }

  return NextResponse.json({
    success: true,
    data: {
      telegram: { live: true, stats: telegram },
      discord: { live: true, stats: discord },
      youtube: { live: false, manual: manual.youtube ?? null },
      linkedin: { live: false, manual: manual.linkedin ?? null },
      instagram: { live: false, manual: manual.instagram ?? null },
      whatsapp: { live: false, manual: manual.whatsapp ?? null },
    },
  });
};

// PUT — save manually entered stats for a platform
export const PUT = async (req: NextRequest) => {
  try {
    const { platform, count, label } = await req.json();
    if (!platform) {
      return NextResponse.json(
        { message: 'platform is required' },
        { status: 400 }
      );
    }
    await SocialStats.findOneAndUpdate(
      { platform },
      { count: Number(count) || 0, label: label || 'followers' },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
