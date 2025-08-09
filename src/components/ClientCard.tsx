
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Client } from '../services/interfaces';
import { dateFormatter } from '../utils/date-formatter';

interface ClientCardProps {
  client: Client;
  onDelete: (id: string) => void;
  enabledEdtion?: boolean;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, enabledEdtion ,onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="card mb-3">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title mb-2">{client.name}</h5>
          <p className="mb-1"><strong>Telefone:</strong> {client.phone}</p>
          <p className="mb-1"><strong>CPF:</strong> {client.cpf}</p>
          <p className="mb-1"><strong>Nascimento:</strong> {dateFormatter(client.birth_date)}</p>
          {enabledEdtion && (<p className="mb-1"><strong>Mensalidade Atual:</strong> R$ {client.current_invoice_price.toFixed(2)}</p>)}
        </div>

        <div className="d-flex flex-column gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate(`/clients/${client.id}`)}
          >
            Visualizar
          </button>

          {enabledEdtion && (
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => navigate(`/clients/${client.id}/edit`)  
           }
          >
            Atualizar
          </button>)}

          {enabledEdtion && (
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(client.id)}
          >
            Deletar
          </button>)}
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
