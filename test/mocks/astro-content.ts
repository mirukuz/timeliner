import type { CollectionEntry } from 'astro:content';

export async function getCollection(
  _collection: string
): Promise<CollectionEntry<any>[]> {
  return [];
}
