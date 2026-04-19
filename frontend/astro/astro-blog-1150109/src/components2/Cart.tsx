import { useStore } from "@nanostores/react";
import { $cart, $totalCnt, $totalAmt, rmFromCart } from "../cartStore2";

export const Cart = () => {
  const items = useStore($cart);
  const cartItems = Object.values(items);
  const totalCnt = useStore($totalCnt);
  const totalAmt = useStore($totalAmt);

  return (
    <div>
      <h2>我的購物車2</h2>
      <ul style={{display: "flex", flexDirection: "column", gap: "10px 0"}}>
        {cartItems.map(cart => (
          <li key={cart.id} style={{display: "flex", justifyContent: "space-between", gap: "10px"}}>
            <p style={{margin: 0}}>{cart.name} x {cart.quantity}</p>
            <button onClick={() => rmFromCart(cart.id)} style={{cursor: "pointer"}}>刪除</button>
          </li>
        ))}
      </ul>
      <hr />
      <p>總計項目：{totalCnt}</p>
      <p>總計金額：{totalAmt}</p>
    </div>
  )
}