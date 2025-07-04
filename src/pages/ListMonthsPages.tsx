import React from 'react';
import { useQuery } from '@tanstack/react-query';
import BackButton from '../components/BackButton';
import ErrorBadge from '../components/ErrorBadge';
import { getMonths } from '../services/fetch-months';
import { useNavigate } from 'react-router-dom';
import { monthFormatter } from '../utils/month-formatter';

const MonthsListPage: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['months'],
    queryFn: getMonths,
    staleTime: 1000 * 60 * 5,
  });
  const navigate = useNavigate();

  const hasMonths = data && data.data && data.data.length > 0;

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

      {isLoading && <p>Carregando meses...</p>}
      {isError && <ErrorBadge message="Erro ao buscar meses" />}

      {!isLoading && !hasMonths && (
        <p className="text-muted">Nenhum mês encontrado.</p>
      )}

      {!isLoading && hasMonths && (
        <div
          className="d-flex flex-column gap-3 overflow-auto"
          style={{ maxHeight: '70vh', maxWidth: 900, margin: '0 auto' }}
        >
          {data?.data?.map((month) => (
            <button
              key={month.id}
              type="button"
              className="btn btn-outline-dark btn-lg shadow-sm text-center py-3"
              style={{
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).classList.add('shadow');
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).classList.remove('shadow');
              }}
              onClick={() => navigate(`/months/${month.id}?month=${month.month}`)}
            >
              <strong>
                {monthFormatter(month.month)}
              </strong>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonthsListPage;
