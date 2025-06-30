import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import ClientForm from '../components/ClientForm';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import type { Client } from '../services/interfaces';
import { createClient } from '../services/create-client';

const AddClientPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newData: Partial<Client>) => createClient(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      navigate('/clients?created=true');
    },
  });

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

      <ClientForm
        title="Adicionar Cliente"
        onSubmit={(formData) => mutation.mutate(formData)}
        isPending={mutation.isPending}
        error={mutation.isError ? 'Erro ao criar cliente.' : null}
      />
    </div>
  );
};

export default AddClientPage;
