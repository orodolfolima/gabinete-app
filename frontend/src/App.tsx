import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Visitantes from './pages/Visitantes';
import Agendamentos from './pages/Agendamentos';
import Templates from './pages/Templates';
import Campanhas from './pages/Campanhas';
import Relatorios from './pages/Relatorios';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/visitantes" element={<Visitantes />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/campanhas" element={<Campanhas />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
