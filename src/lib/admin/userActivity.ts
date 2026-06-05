export function calculateInactivityDays(lastLogin: string | null, createdAt: string): number {
  const now = new Date();
  const referenceDate = lastLogin ? new Date(lastLogin) : new Date(createdAt);
  const diffTime = now.getTime() - referenceDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateActivityStatus(
  lastLogin: string | null,
  createdAt: string,
): {
  isActive: boolean;
  days: number;
  display: string;
  color: 'green' | 'yellow' | 'gray';
  exactTime: string;
} {
  const now = new Date();

  if (!lastLogin) {
    const diffTime = now.getTime() - new Date(createdAt).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return { isActive: false, days: diffDays, display: 'Never', color: 'gray', exactTime: 'Never' };
  }

  const referenceDate = new Date(lastLogin);
  const diffTime = now.getTime() - referenceDate.getTime();
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const isActive = diffMinutes < 5;

  const exactTime = new Date(lastLogin).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  let color: 'green' | 'yellow' | 'gray';
  if (isActive) color = 'green';
  else if (diffMinutes < 60 || diffHours < 24) color = 'yellow';
  else color = 'gray';

  let display: string;
  if (isActive) display = `Active ${diffMinutes}m ago`;
  else if (diffMinutes < 60) display = `${diffMinutes}m ago`;
  else if (diffHours < 24) display = `${diffHours}h ago`;
  else if (diffDays < 7) display = `${diffDays}d ago`;
  else if (diffDays < 30) display = `${Math.floor(diffDays / 7)}w ago`;
  else if (diffDays < 365) display = `${Math.floor(diffDays / 30)}mo ago`;
  else display = `${Math.floor(diffDays / 365)}y ago`;

  return { isActive, days: diffDays, display, color, exactTime };
}

export function shouldHighlightInactivity(inactivityDays: number, productCount: number): boolean {
  return inactivityDays >= 7 && productCount === 0;
}

export function formatMeaningfulInactivity(
  lastLogin: string | null,
  createdAt: string,
  lastMeaningfulAt: string | null | undefined,
): { display: string; color: 'green' | 'yellow' | 'gray'; exactTime: string } {
  const fallback = calculateActivityStatus(lastLogin, createdAt);
  if (!lastMeaningfulAt) {
    return { display: fallback.display, color: fallback.color, exactTime: fallback.exactTime };
  }
  const ref = new Date(lastMeaningfulAt);
  const diffMs = Date.now() - ref.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  let display: string;
  if (diffMinutes < 60) display = `${diffMinutes}m ago`;
  else if (diffHours < 24) display = `${diffHours}h ago`;
  else if (diffDays < 7) display = `${diffDays}d ago`;
  else if (diffDays < 30) display = `${Math.floor(diffDays / 7)}w ago`;
  else display = `${Math.floor(diffDays / 30)}mo ago`;

  const color: 'green' | 'yellow' | 'gray' =
    diffMinutes < 5 ? 'green' : diffDays < 1 ? 'yellow' : 'gray';

  return {
    display,
    color,
    exactTime: ref.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
  };
}

export function formatCreatedAgo(createdAt: string): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(createdAt).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

export function isCreatedToday(createdAt: string): boolean {
  const now = new Date();
  const d = new Date(createdAt);
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function calculateUserStats(users: { created_at: string }[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const priorWeekStart = new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000);

  const newUsersToday = users.filter((u) => new Date(u.created_at) >= today).length;
  const newUsersThisWeek = users.filter((u) => new Date(u.created_at) >= weekAgo).length;
  const newUsersPriorWeek = users.filter((u) => {
    const d = new Date(u.created_at);
    return d >= priorWeekStart && d < weekAgo;
  }).length;

  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const newUsersYesterday = users.filter((u) => {
    const d = new Date(u.created_at);
    return d >= yesterday && d < today;
  }).length;

  return {
    totalUsers: users.length,
    newUsersToday,
    newUsersThisWeek,
    newUsersPriorWeek,
    newUsersYesterday,
  };
}
