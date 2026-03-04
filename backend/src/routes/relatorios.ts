// Routes para Relatórios (Story 1.1.5)
import { Router, Request, Response } from 'express';
import { relatorioService } from '../services/relatorioService';

const router = Router();

/**
 * GET /api/relatorios/atendimento
 * Exportar relatório de atendimento (JSON, PDF, Excel)
 */
router.get('/atendimento', async (req: Request, res: Response) => {
  try {
    const formato = (req.query.formato as string) || 'json'; // json, pdf, excel
    const dataInicio = req.query.dataInicio
      ? new Date(req.query.dataInicio as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 dias atrás
    const dataFim = req.query.dataFim
      ? new Date(req.query.dataFim as string)
      : new Date();

    const usuarioId = req.user?.id || 'sistema';

    // Verificar limite
    const podeExportar = await relatorioService.verificarLimiteExports(
      usuarioId,
    );
    if (!podeExportar) {
      return res.status(429).json({
        erro: 'Limite de exports/dia atingido (máximo 100)',
      });
    }

    // Gerar relatório
    const relatorio = await relatorioService.gerarRelatorioAtendimento({
      dataInicio,
      dataFim,
    });

    // Registrar export
    await relatorioService.registrarExport(formato, usuarioId, 'atendimento');

    // Retornar formato solicitado
    if (formato === 'pdf') {
      // TODO: Implementar geração de PDF com PDFKit
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="relatorio-atendimento.pdf"',
      );
      res.send('PDF not yet implemented');
    } else if (formato === 'excel') {
      // TODO: Implementar geração de Excel com xlsx
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="relatorio-atendimento.xlsx"',
      );
      res.send('Excel not yet implemented');
    } else {
      res.json(relatorio);
    }
  } catch (error) {
    res.status(500).json({
      erro: error instanceof Error ? error.message : 'Erro ao gerar relatório',
    });
  }
});

/**
 * GET /api/relatorios/visitantes
 * Exportar relatório de visitantes
 */
router.get('/visitantes', async (req: Request, res: Response) => {
  try {
    const formato = (req.query.formato as string) || 'json';
    const dataInicio = req.query.dataInicio
      ? new Date(req.query.dataInicio as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dataFim = req.query.dataFim
      ? new Date(req.query.dataFim as string)
      : new Date();

    const usuarioId = req.user?.id || 'sistema';

    // Verificar limite
    const podeExportar = await relatorioService.verificarLimiteExports(
      usuarioId,
    );
    if (!podeExportar) {
      return res.status(429).json({
        erro: 'Limite de exports/dia atingido',
      });
    }

    const relatorio = await relatorioService.gerarRelatorioVisitantes({
      dataInicio,
      dataFim,
    });

    await relatorioService.registrarExport(formato, usuarioId, 'visitantes');

    if (formato === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="relatorio-visitantes.pdf"',
      );
      res.send('PDF not yet implemented');
    } else if (formato === 'excel') {
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="relatorio-visitantes.xlsx"',
      );
      res.send('Excel not yet implemented');
    } else {
      res.json(relatorio);
    }
  } catch (error) {
    res.status(500).json({
      erro: error instanceof Error ? error.message : 'Erro ao gerar relatório',
    });
  }
});

/**
 * GET /api/relatorios/csv
 * Exportar dados em CSV para análise externa
 */
router.get('/csv', async (req: Request, res: Response) => {
  try {
    const dataInicio = req.query.dataInicio
      ? new Date(req.query.dataInicio as string)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dataFim = req.query.dataFim
      ? new Date(req.query.dataFim as string)
      : new Date();

    const usuarioId = req.user?.id || 'sistema';

    // Verificar limite
    const podeExportar = await relatorioService.verificarLimiteExports(
      usuarioId,
    );
    if (!podeExportar) {
      return res.status(429).json({
        erro: 'Limite de exports/dia atingido',
      });
    }

    const dados = await relatorioService.gerarCSVData({
      dataInicio,
      dataFim,
    });

    await relatorioService.registrarExport('csv', usuarioId, 'agendamentos');

    // Converter para CSV
    const headers = Object.keys(dados[0] || {});
    const csv = `${headers.join(',')
    }\n${
      dados
        .map((d) => headers
          .map((h) => {
            const val = d[h];
            return typeof val === 'string' && val.includes(',')
              ? `"${val}"`
              : val;
          })
          .join(','))
        .join('\n')}`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="relatorio.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({
      erro: error instanceof Error ? error.message : 'Erro ao gerar CSV',
    });
  }
});

export default router;
