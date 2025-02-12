import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const Graficos = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (window.electron) {
        setIsLoading(true);
        const usersData = await window.electron.getUsersData();
        setUsers(usersData);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const data = [
    {
      name: 'Cartão',
      valor: users.filter((user) => user.metodo === 'cartao').length,
    },
    {
      name: 'PIX',
      valor: users.filter((user) => user.metodo === 'pix').length,
    },
    {
      name: 'Dinheiro',
      valor: users.filter((user) => user.metodo === 'dinheiro').length,
    },
  ];

  return (
    <section className="p-4 bg-black">
      <h1 className="text-[40px] font-bold text-white">Gráficos</h1>
      {isLoading ? (
        <p className="mt-4 text-[20px] font-normal text-white text-center">
          Carregando...
        </p>
      ) : (
        <div className="mt-5">
          <h2 className="text-[25px] font-bold text-white">
            Métodos de Pagamento{' '}
            <span className="text-[20px] font-normal leading-[37.5px]">
              (quantia de clientes por método)
            </span>
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="white" allowDecimals={false} />
              <YAxis stroke="white" accentHeight={6} allowDecimals={false} />
              <Bar
                dataKey="valor"
                fill="oklch(0.527 0.154 150.069)"
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default Graficos;
