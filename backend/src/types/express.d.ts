// Extensão do tipo Request do Express para incluir user
declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email?: string;
      role?: string;
    };
  }
}
