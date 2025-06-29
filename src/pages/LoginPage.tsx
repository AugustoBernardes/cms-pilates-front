import React, { useState } from "react";
import { loginService } from "../services/login-service";
import ErrorBadge from "../components/ErrorBadge";
import { useNavigate } from "react-router-dom";


const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const data = await loginService(username, password);
      localStorage.setItem("token", data.data?.token || "");
      navigate("/home", { replace: true });

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError("Usuário ou senha inválidos ou erro de rede.");
    }

  };

  return (
    <>
      {error && <ErrorBadge message={error} />}

      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh", width: "100vw", backgroundColor: "#f8f9fa" }}
      >
        <div className="card p-4 shadow" style={{ maxWidth: 400, width: "100%" }}>
          <h2 className="mb-4 text-center">CMS Pilates</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Usuário
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Senha
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
