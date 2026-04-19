import { persistentAtom } from "@nanostores/persistent";

type Theme = 'light' | 'dark';

export const $theme = persistentAtom<Theme>('theme', 'light');

export function toggleTheme() {
  const current = $theme.get();
  $theme.set(current === "light" ? "dark" : "light")
}

