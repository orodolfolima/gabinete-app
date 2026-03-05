import express, {
  Express, Request, Response, NextFunction,
} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import visitantesRouter from './routes/visitantes';
import templatesRouter from './routes/templates';
import agendamentosRouter from './routes/agendamentos';
import campanhasRouter from './routes/campanhas';
import relatoriosRouter from './routes/relatorios';
import webhooksRouter from './routes/webhooks';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'SIGGAP Backend API',
    version: '1.0.0',
    status: 'running',
  });
});

// API Routes
app.use('/api/visitantes', visitantesRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/agendamentos', agendamentosRouter);
app.use('/api/campanhas', campanhasRouter);
app.use('/api/relatorios', relatoriosRouter);
app.use('/api/webhooks', webhooksRouter);

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Backend running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
});
