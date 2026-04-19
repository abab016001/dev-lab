import { atom } from "nanostores";

export const categoryFilter = atom("all");

export function setCategory(value) {
  categoryFilter.set(value);
}