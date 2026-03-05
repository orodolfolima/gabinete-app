import { useState, useCallback } from 'react';
import { Campanha, CreateCampanhaRequest, CampanhaRelatorio } from '../types/campanha';
import { apiFetch } from '../lib/api';

export function useCampanhas() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const list = useCallback(async (status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (status) query.append('status', status);
      const data = await apiFetch<{ data: Campanha[]; total: number }>(`/api/campanhas?${query}`);
      setCampanhas(data.data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao listar campanhas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (body: CreateCampanhaRequest): Promise<Campanha> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Campanha>('/api/campanhas', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setCampanhas((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar campanha');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const send = useCallback(async (id: string): Promise<CampanhaRelatorio> => {
    const data = await apiFetch<{ relatorio: CampanhaRelatorio }>(`/api/campanhas/${id}/enviar`, {
      method: 'PUT',
    });
    return data.relatorio;
  }, []);

  const getRelatorio = useCallback(async (id: string): Promise<CampanhaRelatorio> => apiFetch<CampanhaRelatorio>(`/api/campanhas/${id}/relatorio`), []);

  return {
    campanhas,
    loading,
    error,
    list,
    create,
    send,
    getRelatorio,
  };
}
