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
import {
  Button, Input, Select, Textarea, FormField,
} from './ui';

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
    setVariaveis((prev) => (prev.includes(variavel) ? prev : [...prev, variavel]));
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
          <FormField label="Título do Template" htmlFor="titulo">
            <Input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Confirmação de Agendamento"
            />
          </FormField>

          {/* Canal */}
          <FormField label="Canal de Envio" htmlFor="canal">
            <Select
              id="canal"
              value={canal}
              onChange={(e) => setCanal(e.target.value as TemplateChannel)}
            >
              {Object.entries(CANAL_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
          </FormField>

          {/* Variáveis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variáveis Disponíveis
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {VARIAVEIS_DISPONIVEIS.map((v) => (
                <Button
                  key={v.value}
                  size="sm"
                  variant="outline"
                  className={variaveis.includes(v.value) ? 'bg-indigo-100 text-indigo-700 border-transparent ring-1 ring-indigo-300' : ''}
                  onClick={() => handleAddVariavel(v.value)}
                >
                  {v.label}
                </Button>
              ))}
            </div>
            {variaveis.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {variaveis.map((v) => (
                  <span
                    key={v}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {v}
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-indigo-600 hover:text-indigo-800 hover:bg-transparent font-bold"
                      onClick={() => handleRemoveVariavel(v)}
                    >
                      ×
                    </Button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <FormField label="Conteúdo da Mensagem" htmlFor="conteudo">
            <Textarea
              id="conteudo"
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Digite sua mensagem aqui. Use {variavel} para adicionar placeholders."
              rows={8}
              className="font-mono"
            />
            <p className="text-xs text-gray-500 mt-2">
              Use chaves para variáveis:
              {' '}
              {'{nome}'}
              ,
              {' '}
              {'{data}'}
              , etc.
            </p>
          </FormField>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1" onClick={handleSave} disabled={loading} isLoading={loading} loadingLabel="Salvando...">
              Salvar Template
            </Button>
            <Button variant="secondary" className="flex-1" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
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
