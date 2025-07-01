import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import BackButton from '../components/BackButton';
import ErrorBadge from '../components/ErrorBadge';
import MonthInvoicesList from '../components/MonthInvoicesList';
import { listMonthInvoices } from '../services/list-month-invoices';
import { getMonthResume } from '../services/get-month-resume';
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

  const { data: resumeData, isLoading: loadingResume, isError: errorResume } = useQuery({
    queryKey: ['month-resume', monthId],
    queryFn: () => getMonthResume(monthId!),
    enabled: !!monthId,
    staleTime: 1000 * 60 * 5,
  });

  const invoices: Invoice[] = data?.data?.data || [];
  const monthResume = resumeData?.data;
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

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {monthFormatted && (
          <h2 className="text-center mb-4" style={{ textTransform: 'capitalize' }}>
            Faturas de {monthFormatted}
          </h2>
        )}

        {!monthFormatted && isError && <ErrorBadge message="Erro ao carregar o mês." />}

        {loadingResume && <p>Carregando resumo...</p>}
        {errorResume && <ErrorBadge message="Erro ao carregar resumo do mês." />}
        {monthResume && (
          <div className="card mb-4 shadow-sm border border-secondary bg-light">
            <div className="card-body">
              <h5 className="card-title mb-3">Resumo do Mês</h5>

              <div className="mb-2">
                <strong>Valor esperado:</strong>{' '}
                <span className="badge bg-secondary">
                  R$ {monthResume.total.toFixed(2)}
                </span>
              </div>

              <div className="mb-3">
                <strong>Total em aberto:</strong>{' '}
                <span className="badge bg-warning text-dark">
                  R$ {monthResume.total_open.toFixed(2)}
                </span>
              </div>
                <div className="mb-2">
                <strong>Total pago:</strong>{' '}
                <span className="badge bg-success">
                  R$ {monthResume.total_paid.toFixed(2)}
                </span>
              </div>

              <div className="progress" style={{ height: '20px' }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{
                    width: `${(monthResume.total_paid / monthResume.total) * 100}%`,
                  }}
                  aria-valuenow={(monthResume.total_paid / monthResume.total) * 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  {Math.round((monthResume.total_paid / monthResume.total) * 100)}%
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex flex-column gap-3">
          <MonthInvoicesList
            invoices={invoices}
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>
    </div>
  );
};

export default MonthInvoicesPage;
