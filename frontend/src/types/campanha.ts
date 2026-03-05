export interface Campanha {
  id: string;
  titulo: string;
  templateId: string;
  destinatarios: number;
  segmentacao: string;
  status: string;
  dataAgendamento?: string;
  criadoEm: string;
}

export interface CreateCampanhaRequest {
  titulo: string;
  templateId: string;
  segmentacao: {
    categoria?: string;
    cidade?: string;
    dataMinima?: string;
    ultVisita?: number;
    tags?: string[];
  };
  envioImediato?: boolean;
  dataAgendamento?: string;
}

export interface CampanhaRelatorio {
  total: number;
  entregues: number;
  falhas: number;
  bounces: number;
  taxaEntrega: number;
}
