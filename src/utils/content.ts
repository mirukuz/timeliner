import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export function sortByDateDesc<T extends { data: { date: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getSortedEntries(): Promise<CollectionEntry<'days'>[]> {
  const entries = await getCollection('days');
  return sortByDateDesc(entries);
}
