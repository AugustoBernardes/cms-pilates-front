import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BackButton from '../components/BackButton';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';
import ClientCard from '../components/ClientCard';
import ErrorBadge from '../components/ErrorBadge';
import SuccessBadge from '../components/SuccessBadge';
import { listClients } from '../services/list-clients';
import { useDebounce } from '../hooks/Debounce';
import type { Client } from '../services/interfaces';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteClient } from '../services/delete.client';

const pageSize = 10;

const Clients: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const updateSuccess = params.get('updated') === 'true';
  const createdSuccess = params.get('created') === 'true';

  useEffect(() => {
    if (updateSuccess || createdSuccess) {
      const cleanUrl = location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }
  }, [updateSuccess, createdSuccess, location.pathname]);

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
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['birthday-clients'] });
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    },
  });

  const handleDelete = (id: string) => {
    if (mutation.isPending) return;
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      mutation.mutate(id);
    }
  };

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
      {deleteSuccess && <SuccessBadge message={'Cliente deletado com sucesso!'} />}

      <div className="mb-3">
        <BackButton />
      </div>

      {isError && <ErrorBadge message="Erro ao buscar clientes" />}

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <SearchInput
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setPage(1);
          }}
          placeholder="Buscar clientes..."
          className="mb-3"
        />

        <div className="mb-3">
          <button onClick={() => navigate(`/clients/create`, {replace: true})} className="btn btn-primary">
            Adicionar Novo Cliente
          </button>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />
        </div>

        <div className="border p-3 bg-white rounded">
          <div style={{ marginTop: '1rem' }}>
            {isLoading && <p>Carregando clientes...</p>}

            {!isLoading && clients.length === 0 && <p className="text-muted">Nenhum cliente encontrado.</p>}

            {!isLoading && clients.length > 0 && (
              <div>
                {clients.map((client) => (
                  <ClientCard key={client.id} client={client} enabledEdtion={true} onDelete={(id) => handleDelete(id)} />
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
