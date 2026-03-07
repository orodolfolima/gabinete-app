import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users, Plus, Search, Phone, Mail, MapPin,
  ChevronLeft, ChevronRight, X, Save, Eye,
  MessageCircle, Trash2,
} from 'lucide-react';
import { useVisitantes } from '../hooks/useVisitantes';
import { Visitante, CreateVisitanteRequest, CATEGORIAS } from '../types/visitante';
import {
  Button, Input, Select, FormField,
} from '../components/ui';

export default function VisitantesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    visitantes, total, loading, error,
    list, create, update, remove, getById, addInteracao,
  } = useVisitantes();

  const [showForm, setShowForm] = useState(searchParams.get('novo') === '1');
  const [showDetail, setShowDetail] = useState<Visitante | null>(null);
  const [editando, setEditando] = useState<Visitante | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [busca, setBusca] = useState('');
  const [page, setPage] = useState(0);
  const limite = 20;

  // Form state
  const [form, setForm] = useState<CreateVisitanteRequest>({
    cpf: '', nome: '', email: '', telefone: '', whatsapp: '', categoria: '',
  });
  const [formError, setFormError] = useState('');
  const [interacaoTipo, setInteracaoTipo] = useState('');
  const [interacaoDesc, setInteracaoDesc] = useState('');

  useEffect(() => {
    list({ categoria: filtroCategoria || undefined, limite, offset: page * limite });
  }, [list, filtroCategoria, page]);

  useEffect(() => {
    if (searchParams.get('novo') === '1') {
      setShowForm(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleSubmit = async () => {
    setFormError('');
    if (!form.cpf || !form.nome) {
      setFormError('CPF e Nome sao obrigatorios');
      return;
    }
    try {
      if (editando) {
        await update(editando.id, form);
      } else {
        await create(form);
      }
      setShowForm(false);
      setEditando(null);
      setForm({
        cpf: '', nome: '', email: '', telefone: '', whatsapp: '', categoria: '',
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar');
    }
  };

  const handleEdit = (v: Visitante) => {
    setEditando(v);
    setForm({
      cpf: v.cpf,
      nome: v.nome,
      email: v.email || '',
      telefone: v.telefone || '',
      whatsapp: v.whatsapp || '',
      categoria: v.categoria || '',
    });
    setShowForm(true);
  };

  const handleViewDetail = async (v: Visitante) => {
    try {
      const detail = await getById(v.id);
      setShowDetail(detail);
    } catch {
      setShowDetail(v);
    }
  };

  const handleAddInteracao = async () => {
    if (!showDetail || !interacaoTipo || !interacaoDesc) return;
    try {
      await addInteracao(showDetail.id, interacaoTipo, interacaoDesc);
      const detail = await getById(showDetail.id);
      setShowDetail(detail);
      setInteracaoTipo('');
      setInteracaoDesc('');
    } catch {
      // error handled
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remover este visitante?')) return;
    try {
      await remove(id);
      setShowDetail(null);
    } catch {
      // error handled
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitantes</h1>
          <p className="text-gray-500 mt-1">{total} cadastrados</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditando(null); setForm({ cpf: '', nome: '' }); }}>
          <Plus className="w-4 h-4" /> Novo Visitante
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filtroCategoria}
          onChange={(e) => { setFiltroCategoria(e.target.value); setPage(0); }}
        >
          <option value="">Todas categorias</option>
          {CATEGORIAS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </Select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>
      )}

      {/* List */}
      {loading && visitantes.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : visitantes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum visitante encontrado</p>
          <Button variant="ghost" size="sm" className="mt-3" onClick={() => setShowForm(true)}>
            + Cadastrar primeiro visitante
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Nome</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 hidden sm:table-cell">Contato</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 hidden md:table-cell">Categoria</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 hidden lg:table-cell">Cidade</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visitantes
                  .filter((v) => !busca || v.nome.toLowerCase().includes(busca.toLowerCase()))
                  .map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{v.nome}</p>
                          <p className="text-xs text-gray-400">CPF: {v.cpf}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="space-y-1">
                          {v.telefone && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {v.telefone}
                            </p>
                          )}
                          {v.email && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {v.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {v.categoria && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                            {v.categoria}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {v.endereco && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {v.endereco.cidade}/{v.endereco.estado}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="icon-view" size="icon" onClick={() => handleViewDetail(v)} title="Ver detalhes">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="icon-edit" size="icon" onClick={() => handleEdit(v)} title="Editar">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="icon-delete" size="icon" onClick={() => handleDelete(v.id)} title="Remover">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > limite && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Mostrando {page * limite + 1}-{Math.min((page + 1) * limite, total)} de {total}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setPage((p) => p + 1)} disabled={(page + 1) * limite >= total}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">{editando ? 'Editar Visitante' : 'Novo Visitante'}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {formError && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{formError}</div>}

              <div className="grid grid-cols-2 gap-4">
                <FormField label="CPF" htmlFor="cpf" required>
                  <Input
                    id="cpf"
                    value={form.cpf}
                    onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    placeholder="00000000000"
                    disabled={!!editando}
                  />
                </FormField>
                <FormField label="Nome" htmlFor="nome" required>
                  <Input
                    id="nome"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Nome completo"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Email" htmlFor="email">
                  <Input
                    id="email"
                    type="email"
                    value={form.email || ''}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </FormField>
                <FormField label="Telefone" htmlFor="telefone">
                  <Input
                    id="telefone"
                    value={form.telefone || ''}
                    onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    placeholder="11999990000"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="WhatsApp" htmlFor="whatsapp">
                  <Input
                    id="whatsapp"
                    value={form.whatsapp || ''}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="11999990000"
                  />
                </FormField>
                <FormField label="Categoria" htmlFor="categoria">
                  <Select
                    id="categoria"
                    value={form.categoria || ''}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  >
                    <option value="">Selecione...</option>
                    {CATEGORIAS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </Select>
                </FormField>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <Button className="flex-1" onClick={handleSubmit} disabled={loading} isLoading={loading} loadingLabel="Salvando...">
                <Save className="w-4 h-4" /> Salvar
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">{showDetail.nome}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowDetail(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Info */}
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="CPF" value={showDetail.cpf} />
                <InfoItem label="Categoria" value={showDetail.categoria || '--'} />
                <InfoItem label="Email" value={showDetail.email || '--'} />
                <InfoItem label="Telefone" value={showDetail.telefone || '--'} />
                <InfoItem label="WhatsApp" value={showDetail.whatsapp || '--'} />
                <InfoItem
                  label="Endereco"
                  value={showDetail.endereco ? `${showDetail.endereco.cidade}/${showDetail.endereco.estado}` : '--'}
                />
              </div>

              {/* Add Interaction */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Nova Interacao</h3>
                <div className="flex gap-2">
                  <Select
                    value={interacaoTipo}
                    onChange={(e) => setInteracaoTipo(e.target.value)}
                  >
                    <option value="">Tipo...</option>
                    <option value="ligacao">Ligacao</option>
                    <option value="email">Email</option>
                    <option value="reuniao">Reuniao</option>
                    <option value="visita">Visita</option>
                  </Select>
                  <Input
                    value={interacaoDesc}
                    onChange={(e) => setInteracaoDesc(e.target.value)}
                    placeholder="Descricao..."
                  />
                  <Button size="sm" onClick={handleAddInteracao} disabled={!interacaoTipo || !interacaoDesc}>
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Interactions */}
              {showDetail.interacoes && showDetail.interacoes.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Historico ({showDetail.interacoes.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {showDetail.interacoes.map((int) => (
                      <div key={int.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 capitalize">{int.tipo}</p>
                          <p className="text-sm text-gray-600">{int.descricao}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(int.data).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
      <p className="text-sm text-gray-900 mt-0.5 capitalize">{value}</p>
    </div>
  );
}
