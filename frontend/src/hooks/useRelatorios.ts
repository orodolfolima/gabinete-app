import { useState, useCallback } from 'react';
import { RelatorioAtendimento, RelatorioVisitantes } from '../types/relatorio';
import { apiFetch } from '../lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useRelatorios() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAtendimento = useCallback(async (
    dataInicio?: string,
    dataFim?: string,
  ): Promise<RelatorioAtendimento> => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (dataInicio) query.append('dataInicio', dataInicio);
      if (dataFim) query.append('dataFim', dataFim);
      return await apiFetch<RelatorioAtendimento>(`/api/relatorios/atendimento?${query}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar relatorio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getVisitantes = useCallback(async (
    dataInicio?: string,
    dataFim?: string,
  ): Promise<RelatorioVisitantes> => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (dataInicio) query.append('dataInicio', dataInicio);
      if (dataFim) query.append('dataFim', dataFim);
      return await apiFetch<RelatorioVisitantes>(`/api/relatorios/visitantes?${query}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar relatorio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadCSV = useCallback(async (dataInicio?: string, dataFim?: string) => {
    const query = new URLSearchParams();
    if (dataInicio) query.append('dataInicio', dataInicio);
    if (dataFim) query.append('dataFim', dataFim);

    const response = await fetch(`${API_URL}/api/relatorios/csv?${query}`);
    if (!response.ok) throw new Error('Erro ao exportar CSV');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }, []);

  return {
    loading,
    error,
    getAtendimento,
    getVisitantes,
    downloadCSV,
  };
}
