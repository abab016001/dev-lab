# Astro 「群島架構」Nano Stores 繼續學習 - 2

## 第二題：深色模式（Dark Mode）

**深色模式（Dark Mode）** 的核心在於如何讓狀態「持久化」（即使重新整理網頁，設定也不會消失），以及如何與系統或手動設定同步。

在 Nano Stores 中，我們可以使用原生提供的 `persistent` 擴充功能，這能讓我們省去手寫 `localStorage.getItem/setItem` 的麻煩。

---

### 練習目標

1. 建立一個持久化的 Atom (`$isDark`)。
2. 建立一個切換開關元件（使用 React 或 原生 JS）。
3. 根據狀態自動切換 HTML 的 `class="dark"`。
4. 確保頁面重新整理後，狀態依然正確。

---

### 第一步：安裝持久化插件

Nano Stores 官方提供了一個專門處理持久化的套件：

```bash
npm install @nanostores/persistent
```

---

### 第二步：建立 Store (`src/themeStore.ts`)

這裡我們使用 `persistentAtom`。它的用法和 `atom` 幾乎一樣，但第一個參數是 `localStorage` 的 Key，第二個是初始值。

當你使用 `@nanostores/persistent` 中的 `persistentAtom` 時，它會自動處理與瀏覽器 `LocalStorage` 的同步。

**它是如何運作的？**

1. **寫入 (Write)：** 當你執行 `$theme.set('dark')` 時，它會同時更新記憶體中的狀態，並在 LocalStorage 中存入 `theme: "dark"`。

2. **讀取 (Read)：** 當使用者重新整理網頁時，它會先去 LocalStorage 找有沒有一個 key 叫作 `'theme'`。如果有，就用那個值作為初始值；如果沒有，才使用你設定的預設值 `'light'`。

3. **監聽 (Listen)：** 它甚至會監聽 LocalStorage 的事件。如果你在同一個網站開了兩個分頁，在 A 分頁切換主題，B 分頁也會跟著同步變化。

**你可以在瀏覽器檢查它**
如果你想親眼確認，可以依照以下步驟：

1. 在網頁上按 **F12** (或右鍵「檢查」)。
2. 切換到 **Application (應用程式)** 頁籤。
3. 在左側找到 **Local Storage**。
4. 點擊你的網址，你就會看到` key: theme` 和 `value: light/dark`。

```ts
import { persistentAtom } from '@nanostores/persistent'

// 'isDark' 是存在 localStorage 裡的 Key
// 第二個參數是預設值，這裡設定為字串 'light' (persistent 目前主要支援字串)
export const $theme = persistentAtom('theme', 'light')

export function toggleTheme() {
  const current = $theme.get()
  $theme.set(current === 'light' ? 'dark' : 'light')
}
```

#### ❌ 可能會出現錯誤

```
  Argument of type '"light" | "dark"' is not assignable to parameter of type '"light"'.
  Type '"dark"' is not assignable to type '"light"'.
```

這個錯誤是因為 TypeScript 的**自動型別推斷**太過嚴格了。

當你寫 `persistentAtom('theme', 'light')` 時，TypeScript 會以為這個 Store **永遠只能是** `'light'` 這個字串，而不接受其他的字串（例如 `'dark'`）。

**💡 解決方法：明確定義型別**
你需要告訴 TypeScript，這個 Store 的型別是 `'light' | 'dark'`（這兩者之一），而不僅僅是字串 `'light'`。

**🆗 修正後的程式碼：**

```ts
import { persistentAtom } from '@nanostores/persistent'

// 1. 定義允許的型別
type Theme = 'light' | 'dark'

// 2. 在建立時明確指定型別 <Theme>
export const $theme = persistentAtom<Theme>('theme', 'light')

export function toggleTheme() {
  const current = $theme.get()
  // 現在這裡就不會報錯了
  $theme.set(current === 'light' ? 'dark' : 'light')
}
```

**❔ 為什麼會報錯？（原理分析）**
如果你不加上 `<Theme>`，TypeScript 的推斷邏輯如下：

它看到初始值是 `'light'`。

它為了安全，把這個 Store 的型別鎖定為 **字面量型別 (Literal Type)**：`"light"`。

當你試圖 `.set("dark")` 時，它會說：「嘿！你說過這個變數只能是 `"light"`，你現在給我 `"dark"` 是不合法的。」

這在 TypeScript 中稱為 **Type Widening（型別拓寬）** 的問題。
_widening [ˈwaɪdənɪŋ]_

---

### 第三步：建立切換開關元件 (`src/components/ThemeToggle.astro`)

我們直接用原生 JS 來實作，這樣最輕量。

```astro
<button id="theme-btn" class="p-2 border rounded">
  切換模式
</button>

<script>
  import { $theme, toggleTheme } from '../themeStore';

  const btn = document.querySelector('#theme-btn');

  // 點擊時呼叫 store 的切換函數
  btn?.addEventListener('click', () => {
    toggleTheme();
  });

  // 監聽變化：當切換時，更新按鈕文字或樣式
  $theme.subscribe(value => {
    btn.textContent = value === 'dark' ? '🌙 深色模式' : '☀️ 淺色模式';
  });
</script>
```

---

### 第四步：最重要的——防止「閃爍」（Flash of Unstyled Content）

這是做深色模式最難的地方。如果我們等 JS 下載完才切換顏色，頁面會先白一下才變黑。 我們必須在 `<head>` 裡放一段極短的腳本，**在頁面渲染前**就讀取 Store。

在你的 `src/layouts/Layout.astro` 中：

```astro
---
// Layout 的頭部
---
<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <title>Nano Stores 練習</title>

    <script is:inline>
      // 注意：這段 script 必須是 is:inline
      // 我們直接從 localStorage 拿值，因為此時 Nano Stores 可能還沒加載
      const theme = localStorage.getItem('theme') || 'light';
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    </script>

    <style is:global>
      /* 定義簡單的深色模式樣式 */
      :root { background: #ffffff; color: #000; }
      :root.dark { background: #1a1a1a; color: #fff; }
    </style>
  </head>
  <body>
    <slot />

    <script>
      // 這裡我們還是要訂閱 Store，以便在用戶點擊按鈕時「即時」切換 class
      import { $theme } from '../themeStore';
      $theme.subscribe(value => {
        if (value === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      });
    </script>
  </body>
</html>
```

---

## 扎實學習的小筆記：

1. **為什麼要 `is:inline`？** Astro 預設會打包腳本。但處理主題切換的腳本必須「阻塞」渲染，確保 HTML 標籤一出來就帶有正確的 class，否則使用者會被閃瞎。

2. **Persistent 的特性**： `persistentAtom` 會自動處理 `window.addEventListener('storage', ...)`。這意味著如果你開兩個分頁，在 A 分頁切換深色模式，B 分頁會**自動同步**變黑！

---

## 進階挑戰：

現在你的深色模式是手動切換的。你能否修改 `themeStore.ts`，讓它在使用者**第一次**進入網站時，自動偵測系統的偏好設定 (`window.matchMedia('(prefers-color-scheme: dark)')`)？
