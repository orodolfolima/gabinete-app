export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to SIGGAP
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sistema Integrado de Gestão de Gabinete Parlamentar
        </p>
        <div className="space-y-2 text-gray-700">
          <p>✅ Frontend: React 18 + TypeScript</p>
          <p>✅ Backend: Express.js + Prisma</p>
          <p>✅ Database: PostgreSQL</p>
          <p>✅ Infra: Docker Compose</p>
        </div>
      </div>
    </div>
  );
}
