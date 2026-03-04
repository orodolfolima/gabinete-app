// Types para Visitante (Story 1.1.1)

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
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Endereco {
  id: string;
  visitanteId: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Interacao {
  id: string;
  visitanteId: string;
  tipo?: string;
  descricao?: string;
  data: Date;
  usuarioId?: string;
  createdAt: Date;
}

export interface Agendamento {
  id: string;
  visitanteId: string;
  dataHora: Date;
  duracao: number; // minutos
  tipo: string;
  assunto: string;
  status: string;
  checkIn?: Date;
  checkOut?: Date;
  responsavel?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Demanda {
  id: string;
  protocolo: string;
  visitanteId: string;
  tipo: string;
  titulo: string;
  descricao: string;
  prioridade: string;
  status: string;
  responsavel?: string;
  prazaEstimado?: Date;
  dataConclusao?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tramitacao {
  id: string;
  demandaId: string;
  usuarioId: string;
  statusAnterior: string;
  statusNovo: string;
  descricao?: string;
  createdAt: Date;
}

// DTO para criar visitante
export interface CreateVisitanteDTO {
  cpf: string;
  rg?: string;
  nome: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  categoria?: string;
  endereco?: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
}

export interface UpdateVisitanteDTO {
  rg?: string;
  nome?: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  fotoUrl?: string;
  categoria?: string;
}

// Categorias de visitante
export const CATEGORIAS_VISITANTE = [
  'lideranca',
  'empresario',
  'cidadao',
  'jornalista',
  'servidor',
  'outro',
] as const;

// Estados brasileiros
export const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

// Validações
export const validarCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;

  // Validação básica de CPF (algoritmo oficial)
  let sum = 0;
  let remainder: number;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

  return true;
};

export const validarCEP = (cep: string): boolean => {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.length === 8;
};

export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarTelefone = (telefone: string): boolean => {
  const cleaned = telefone.replace(/\D/g, '');
  return cleaned.length === 11; // Brasil: (XX) 9XXXX-XXXX
};
