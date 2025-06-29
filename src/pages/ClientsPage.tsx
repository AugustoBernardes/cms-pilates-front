import React, { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import { listClients, type Client } from '../services/list-clients';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';
import ClientCard from '../components/ClientCard';
import ErrorBadge from '../components/ErrorBadge';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 2;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce: update after 500ms of inactivity
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset page when search term changes
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Search data every time the debounced search term or page changes
  useEffect(() => {
    setLoading(true);
    setError(null);

    listClients({ search: debouncedSearchTerm, page, page_size: pageSize })
      .then((response) => {
        if (response.status === 'success') {
          setClients(response.data?.data || []);
          setTotalPages(response.data?.total_pages || 1);
        } else {
          setError('Erro ao buscar clientes');
        }
      })
      .catch(() => setError('Erro ao buscar clientes'))
      .finally(() => setLoading(false));
  }, [debouncedSearchTerm, page]);

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

      {error && <ErrorBadge message={error} />}


      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
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
            {loading && <p>Carregando clientes...</p>}

            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && clients.length === 0 && (
              <p className="text-muted">Nenhum cliente encontrado.</p>
            )}

            {!loading && !error && clients.length > 0 && (
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
