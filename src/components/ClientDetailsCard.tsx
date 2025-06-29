import React from 'react';

type Client = {
  name: string;
  phone: string;
  cpf: string;
  birth_date: string;
  current_invoice_price: number;
  created_at: string;
};

type Props = {
  client: Client;
};

const ClientDetails: React.FC<Props> = ({ client }) => {
  return (
    <div className="mb-4 p-4 bg-white rounded shadow-sm">
      <h2 className="text-center mb-4">{client.name}</h2>

      <div className="d-flex justify-content-between flex-wrap">
        <div style={{ minWidth: 250, marginBottom: 12 }}>
          <p><strong>Telefone:</strong> {client.phone}</p>
          <p><strong>CPF:</strong> {client.cpf}</p>
          <p><strong>Data de Nascimento:</strong> {new Date(client.birth_date).toLocaleDateString('pt-BR')}</p>
        </div>
        <div style={{ minWidth: 250, marginBottom: 12 }}>
          <p><strong>Valor da Mensalidade Atual:</strong> R$ {client.current_invoice_price.toFixed(2)}</p>
          <p><strong>Criado em:</strong> {new Date(client.created_at).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
