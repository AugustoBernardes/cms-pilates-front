import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getClientById } from '../services/get-client';
import BackButton from '../components/BackButton';
import ErrorBadge from '../components/ErrorBadge';

const ViewClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClientById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const client = data?.data;

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f8f9fa',
        padding: '20px 40px',
        boxSizing: 'border-box',
      }}
    >
      <div className="mb-3">
        <BackButton />
      </div>

      {isError && <ErrorBadge message="Erro ao carregar cliente." />}
      {isLoading && <p>Carregando cliente...</p>}

      {!isLoading && !isError && client && (
        <div className="card p-4">
          <h3>{client.name}</h3>
          <p><strong>Telefone:</strong> {client.phone}</p>
          <p><strong>CPF:</strong> {client.cpf}</p>
          <p><strong>Data de Nascimento:</strong> {new Date(client.birth_date).toLocaleDateString('pt-BR')}</p>
          <p><strong>Valor da Fatura Atual:</strong> R$ {client.current_invoice_price.toFixed(2)}</p>
          <p><strong>Criado em:</strong> {new Date(client.created_at).toLocaleDateString('pt-BR')}</p>
        </div>
      )}
    </div>
  );
};

export default ViewClient;
