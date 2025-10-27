# 🧠 Projeto CRUD com FastAPI + Redis + React

Este projeto é uma aplicação **Full Stack** simples que implementa um **CRUD de tarefas** (Task CRUD) usando **FastAPI (Python)** no backend, **Redis** como banco de dados e **React** no frontend.

---

## 🚀 Funcionalidades

* ➕ **Adicionar** tarefas
* 📝 **Editar** tarefas
* 🗑️ **Excluir** tarefas
* 🔄 **Alterar status da tarefa** para:
    * **Pendente**
    * **Em progresso**
    * **Concluída**
* 📋 **Ordenação Automática:**
    * Tarefas *em progresso* aparecem no topo.
    * Depois as *pendentes*.
    * Por fim, as *concluídas*.

---

## 🧰 Tecnologias Utilizadas

### Backend:
* [FastAPI](https://fastapi.tiangolo.com/)
* [Redis](https://redis.io/)
* [Uvicorn](https://www.uvicorn.org/)
* [Pydantic](https://docs.pydantic.dev/)
* [python-dotenv](https://pypi.org/project/python-dotenv/)

### Frontend:
* [React](https://react.dev/)
* [Fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API)
* [CSS Flexbox](https://developer.mozilla.org/docs/Web/CSS/CSS_flexible_box_layout)

---

## ⚙️ Instalação e Execução

### 🔹 1. Configurar o Backend (FastAPI)

1.  Acesse a pasta do backend:
    ```
    cd backend
2.  Crie e ative um ambiente virtual:
    ```
    python -m venv venv
    venv\Scripts\activate      # no Windows
    # ou
    source venv/bin/activate   # no Linux/Mac
3.  Instale as dependências (a partir da raiz do projeto):
    ```
    pip install -r ../requirements.txt
4.  **Inicie o Servidor Redis** (necessário antes de executar o FastAPI):
    ```
    redis-server
5.  Execute o servidor FastAPI:
    ```
    uvicorn main:app --reload --port 8000
    ```
    O backend ficará disponível em: **http://localhost:8000/docs**

### 🔹 2. Configurar o Frontend (React)

1.  Acesse a pasta do frontend:
    ```
    cd frontend
2.  Instale as dependências:
    ```
    npm install
3.  Inicie o servidor React:
    ```
    npm start
    ```
    O frontend abrirá automaticamente em: **http://localhost:3000**

---
✨ Desenvolvido por Eduardo Henrique Silva de Amorim | Banco de Dados Não-Relacional
