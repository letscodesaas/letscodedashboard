import { NextResponse } from 'next/server';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function fetchTelegram(): Promise<{ members: number } | null> {
  try {
    const res = await fetch('https://t.me/offcampusjobsupdatess', {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(7000),
    });
    const html = await res.text();
    // Telegram uses space as thousands separator: "41 486 subscribers"
    const match = html.match(/(\d[\d\s,]*\d|\d+)\s+subscribers/i);
    if (!match) return null;
    const cleaned = match[1].replace(/[\s,]/g, '');
    return { members: parseInt(cleaned, 10) };
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
      {
        headers: { 'User-Agent': UA },
        signal: AbortSignal.timeout(7000),
      }
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

async function fetchYouTube(): Promise<{
  subscribers: number;
  views: number;
  videos: number;
} | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=letscodewithavinash&key=${key}`,
      { signal: AbortSignal.timeout(7000) }
    );
    const data = await res.json();
    const stats = data?.items?.[0]?.statistics;
    if (!stats) return null;
    return {
      subscribers: parseInt(stats.subscriberCount, 10),
      views: parseInt(stats.viewCount, 10),
      videos: parseInt(stats.videoCount, 10),
    };
  } catch {
    return null;
  }
}

export const GET = async () => {
  const [telegram, discord, youtube] = await Promise.all([
    fetchTelegram(),
    fetchDiscord(),
    fetchYouTube(),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      telegram: {
        url: 'https://t.me/offcampusjobsupdatess',
        stats: telegram,
      },
      discord: {
        url: 'https://discord.gg/XRBheB9QF9',
        stats: discord,
      },
      youtube: {
        url: 'https://www.youtube.com/@letscodewithavinash',
        stats: youtube,
        needsKey: !process.env.YOUTUBE_API_KEY,
      },
      linkedin: {
        url: 'https://www.linkedin.com/company/lets-code-forever/',
        stats: null,
      },
      instagram: {
        url: 'https://www.instagram.com/lets__code/',
        stats: null,
      },
      whatsapp: {
        url: 'https://whatsapp.com/channel/0029Va9IblC7dmecjzkkn811',
        stats: null,
      },
    },
  });
};
