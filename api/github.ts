export const config = { runtime: 'edge' };

const USER = 'connergroth';

async function fetchGraphQL(token: string, query: string) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'connergroth.com',
    },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

async function fetchPublicEvents() {
  const pages = await Promise.all(
    [1, 2].map((page) =>
      fetch(
        `https://api.github.com/users/${USER}/events/public?per_page=100&page=${page}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'connergroth.com',
          },
        }
      )
        .then((r) => r.json())
        .catch(() => [])
    )
  );
  return [
    ...(Array.isArray(pages[0]) ? pages[0] : []),
    ...(Array.isArray(pages[1]) ? pages[1] : []),
  ];
}

export default async function handler() {
  const token = process.env.GITHUB_TOKEN;
  const diag: any = {};

  // 30-day window
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 29);
  start.setHours(0, 0, 0, 0);

  const days = new Array(30).fill(0);
  let total = 0;
  let latestCommit: { repo: string; createdAt: string } | null = null;

  if (token) {
    // 1) Contribution calendar via GraphQL (includes private if user enabled the setting)
    const calQuery = `{
      user(login: "${USER}") {
        contributionsCollection(from: "${start.toISOString()}", to: "${now.toISOString()}") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
          commitContributionsByRepository(maxRepositories: 10) {
            repository { nameWithOwner defaultBranchRef { name } }
            contributions(first: 1, orderBy: { field: OCCURRED_AT, direction: DESC }) {
              nodes { occurredAt }
            }
          }
        }
      }
    }`;

    const calData = await fetchGraphQL(token, calQuery).catch(() => null);
    const cal =
      calData?.data?.user?.contributionsCollection?.contributionCalendar;
    const byRepo =
      calData?.data?.user?.contributionsCollection
        ?.commitContributionsByRepository;

    diag.graphql = { ok: !!cal, errors: calData?.errors || null };

    if (cal?.weeks) {
      for (const week of cal.weeks) {
        for (const day of week.contributionDays) {
          const d = new Date(day.date);
          const idx = Math.floor(
            (d.getTime() - start.getTime()) / 86_400_000
          );
          if (idx >= 0 && idx < 30) {
            days[idx] = day.contributionCount;
            total += day.contributionCount;
          }
        }
      }
    }

    // Pick the repo with the most recent contribution
    if (Array.isArray(byRepo) && byRepo.length > 0) {
      let best: any = null;
      for (const r of byRepo) {
        const node = r.contributions?.nodes?.[0];
        if (!node) continue;
        if (!best || new Date(node.occurredAt) > new Date(best.date)) {
          best = {
            date: node.occurredAt,
            repo: r.repository.nameWithOwner,
            branch: r.repository.defaultBranchRef?.name || 'main',
          };
        }
      }
      if (best) {
        latestCommit = {
          repo: `${best.repo.replace(`${USER}/`, '')}/${best.branch}`,
          createdAt: best.date,
        };
      }
    }
  }

  // Fallback: public events (for latestCommit detail and if GraphQL failed)
  if (!latestCommit || total === 0) {
    const events = await fetchPublicEvents();
    diag.publicEvents = events.length;

    if (!latestCommit) {
      const push = events.find((e: any) => e.type === 'PushEvent');
      if (push) {
        latestCommit = {
          repo: `${push.repo.name.replace(`${USER}/`, '')}/${(push.payload?.ref || '').replace('refs/heads/', '') || 'main'}`,
          createdAt: push.created_at,
        };
      }
    }

    if (total === 0) {
      for (const ev of events) {
        if (ev.type !== 'PushEvent') continue;
        const d = new Date(ev.created_at);
        if (d < start) continue;
        const idx = Math.floor(
          (d.getTime() - start.getTime()) / 86_400_000
        );
        if (idx >= 0 && idx < 30) {
          const n =
            ev.payload?.size || ev.payload?.commits?.length || 1;
          days[idx] += n;
          total += n;
        }
      }
    }
  }

  return new Response(
    JSON.stringify({
      latestCommit,
      history: {
        days,
        total,
        startDate: start.toISOString(),
        endDate: now.toISOString(),
      },
      diag,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
      },
    }
  );
}
