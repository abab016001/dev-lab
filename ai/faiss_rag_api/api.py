from rag import Rag
from pydantic import BaseModel
from fastapi import FastAPI

app = FastAPI()

class Query(BaseModel):
    question: str

class Api:
    def __init__(self):
        pass

    @app.post("/chat")
    def chat(q: Query):
        context, answer = Rag().rag(q.question)

        return {
            "question": q.question,
            "context": context,
            "answer": answer
        }
    
######################################################

"""
🚀 執行
uvicorn api:app --reload --port 8000

    * `--reload`
    👉 開發模式（程式修改會自動重啟）

    * `--port 8000`
    👉 指定埠號

✅ 啟動成功畫面
Uvicorn running on http://127.0.0.1:8000

✅ 測試 API
http://127.0.0.1:8000/chat
"""