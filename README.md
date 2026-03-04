# SIGGAP - Sistema Integrado de Gestão de Gabinete Parlamentar

MVP (Minimum Viable Product) completo para gestão de gabinetes parlamentares.

## 📋 Características

- ✅ **Frontend**: React 18 + TypeScript + Tailwind CSS
- ✅ **Backend**: Express.js + TypeScript + Prisma ORM
- ✅ **Database**: PostgreSQL 15
- ✅ **Infrastructure**: Docker + Docker Compose
- ✅ **Code Quality**: ESLint + Prettier + TypeScript strict mode
- ✅ **Git Hooks**: Husky + lint-staged

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- Docker & Docker Compose
- Git

### Setup Local

```bash
# 1. Clone o repositório
git clone https://github.com/orodolfolima/gabinete-app.git
cd gabinete-app

# 2. Instale dependências
npm install

# 3. Configure Husky
npx husky install

# 4. Crie arquivo .env
cp .env.example .env

# 5. Inicie containers
docker-compose up

# 6. Aguarde inicialização (30-60 segundos)

# 7. Teste endpoints
curl http://localhost:5000/health
# Esperado: {"status":"ok","timestamp":"2026-03-03T..."}

# 8. Acesse aplicação
open http://localhost:3000
# Esperado: "Welcome to SIGGAP" page
```

## 📂 Estrutura de Pastas

```
projeto-root/
├── frontend/                 # React application
│   ├── src/
│   │   ├── App.tsx          # Main component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Tailwind styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── Dockerfile
│
├── backend/                  # Express API
│   ├── src/
│   │   └── server.ts        # Main server
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── docker-compose.yml        # Multi-container setup
├── .env.example              # Environment variables template
├── .gitignore
└── README.md                 # This file
```

## 🔧 Scripts Disponíveis

### Frontend
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run typecheck    # TypeScript type checking
```

### Backend
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript
npm run start        # Run compiled code
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run typecheck    # TypeScript type checking
npm run db:migrate   # Run Prisma migrations
npm run db:studio    # Open Prisma Studio UI
```

### Docker
```bash
docker-compose up              # Start all services
docker-compose up -d           # Start in background
docker-compose down            # Stop all services
docker-compose logs -f backend # View backend logs
docker-compose logs -f db      # View database logs
```

## 📊 API Endpoints

### Health Check
```
GET /health
Response: { "status": "ok", "timestamp": "..." }
```

### Root
```
GET /
Response: { "message": "SIGGAP Backend API", "version": "1.0.0", ... }
```

## 🔐 Environment Variables

Ver `.env.example` para lista completa:

- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)
- `PORT` - Backend port (5000)
- `FRONTEND_URL` - Frontend URL for CORS
- `WHATSAPP_API_KEY` - WhatsApp integration (opcional)
- E mais...

## 🧪 Testes

```bash
# Lint verification
npm run lint

# Type checking
npm run typecheck

# All checks (lint + typecheck)
npm run lint && npm run typecheck
```

## 📚 Documentação

- [Architecture](docs/architecture/) - Sistema arquitetura
- [Stories](docs/stories/) - 19 histórias de desenvolvimento
- [PRD](docs/prd/) - Documento de requisitos
- [Epic](docs/epics/) - Planejamento geral

## 🔄 Development Workflow

1. **Create feature branch**: `git checkout -b feature/description`
2. **Make changes**: Implemente a funcionalidade
3. **Run checks**: `npm run lint && npm run typecheck`
4. **Commit**: `git commit -m "type: message"`
5. **Create PR**: Solicite review no GitHub
6. **Merge**: Após aprovação

## 🚀 Deployment

Sistema pronto para deployment via:
- Docker Hub push
- GitHub Container Registry
- Cloud platforms (Heroku, Railway, Render, etc)

## 📞 Support

Para issues e dúvidas, abra uma issue no GitHub.

## 📄 License

MIT - Veja LICENSE para detalhes

---

**Desenvolvido com ❤️ por Dex (Dev Agent)**
