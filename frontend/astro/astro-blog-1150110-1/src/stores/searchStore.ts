import { atom, computed } from "nanostores";

export const $searchQuery = atom('');
export const $currentCategory = atom('All');

export const $filterStatus = computed(
  [$searchQuery, $currentCategory],
  (query, category) => `正在搜尋: ${query} (分類: ${category})`
)