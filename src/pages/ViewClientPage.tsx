import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientById } from '../services/get-client';
import { updateInvoiceStatus } from '../services/update-invoice-status';
import { getClientInvoices, type Invoice } from '../services/get-client-invoices';
import ErrorBadge from '../components/ErrorBadge';
import BackButton from '../components/BackButton';
import Pagination from '../components/Pagination';

const ViewClient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) navigate('/clients');
  }, [id, navigate]);

  const [invoicePage, setInvoicePage] = useState(1);
  const invoicePageSize = 2;

  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Client details
  const { data: clientData, isLoading: loadingClient, isError: errorClient } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClientById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  // Cliente invoices
  const { data: invoicesData, isLoading: loadingInvoices, isError: errorInvoices } = useQuery({
    queryKey: ['client-invoices', id, invoicePage],
    queryFn: () => getClientInvoices(id!, invoicePage, invoicePageSize),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  // Mutation to update invoice status
  const mutation = useMutation({
    mutationFn: ({ invoice_id, currentStatus }: { invoice_id: string; currentStatus: string }) =>
      updateInvoiceStatus(invoice_id, currentStatus === 'paid' ? 'open' : 'paid'),
    onSuccess: () => {
      setSuccessMessage('Status da fatura atualizado com sucesso!');
      if (id) queryClient.invalidateQueries({ queryKey: ['client-invoices', id] });
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: () => {
      setSuccessMessage('Erro ao atualizar status da fatura.');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
  });

  const client = clientData?.data;
  const invoices: Invoice[] = invoicesData?.data?.data || [];
  const totalPages = invoicesData?.data?.total_pages || 1;

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

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {!loadingClient && !errorClient && client && (
          <div className="mb-4 p-4 bg-white rounded shadow-sm">
            <h2 className="text-center mb-4">{client.name}</h2>

            <div className="d-flex justify-content-between flex-wrap">
              <div style={{ minWidth: 250, marginBottom: 12 }}>
                <p><strong>Telefone:</strong> {client.phone}</p>
                <p><strong>CPF:</strong> {client.cpf}</p>
                <p><strong>Data de Nascimento:</strong> {new Date(client.birth_date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div style={{ minWidth: 250, marginBottom: 12 }}>
                <p><strong>Valor da Mensalidade Atual:</strong> R$ {client.current_invoice_price.toFixed(2)}</p>
                <p><strong>Criado em:</strong> {new Date(client.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        )}

        <h2 className="mb-3 text-center">Faturas do Cliente</h2>

        <div className="d-flex justify-content-end mb-3">
          <Pagination
            currentPage={invoicePage}
            totalPages={totalPages}
            onPageChange={setInvoicePage}
          />
        </div>

        <div className="border p-3 bg-white rounded">
          {successMessage && <ErrorBadge message={successMessage} />}

          {loadingInvoices && <p>Carregando faturas...</p>}
          {errorInvoices && <ErrorBadge message="Erro ao carregar faturas." />}

          {!loadingInvoices && invoices.length === 0 && (
            <p className="text-muted">Nenhuma fatura encontrada.</p>
          )}

          {!loadingInvoices && invoices.length > 0 && (
            <div className="d-flex flex-column gap-3">
              {invoices.map((invoice) => {
                const isPaid = invoice.status === 'paid';

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
                        {new Date(invoice.created_at).toLocaleString('pt-BR', {
                          month: 'long',
                          year: 'numeric',
                        })}
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
                      onClick={() =>
                        mutation.mutate({ invoice_id: invoice.id, currentStatus: invoice.status })
                      }
                      disabled={mutation.isPending}
                    >
                      {isPaid ? 'Reabrir Fatura' : 'Pagar fatura'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewClient;
