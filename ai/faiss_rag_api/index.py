import os
import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

class App:
    def __init__(self):
        self.model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
        self.data_path = "./data"
        self.texts = []

    def read_data(self):
        """1️⃣ 讀取所有 txt"""
        for file in os.listdir(self.data_path):
            if file.endswith(".txt"):
                with open(os.path.join(self.data_path, file), "r", encoding="utf-8") as f:
                    content = f.read()

                # 2️⃣ Chunking（重點）
                chunks = content.split("。")
                for c in  chunks:
                    c = c.strip()
                    if len(c) > 5:
                        self.texts.append(c)

        print("chunks:", len(self.texts))
        
        self._save()
    
    def _save(self):
        # 3️⃣ embedding
        embeddings = self.model.encode(self.texts, normalize_embeddings=True)
        dim = embeddings.shape[1]
        self.embed = embeddings
        self.dim = dim

        # 4️⃣ FAISS index
        index = faiss.IndexFlatIP(dim)
        index.add(np.array(embeddings))
        self.index = index

        # 5️⃣ save
        faiss.write_index(index, "store.faiss")
        np.save("texts.npy", np.array(self.texts))

        print("FAISS 建立完成")


app = App()
app.read_data()