import { formatDistanceToNow } from 'date-fns';

export function getDateOfPost(date: Date) {
  return `${formatDistanceToNow(date, { addSuffix: true })}`;
}