import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientById } from '../services/get-client';
import ErrorBadge from '../components/ErrorBadge';
import { updateClient } from '../services/update-client';
import BackButton from '../components/BackButton';
import type { Client } from '../services/interfaces';

const EditClientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClientById(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (updatedData: Partial<Client>) => updateClient(id!, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', id], refetchType: 'none'});
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      navigate('/clients?updated=true', { replace: true });
    },
  });

  const [form, setForm] = useState({
    name: '',
    phone: '',
    cpf: '',
    birth_date: '',
    current_invoice_price: 0,
  });

  useEffect(() => {
    if (data?.data) {
      setForm({
        name: data.data.name,
        phone: data.data.phone,
        cpf: data.data.cpf,
        birth_date: data.data.birth_date,
        current_invoice_price: data.data.current_invoice_price,
      });
    }
  }, [data]);

  if (isLoading) return <p>Carregando cliente para edição...</p>;
  if (isError) return <ErrorBadge message="Erro ao carregar cliente." />;

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
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

      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          backgroundColor: '#fff',
          padding: '2rem 3rem',
          borderRadius: 8,
          boxShadow: '0 0 6px rgb(0 0 0 / 0.1)',
        }}
      >
        <h2 className="mb-4 text-center">Editar Cliente</h2>

        <form id="edit-client-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome:</label>
            <input
              type="text"
              className="form-control"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Telefone:</label>
            <input
              type="text"
              className="form-control"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">CPF:</label>
            <input
              type="text"
              className="form-control"
              value={form.cpf}
              onChange={(e) => handleChange('cpf', e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Data de Nascimento:</label>
            <input
              type="date"
              className="form-control"
              value={form.birth_date.split('T')[0]}
              onChange={(e) => handleChange('birth_date', e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Mensalidade Atual (R$):</label>
            <input
              type="number"
              className="form-control"
              value={form.current_invoice_price}
              onChange={(e) => handleChange('current_invoice_price', parseFloat(e.target.value))}
              required
              min="0"
              step="0.01"
            />
          </div>
        </form>

        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-success btn-lg"
            form="edit-client-form"
            disabled={mutation.isPending}
            style={{ minWidth: 140 }}
          >
            {mutation.isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>

        {mutation.isError && (
          <div className="mt-3">
            <ErrorBadge message="Erro ao atualizar cliente." />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditClientPage;
