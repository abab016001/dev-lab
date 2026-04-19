# Astro 「群島架構」Nano Stores 繼續學習 - 1

## 第一題：「購物車」系統

這個練習的重點在於學習如何使用 `map` 來處理**物件型態的狀態**，以及如何在多個元件之間同步這些數據。

---

### 練習目標

1. 建立一個商品清單，點擊「加入」按鈕時更新購物車。
2. 若商品已在購物車，數量 $+1$；若不在，則新增一筆。
3. 即時顯示購物車內的商品總數。

---

### 第一步：建立 Store (`src/cartStore.ts`)

在 Nano Stores 中，處理集合（Collection）最適合用 `map`。我們用商品的 id 作為 Key。

```ts
import { map } from 'nanostores'

// 初始購物車是個空物件
export const $cart = map({})

/**
 * 加入購物車的邏輯
 * @param {Object} item - 包含 id, name, price 的物件
 */
export function addToCart(item) {
  const existingItem = $cart.get()[item.id]

  if (existingItem) {
    // 如果已存在，更新該 Key 的數量
    $cart.setKey(item.id, {
      ...existingItem,
      quantity: existingItem.quantity + 1,
    })
  } else {
    // 如果不存在，新增一筆並設定數量為 1
    $cart.setKey(item.id, { ...item, quantity: 1 })
  }
}
```

#### ❌ 可能會出現錯誤

```ts
const existingItem = $cart.get()[item.id]
```

```
const existingItem = $cart.get()[item.id]

Element implicitly has an 'any' type because expression of type 'any' can't be used to index type '{}'.
```

這個錯誤是 **TypeScript** 的經典報錯，通常出現在你定義 Nanostores 的時候，**沒有告訴它 Store 裡面裝的是什麼數據結構**。

當你寫 `$cart = map({})` 時，TypeScript 會推斷這個 Store 的類型是 `Record<string, never>` 或是一個空的 `{}`，所以當你嘗試用 `item.id` 去抓取內容時，它會覺得：「這東西明明是空的，你怎麼能用一個 key 去找它呢？」

**如何修復？**
你需要在建立 Store 時定義一個 **Type（類型）** 或 **Interface（介面）**。

**1. 定義資料結構**
假設你的購物車裡面裝的是商品資訊：

```ts
import { map } from 'nanostores'

// 定義單個商品的結構
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

// 定義整個 Store 的結構，Key 是字串（ID），Value 是 CartItem
// 使用 map<Record<string, CartItem>>({})
export const $cart = map<Record<string, CartItem>>({})
```

**2. 獲取資料時**
現在你再寫這行，TypeScript 就會知道 `existingItem` 的類型是 `CartItem | undefined` 了：

```ts
const existingItem = $cart.get()[item.id]
```

**為什麼會發生這個錯誤？**

1. **預設類型太嚴格**：如果你寫 `map({})`，TypeScript 會把 `{}` 視為「沒有任何屬性的物件」。

2. **索引簽名（Index Signature）**：在 TypeScript 中，如果你想用變數（如 `item.id`）來當作 Key 去讀取物件，該物件必須定義過「索引簽名」，例如 `[key: string]: T`。

**進階建議：使用 Nanostores 的 `setKey`**
如果你是想要檢查是否存在並更新購物車，建議配合 `$cart.setKey` 使用，這在 Nanostores 中效能更好：

```ts
const itemId = item.id
const cartData = $cart.get()

if (cartData[itemId]) {
  // 如果已存在，更新數量
  $cart.setKey(itemId, {
    ...cartData[itemId],
    quantity: cartData[itemId].quantity + 1,
  })
} else {
  // 如果不存在，新增項目
  $cart.setKey(itemId, { ...item, quantity: 1 })
}
```

#### ✅ 所以改成這樣

```ts
import { map } from 'nanostores'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export const $cart = map<Record<string, CartItem>>({})

/**
 * 加入購物車的邏輯
 * @param {CartItem} item - 包含 id, name, price 的物件
 */
export function addToCart(item: CartItem) {
  const existingItem = $cart.get()[item.id]
  if (existingItem) {
    $cart.setKey(item.id, {
      ...existingItem,
      quantity: existingItem.quantity + 1,
    })
  } else {
    $cart.setKey(item.id, { ...item, quantity: 1 })
  }
}
```

---

### 第二步：建立產品列表元件 (`src/components/ProductList.astro`)

這個元件純粹負責展示，並在點擊時呼叫我們寫好的 `addToCart` 函數。

```astro
---
const products = [
  { id: 'p1', name: 'Astro 貼紙', price: 50 },
  { id: 'p2', name: 'Nano 紀念衫', price: 500 },
];
---

<div class="product-grid">
  {products.map(item => (
    <div class="card">
      <h3>{item.name}</h3>
      <p>${item.price}</p>
      <button class="add-btn" data-item={JSON.stringify(item)}>
        加入購物車
      </button>
    </div>
  ))}
</div>

<script>
  import { addToCart } from '../cartStore';

  // 取得所有按鈕並綁定事件
  const buttons = document.querySelectorAll('.add-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = JSON.parse(btn.getAttribute('data-item'));
      addToCart(item);
    });
  });
</script>
```

#### ❌ 可能會出現錯誤

```ts
const item = JSON.parse(btn.getAttribute('data-item'))
```

```
Argument of type 'string | null' is not assignable to parameter of type 'string'.
  Type 'null' is not assignable to type 'string'.
```

這也是一個常見的 TypeScript 報錯。問題在於 `getAttribute()` 的回傳值可能是 `string`（找到屬性）或者是 `null`（沒找到屬性）。

但 `JSON.parse()` 的參數**必須**是字串，它不接受 `null`。TypeScript 為了保護你，怕屬性不存在導致程式崩潰，所以攔截了這個賦值。

以下是三種解決方法，按**推薦程度**排序：

##### 1. 使用「短路運算子」提供預設值（最推薦）

這是最簡單且安全的做法。如果 `getAttribute` 回傳 `null`，就給它一個空物件的 JSON 字串 `'{}'`：

```ts
const itemData = btn.getAttribute('data-item') || '{}'
const item = JSON.parse(itemData)
```

#### 2. 先做「非空檢查」 (Type Guard)

如果你希望只有在確定有資料時才執行邏輯，可以用 `if`：

```ts
const itemData = btn.getAttribute('data-item')

if (itemData) {
  const item = JSON.parse(itemData)
  // 在這裡處理 item...
} else {
  console.error('找不到 data-item 屬性')
}
```

#### 3. 使用「非空斷言」 `!` (不推薦)

如果你百分之百確定 HTML 標籤上一定有 `data-item`，可以在後面加個 `!`。但如果萬一漏寫了 HTML 屬性，這行就會噴錯：

```ts
// 警告：如果 HTML 沒寫 data-item，這行會導致 JSON.parse 報錯
const item = JSON.parse(btn.getAttribute('data-item')!)
```

#### 💡 為什麼要這樣寫？

因為在瀏覽器中，HTML 結構與 JavaScript 是分開的。TypeScript 沒辦法確定你的 HTML 檔案裡是否真的寫了 data-item 這個屬性。

---

### 第三步：建立購物車顯示元件 (`src/components/Cart.astro`)

這個元件需要訂閱 **$cart** 的變化。

```astro
<div class="cart-container">
  <h2>你的購物車</h2>
  <ul id="cart-items">
    </ul>
  <hr />
  <p>總計項目：<span id="total-count">0</span></p>
</div>

<script>
  import { $cart } from '../cartStore';

  const cartList = document.querySelector('#cart-items');
  const totalDisplay = document.querySelector('#total-count');

  // 訂閱 Store 的變化
  $cart.subscribe((cartContent) => {
    // 1. 清空舊列表
    cartList.innerHTML = '';

    // 2. 計算總數與渲染列表
    let total = 0;

    Object.values(cartContent).forEach(item => {
      total += item.quantity;

      const li = document.createElement('li');
      li.textContent = `${item.name} x ${item.quantity}`;
      cartList.appendChild(li);
    });

    // 3. 更新總數顯示
    totalDisplay.textContent = total.toString();
  });
</script>
```

---

### 第四步：在頁面中使用

在你的 `index.astro` 頁面引入這兩個元件：

```astro
---
import ProductList from '../components/ProductList.astro';
import Cart from '../components/Cart.astro';
---

<main>
  <h1>我的 Astro 商店</h1>
  <div style="display: flex; gap: 50px;">
    <ProductList />
    <Cart />
  </div>
</main>
```

---

### 扎實學習的小筆記：

1. **為什麼用 setKey 而不是 set？** 使用 `setKey('id', value)` 只會更新特定項目，對於效能更好，且代碼更簡潔，不需要每次都展開（spread）整個舊物件。

2. **`subscribe` 的威力：** 注意到嗎？當你在 `ProductList` 點擊按鈕時，`Cart` 元件會**自動**感應並更新。這就是 Nano Stores 解決「跨元件溝通」的方式。

---

## 進階挑戰：

現在你已經完成了基礎加入功能，試著在 `cartStore.js` 增加一個 `removeFromCart(id)` 函數，並在 `Cart.astro` 裡為每個項目加上一個「刪除」按鈕。

---

# 📚 額外筆記

## 1. 關於 `appendChild`

```js
// Cart 練習題
cartList.append(li)
```

**vscode 提供關鍵字 `append`、`appendChild`，這兩者差在哪裡？**

這兩者在功能上很像，都是把元素塞進父節點，但 `append()` 是現代 JavaScript 的標準，而 `appendChild()` 是歷史悠久的傳統方法。

以下是它們的 **4 大核心差異**：

**① 能否同時加入「多個內容」**

- `append()`：可以一次加入多個元素或字串。
- `appendChild()`：一次只能加入 一個 節點（Node）。

```js
const parent = document.createElement('div')
const child = document.createElement('p')

// ✅ append 可以一次塞很多東西
parent.append(child, 'Hello', document.createElement('span'))

// ❌ appendChild 只能塞一個，且不接受字串
parent.appendChild(child)
```

**② 是否支援「純文字字串」**

- `append()`：支援直接傳入字串，它會自動幫你轉成「文字節點」（Text Node）。
- `appendChild()`：**不支援字串**，你必須先手動建立 `createTextNode`。

```js
// ✅ OK
cartList?.append('這是一段文字')

// ❌ 會報錯 (Uncaught TypeError: Failed to execute 'appendChild' on 'Node')
cartList?.appendChild('這是一段文字')
```

**③ 回傳值 (Return Value)**

- `append()`：回傳 undefined。
- `appendChild()`：會回傳剛被**加入的那個節點**。

```js
const returnedValue = parent.appendChild(child)
console.log(returnedValue === child) // true
```

**④ 瀏覽器支援度 (Compatibility)**

- `appendChild()`：老祖宗等級，支援所有瀏覽器（包括早已作古的 IE6）。

- `append()`：較新的 API（ES6 之後），**不支援 IE**。但在現代開發（如你的 Astro 專案）中，這完全不是問題，大家現在都優先使用 `append()`。

**總結**
特性|append()|appendChild()
|--|--|--|
加入多個項目|✅ 支援|❌ 不支援
直接加入字串|✅ 支援|❌ 不支援
回傳值|undefined|被加入的節點
推薦程度|⭐⭐⭐⭐⭐ (現代開發首選)|⭐⭐⭐ (需要相容極舊瀏覽器時)

---

## 2. 關於 `addToCart`

**原先寫法 ✅**

```ts
import { map } from 'nanostores'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export const $cart = map<Record<string, CartItem>>({})

/**
 * 加入購物車的邏輯
 * @param {CartItem} item - 包含 id, name, price 的物件
 */
export function addToCart(item: CartItem) {
  const existingItem = $cart.get()[item.id]
  if (existingItem) {
    $cart.setKey(item.id, {
      ...existingItem,
      quantity: existingItem.quantity + 1,
    })
  } else {
    $cart.setKey(item.id, { ...item, quantity: 1 })
  }
}
```

**如果這樣寫 ❓**

```ts
import { map } from 'nanostores'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

// 初始購物車 = 空物件
export const $cart = map<Record<string, CartItem>>({})

export function addToCart(item: CartItem) {
  const existingItem = $cart.get()[item.id]
  if (existingItem) {
    existingItem.quantity++
  } else {
    $cart.setKey(item.id, { ...item, quantity: 1 })
  }
}
```

這段程式碼邏輯在一般的 JavaScript 物件操作中看起來很自然，
但在 **Nanostores**（以及大多數狀態管理庫）中，**直接修改 `existingItem.quantity++` 是行不通的**。

### 為什麼不可以這樣寫？

Nanostores 是基於「響應式」原理。當你執行 `existingItem.quantity++` 時：

1. 你直接修改了記憶體中的物件屬性。
2. **Nanostores 偵測不到這個變化**，因為 Store 的參照（Reference）沒有改變。
3. 結果：你的訂閱者（例如 UI 介面）**不會更新**，雖然數據變了，但畫面沒反應。

### 正確的寫法

你必須使用 `$cart.setKey()` `或 $cart.set()`，這樣 Nanostores 才會發出「數據已更新」的通知。

#### ✅ 推薦：使用 `setKey`（效能最好）

```ts
export function addToCart(item: CartItem) {
  const cart = $cart.get()
  const existingItem = cart[item.id]

  if (existingItem) {
    // 透過 setKey 更新，Nanostores 會觸發 UI 更新
    $cart.setKey(item.id, {
      ...existingItem,
      quantity: existingItem.quantity + 1,
    })
  } else {
    $cart.setKey(item.id, { ...item, quantity: 1 })
  }
}
```

**為什麼要用 `...existingItem`？（不可變性 Immutable）**
在現代前端開發中，我們傾向於「產生一個新物件」而不是「修改舊物件」。

| 方式                | 代碼                                   | 結果                      |
| :------------------ | :------------------------------------- | :------------------------ |
| ❌ 錯誤 (Mutable)   | `item.quantity++`                      | 數據變了，但 UI 不會跳動  |
| ✅ 正確 (Immutable) | `setKey(id, { ...item, quantity: n })` | 數據變了，UI 立即同步更新 |

---

## 3. 關於 `<Cart />`

**① 原本寫法：** 訂閱 `$cart` 的變化。
使用純 JavaScript 在 `<script> 中手動更新`

**② 使用框架組件（如 React / Vue / Preact）**
NanoStores 的強大之處在於它有針對不同框架的 Hook，能讓組件自動隨著 Store 更新。

如果把 `Cart` 改用 React 寫：

```tsx
// Cart.tsx
import { useStore } from '@nanostores/react'
import { $cart } from './cartStore'

export const Cart = () => {
  const items = useStore($cart) // 這是關鍵！它會自動監聽並觸發重新渲染
  const cartItems = Object.values(items)

  return (
    <div>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} x {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

在 index.astro 中引用這個 `Cart.tsx` 並加上 `client:load`，它就會在點擊按鈕時立刻更新了。
