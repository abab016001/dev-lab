import { atom } from "nanostores";

export const $counter = atom(0);

import { map } from "nanostores";

export const $user = map({
  name: 'Guest',
  role: 'Visitor',
});

export function updateName(newName: string) {
  $user.setKey('name', newName);
}