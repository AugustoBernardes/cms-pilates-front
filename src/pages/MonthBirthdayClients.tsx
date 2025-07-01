import React from 'react';
import { useQuery } from '@tanstack/react-query';
import BackButton from '../components/BackButton';
import ClientCard from '../components/ClientCard';
import ErrorBadge from '../components/ErrorBadge';
import { listBirthdayClients } from '../services/list-birthday-clients';
import type { Client } from '../services/interfaces';

const BirthdayClientsPage: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['birthday-clients'],
    queryFn: listBirthdayClients,
    staleTime: 1000 * 60 * 5,
  });

  const clients: Client[] = data?.data || [];

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

      <h2 className="text-center mb-4">Clientes Aniversariantes</h2>

      {isError && <ErrorBadge message="Erro ao carregar aniversariantes." />}
      {isLoading && <p>Carregando clientes...</p>}

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="border p-3 bg-white rounded">
          {!isLoading && clients.length === 0 && (
            <p className="text-muted">Nenhum aniversariante encontrado.</p>
          )}

          {!isLoading && clients.length > 0 && (
            <div>
              {clients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onDelete={(id) => console.log('Deletar', id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BirthdayClientsPage;
