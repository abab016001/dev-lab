import { atom } from "nanostores";

export type Category = 'All' | 'GitHub' | 'News' | 'Tech';
export const $activeCategory = atom<Category>('All');

export const $searchTerm = atom('');