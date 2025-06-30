import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientById } from '../services/get-client';
import { updateClient } from '../services/update-client';
import ClientForm from '../components/ClientForm';
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
      queryClient.invalidateQueries({ queryKey: ['client', id], refetchType: 'none' });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      navigate('/clients?updated=true', { replace: true });
    },
  });

  useEffect(() => {
    if (!id) navigate('/clients');
  }, [id, navigate]);

  if (isLoading) return <p>Carregando cliente...</p>;
  if (isError) return <p>Erro ao carregar cliente.</p>;

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
        title="Editar Cliente"
        initialData={data?.data}
        onSubmit={(formData) => mutation.mutate(formData)}
        isPending={mutation.isPending}
        error={mutation.isError ? 'Erro ao atualizar cliente.' : null}
      />
    </div>
  );
};

export default EditClientPage;
