import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getClientById } from '../services/get-client';
import { getClientInvoices, type Invoice } from '../services/get-client-invoices';
import BackButton from '../components/BackButton';
import ErrorBadge from '../components/ErrorBadge';
import Pagination from '../components/Pagination';

const ViewClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [invoicePage, setInvoicePage] = useState(1);
  const invoicePageSize = 2;

  const { data: clientData, isLoading: loadingClient, isError: errorClient } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClientById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const { data: invoicesData, isLoading: loadingInvoices, isError: errorInvoices } = useQuery({
    queryKey: ['client-invoices', id, invoicePage],
    queryFn: () => getClientInvoices(id!, invoicePage, invoicePageSize),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const client = clientData?.data;
  const invoices: Invoice[] = invoicesData?.data?.data || [];
  const totalPages = invoicesData?.data?.total_pages || 1;

  const handleToggleStatus = (invoice: Invoice) => {
    if (invoice.status === 'open') {
      console.log('Marcar como Pago:', invoice.id);
      // Aqui você chama o service para marcar como pago
    } else {
      console.log('Reabrir Fatura:', invoice.id);
      // Aqui você chama o service para reabrir a fatura
    }
  };

  const getMonthName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

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

      {errorClient && <ErrorBadge message="Erro ao carregar cliente." />}
      {loadingClient && <p>Carregando cliente...</p>}

      {!loadingClient && !errorClient && client && (
        <div className="mb-4 p-4 bg-white rounded shadow-sm">
          <h2 className="text-center">{client.name}</h2>

          <div className="row mt-4">
            <div className="col-md-6">
              <p><strong>Telefone:</strong> {client.phone}</p>
              <p><strong>CPF:</strong> {client.cpf}</p>
              <p><strong>Data de Nascimento:</strong> {new Date(client.birth_date).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Valor da Mensalidade Atual:</strong> R$ {client.current_invoice_price.toFixed(2)}</p>
              <p><strong>Criado em:</strong> {new Date(client.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-center mb-4">Faturas do Cliente</h2>

      <div className="d-flex justify-content-end mb-3">
        <Pagination
          currentPage={invoicePage}
          totalPages={totalPages}
          onPageChange={setInvoicePage}
        />
      </div>

      <div className="border p-3 bg-white rounded">
        {loadingInvoices && <p>Carregando faturas...</p>}
        {errorInvoices && <ErrorBadge message="Erro ao carregar faturas." />}

        {!loadingInvoices && invoices.length === 0 && (
          <p className="text-muted">Nenhuma fatura encontrada.</p>
        )}

        {!loadingInvoices && invoices.length > 0 && (
          <div className="d-flex flex-column gap-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="card shadow-sm p-3">
                <h5 className="mb-2">{getMonthName(invoice.created_at)}</h5>

                <p className="mb-1">
                  <strong>Valor:</strong> R$ {invoice.value.toFixed(2)}
                </p>

                <p className="mb-1">
                  <strong>Criado em:</strong> {new Date(invoice.created_at).toLocaleDateString('pt-BR')}
                </p>

                <p className="mb-2">
                  <strong>Status:</strong>{' '}
                  <span
                    className={`badge ${
                      invoice.status === 'paid'
                        ? 'bg-success'
                        : 'bg-warning text-dark'
                    }`}
                  >
                    {invoice.status === 'paid' ? 'Pago' : 'Aberto'}
                  </span>
                </p>

                <button
                  className={`btn btn-sm ${
                    invoice.status === 'open' ? 'btn-success' : 'btn-warning'
                  }`}
                  onClick={() => handleToggleStatus(invoice)}
                >
                  {invoice.status === 'open' ? 'Marcar como Pago' : 'Reabrir Fatura'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewClient;
