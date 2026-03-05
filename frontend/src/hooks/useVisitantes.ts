import { useState, useCallback } from 'react';
import { Visitante, CreateVisitanteRequest, VisitanteListResponse } from '../types/visitante';
import { apiFetch } from '../lib/api';

export function useVisitantes() {
  const [visitantes, setVisitantes] = useState<Visitante[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const list = useCallback(async (params?: {
    categoria?: string;
    cidade?: string;
    limite?: number;
    offset?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (params?.categoria) query.append('categoria', params.categoria);
      if (params?.cidade) query.append('cidade', params.cidade);
      if (params?.limite) query.append('limite', String(params.limite));
      if (params?.offset) query.append('offset', String(params.offset));

      const data = await apiFetch<VisitanteListResponse>(`/api/visitantes?${query}`);
      setVisitantes(data.data);
      setTotal(data.total);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao listar visitantes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id: string): Promise<Visitante> => {
    const data = await apiFetch<Visitante>(`/api/visitantes/${id}`);
    return data;
  }, []);

  const create = useCallback(async (body: CreateVisitanteRequest): Promise<Visitante> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Visitante>('/api/visitantes', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setVisitantes((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar visitante');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, body: Partial<CreateVisitanteRequest>): Promise<Visitante> => {
    setLoading(true);
    try {
      const data = await apiFetch<Visitante>(`/api/visitantes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      setVisitantes((prev) => prev.map((v) => (v.id === id ? data : v)));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await apiFetch(`/api/visitantes/${id}`, { method: 'DELETE' });
      setVisitantes((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addInteracao = useCallback(async (visitanteId: string, tipo: string, descricao: string) => {
    await apiFetch(`/api/visitantes/${visitanteId}/interacao`, {
      method: 'POST',
      body: JSON.stringify({ tipo, descricao }),
    });
  }, []);

  return {
    visitantes,
    total,
    loading,
    error,
    list,
    getById,
    create,
    update,
    remove,
    addInteracao,
  };
}
