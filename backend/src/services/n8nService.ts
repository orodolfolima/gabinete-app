// Service para n8n Integration (Story 1.4.2)
import axios, { AxiosInstance } from 'axios';

interface ExecutionPayload {
  [key: string]: any;
}

interface ExecutionResult {
  executionId: string;
  workflowName: string;
  status: string;
}

interface WorkflowStatus {
  executionId: string;
  workflowName: string;
  status: 'new' | 'running' | 'success' | 'error' | 'waiting';
  startedAt?: string;
  stoppedAt?: string;
  data?: any;
}

interface HealthCheck {
  ok: boolean;
  version?: string;
  uptime?: number;
}

export class N8nService {
  private client: AxiosInstance;
  private n8nUrl: string;
  private retryAttempts = 3;
  private retryDelay = 1000; // ms

  constructor() {
    this.n8nUrl = process.env.N8N_URL || 'http://n8n:5678';
    this.client = axios.create({
      baseURL: this.n8nUrl,
      timeout: 10000,
    });
  }

  /**
   * Validar payload do webhook
   */
  validarPayload(event: string, data: any): { valido: boolean; erro?: string } {
    const camposObrigatorios: Record<string, string[]> = {
      agendamento_confirmado: ['visitanteId', 'data', 'hora', 'template'],
      agendamento_lembrete_24h: ['visitanteId', 'data', 'hora'],
      agendamento_lembrete_2h: ['visitanteId', 'hora'],
      visita_finalizada: ['visitanteId', 'agendamentoId'],
      demanda_criada: ['demandaId', 'visitanteId', 'tipo'],
      aviso_geral: ['mensagem'],
    };

    const campos = camposObrigatorios[event] || [];
    for (const campo of campos) {
      if (!data[campo]) {
        return {
          valido: false,
          erro: `Campo obrigatório ausente: ${campo}`,
        };
      }
    }

    return { valido: true };
  }

  /**
   * Disparar workflow n8n
   */
  async disparar(event: string, payload: ExecutionPayload): Promise<ExecutionResult> {
    // Mapear evento para webhook n8n
    const workflowWebhooks: Record<string, string> = {
      agendamento_confirmado: 'agendamento-confirmado',
      agendamento_lembrete_24h: 'agendamento-lembrete-24h',
      agendamento_lembrete_2h: 'agendamento-lembrete-2h',
      visita_finalizada: 'visita-finalizada',
      demanda_criada: 'demanda-criada',
      aviso_geral: 'aviso-geral',
    };

    const webhookPath = workflowWebhooks[event];
    if (!webhookPath) {
      throw new Error(`Evento não mapeado: ${event}`);
    }

    try {
      const response = await this.retryRequest(async () =>
        this.client.post(`/webhook/${webhookPath}`, payload)
      );

      return {
        executionId: response.data.executionId || response.data.id || 'unknown',
        workflowName: webhookPath,
        status: 'triggered',
      };
    } catch (error) {
      console.error(`Erro ao disparar workflow ${event}:`, error);
      throw new Error(`Falha ao disparar workflow: ${(error as Error).message}`);
    }
  }

  /**
   * Obter status de execução
   */
  async obterStatus(executionId: string): Promise<WorkflowStatus | null> {
    try {
      const response = await this.client.get(`/api/v1/executions/${executionId}`);

      if (!response.data) return null;

      const data = response.data;
      return {
        executionId: data.id || executionId,
        workflowName: data.workflowName || 'unknown',
        status: data.status || 'unknown',
        startedAt: data.startedAt,
        stoppedAt: data.stoppedAt,
        data: data.data,
      };
    } catch (error) {
      console.error(`Erro ao obter status ${executionId}:`, error);
      return null;
    }
  }

  /**
   * Health check de n8n
   */
  async health(): Promise<HealthCheck> {
    try {
      const response = await axios.get(`${this.n8nUrl}/healthz`, { timeout: 5000 });
      return {
        ok: response.status === 200,
        version: response.data?.version || 'unknown',
        uptime: response.data?.uptime,
      };
    } catch (error) {
      return {
        ok: false,
      };
    }
  }

  /**
   * Listar workflows executados (logs)
   */
  async listarExecucoes(
    limit = 50,
    offset = 0
  ): Promise<{ execucoes: WorkflowStatus[]; total: number }> {
    try {
      const response = await this.client.get('/api/v1/executions', {
        params: { limit, skip: offset },
      });

      const execucoes = (response.data.data || []).map((e: any) => ({
        executionId: e.id,
        workflowName: e.workflowName || 'unknown',
        status: e.status || 'unknown',
        startedAt: e.startedAt,
        stoppedAt: e.stoppedAt,
      }));

      return {
        execucoes,
        total: response.data.count || 0,
      };
    } catch (error) {
      console.error('Erro ao listar execuções:', error);
      return { execucoes: [], total: 0 };
    }
  }

  /**
   * Retry logic para requisições
   */
  private async retryRequest<T>(
    fn: () => Promise<T>,
    attempt = 1
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (attempt < this.retryAttempts) {
        console.warn(
          `Retry ${attempt}/${this.retryAttempts} após ${this.retryDelay}ms`
        );
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        return this.retryRequest(fn, attempt + 1);
      }
      throw error;
    }
  }
}

export const n8nService = new N8nService();
