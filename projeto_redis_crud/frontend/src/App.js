import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("Pendente");
  const [editandoId, setEditandoId] = useState(null);
  const [loading, setLoading] = useState(false);

  const carregarTarefas = async () => {
    try {
      setLoading(true);
      const resp = await api.get("/tarefas");
      const dados = resp.data
        .map((t) => {
          const id = t.id ?? t["id"] ?? (t.key ? t.key.split(":")[1] : undefined);
          return { ...t, id: Number(id) };
        })
        .sort((a, b) => {
          const prioridade = {
            "Em Progresso": 1,
            "Pendente": 2,
            "Concluída": 3,
          };
          if (prioridade[a.status] !== prioridade[b.status]) {
            return prioridade[a.status] - prioridade[b.status];
          }
          return b.id - a.id;
        });

      setTarefas(dados);
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err);
      setTarefas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  const limparForm = () => {
    setTitulo("");
    setDescricao("");
    setStatus("Pendente");
    setEditandoId(null);
  };

  const criarTarefa = async () => {
    if (!titulo.trim()) return alert("Informe um título");
    try {
      await api.post("/tarefas", { titulo, descricao, status });
      await carregarTarefas();
      limparForm();
    } catch (err) {
      console.error("Erro criar:", err);
      alert("Erro ao criar tarefa (veja console).");
    }
  };

  const iniciarEdicao = (t) => {
    setEditandoId(t.id);
    setTitulo(t.titulo ?? "");
    setDescricao(t.descricao ?? "");
    setStatus(t.status ?? "Pendente");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const salvarEdicao = async () => {
    if (!editandoId) return;
    try {
      await api.put(`/tarefas/${editandoId}`, { titulo, descricao, status });
      await carregarTarefas();
      limparForm();
    } catch (err) {
      console.error("Erro atualizar:", err);
      alert("Erro ao atualizar tarefa.");
    }
  };

  const deletarTarefa = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta tarefa?")) return;
    try {
      await api.delete(`/tarefas/${id}`);
      await carregarTarefas();
    } catch (err) {
      console.error("Erro deletar:", err);
      alert("Erro ao excluir tarefa.");
    }
  };

  const toggleConcluida = async (t) => {
    const novoStatus = t.status === "Concluída" ? "Pendente" : "Concluída";
    try {
      await api.put(`/tarefas/${t.id}`, { ...t, status: novoStatus });
      await carregarTarefas();
    } catch (err) {
      console.error("Erro toggle:", err);
      alert("Erro ao atualizar status.");
    }
  };

  return (
    <div className="container">
      <h1>Gerenciador de Tarefas</h1>

      <div className="card-form">
        <input
          className="input"
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <textarea
          className="textarea"
          placeholder="Descrição (opcional)"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <div className="row">
          <select
            className="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pendente">Pendente</option>
            <option value="Em Progresso">Em Progresso</option>
            <option value="Concluída">Concluída</option>
          </select>

          {editandoId ? (
            <>
              <button className="btn btn-primary" onClick={salvarEdicao}>
                Salvar
              </button>
              <button className="btn btn-ghost" onClick={limparForm}>
                Cancelar
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={criarTarefa}>
              Adicionar
            </button>
          )}
        </div>
      </div>

      <h2 className="subtitulo">Tarefas</h2>

      {loading ? (
        <p className="loading">Carregando...</p>
      ) : tarefas.length === 0 ? (
        <p className="nenhuma">Nenhuma tarefa cadastrada.</p>
      ) : (
        <ul className="lista">
          {tarefas.map((t) => (
            <li key={t.id} className={`item ${t.status === "Concluída" ? "concluida" : ""}`}>
              <div className="item-left">
                <div className="item-titulo">{t.titulo}</div>
                {t.descricao ? <div className="item-desc">{t.descricao}</div> : null}
                <div className="item-meta">
                  <span
                    className={`badge ${
                      t.status === "Concluída"
                        ? "verde"
                        : t.status === "Em Progresso"
                        ? "amarelo"
                        : ""
                    }`}
                  >
                    {t.status}
                  </span>
                  {t.data_criacao ? <small className="data"> • {t.data_criacao}</small> : null}
                </div>
              </div>

              <div className="item-actions">
                <button
                  className="icon-btn"
                  title="Concluir / Reabrir"
                  onClick={() => toggleConcluida(t)}
                >
                  {t.status === "Concluída" ? "↺" : "✓"}
                </button>

                <button className="icon-btn" title="Editar" onClick={() => iniciarEdicao(t)}>
                  ✎
                </button>

                <button
                  className="icon-btn danger"
                  title="Excluir"
                  onClick={() => deletarTarefa(t.id)}
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
