import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import BackButton from '../components/BackButton';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';
import ClientCard from '../components/ClientCard';
import ErrorBadge from '../components/ErrorBadge';
import { listClients, type Client } from '../services/list-clients';
import { useDebounce } from '../hooks/Debounce';

const pageSize = 2;

const Clients: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['clients', { searchTerm: debouncedSearchTerm, page }],
    queryFn: () =>
      listClients({
        search: debouncedSearchTerm,
        page,
        page_size: pageSize,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const clients: Client[] = data?.data?.data || [];
  const totalPages = data?.data?.total_pages || 1;

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

      {isError && <ErrorBadge message="Erro ao buscar clientes" />}

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <SearchInput
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setPage(1); // Resetar página ao buscar
          }}
          placeholder="Buscar clientes..."
          className="mb-3"
        />

        <div className="mb-3">
          <button className="btn btn-primary">Adicionar Novo Cliente</button>
        </div>

        <div className="position-relative border p-3 bg-white rounded">
          <div className="position-absolute top-0 end-0 m-2">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>

          <div style={{ marginTop: '2rem' }}>
            {isLoading && <p>Carregando clientes...</p>}

            {!isLoading && clients.length === 0 && (
              <p className="text-muted">Nenhum cliente encontrado.</p>
            )}

            {!isLoading && clients.length > 0 && (
              <div>
                {clients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    onView={(id) => console.log('Visualizar', id)}
                    onEdit={(id) => console.log('Atualizar', id)}
                    onDelete={(id) => console.log('Deletar', id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Clients;