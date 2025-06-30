import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import BackButton from '../components/BackButton';
import ErrorBadge from '../components/ErrorBadge';
import MonthInvoicesList from '../components/MonthInvoicesList';
import { listMonthInvoices } from '../services/list-month-invoices';
import type { Invoice } from '../services/get-client-invoices';

const pageSize = 2;

const MonthInvoicesPage: React.FC = () => {
  const { monthId } = useParams<{ monthId: string }>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const monthParam = params.get('month');

  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['invoices-by-month', monthId, page],
    queryFn: () => listMonthInvoices({ id: monthId || '', page, page_size: pageSize }),
    enabled: !!monthId,
    staleTime: 1000 * 60 * 5,
  });

  const invoices: Invoice[] = data?.data?.data || [];
  const totalPages = data?.data?.total_pages ?? 1;

  const monthFormatted = monthParam
    ? new Date(monthParam + '-01').toLocaleString('pt-BR', {
        month: 'long',
        year: 'numeric',
      })
    : '';

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

      {monthFormatted && (
        <h2 className="text-center mb-4" style={{ textTransform: 'capitalize' }}>
          Faturas de {monthFormatted}
        </h2>
      )}

      {!monthFormatted && isError && <ErrorBadge message="Erro ao carregar o mês." />}

      <MonthInvoicesList
        invoices={invoices}
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

export default MonthInvoicesPage;
