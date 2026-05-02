# 業界常用架構：Chunking + 文件讀取 + FastAPI API + FAISS + Ollama。

## 🧠 系統架構（正式版 RAG）
```
PDF/TXT Files
    ↓
Chunking（切片）
    ↓
Embedding（SentenceTransformer）
    ↓
FAISS（向量索引）
    ↓
TopK chunks
    ↓
Ollama（生成回答）
    ↓
FastAPI（API輸出）
```

## ⚙️ 安裝套件
```bash
pip install fastapi uvicorn sentence-transformers faiss-cpu numpy ollama
```

---

## 📁 專案結構（建議）
```
rag-system/
 ├── data/               # 放 txt 文件
 ├── index.py            # 建索引
 ├── rag.py              # RAG 核心
 ├── api.py              # API 服務
 └── store.faiss         # 向量庫
```

### Step 1：Chunking + 文件讀取
- **📄 index.py**

### 🔍 Step 2：RAG 核心
- **📄 rag.py**

### 🚀 Step 3：API 化（FastAPI）
- **📄 api.py**

---

## 🚀 前置作業
1. 執行 `index.py`
2. 生成 `store.faiss`、`texts.npy`

## ▶️ 啟動 API
```bash
uvicorn api:app --reload --port 8000
```

## 📡 測試 API
```bash
curl -X POST http://127.0.0.1:8000/chat ^
-H "Content-Type: application/json" ^
-d "{\"question\": \"牛肉麵是什麼\"}"
```

---

### `uvicorn api:app --reload` 是什麼

是用來 **啟動 Python Web API 伺服器** 的一條指令，
通常搭配像 FastAPI 或 Starlette 使用。

- 🔧 1️⃣ uvicorn 是什麼
    Uvicorn 是一個 **ASGI 伺服器**，簡單講就是：

    👉 幫你把 Python 程式變成「可以被瀏覽器或前端呼叫的 API 服務」

    就像：
    - Node.js 的 `express + node`
    - Python 的 `uvicorn + fastapi`

- 📦 2️⃣ `api:app` 是什麼
    意思是：
    | 部分    | 意思                      |
    | ----- | ----------------------- |
    | `api` | Python 檔案名稱（api.py）     |
    | `app` | 裡面的一個變數（通常是 FastAPI 實例） |

### 📦 安裝
```bash
pip install fastapi uvicorn
```

### 🚀 執行
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

### `store.faiss` 是什麼

`store.faiss` 通常是 **FAISS 向量資料庫的索引檔案** 。

就是：
```
📦 把「文字轉成向量後的資料結構」存成檔案，方便下次直接載入，不用重算。
```

- **🔧 FAISS 是什麼**

    FAISS 是一個用來做 **向量相似度搜尋（vector search）** 的工具。

    例如你會做這種事：

    - 「牛肉麵很好吃」
    - 「我喜歡吃牛肉麵」
    - 「今天天氣很好」

    轉成向量後，FAISS 幫你找「最像的句子」。

- **📁 store.faiss 是什麼？**

    代表 💾 FAISS index 被存檔後的二進位檔，裡面內容包含：

    - 向量資料（embedding vectors）
    - index 結構（例如 IVF / HNSW）
    - 搜尋用的壓縮資訊

    [存檔] `faiss.write_index(index, "store.faiss")`

    [讀取] `index = faiss.read_index("store.faiss")`

---

### `texts.npy` 是什麼

`texts.npy` 通常是用來存 **原始文字資料（或對應向量的索引資料）** 的 NumPy 檔案。

它是：
```
📦 NumPy 的二進位儲存格式（.npy），用來快速存取 array
```

**🧠 `.npy` 是什麼**

- NumPy 的 `.npy` 格式是：
    ```
    💾 專門用來存「單一 numpy array」的檔案格式
    ```

- [存檔] `np.save("texts.npy", texts)`

- [讀取] `texts = np.load("texts.npy", allow_pickle=True)`

**📁 `texts.npy` 通常存什麼？**

- **✅ 1. 原始文本（最常見）**
    ```python
    texts = [
        "牛肉麵很好吃",
        "我喜歡吃牛肉麵",
        "今天天氣很好"
    ]
    ```

- **✅ 2. 向量對應的 metadata**
    ```python
    texts = [
        {"id": 1, "text": "牛肉麵很好吃"},
        {"id": 2, "text": "我喜歡吃牛肉麵"}
    ]
    ```

    （⚠️ 這種通常要 `allow_pickle=True`）

- **✅ 3. FAISS 的輔助索引**
    | 檔案          | 用途    |
    | ----------- | ----- |
    | store.faiss | 向量索引  |
    | texts.npy   | 原始句子  |
    | ids.npy     | 對應 ID |

**🔗 為什麼需要 texts.npy？**

因為：👉 FAISS 只會告訴你「哪個 index 最像」，但不會告訴你： ❌ 原句是什麼

所以流程是：
```
query → embedding → FAISS 搜尋 → 回傳 index → texts.npy 查原文
```

- **🧠 實際例子**
    ```python
    D, I = index.search(query_vector, k=3)

    for idx in I[0]:
        print(texts[idx])
    ```