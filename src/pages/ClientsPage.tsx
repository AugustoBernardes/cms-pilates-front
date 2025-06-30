import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import BackButton from '../components/BackButton';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';
import ClientCard from '../components/ClientCard';
import ErrorBadge from '../components/ErrorBadge';
import { listClients } from '../services/list-clients';
import { useDebounce } from '../hooks/Debounce';
import type { Client } from '../services/interfaces';
import { useLocation, useNavigate } from 'react-router-dom';
import SuccessBadge from '../components/SuccessBadge';

const pageSize = 2;

const Clients: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const updateSuccess = params.get('updated') === 'true';
  const createdSuccess = params.get('created') === 'true';


  useEffect(() => {
  if (updateSuccess) {
    const cleanUrl = location.pathname;
    window.history.replaceState({}, '', cleanUrl);
  }
}, [updateSuccess, location.pathname]);

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

      {updateSuccess && <SuccessBadge message={'Dados do cliente Atualizados!'} />}
      {createdSuccess && <SuccessBadge message={'Cliente criado com sucesso!'} />}

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
          <button onClick={() => navigate(`/clients/create`) } className="btn btn-primary">Adicionar Novo Cliente</button>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>

        <div className="border p-3 bg-white rounded">
          <div style={{ marginTop: '1rem' }}>
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
