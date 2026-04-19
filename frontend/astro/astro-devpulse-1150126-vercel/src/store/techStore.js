import { atom } from "nanostores";

export const categoryFilter = atom("All");

export function setCategory(value) {
  categoryFilter.set(value);
}