// Componente TemplatePreview (Story 1.4.1 - Frontend)
import { useState, useMemo } from 'react';
import { TemplateChannel, CANAL_LABELS } from '../types/template';
import { Input, FormField } from './ui';

interface TemplatePreviewProps {
  conteudo: string;
  canal: TemplateChannel;
  variaveis: string[];
}

const CANAL_LIMITES: Record<TemplateChannel, number> = {
  SMS: 160,
  WHATSAPP: 4096,
  EMAIL: Infinity,
};

export default function TemplatePreview({
  conteudo,
  canal,
  variaveis,
}: TemplatePreviewProps) {
  const [variavelMap, setVariavelMap] = useState<Record<string, string>>({});

  const limite = CANAL_LIMITES[canal];
  const caracteres = conteudo.length;
  const percentual = limite === Infinity ? 0 : (caracteres / limite) * 100;

  // Renderizar conteúdo com substituição de variáveis
  const conteudoRenderizado = useMemo(() => {
    let resultado = conteudo;
    for (const [key, value] of Object.entries(variavelMap)) {
      if (value) {
        resultado = resultado.replace(new RegExp(`{${key}}`, 'g'), value);
      }
    }
    return resultado;
  }, [conteudo, variavelMap]);

  // Determinar cor do indicador
  const getIndicadorColor = () => {
    if (percentual <= 50) return 'bg-green-500';
    if (percentual <= 90) return 'bg-yellow-500';
    if (percentual <= 100) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Avisos
  const avisos = useMemo(() => {
    const msgs: string[] = [];
    if (percentual > 100) {
      msgs.push(`❌ Excede limite em ${caracteres - limite} caracteres`);
    } else if (percentual > 90) {
      msgs.push(`⚠️ Próximo ao limite (${percentual.toFixed(0)}%)`);
    }
    if (variaveis.length === 0 && conteudo.includes('{')) {
      msgs.push('ℹ️ Você tem placeholders mas nenhuma variável selecionada');
    }
    return msgs;
  }, [percentual, caracteres, limite, variaveis, conteudo]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="sticky top-0 bg-white pb-6">
        <h2 className="text-xl font-bold mb-4">Preview</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">
            {CANAL_LABELS[canal]}
          </p>
          {limite !== Infinity && (
            <>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">
                  {caracteres}
                  {' '}
                  /
                  {limite}
                </span>
                <span className={percentual > 100 ? 'text-red-600' : 'text-gray-600'}>
                  {percentual.toFixed(0)}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition ${getIndicadorColor()}`}
                  style={{ width: `${Math.min(percentual, 100)}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mensagem de aviso */}
      {avisos.length > 0 && (
        <div className="space-y-2">
          {avisos.map((aviso, idx) => (
            <div key={idx} className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
              {aviso}
            </div>
          ))}
        </div>
      )}

      {/* Inputs de variáveis */}
      {variaveis.length > 0 && (
        <div className="space-y-3 bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700">
            Substitua as variáveis para preview:
          </p>
          {variaveis.map((variavel) => (
            <FormField key={variavel} label={variavel} htmlFor={`var-preview-${variavel}`}>
              <Input
                id={`var-preview-${variavel}`}
                type="text"
                placeholder={`Digite o valor para {${variavel}}`}
                value={variavelMap[variavel] || ''}
                onChange={(e) => setVariavelMap((prev) => ({
                  ...prev,
                  [variavel]: e.target.value,
                }))}
              />
            </FormField>
          ))}
        </div>
      )}

      {/* Preview da mensagem */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Mensagem Final:</p>
        <div
          className={`p-4 rounded-lg border-2 font-mono text-sm whitespace-pre-wrap break-words ${
            canal === 'SMS'
              ? 'bg-blue-50 border-blue-200 max-h-40 overflow-y-auto'
              : canal === 'WHATSAPP'
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
          }`}
        >
          {conteudoRenderizado || '(mensagem vazia)'}
        </div>
      </div>

      {/* Dicas */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 Dica: SMS tem limite de 160 caracteres por mensagem</p>
        <p>
          💡 Use
          {'{variavel}'}
          {' '}
          para adicionar placeholders dinâmicos
        </p>
        <p>💡 WhatsApp permite formatação com *bold* e _itálico_</p>
      </div>
    </div>
  );
}
