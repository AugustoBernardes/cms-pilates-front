import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleButtonClick = (path: string) => {
    navigate(path);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh', width: '100vw', backgroundColor: '#f8f9fa' }}
    >
      <div className="text-center" style={{ width: '100%', maxWidth: '400px' }}>
        <h1>Bem-vindo ao CMS Pilates!</h1>

        <div className="d-grid gap-3 mt-4">
          <button
            onClick={() => handleButtonClick('/clients')}
            className="btn btn-primary btn-lg w-100"
          >
            Gerenciar Clientes
          </button>

          <button
            onClick={() => handleButtonClick('/months')}
            className="btn btn-secondary btn-lg w-100"
          >
            Histórico de Pagamento
          </button>

          <button
            onClick={() => handleButtonClick('/birthdays')}
            className="btn btn-success btn-lg w-100"
          >
            Aniversários
          </button>

          <button
            onClick={() => handleButtonClick('/pending-invoices')}
            className="btn btn-warning btn-lg w-100"
          >
            Faturas Pendentes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
