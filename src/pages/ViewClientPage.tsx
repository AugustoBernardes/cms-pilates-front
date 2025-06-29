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

  function formatMonthYear(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

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

      {/* Container para alinhar largura dos dois blocos */}
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Dados do cliente */}
        {!loadingClient && !errorClient && client && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: 12,
              boxShadow: '0 0 12px rgb(0 0 0 / 0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h2 style={{ fontWeight: 600, fontSize: '2rem', marginBottom: 16 }}>
              {client.name}
            </h2>
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
                gap: '1.5rem',
              }}
            >
              <div style={{ minWidth: 220 }}>
                <p><strong>Telefone:</strong> {client.phone}</p>
                <p><strong>CPF:</strong> {client.cpf}</p>
                <p><strong>Data de Nascimento:</strong> {new Date(client.birth_date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div style={{ minWidth: 220 }}>
                <p><strong>Valor da Mensalidade Atual:</strong> R$ {client.current_invoice_price.toFixed(2)}</p>
                <p><strong>Criado em:</strong> {new Date(client.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Título das faturas */}
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Faturas do Cliente</h3>

        {/* Container das faturas */}
        <div
          style={{
            position: 'relative',
            border: '1px solid #ddd',
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: 12,
          }}
        >
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <Pagination
              currentPage={invoicePage}
              totalPages={totalPages}
              onPageChange={setInvoicePage}
            />
          </div>

          {loadingInvoices && <p>Carregando faturas...</p>}
          {errorInvoices && <ErrorBadge message="Erro ao carregar faturas." />}

          {!loadingInvoices && invoices.length === 0 && (
            <p className="text-muted">Nenhuma fatura encontrada.</p>
          )}

          {!loadingInvoices && invoices.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginTop: '2rem',
              }}
            >
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  style={{
                    border: '1.5px solid',
                    borderColor: invoice.status === 'paid' ? '#28a745' : '#dc3545',
                    borderRadius: 10,
                    padding: '1rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: invoice.status === 'paid' ? '#d4edda' : '#f8d7da',
                    color: invoice.status === 'paid' ? '#155724' : '#721c24',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flex: 1,
                      justifyContent: 'space-between',
                      gap: '2rem',
                      minWidth: 0,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <strong>Mês:</strong> {formatMonthYear(invoice.created_at)}
                    </div>
                    <div>
                      <strong>Status:</strong>{' '}
                      {invoice.status === 'paid' ? (
                        <span style={{ fontWeight: 'bold', color: '#155724' }}>Pago</span>
                      ) : (
                        <span style={{ fontWeight: 'bold', color: '#721c24' }}>Aberto</span>
                      )}
                    </div>
                    <div>
                      <strong>Valor:</strong> R$ {invoice.value.toFixed(2)}
                    </div>
                    <div>
                      <strong>Criado em:</strong>{' '}
                      {new Date(invoice.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginLeft: '1rem' }}>
                    {invoice.status === 'open' ? (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => console.log('Marcar como pago:', invoice.id)}
                      >
                        Pagar fatura
                      </button>
                    ) : (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => console.log('Marcar como pendente:', invoice.id)}
                      >
                        Reabrir fatura
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewClient;
