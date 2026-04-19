import { computed, map } from "nanostores";

export interface CartItem {
  id: string,
  name: string,
  price: number,
  quantity?: number
}

// 初始購物車 = 空物件
export const $cart = map<Record<string, CartItem>>({});

export function addToCart(item: CartItem) {
  const existingItem = $cart.get()[item.id];
  if (existingItem) {
    $cart.setKey(item.id, { ...existingItem, quantity: existingItem.quantity! + 1 })
  } else {
    $cart.setKey(item.id, { ...item, quantity: 1 });
  }
}

export function rmFromCart(id: string) {
  $cart.setKey(id, undefined);
}

export const $totalCnt = computed($cart, (items) => {
  const cartItems = Object.values(items);
  const ans = cartItems.reduce((acc, cur) => acc + Number(cur.quantity ?? 0), 0);
  return ans;
})

export const $totalAmt = computed($cart, (items) => {
  const cartItems = Object.values(items);
  const ans = cartItems.reduce((acc, cur) => acc + Number(cur.quantity ?? 0) * Number(cur.price ?? 0), 0);
  return ans;
})