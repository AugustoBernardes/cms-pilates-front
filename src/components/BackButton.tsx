import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleGoBack}
      className="btn btn-danger btn-lg shadow"
      style={{ minWidth: 120 }}
      aria-label="Voltar"
    >
      ← Voltar
    </button>
  );
};

export default BackButton;
