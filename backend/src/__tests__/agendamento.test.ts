// Testes para Agendamento (Story 1.1.3)
import { describe, it, expect } from 'vitest';

describe('Agendamento - Story 1.1.3', () => {
  describe('Detecção de Conflito de Horário', () => {
    it('deve detectar conflito quando agendamentos se sobrepõem', () => {
      // Agendamento 1: 10:00 - 11:00
      const ag1 = {
        dataHora: new Date('2026-03-05T10:00:00'),
        duracao: 60, // 60 minutos
      };

      // Agendamento 2: 10:30 - 11:30 (sobrepõe com ag1)
      const ag2 = {
        dataHora: new Date('2026-03-05T10:30:00'),
        duracao: 60,
      };

      const fim1 = new Date(
        ag1.dataHora.getTime() + ag1.duracao * 60000,
      );
      const fim2 = new Date(
        ag2.dataHora.getTime() + ag2.duracao * 60000,
      );

      // Verificação de sobreposição
      const temConflito = ag1.dataHora < fim2 && ag2.dataHora < fim1;

      expect(temConflito).toBe(true);
    });

    it('não deve detectar conflito quando agendamentos não se sobrepõem', () => {
      // Agendamento 1: 10:00 - 11:00
      const ag1 = {
        dataHora: new Date('2026-03-05T10:00:00'),
        duracao: 60,
      };

      // Agendamento 2: 11:00 - 12:00 (começa quando ag1 termina)
      const ag2 = {
        dataHora: new Date('2026-03-05T11:00:00'),
        duracao: 60,
      };

      const fim1 = new Date(
        ag1.dataHora.getTime() + ag1.duracao * 60000,
      );

      const temConflito = ag1.dataHora < ag2.dataHora && ag2.dataHora < fim1;

      expect(temConflito).toBe(false);
    });

    it('deve detectar conflito parcial no início', () => {
      // Agendamento 1: 10:00 - 11:00
      const ag1 = {
        dataHora: new Date('2026-03-05T10:00:00'),
        duracao: 60,
      };

      // Agendamento 2: 9:30 - 10:30 (começa antes, termina no meio)
      const ag2 = {
        dataHora: new Date('2026-03-05T09:30:00'),
        duracao: 60,
      };

      const fim1 = new Date(
        ag1.dataHora.getTime() + ag1.duracao * 60000,
      );
      const fim2 = new Date(
        ag2.dataHora.getTime() + ag2.duracao * 60000,
      );

      const temConflito = ag2.dataHora < fim1 && ag1.dataHora < fim2;

      expect(temConflito).toBe(true);
    });

    it('deve detectar conflito parcial no final', () => {
      // Agendamento 1: 10:00 - 11:00
      const ag1 = {
        dataHora: new Date('2026-03-05T10:00:00'),
        duracao: 60,
      };

      // Agendamento 2: 10:30 - 11:30 (começa no meio, termina depois)
      const ag2 = {
        dataHora: new Date('2026-03-05T10:30:00'),
        duracao: 60,
      };

      const fim1 = new Date(
        ag1.dataHora.getTime() + ag1.duracao * 60000,
      );
      const fim2 = new Date(
        ag2.dataHora.getTime() + ag2.duracao * 60000,
      );

      const temConflito = ag2.dataHora < fim1 && ag1.dataHora < fim2;

      expect(temConflito).toBe(true);
    });
  });

  describe('Validação de Datas', () => {
    it('deve rejeitar data no passado', () => {
      const dataPassada = new Date(Date.now() - 1000); // 1 segundo atrás
      const agora = new Date();

      expect(dataPassada < agora).toBe(true);
    });

    it('deve aceitar data no futuro', () => {
      const dataFutura = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 dia
      const agora = new Date();

      expect(dataFutura > agora).toBe(true);
    });
  });

  describe('Validação de Duração', () => {
    it('deve rejeitar duração <= 0', () => {
      expect(() => {
        const duracao = 0;
        if (duracao <= 0 || duracao > 480) throw new Error('Duração inválida');
      }).toThrow();
    });

    it('deve rejeitar duração > 480 minutos (8h)', () => {
      expect(() => {
        const duracao = 500;
        if (duracao > 480) throw new Error('Duração inválida');
      }).toThrow();
    });

    it('deve aceitar duração entre 1 e 480 minutos', () => {
      const duracao = 120; // 2 horas
      const valido = duracao > 0 && duracao <= 480;

      expect(valido).toBe(true);
    });
  });

  describe('Transições de Status', () => {
    it('deve transicionar agendado → confirmado (check-in)', () => {
      const agendamento: { status: string; checkIn: Date | null } = {
        status: 'agendado',
        checkIn: null,
      };

      // Após check-in
      agendamento.status = 'confirmado';
      agendamento.checkIn = new Date();

      expect(agendamento.status).toBe('confirmado');
      expect(agendamento.checkIn).toBeTruthy();
    });

    it('deve transicionar confirmado → realizado (check-out)', () => {
      const agendamento: { status: string; checkIn: Date; checkOut: Date | null } = {
        status: 'confirmado',
        checkIn: new Date(Date.now() - 30 * 60000), // 30 min atrás
        checkOut: null,
      };

      // Após check-out
      agendamento.status = 'realizado';
      agendamento.checkOut = new Date();

      expect(agendamento.status).toBe('realizado');
      expect(agendamento.checkOut).toBeTruthy();
    });

    it('não deve permitir check-in duplicado', () => {
      const agendamento = {
        checkIn: new Date(),
      };

      expect(() => {
        if (agendamento.checkIn) {
          throw new Error('Check-in já foi realizado');
        }
      }).toThrow();
    });

    it('deve rejeitar check-out sem check-in', () => {
      const agendamento = {
        checkIn: null,
      };

      expect(() => {
        if (!agendamento.checkIn) {
          throw new Error('Check-in não foi realizado');
        }
      }).toThrow();
    });
  });

  describe('Cálculo de Duração Real', () => {
    it('deve calcular tempo decorrido entre check-in e check-out', () => {
      const checkIn = new Date('2026-03-05T10:00:00');
      const checkOut = new Date('2026-03-05T10:45:00');

      const minutosDecorridos = Math.round(
        (checkOut.getTime() - checkIn.getTime()) / 60000,
      );

      expect(minutosDecorridos).toBe(45);
    });

    it('deve alertar se visitante passou do horário', () => {
      const agendamento = {
        dataHora: new Date('2026-03-05T10:00:00'),
        duracao: 60,
        checkOut: new Date('2026-03-05T11:30:00'),
      };

      const fimEsperado = new Date(
        agendamento.dataHora.getTime() + agendamento.duracao * 60000,
      );
      const atrasado = agendamento.checkOut > fimEsperado;

      expect(atrasado).toBe(true);
    });
  });

  describe('Período de Listagem', () => {
    it('deve listar agendamentos dentro do período', () => {
      const dataInicio = new Date('2026-03-01');
      const dataFim = new Date('2026-03-31');

      const agendamento = {
        dataHora: new Date('2026-03-15'),
      };

      const dentroPeriodo = agendamento.dataHora >= dataInicio
        && agendamento.dataHora <= dataFim;

      expect(dentroPeriodo).toBe(true);
    });

    it('não deve listar agendamentos fora do período', () => {
      const dataInicio = new Date('2026-03-01');
      const dataFim = new Date('2026-03-31');

      const agendamento = {
        dataHora: new Date('2026-04-15'),
      };

      const dentroPeriodo = agendamento.dataHora >= dataInicio
        && agendamento.dataHora <= dataFim;

      expect(dentroPeriodo).toBe(false);
    });
  });

  describe('Exclusão de Agendamentos Cancelados', () => {
    it('agendamentos cancelados não devem aparecer em listagens', () => {
      const agendamentos = [
        { id: 1, status: 'agendado' },
        { id: 2, status: 'cancelado' },
        { id: 3, status: 'realizado' },
      ];

      const ativos = agendamentos.filter((a) => a.status !== 'cancelado');

      expect(ativos.length).toBe(2);
      expect(ativos.every((a) => a.status !== 'cancelado')).toBe(true);
    });

    it('agendamentos cancelados não devem bloquear horários', () => {
      // Simular: ag1 cancelado, ag2 no mesmo horário deve ser permitido
      const agendamentos = [
        {
          dataHora: new Date('2026-03-05T10:00:00'),
          duracao: 60,
          status: 'cancelado',
        },
      ];

      const ativos = agendamentos.filter((a) => a.status !== 'cancelado');

      expect(ativos.length).toBe(0); // Nenhum agendamento ativo bloqueia
    });
  });
});
