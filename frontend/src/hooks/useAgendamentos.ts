import { useState, useCallback } from 'react';
import { Agendamento, CreateAgendamentoRequest, AgendamentoListResponse } from '../types/agendamento';
import { apiFetch } from '../lib/api';

export function useAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const list = useCallback(async (dataInicio?: string, dataFim?: string) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (dataInicio) query.append('dataInicio', dataInicio);
      if (dataFim) query.append('dataFim', dataFim);

      const data = await apiFetch<AgendamentoListResponse>(`/api/agendamentos?${query}`);
      setAgendamentos(data.data);
      setTotal(data.total);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao listar agendamentos');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id: string): Promise<Agendamento> => apiFetch<Agendamento>(`/api/agendamentos/${id}`), []);

  const create = useCallback(async (body: CreateAgendamentoRequest): Promise<Agendamento> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Agendamento>('/api/agendamentos', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setAgendamentos((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar agendamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, body: Partial<CreateAgendamentoRequest & { status: string }>) => {
    setLoading(true);
    try {
      const data = await apiFetch<Agendamento>(`/api/agendamentos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      setAgendamentos((prev) => prev.map((a) => (a.id === id ? data : a)));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(async (id: string, motivo?: string) => {
    await apiFetch(`/api/agendamentos/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ motivo }),
    });
    setAgendamentos((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const checkIn = useCallback(async (id: string) => {
    const result = await apiFetch<{ agendamento: Agendamento }>(`/api/agendamentos/${id}/check-in`, {
      method: 'POST',
    });
    setAgendamentos((prev) => prev.map((a) => (a.id === id ? result.agendamento : a)));
    return result.agendamento;
  }, []);

  const checkOut = useCallback(async (id: string) => {
    const result = await apiFetch<{ agendamento: Agendamento }>(`/api/agendamentos/${id}/check-out`, {
      method: 'POST',
    });
    setAgendamentos((prev) => prev.map((a) => (a.id === id ? result.agendamento : a)));
    return result.agendamento;
  }, []);

  return {
    agendamentos,
    total,
    loading,
    error,
    list,
    getById,
    create,
    update,
    cancel,
    checkIn,
    checkOut,
  };
}
