import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientById } from '../services/get-client';
import { updateInvoiceStatus } from '../services/update-invoice-status';
import { getClientInvoices, type Invoice } from '../services/get-client-invoices';
import ErrorBadge from '../components/ErrorBadge';
import BackButton from '../components/BackButton';
import ClientDetails from '../components/ClientDetailsCard';
import ClientInvoices from '../components/ClientInvoices';

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

  // Clients invoices
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
      queryClient.invalidateQueries({ queryKey: ['invoices-by-month'], refetchType: 'none' });
      queryClient.invalidateQueries({ queryKey: ['month-resume'], refetchType: 'none' });
      queryClient.invalidateQueries({ queryKey: ['pending-invoices'], refetchType: 'none' });
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
          <ClientDetails client={client} />
        )}

        <h2 className="mb-3 text-center">Faturas do Cliente</h2>

        <ClientInvoices
          invoices={invoices}
          totalPages={totalPages}
          currentPage={invoicePage}
          onPageChange={setInvoicePage}
          onToggleStatus={(invoice_id, currentStatus,) =>
            mutation.mutate({ invoice_id, currentStatus })
          }
          isLoading={loadingInvoices}
          isError={errorInvoices}
          successMessage={successMessage}
          isMutationPending={mutation.isPending}
        />

      </div>
    </div>
  );
};

export default ViewClient;
