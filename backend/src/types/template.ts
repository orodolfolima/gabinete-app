// Types para Templates de Mensagens (Story 1.4.1)

export type TemplateChannel = 'SMS' | 'WHATSAPP' | 'EMAIL';

export interface Template {
  id: string;
  titulo: string;
  conteudo: string;
  canal: TemplateChannel;
  variaveis: string[];
  ativo: boolean;
  versao: number;
  criadorId: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface TemplateVersao {
  id: string;
  templateId: string;
  numero: number;
  conteudo: string;
  mudancas?: string;
  criadoEm: Date;
}

export interface CreateTemplateDTO {
  titulo: string;
  conteudo: string;
  canal: TemplateChannel;
  variaveis: string[];
}

export interface UpdateTemplateDTO {
  titulo?: string;
  conteudo?: string;
  canal?: TemplateChannel;
  variaveis?: string[];
  ativo?: boolean;
}

export interface TemplatePreview {
  conteudo: string;
  caracteresUsados: number;
  limiteCanal: number;
  avisos: string[];
}

export const CANAL_LIMITES = {
  SMS: 160,
  WHATSAPP: 4096,
  EMAIL: Infinity,
} as const;

export const VARIAVEIS_DISPONIVEIS = [
  'nome',
  'data',
  'hora',
  'categoria',
  'parlamentar',
  'idade',
  'cidade',
] as const;
