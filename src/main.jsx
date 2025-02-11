import './index.css';
import { StrictMode } from 'react';
import { HashRouter, Route, Routes } from 'react-router';
import { createRoot } from 'react-dom/client';
import CadastroClientes from './pages/CadastroClientes.jsx';
import Inicio from './pages/Inicio.jsx';
import ConsultaClientes from './pages/ConsultaClientes.jsx';
import Graficos from './pages/Graficos.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <main className="bg-black h-full">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/cadastro-clientes" element={<CadastroClientes />} />
          <Route path="/consulta-clientes" element={<ConsultaClientes />} />
          <Route path="/graficos" element={<Graficos />} />
        </Routes>
      </main>
    </HashRouter>
  </StrictMode>
);
