const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

const shortDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

export const formatAddedTimestamp = (createdAtIso: string, nowValue: number = Date.now()): string => {
  const createdTime = Date.parse(createdAtIso);
  if (Number.isNaN(createdTime)) {
    return 'Added just now';
  }

  const elapsed = Math.max(0, nowValue - createdTime);

  if (elapsed < MS_PER_MINUTE) {
    return 'Added just now';
  }

  if (elapsed < MS_PER_HOUR) {
    const minutes = Math.floor(elapsed / MS_PER_MINUTE);
    return `Added ${minutes} min ago`;
  }

  if (elapsed < MS_PER_DAY) {
    const hours = Math.floor(elapsed / MS_PER_HOUR);
    return `Added ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  if (elapsed < MS_PER_DAY * 2) {
    return 'Added yesterday';
  }

  if (elapsed < MS_PER_DAY * 7) {
    const days = Math.floor(elapsed / MS_PER_DAY);
    return `Added ${days} days ago`;
  }

  return `Added ${shortDate.format(new Date(createdTime))}`;
};
