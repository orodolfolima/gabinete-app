export interface Endereco {
  id: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Interacao {
  id: string;
  visitanteId: string;
  tipo: string;
  descricao: string;
  data: string;
  usuarioId?: string;
  createdAt: string;
}

export interface Visitante {
  id: string;
  cpf: string;
  rg?: string;
  nome: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  fotoUrl?: string;
  categoria?: string;
  endereco?: Endereco;
  interacoes?: Interacao[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisitanteRequest {
  cpf: string;
  rg?: string;
  nome: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  categoria?: string;
  endereco?: Omit<Endereco, 'id'>;
}

export interface VisitanteListResponse {
  data: Visitante[];
  total: number;
  limite: number;
  offset: number;
  hasMore: boolean;
}

export const CATEGORIAS = [
  { label: 'Lideranca', value: 'lideranca' },
  { label: 'Empresario', value: 'empresario' },
  { label: 'Cidadao', value: 'cidadao' },
  { label: 'Jornalista', value: 'jornalista' },
  { label: 'Servidor', value: 'servidor' },
  { label: 'Outro', value: 'outro' },
] as const;

export const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;
