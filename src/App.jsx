import { useEffect, useState } from 'react';
import CadastroClientes from './pages/CadastroClientes';
import ConsultaClientes from './pages/ConsultaClientes';
import Graficos from './pages/Graficos';
import Inicio from './pages/Inicio';

function App() {
  const [selectedView, setSelectedView] = useState('');

  useEffect(() => {
    if (window.electron) {
      window.electron.onCadastroClientes(() => {
        setSelectedView('cadastro-clientes');
      });
      window.electron.onConsultaClientes(() => {
        setSelectedView('consulta-clientes');
      });
      window.electron.onGraficos(() => {
        setSelectedView('graficos');
      });
      window.electron.onInicio(() => {
        setSelectedView(null);
      });
    }
  }, []);

  switch (selectedView) {
    case 'cadastro-clientes':
      return <CadastroClientes />;
    case 'consulta-clientes':
      return <ConsultaClientes />;
    case 'graficos':
      return <Graficos />;
    default:
      return <Inicio />;
  }
}

export default App;
