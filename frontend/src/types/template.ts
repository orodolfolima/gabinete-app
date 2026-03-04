// Types para Templates (Story 1.4.1 - Frontend)

export type TemplateChannel = 'SMS' | 'WHATSAPP' | 'EMAIL';

export interface Template {
  id: string;
  titulo: string;
  conteudo: string;
  canal: TemplateChannel;
  variaveis: string[];
  ativo: boolean;
  versao: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateTemplateRequest {
  titulo: string;
  conteudo: string;
  canal: TemplateChannel;
  variaveis: string[];
}

export interface TemplatePreviewResponse {
  conteudo: string;
  caracteresUsados: number;
  limiteCanal: number;
  avisos: string[];
}

export const CANAL_LABELS: Record<TemplateChannel, string> = {
  SMS: 'SMS (160 caracteres)',
  WHATSAPP: 'WhatsApp (4.096 caracteres)',
  EMAIL: 'Email (sem limite)',
};

export const VARIAVEIS_DISPONIVEIS = [
  { label: 'Nome', value: 'nome' },
  { label: 'Data', value: 'data' },
  { label: 'Hora', value: 'hora' },
  { label: 'Categoria', value: 'categoria' },
  { label: 'Parlamentar', value: 'parlamentar' },
  { label: 'Idade', value: 'idade' },
  { label: 'Cidade', value: 'cidade' },
] as const;
