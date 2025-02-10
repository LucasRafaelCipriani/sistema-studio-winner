import { useEffect, useState } from 'react';
import { getPaymentMethod } from '../utils/get-payment-method';

const ConsultaClientes = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (window.electron) {
      window.electron.onGetUsers((response) => {
        setUsers(response);
      });
    }
  }, []);

  return (
    <section className="p-4 bg-black">
      <h1 className="text-[40px] font-bold text-white">
        Tabela de <span className="text-green-700">Clientes</span>
      </h1>
      {users.length > 0 ? (
        <div className="mt-3 border border-white rounded-lg px-6 py-4 text-white">
          {users.map((user, index) => (
            <div key={index} className="border p-3">
              <p>Nome: {user.nome}</p>
              <p>Telefone: {user.telefone}</p>
              <p>Mensalidade: {user.mensalidade}</p>
              <p>Método de Pagamento: {getPaymentMethod(user.metodo)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-[20px] font-normal text-white text-center">
          Nenhum cliente foi cadastrado.
        </p>
      )}
    </section>
  );
};

export default ConsultaClientes;
