import ollama
import faiss
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer

class Rag:
    BASE_DIR = Path(__file__).parent
    def __init__(self):
        # load model
        self.model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

        # load index
        self.index = faiss.read_index(str(self.BASE_DIR / "store.faiss"))
        self.texts = np.load(str(self.BASE_DIR / "texts.npy"), allow_pickle=True)

    def _prompt(self, query, context=None):
        """
        context ? 根據context用ollama回答 : 直接用ollama回答，不套用context
        """
        if context: # 根據context用ollama回答
            return f"""
    你是一個AI助手。

    規則：
    1. 只能根據「提供的內容」回答
    2. 如果內容與問題無關，請說「資料不足，無法從資料庫回答」
    3. 使用繁體中文

    內容：
    {chr(10).join(context)}

    問題：
    {query}
    """
        else: # 直接用ollama回答，不套用context
            return f"""
    你是一個AI助手，請用繁體中文回答問題。

    問題：
    {query}
    """

    def search(self, query, top_k=5):
        q_emb = self.model.encode([query], normalize_embeddings=True)
        
        scores, idx = self.index.search(np.array(q_emb), top_k)
        results = []
        for score, i in zip(scores[0], idx[0]):
            results.append((self.texts[i], float(score)))

        return results
    
    def should_use_rag(self, results, threshold=0.35):
        bast_score = max([s for _, s in results])
        return bast_score >= threshold
    
    def build_context(self, results):
        return [text for text, score in results]
    
    def ask_llm(self, query, context=None):
        res = ollama.chat(
            model="llama3",
            messages=[{"role": "user", "content": self._prompt(query, context)}],
            options={
                "temperature": 0.2
            }
        )

        return res["message"]["content"]
    
    def rag(self, query):
        results = self.search(query)

        # 判斷是否使用 RAG
        if not self.should_use_rag(results):
            answer = self.ask_llm(query)
            return [], answer
        
        # 使用 RAG
        context = self.build_context(results)
        answer = self.ask_llm(query, context)
        return context, answer
    
if __name__ == "__main__":
    rag = Rag()
    context, answer = rag.rag("牛肉麵是什麼")
    ## print(context)
    print(answer)