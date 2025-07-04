import React from 'react';
import Pagination from './Pagination';
import SuccessBadge from './SuccessBadge';
import ErrorBadge from './ErrorBadge';
import type { Invoice } from '../services/get-client-invoices';
import { monthFormatter } from '../utils/month-formatter';



type Props = {
  invoices: Invoice[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (invoiceId: string, currentStatus: string) => void;
  isLoading: boolean;
  isError: boolean;
  successMessage: string | null;
  isMutationPending: boolean;
};

const ClientInvoices: React.FC<Props> = ({
  invoices,
  totalPages,
  currentPage,
  onPageChange,
  onToggleStatus,
  isLoading,
  isError,
  successMessage,
  isMutationPending,
}) => {

  
  return (
    <div className="border p-3 bg-white rounded">

      {successMessage && <SuccessBadge message={successMessage} />}
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
            {invoices.map((invoice) => {
              const isPaid = invoice.status === 'paid';
              console.log({invoice, month: new Date(invoice.month.month)});

              return (
                <div
                  key={invoice.id}
                  className="d-flex justify-content-between align-items-center p-3 border rounded shadow-sm"
                  style={{ backgroundColor: '#f9f9f9' }}
                >
                  <div>
                    <p
                      className="mb-1 fw-bold"
                      style={{ fontSize: '1.1rem', textTransform: 'capitalize' }}
                    >
                      {monthFormatter(invoice.month.month)}
                    </p>
                    <span
                      className={`badge ${isPaid ? 'bg-success' : 'bg-warning text-dark'}`}
                      style={{ fontSize: '0.9rem' }}
                    >
                      {isPaid ? 'Pago' : 'Aberto'}
                    </span>
                    <p className="mt-1 mb-0" style={{ fontWeight: 600 }}>
                      Valor: R$ {invoice.value.toFixed(2)}
                    </p>
                  </div>

                  <button
                    className={`btn btn-sm ${isPaid ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => onToggleStatus(invoice.id, invoice.status)}
                    disabled={isMutationPending}
                  >
                    {isPaid ? 'Reabrir Fatura' : 'Pagar fatura'}
                  </button>
                </div>
              );
            })}
          </div>

        </>
      )}
    </div>
  );
};

export default ClientInvoices;
