# Astro 「群島架構」Nano Stores 繼續學習 - 3

## 第三題：跨框架同步（React 與 Vue 的對話）

這是 Nano Stores 最強大的地方。假設你有一個專案，因為歷史原因或團隊偏好，同時使用了 React 和 Vue。

---

### 練習目標

1. 建立一個 **React** 的輸入框（Input）。
2. 建立一個 **Vue** 的預覽文字（Preview）。
3. 當 React 框輸入文字時，Vue 的文字即時改變。

---

### 1. 建立 Store (`src/textStore.ts`)

```ts
import { atom } from 'nanostores'

export const $sharedText = atom('Hello Nano!')
```

---

### 2. React 元件 (src/components/ReactInput.tsx)

在 React 中，我們使用` @nanostores/react` 提供的 `useStore` 鉤子。

```tsx
import { useStore } from '@nanostores/react'
import { $sharedText } from '../textStore'

export default function ReactInput() {
  const text = useStore($sharedText)

  return (
    <div className="p-4 border-2 border-blue-500">
      <h3>React 元件</h3>
      <input
        type="text"
        value={text}
        onChange={(e) => $sharedText.set(e.target.value)}
        className="text-black p-1"
      />
    </div>
  )
}
```

---

### 3. Vue 元件 (`src/components/VuePreview.vue`)

在 Vue 中，我們使用 `@nanostores/vue` 提供的 `useStore`。

#### ① 安裝

```bash
npm install @nanostores/vue
```

#### ② 使用

```vue
<script setup>
  import { useStore } from '@nanostores/vue'
  import { $sharedText } from '../textStore'

  // vue 的 useStore 會回傳一個 Ref
  const text = useStore($sharedText)
</script>

<template>
  <div class="p-4 border-2 border-green-500">
    <h3>Vue 元件</h3>
    <p>即時預覽：{{ text }}</p>
  </div>
</template>
```

#### ❌ 可能會遇到這個錯誤

```
Failed to parse source for import analysis because the content contains invalid JS syntax. Install @vitejs/plugin-vue to handle .vue files.
```

這個錯誤訊息非常明確：你的 Astro 專案目前**看不懂 `.vue` 檔案**。

雖然你安裝了 `@nanostores/vue`，但那只是讓 Vue 能與 Store 溝通的工具。你還需要安裝 **Astro 的 Vue 整合套件**，讓 Astro 具備編譯 Vue 組件的能力。

**解決方法：安裝 Astro Vue 整合**
請在終端機執行這行自動化指令：

```bash
npx astro add vue
```

**這個指令會幫你做三件事：**

1. 安裝 `@astrojs/vue`。
2. 安裝 `vue` 核心庫。
3. 自動修改 `astro.config.mjs`，把 `vue()` 加入到 `integrations` 陣列中。

**手動檢查 astro.config.mjs**
執行完指令後，你的設定檔應該會長這樣：

```js
import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue' // 確保有這行
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  integrations: [
    vue(), // 確保有這行
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
```

**為什麼會報錯？**
Astro 本身是一個靜態網站生成器，它預設只支援 `.astro` 檔案。如果你想在裡面放 Vue、React 或 Svelte，你必須告訴 Astro 的底層編譯器（Vite）如何處理這些特殊副檔名。

你遇到的 `Failed to parse source` 錯誤，就是因為 Vite 試圖把你的 `.vue` 檔當成普通 JavaScript 來讀取，結果被 `<template>` 標籤卡住了。

**💡 程式碼檢查：關於 useStore 的小提醒**
有一點要特別注意：

- `$sharedText` 是一個 `atom`（例如 `atom('hello')`），`useStore($sharedText)` 會回傳一個 Vue 的 `Ref`。
  在 `<template>` 中，你直接用 `{{ text }}` 是對的，Vue 會自動解包。
- 但在 `<script setup>` 中，如果你要讀取它的值，記得要加 `.value`：

  ```js
  console.log(text.value) // 在 script 中要加 .value
  ```

---

### 4. 在 Astro 中併用

```astro
---
import ReactInput from '../components/ReactInput.jsx';
import VuePreview from '../components/VuePreview.vue';
---

<div class="grid gap-8">
  <ReactInput client:load />
  <VuePreview client:load />
</div>
```
