// Componente TemplateEditor (Story 1.4.1 - Frontend)
import { useState, useCallback } from 'react';
import {
  Template,
  CreateTemplateRequest,
  TemplateChannel,
  CANAL_LABELS,
  VARIAVEIS_DISPONIVEIS,
} from '../types/template';
import TemplatePreview from './TemplatePreview';

interface TemplateEditorProps {
  template?: Template;
  onSave: (data: CreateTemplateRequest) => Promise<void>;
  onCancel: () => void;
}

export default function TemplateEditor({
  template,
  onSave,
  onCancel,
}: TemplateEditorProps) {
  const [titulo, setTitulo] = useState(template?.titulo || '');
  const [conteudo, setConteudo] = useState(template?.conteudo || '');
  const [canal, setCanal] = useState<TemplateChannel>(template?.canal || 'SMS');
  const [variaveis, setVariaveis] = useState<string[]>(template?.variaveis || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddVariavel = useCallback((variavel: string) => {
    setVariaveis((prev) =>
      prev.includes(variavel) ? prev : [...prev, variavel]
    );
  }, []);

  const handleRemoveVariavel = useCallback((variavel: string) => {
    setVariaveis((prev) => prev.filter((v) => v !== variavel));
  }, []);

  const handleSave = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!titulo.trim()) {
        throw new Error('Título é obrigatório');
      }
      if (!conteudo.trim()) {
        throw new Error('Conteúdo é obrigatório');
      }

      await onSave({
        titulo,
        conteudo,
        canal,
        variaveis,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }, [titulo, conteudo, canal, variaveis, onSave]);

  return (
    <div className="flex gap-6 h-screen bg-gray-50">
      {/* Lado esquerdo: Editor */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-6">
              {template ? 'Editar Template' : 'Novo Template'}
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800">
              {error}
            </div>
          )}

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Template
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Confirmação de Agendamento"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Canal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canal de Envio
            </label>
            <select
              value={canal}
              onChange={(e) => setCanal(e.target.value as TemplateChannel)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(CANAL_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Variáveis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variáveis Disponíveis
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {VARIAVEIS_DISPONIVEIS.map((v) => (
                <button
                  key={v.value}
                  onClick={() => handleAddVariavel(v.value)}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    variaveis.includes(v.value)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            {variaveis.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {variaveis.map((v) => (
                  <span
                    key={v}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {v}
                    <button
                      onClick={() => handleRemoveVariavel(v)}
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo da Mensagem
            </label>
            <textarea
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Digite sua mensagem aqui. Use {variavel} para adicionar placeholders."
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Use chaves para variáveis: {'{nome}'}, {'{data}'}, etc.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 font-medium"
            >
              {loading ? 'Salvando...' : 'Salvar Template'}
            </button>
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 disabled:bg-gray-200 font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* Lado direito: Preview */}
      <div className="flex-1 overflow-auto p-6 bg-white border-l border-gray-200">
        <TemplatePreview
          conteudo={conteudo}
          canal={canal}
          variaveis={variaveis}
        />
      </div>
    </div>
  );
}
