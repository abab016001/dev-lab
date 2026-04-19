# Astro 「群島架構」Nano Stores 繼續學習

**Nano Stores**與其它的狀態管理工具（如 Redux 或 Pinia）不同
Nano Stores 是 **不可知框架（Framework-agnostic）** 的。這意味著你可以在同一個 Astro 專案中，讓 **React、Vue、Svelte 和原生 JS** 共享同一個狀態。

---

## 第一階段：核心概念與環境設定

Nano Stores 的核心是 **Atoms**（單一值）和 **Maps**（物件結構）。它們是「訂閱制」的，只有在元件真正掛載到瀏覽器時才會運作。

### 1. 安裝

在你的 Astro 專案中執行：

```bash
npm install nanostores @nanostores/react # 如果你用 React
# 或者
npm install nanostores @nanostores/vue   # 如果你用 Vue
```

### 2. 建立你的第一個 Store

在 `src` 下建立一個 `store.js`：

```js
import { atom } from 'nanostores'

// 定義一個初始值為 0 的 Atom
export const $counter = atom(0)
```

---

## 第二階段：在 Astro 元件中使用（群島通訊）

這是最常見的情境：你有一個按鈕（React）和一個顯示面板（Vue），它們需要同步數據。

### 練習 1：基礎計數器

#### 步驟 A：建立 React 按鈕 (`src/components/Button.jsx`)

```js
import { $counter } from '../store'

export default function Button() {
  return <button onClick={() => $counter.set($counter.get() + 1)}>加 1</button>
}
```

#### 步驟 B：建立原生 JS 顯示器 (`src/components/Display.astro`) 在 Astro 的 `<script>` 標籤中，你需要使用 `.subscribe` 來監聽變化：

```html
<div id="display">0</div>

<script>
  import { $counter } from '../store'

  const div = document.querySelector('#display')
  // 訂閱變化，當 $counter 改變時更新 DOM
  $counter.subscribe((value) => {
    div.textContent = value.toString()
  })
</script>
```

---

## 第三階段：處理複雜數據（Maps）

### 練習 2：使用者設定檔

**建立 Store：**

```js
import { map } from 'nanostores'

export const $user = map({
  name: 'Guest',
  role: 'Visitor',
})

// 更新函數
export function updateName(newName) {
  $user.setKey('name', newName)
}
```

---

## 第四階段：進階技巧與非同步數據

### 練習 3：從 API 獲取數據

Nano Stores 可以處理非同步狀態。這在 Astro 中處理客戶端數據請求非常有用。

```js
import { atom, onMount } from 'nanostores'

export const $data = atom([])

onMount($data, () => {
  // 當有人訂閱 $data 時，這段代碼才會執行
  fetch('https://api.example.com/items')
    .then((res) => res.json())
    .then((json) => $data.set(json))
})
```

---

## 🛠️ 實作

### 1. 完成第一階段、第二階段

### 2. 在 `src/pages/index.astro` 匯入元件 `Display`、`Button`

```astro
 ---
 import Display from '../components/Display.astro'
 import Button from '../components/Button'
 ---

 <html lang="en">
   <head>
     <meta charset="utf-8" />
     <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
     <meta name="viewport" content="width=device-width" />
     <meta name="generator" content={Astro.generator} />
     <title>Astro</title>
   </head>
   <body>
     <h1>Astro</h1>
     <Display client:load />
     <Button client:load />
   </body>
 </html>
```

### 3. ❌ 發生錯誤

```
 Unable to render Button.

 No valid renderer was found for the .09/blog/src/components/Button file extension.
```

**意思是：** 你試圖在 Astro 頁面中使用一個框架組件（例如 React 的 `.jsx` 或 `.tsx`），但你**還沒有告訴 Astro 如何處理這種檔案**。

Astro 預設只懂 `.astro` 檔案，其他的框架（React, Vue, Svelte 等）都需要透過 **Integration (整合)** 手動開啟。

#### 第一步：安裝 React 整合套件

在你的終端機執行以下指令（這會自動幫你安裝套件並修改設定檔）：

```bash
npx astro add react
```

_(當它詢問是否要繼續、更新設定檔、安裝依賴時，請一路按 **y** 或 **Enter**)_

#### 第二步：檢查設定檔 (astro.config.mjs)

執行完上述指令後，你的 `astro.config.mjs` 應該會自動變成這樣：

```js
import { defineConfig } from 'astro/config'
import react from '@astrojs/react' // 1. 引入

export default defineConfig({
  integrations: [react()], // 2. 啟用
})
```

#### 第三步：檢查組件引用方式

在 Astro 檔案中引用 React 組件時，請確保你有加上 **Client Directive**（客戶端指令），否則 React 的互動功能（如點擊事件）會失效：

```astro
---
import { Button } from './Button.tsx';
---

<Button client:load />
```

#### 🤔 為什麼會這樣？

Astro 的核心概念是 "**Island Architecture**" **(孤島架構)**。 預設情況下，為了效能，Astro 會把所有組件都渲染成純 HTML（不含任何 JavaScript）。如果你沒安裝 React 整合包，它看到 .jsx 或 .tsx 檔案會完全不知道該如何解譯，所以才會噴出這個錯誤。

### 4. ✅ 成功顯示 `<Display>` 、 `<Button>`

**Button** 可點擊，**Display** 計數累加

---

## 扎實練習題

接下來的 3 個章節會陸續介紹以下三個挑戰：

- **「購物車」挑戰：** 建立一個 `map` 存儲購物車商品。建立一個 Astro 頁面，左邊是產品列表（點擊加入），右邊是購物車清單（即時更新數量）。

- **「深色模式」切換：** 建立一個 `$isDark` 的 atom，並同步到瀏覽器的 `localStorage`。當切換開關時，整個網站的 `<html>` 標籤要自動加上或移除 .dark 類名。

- **「跨框架同步」：** 如果你會兩種框架（如 React 和 Vue），嘗試寫一個 React 表單輸入文字，讓一個 Vue 元件即時顯示該文字。

---
