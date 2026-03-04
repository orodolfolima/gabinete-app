// Hook para gerenciar templates (Story 1.4.1 - Frontend)
import { useState, useCallback } from 'react';
import { Template, CreateTemplateRequest, TemplatePreviewResponse } from '../types/template';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Listar templates com filtros
   */
  const list = useCallback(
    async (canal?: string, ativo?: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (canal) params.append('canal', canal);
        if (ativo !== undefined) params.append('ativo', String(ativo));

        const response = await fetch(`${API_URL}/api/templates?${params}`, {
          method: 'GET',
        });

        if (!response.ok) throw new Error('Erro ao listar templates');

        const data = await response.json();
        setTemplates(data.templates);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Obter template por ID
   */
  const getById = useCallback(async (id: string): Promise<Template> => {
    try {
      const response = await fetch(`${API_URL}/api/templates/${id}`);
      if (!response.ok) throw new Error('Template não encontrado');
      return response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      throw err;
    }
  }, []);

  /**
   * Criar novo template
   */
  const create = useCallback(async (data: CreateTemplateRequest): Promise<Template> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro ao criar template');
      }

      const template = await response.json();
      setTemplates((prev) => [template, ...prev]);
      return template;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Atualizar template
   */
  const update = useCallback(
    async (id: string, data: Partial<CreateTemplateRequest>): Promise<Template> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/templates/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.erro || 'Erro ao atualizar template');
        }

        const template = await response.json();
        setTemplates((prev) => prev.map((t) => (t.id === id ? template : t)));
        return template;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Deletar template
   */
  const delete_ = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/templates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao deletar template');

      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Gerar preview com substituição de variáveis
   */
  const preview = useCallback(
    async (id: string, variavelMap: Record<string, string>): Promise<TemplatePreviewResponse> => {
      try {
        const response = await fetch(`${API_URL}/api/templates/${id}/preview`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ variaveis: variavelMap }),
        });

        if (!response.ok) throw new Error('Erro ao gerar preview');
        return response.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(message);
        throw err;
      }
    },
    [],
  );

  return {
    templates,
    loading,
    error,
    list,
    getById,
    create,
    update,
    delete: delete_,
    preview,
  };
}
