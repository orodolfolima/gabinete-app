import { useState, useEffect } from 'react';
import TemplateEditor from './components/TemplateEditor';
import { useTemplates } from './hooks/useTemplates';
import { CreateTemplateRequest } from './types/template';

export default function App() {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const { templates, loading, list, create } = useTemplates();

  useEffect(() => {
    list();
  }, [list]);

  const handleSave = async (data: CreateTemplateRequest) => {
    try {
      await create(data);
      setView('list');
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  if (view === 'edit') {
    return (
      <TemplateEditor
        onSave={handleSave}
        onCancel={() => setView('list')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Templates de Mensagens
            </h1>
            <button
              onClick={() => setView('edit')}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-medium"
            >
              + Novo Template
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading && !templates.length ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">Nenhum template criado ainda</p>
            <button
              onClick={() => setView('edit')}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 font-medium"
            >
              Criar Primeiro Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">
                    {template.titulo}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      template.ativo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {template.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Canal
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {template.canal}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">
                      Conteúdo
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {template.conteudo}
                    </p>
                  </div>

                  {template.variaveis.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-medium mb-2">
                        Variáveis
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.variaveis.map((v) => (
                          <span
                            key={v}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
                    v{template.versao} • {new Date(template.criadoEm).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                <button className="w-full mt-4 bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 text-sm font-medium">
                  Editar
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
