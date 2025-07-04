import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import BackButton from '../components/BackButton';
import ErrorBadge from '../components/ErrorBadge';
import SearchInput from '../components/SearchInput';
import { useDebounce } from '../hooks/Debounce';

import type { Invoice } from '../services/get-client-invoices';
import GenericInvoiceList from '../components/GenericInvoicesList';
import { listPendingInvoices } from '../services/list-pending-invoices';

const pageSize = 10;

const PendingInvoicesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['pending-invoices', { search: debouncedSearch, page }],
    queryFn: () =>
      listPendingInvoices({
        search: debouncedSearch,
        page,
        page_size: pageSize,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const invoices: Invoice[] = data?.data?.data || [];
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

      <h2 className="mb-4 text-center">Faturas Pendentes</h2>

      {isError && <ErrorBadge message="Erro ao carregar faturas pendentes." />}

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <SearchInput
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setPage(1);
          }}
          placeholder="Buscar por cliente..."
          className="mb-3"
        />

        <GenericInvoiceList
          invoices={invoices}
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
};

export default PendingInvoicesPage;
