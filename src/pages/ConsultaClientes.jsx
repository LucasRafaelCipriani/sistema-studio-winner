import { useEffect, useRef, useState } from 'react';
import { getPaymentMethod } from '../utils/get-payment-method';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { toast, ToastContainer } from 'react-toastify';

const ConsultaClientes = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);

  const editUser = () => console.log('Edit');

  const deleteUser = async (user) => {
    if (window.electron) {
      const userConfirmed = await window.electron.confirmDeletion();

      if (userConfirmed) {
        ref.current = false;
        window.electron.deleteUserData(user);
        setUsers((prev) => prev.filter((item) => item.id !== user.id));
      }
    }
  };

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

  useEffect(() => {
    if (window.electron) {
      window.electron.onUserResponse((isSuccess, isDeleting = false) => {
        if (!ref.current) {
          ref.current = true;
          if (isSuccess) {
            toast.success(
              isDeleting
                ? 'Cliente removido com sucesso!'
                : 'Cliente salvo com sucesso!',
              {
                toastId: new Date().getTime(),
              }
            );
          } else {
            toast.error(
              'Um erro ocorreu ao tentar salvar um cliente. Por favor, tente novamente.',
              {
                toastId: new Date().getTime(),
              }
            );
          }
        }
      });
    }
  }, []);

  return (
    <section className="p-4 bg-black">
      <h1 className="text-[40px] font-bold text-white">
        Tabela de <span className="text-green-700">Clientes</span>
      </h1>
      {isLoading ? (
        <p className="mt-4 text-[20px] font-normal text-white text-center">
          Carregando...
        </p>
      ) : (
        <>
          {users.length > 0 ? (
            <div className="mt-3 border border-white rounded-lg px-6 py-4 text-white">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="border p-3 flex justify-between items-center"
                >
                  <div className="flex flex-col gap-y-3 text-[18px]">
                    <p>Nome: {user.nome}</p>
                    <p>Telefone: {user.telefone}</p>
                    <p>Mensalidade: {user.mensalidade}</p>
                    <p>Método de Pagamento: {getPaymentMethod(user.metodo)}</p>
                  </div>
                  <div className="flex flex-row gap-x-4">
                    <button
                      onClick={editUser}
                      title="Editar cliente"
                      className="cursor-pointer"
                    >
                      <IconPencil size={30} />
                    </button>
                    <button
                      onClick={() => deleteUser(user)}
                      title="Deletar cliente"
                      className="cursor-pointer"
                    >
                      <IconTrash size={30} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-[20px] font-normal text-white text-center">
              Nenhum cliente foi cadastrado.
            </p>
          )}
        </>
      )}
      <ToastContainer
        limit={1}
        position="bottom-right"
        toastStyle={{ width: '100%' }}
      />
    </section>
  );
};

export default ConsultaClientes;
