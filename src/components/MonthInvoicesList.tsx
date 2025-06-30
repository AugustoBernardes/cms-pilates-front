import React from 'react';
import Pagination from './Pagination';
import ErrorBadge from './ErrorBadge';
import { useNavigate } from 'react-router-dom';
import type { Invoice } from '../services/get-client-invoices';

type Props = {
  invoices: Invoice[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
};

const MonthInvoicesList: React.FC<Props> = ({
  invoices,
  totalPages,
  currentPage,
  onPageChange,
  isLoading,
  isError,
}) => {
  const navigate = useNavigate();

  return (
    <div className="border p-3 bg-white rounded">
      {isLoading && <p>Carregando faturas...</p>}
      {isError && <ErrorBadge message="Erro ao carregar faturas." />}
      {!isLoading && invoices.length === 0 && <p className="text-muted">Nenhuma fatura encontrada.</p>}

      {!isLoading && invoices.length > 0 && (
        <>
          <div className="d-flex justify-content-end mb-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>

          <div className="d-flex flex-column gap-3 mb-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="d-flex justify-content-between align-items-center p-3 border rounded shadow-sm"
                style={{ backgroundColor: '#f9f9f9' }}
              >
                <div>
                  <p className="mb-1 fw-bold" style={{ fontSize: '1.1rem' }}>
                    Cliente: {invoice.client?.name}
                  </p>

                  <p className="mb-1 text-muted" style={{ fontSize: '0.95rem' }}>
                    Telefone: {invoice.client?.phone}
                  </p>

                  <span
                    className={`badge ${
                      invoice.status === 'paid' ? 'bg-success' : 'bg-warning text-dark'
                    }`}
                    style={{ fontSize: '0.9rem' }}
                  >
                    {invoice.status === 'paid' ? 'Pago' : 'Aberto'}
                  </span>

                  <p className="mt-1 mb-0 fw-bold">
                    Valor: R$ {invoice.value.toFixed(2)}
                  </p>
                </div>

                <button
                  className="btn btn-outline-dark btn-sm shadow-sm"
                  onClick={() => navigate(`/clients/${invoice.client_id}`)}
                >
                  Ver Cliente
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MonthInvoicesList;
