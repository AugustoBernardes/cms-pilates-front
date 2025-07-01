import React, { useState, useEffect } from 'react';
import type { Client } from '../services/interfaces';
import ErrorBadge from './ErrorBadge';

interface ClientFormProps {
  initialData?: Partial<Client>;
  onSubmit: (data: Partial<Client>) => void;
  isPending: boolean;
  error?: string | null;
  title: string;
}

const ClientForm: React.FC<ClientFormProps> = ({
  initialData,
  onSubmit,
  isPending,
  error,
  title,
}) => {
  const [form, setForm] = useState<Partial<Client>>({
    name: '',
    phone: '',
    cpf: '',
    birth_date: '',
    current_invoice_price: undefined,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        phone: initialData.phone || '',
        cpf: initialData.cpf || '',
        birth_date: initialData.birth_date || '',
        current_invoice_price: initialData.current_invoice_price,
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof typeof form, value: string | number | undefined) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = { ...form };

    if (!dataToSend.cpf || dataToSend.cpf.trim() === '') {
      delete dataToSend.cpf;
    }

    onSubmit(dataToSend);
  };

  return (
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
      <h2 className="mb-4 text-center">{title}</h2>

      <form id="client-form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome:</label>
          <input
            type="text"
            className="form-control"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            title="Por favor, preencha o nome"
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
            title="Por favor, preencha o telefone"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">CPF:</label>
          <input
            type="text"
            className="form-control"
            value={form.cpf}
            onChange={(e) => handleChange('cpf', e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Data de Nascimento:</label>
          <input
            type="date"
            className="form-control"
            value={form.birth_date ? form.birth_date.split('T')[0] : ''}
            onChange={(e) => handleChange('birth_date', e.target.value)}
            required
            title="Por favor, preencha a data de nascimento"
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Mensalidade Atual (R$):</label>
          <input
            type="number"
            className="form-control"
            value={form.current_invoice_price !== undefined ? form.current_invoice_price : ''}
            placeholder="Ex: 150.00"
            onChange={(e) =>
              handleChange(
                'current_invoice_price',
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
            required
            min="0"
            step="0.01"
            title="Por favor, informe o valor da mensalidade"
          />
        </div>

        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-success btn-lg"
            disabled={isPending}
            style={{ minWidth: 140 }}
          >
            {isPending ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-3">
          <ErrorBadge message={error} />
        </div>
      )}
    </div>
  );
};

export default ClientForm;
