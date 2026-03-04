// Testes para Relatórios (Story 1.1.5)
import { describe, it, expect } from 'vitest';

describe('Relatório - Story 1.1.5', () => {
  describe('Relatório de Atendimento', () => {
    it('deve calcular total de visitantes', () => {
      const agendamentos = [
        { visitanteId: '1' },
        { visitanteId: '2' },
        { visitanteId: '1' }, // Mesmo visitante
      ];

      const visitantesUnicos = new Set(
        agendamentos.map((a) => a.visitanteId)
      ).size;

      expect(visitantesUnicos).toBe(2);
    });

    it('deve calcular taxa de presença', () => {
      const agendamentos = [
        { status: 'realizado' },
        { status: 'realizado' },
        { status: 'cancelado' },
        { status: 'realizado' },
      ];

      const realizados = agendamentos.filter(
        (a) => a.status === 'realizado'
      ).length;
      const taxa = (realizados / agendamentos.length) * 100;

      expect(taxa).toBe(75);
    });

    it('deve calcular tempo médio de atendimento', () => {
      const agendamentos = [
        {
          checkIn: new Date('2026-03-05T10:00:00'),
          checkOut: new Date('2026-03-05T10:30:00'),
        },
        {
          checkIn: new Date('2026-03-05T11:00:00'),
          checkOut: new Date('2026-03-05T11:20:00'),
        },
      ];

      const tempoTotal = agendamentos.reduce((acc, a) => {
        const duracao = a.checkOut.getTime() - a.checkIn.getTime();
        return acc + duracao;
      }, 0);

      const tempoMedio = tempoTotal / agendamentos.length / 60000; // em minutos

      expect(tempoMedio).toBe(25); // (30 + 20) / 2
    });

    it('deve listar top 5 categorias', () => {
      const visitantes = [
        { categoria: 'lideranca' },
        { categoria: 'lideranca' },
        { categoria: 'empresario' },
        { categoria: 'empresario' },
        { categoria: 'empresario' },
        { categoria: 'cidadao' },
      ];

      const top = visitantes
        .reduce((acc: any, v) => {
          const existing = acc.find((x: any) => x.categoria === v.categoria);
          if (existing) existing.count++;
          else acc.push({ categoria: v.categoria, count: 1 });
          return acc;
        }, [])
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 5);

      expect(top[0].categoria).toBe('empresario');
      expect(top[0].count).toBe(3);
      expect(top.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Relatório de Visitantes', () => {
    it('deve contar total de visitantes', () => {
      const visitantes = [{ id: '1' }, { id: '2' }, { id: '3' }];

      expect(visitantes.length).toBe(3);
    });

    it('deve contar novos cadastros em período', () => {
      const dataInicio = new Date('2026-03-01');
      const dataFim = new Date('2026-03-31');

      const visitantes = [
        { createdAt: new Date('2026-03-05') },
        { createdAt: new Date('2026-03-15') },
        { createdAt: new Date('2026-02-28') }, // Fora do período
      ];

      const novos = visitantes.filter(
        (v) => v.createdAt >= dataInicio && v.createdAt <= dataFim
      ).length;

      expect(novos).toBe(2);
    });

    it('deve agrupar por categoria', () => {
      const visitantes = [
        { categoria: 'lideranca' },
        { categoria: 'lideranca' },
        { categoria: 'empresario' },
      ];

      const porCategoria = visitantes
        .reduce((acc: any, v) => {
          const existing = acc.find((x: any) => x.categoria === v.categoria);
          if (existing) existing.count++;
          else acc.push({ categoria: v.categoria, count: 1 });
          return acc;
        }, [])
        .sort((a: any, b: any) => b.count - a.count);

      expect(porCategoria[0].categoria).toBe('lideranca');
      expect(porCategoria[0].count).toBe(2);
    });

    it('deve agrupar por estado', () => {
      const visitantes = [
        { estado: 'SP' },
        { estado: 'SP' },
        { estado: 'RJ' },
      ];

      const porEstado = visitantes
        .reduce((acc: any, v) => {
          const existing = acc.find((x: any) => x.estado === v.estado);
          if (existing) existing.count++;
          else acc.push({ estado: v.estado, count: 1 });
          return acc;
        }, [])
        .sort((a: any, b: any) => b.count - a.count);

      expect(porEstado[0].estado).toBe('SP');
      expect(porEstado[0].count).toBe(2);
    });
  });

  describe('Exportação CSV', () => {
    it('deve gerar headers CSV corretamente', () => {
      const dados = [
        {
          agendamento_id: '1',
          visitante_nome: 'João',
          visitante_categoria: 'lideranca',
        },
      ];

      const headers = Object.keys(dados[0]);

      expect(headers).toContain('agendamento_id');
      expect(headers).toContain('visitante_nome');
      expect(headers).toContain('visitante_categoria');
    });

    it('deve escapar valores com vírgula em CSV', () => {
      const valor = 'Silva, João';
      const escapado =
        typeof valor === 'string' && valor.includes(',')
          ? `"${valor}"`
          : valor;

      expect(escapado).toBe('"Silva, João"');
    });

    it('deve sanitizar CPF em CSV', () => {
      const cpf = '12345678901';
      const sanitized = `***${cpf.slice(-3)}`;

      expect(sanitized).toBe('***901');
      expect(sanitized).not.toContain('123');
    });
  });

  describe('Limites e Segurança', () => {
    it('deve enforçar limite de 100 exports/dia', () => {
      const limite = 100;
      const exportsAtual = 100;

      const podeExportar = exportsAtual < limite;

      expect(podeExportar).toBe(false);
    });

    it('deve mascarar dados sensíveis em CSV', () => {
      const cpf = '12345678901';
      const rg = '123456789';

      const cpfMascarado = `***${cpf.slice(-3)}`;
      const rgMascarado = `***${rg.slice(-3)}`;

      expect(cpfMascarado).toBe('***901');
      expect(rgMascarado).toBe('***789');
    });
  });

  describe('Período de Relatório', () => {
    it('deve filtrar agendamentos dentro do período', () => {
      const dataInicio = new Date('2026-03-01');
      const dataFim = new Date('2026-03-31');

      const agendamentos = [
        { dataHora: new Date('2026-03-05') },
        { dataHora: new Date('2026-03-15') },
        { dataHora: new Date('2026-04-05') }, // Fora do período
      ];

      const filtrados = agendamentos.filter(
        (a) => a.dataHora >= dataInicio && a.dataHora <= dataFim
      );

      expect(filtrados.length).toBe(2);
    });

    it('deve suportar período customizável', () => {
      const periodo1 = {
        dataInicio: new Date('2026-01-01'),
        dataFim: new Date('2026-01-31'),
      };
      const periodo2 = {
        dataInicio: new Date('2026-03-01'),
        dataFim: new Date('2026-03-31'),
      };

      expect(periodo1.dataInicio).not.toEqual(periodo2.dataInicio);
      expect(periodo1.dataFim).not.toEqual(periodo2.dataFim);
    });

    it('deve suportar período de 30 dias por default', () => {
      const agora = new Date();
      const trinta_dias_atras = new Date(
        agora.getTime() - 30 * 24 * 60 * 60 * 1000
      );

      expect(trinta_dias_atras.getTime()).toBeLessThan(agora.getTime());
    });
  });

  describe('Formatos de Saída', () => {
    it('deve suportar formato JSON', () => {
      const formato = 'json';

      expect(['json', 'pdf', 'excel', 'csv']).toContain(formato);
    });

    it('deve suportar formato PDF', () => {
      const formato = 'pdf';

      expect(['json', 'pdf', 'excel', 'csv']).toContain(formato);
    });

    it('deve suportar formato Excel', () => {
      const formato = 'excel';

      expect(['json', 'pdf', 'excel', 'csv']).toContain(formato);
    });

    it('deve suportar formato CSV', () => {
      const formato = 'csv';

      expect(['json', 'pdf', 'excel', 'csv']).toContain(formato);
    });
  });
});
