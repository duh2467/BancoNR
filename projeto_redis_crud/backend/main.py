from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import redis
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

r = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

class Tarefa(BaseModel):
    id: int | None = None
    titulo: str
    descricao: str
    status: str = "Pendente"

@app.get("/tarefas")
def listar_tarefas():
    chaves = r.keys("tarefa:*")
    tarefas = []
    for chave in chaves:
        dados = r.get(chave)
        if dados:
            tarefas.append(json.loads(dados))
    tarefas.sort(key=lambda x: x["id"])
    return tarefas

@app.post("/tarefas")
def criar_tarefa(tarefa: Tarefa):
    novo_id = r.incr("contador_tarefas")
    tarefa.id = novo_id
    tarefa_data = tarefa.dict()
    r.set(f"tarefa:{novo_id}", json.dumps(tarefa_data))
    return tarefa_data

@app.put("/tarefas/{tarefa_id}")
def atualizar_tarefa(tarefa_id: int, tarefa: Tarefa):
    chave = f"tarefa:{tarefa_id}"
    if not r.exists(chave):
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    tarefa.id = tarefa_id
    r.set(chave, json.dumps(tarefa.dict()))
    return tarefa

@app.delete("/tarefas/{tarefa_id}")
def deletar_tarefa(tarefa_id: int):
    chave = f"tarefa:{tarefa_id}"
    if not r.exists(chave):
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    r.delete(chave)
    return {"mensagem": "Tarefa excluída com sucesso"}
