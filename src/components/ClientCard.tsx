// src/components/ClientCard.tsx
import React from 'react';
import type { Client } from '../services/list-clients';

interface ClientCardProps {
  client: Client;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onView, onEdit, onDelete }) => {
  return (
    <div className="card mb-3">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title mb-2">{client.name}</h5>
          <p className="mb-1"><strong>Telefone:</strong> {client.phone}</p>
          <p className="mb-1"><strong>CPF:</strong> {client.cpf}</p>
          <p className="mb-1"><strong>Nascimento:</strong> {new Date(client.birth_date).toLocaleDateString('pt-BR')}</p>
          <p className="mb-1"><strong>Fatura Atual:</strong> R$ {client.current_invoice_price.toFixed(2)}</p>
        </div>

        <div className="d-flex flex-column gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => onView(client.id)}
          >
            Visualizar
          </button>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => onEdit(client.id)}
          >
            Atualizar
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(client.id)}
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
