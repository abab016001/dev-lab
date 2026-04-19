import { map } from "nanostores";

interface CartItem {
  id: string,
  name: string,
  price: number,
  quantity: number,
}

export const $cart = map<Record<string, CartItem>>({});

/**
 * 加入購物車的邏輯
 * @param {CartItem} item - 包含 id, name, price 的物件
 */
export function addToCart(item: CartItem) {
  const existingItem = $cart.get()[item.id]
  if (existingItem) {
    $cart.setKey(item.id, {
      ...existingItem,
      quantity: existingItem.quantity + 1
    })
  } else {
    $cart.setKey(item.id, { ...item, quantity: 1 });
  }
}