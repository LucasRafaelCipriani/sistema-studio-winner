import { useEffect, useRef, useState } from 'react';
import { useToggle } from 'react-use';
import { getPaymentMethod } from '../utils/get-payment-method';
import { IconPencil, IconTrash, IconX } from '@tabler/icons-react';
import { toast, ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import { Controller, useForm } from 'react-hook-form';
import EdicaoCliente from './EdicaoCliente';
import { cn } from '../utils/cn';
import MaskedInput from 'react-text-mask';
import { useMoney } from '../hooks/useMoney';

function formatMoney(value) {
  if (value.includes(',')) return value;

  const price = Number(value.replace(/\D/g, ''));

  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const ConsultaClientes = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpened, setIsFilterOpened] = useToggle(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isEditModalOpened, setIsEditModalOpened] = useState(false);
  const ref = useRef(null);
  const money = useMoney();

  const { register, handleSubmit, formState, reset, control } = useForm({
    defaultValues: {
      nome: '',
      telefone: '',
      mensalidade: '',
      metodo: '',
      instagram: '',
      plano: '',
      vencimento: '',
      observacoes: '',
    },
  });

  const editUser = (user) => {
    if (window.electron) {
      setIsEditModalOpened(true);
      setEditedUser(user);
    }
  };

  const onEditUser = (user) => {
    setUsers((prev) => {
      const index = prev.findIndex((item) => item.id === user.id);

      prev[index] = user;

      return prev;
    });

    toast.success('Cliente salvo com sucesso!', {
      toastId: new Date().getTime(),
    });
  };

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

  const onFilterUsers = async (data) => {
    if (window.electron) {
      setIsLoading(true);
      const filteredUsers = await window.electron.filterUsersData({
        ...data,
        mensalidade: money.formatMoney(data.mensalidade),
      });
      setUsers(filteredUsers);
      setIsLoading(false);
    }
  };

  const resetFilters = async () => {
    if (window.electron) {
      setIsLoading(true);
      const usersData = await window.electron.getUsersData();
      setUsers(usersData);
      setIsLoading(false);
      reset();
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
      <div className="mb-3 flex justify-end flex-col items-end text-white">
        <button
          className="bg-green-700 text-white p-3 rounded-lg hover:bg-green-950 cursor-pointer"
          onClick={setIsFilterOpened}
        >
          {isFilterOpened ? 'Fechar' : 'Abrir'} Filtros
        </button>
        {isFilterOpened ? (
          <form
            className="mt-5 flex flex-col gap-x-4 gap-y-10 mb-3 border p-6 rounded-lg w-fit"
            onSubmit={handleSubmit(onFilterUsers)}
          >
            <div className="flex flex-row gap-x-10 justify-end">
              <div className="flex flex-col">
                <label>Nome:</label>
                <input
                  type="text"
                  className="border-b text-[20px] focus-within:outline-none"
                  placeholder="Carlos Alberto"
                  {...register('nome')}
                />
              </div>
              <div className="flex flex-col">
                <label>Telefone:</label>
                <Controller
                  name="telefone"
                  control={control}
                  render={({ field }) => (
                    <MaskedInput
                      {...field}
                      mask={[
                        '(',
                        /\d/,
                        /\d/,
                        ')',
                        ' ',
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        '-',
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                      ]}
                      type="text"
                      name="telefone"
                      id="telefone"
                      className="border-b text-[20px] focus-within:outline-none"
                      placeholder="(99) 99999-9999"
                      guide={false}
                      ref={(input) => {
                        field.ref({
                          focus: () => input && input.inputElement.focus(),
                        });
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col">
                <label>Mensalidade:</label>
                <Controller
                  name="mensalidade"
                  control={control}
                  render={({ field }) => (
                    <MaskedInput
                      {...field}
                      mask={money.moneyMask}
                      type="text"
                      name="mensalidade"
                      id="mensalidade"
                      className="border-b text-[20px] focus-within:outline-none"
                      placeholder="R$ 0,00"
                      guide={false}
                      onBlur={(event) => {
                        event.target.value = money.formatMoney(
                          event.target.value
                        );
                        field.value = money.formatMoney(event.target.value);
                      }}
                      ref={(input) => {
                        field.ref({
                          focus: () => input && input.inputElement.focus(),
                        });
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col">
                <label>Método de Pagamento:</label>
                <div className="flex flex-col gap-y-2">
                  <label className="text-[20px] flex gap-x-2">
                    <input
                      type="radio"
                      value="pix"
                      name="metodo"
                      {...register('metodo')}
                    />
                    Pix
                  </label>
                  <label className="text-[20px] flex gap-x-2">
                    <input
                      type="radio"
                      value="cartao"
                      name="metodo"
                      {...register('metodo')}
                    />
                    Cartão Débito/Crédito
                  </label>
                  <label className="text-[20px] flex gap-x-2">
                    <input
                      type="radio"
                      value="dinheiro"
                      name="metodo"
                      {...register('metodo')}
                    />
                    Dinheiro
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-1 justify-end gap-x-4">
              <button
                disabled={formState.isLoading}
                className="bg-green-700 text-white p-3 rounded-lg hover:bg-green-950 cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed"
                type="button"
                onClick={resetFilters}
              >
                Resetar Filtros
              </button>
              <button
                disabled={!formState.isValid || formState.isLoading}
                className="bg-green-700 text-white p-3 rounded-lg hover:bg-green-950 cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed"
                type="submit"
              >
                Filtrar Clientes
              </button>
            </div>
          </form>
        ) : null}
      </div>
      {isLoading ? (
        <p className="mt-4 text-[20px] font-normal text-white text-center">
          Carregando...
        </p>
      ) : (
        <>
          {users.length > 0 ? (
            <div className="mt-3 border-white rounded-lg py-4 text-white">
              <div className="border p-3 flex justify-between items-center bg-green-900">
                <p className="w-[20%] text-left">Nome</p>
                <p className="w-[20%] text-center">Telefone</p>
                <p className="w-[20%] text-center">Mensalidade</p>
                <p className="w-[20%] text-center">Método de Pagamento</p>
                <p className="w-[20%] text-right">Ações</p>
              </div>
              {users.map((user, index) => (
                <div
                  key={index}
                  className={cn(
                    'border p-3 flex justify-between items-center',
                    {
                      'bg-gray-800': index % 2 !== 0,
                    }
                  )}
                >
                  <p className="w-[20%] text-left">{user.nome}</p>
                  <p className="w-[20%] text-center">{user.telefone}</p>
                  <p className="w-[20%] text-center">
                    {formatMoney(user.mensalidade)}
                  </p>
                  <p className="w-[20%] text-center">
                    {getPaymentMethod(user.metodo)}
                  </p>
                  <div className="flex flex-row gap-x-4 w-[20%] justify-end">
                    <button
                      onClick={() => editUser(user)}
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
      <Modal
        isOpen={isEditModalOpened && editedUser}
        onRequestClose={() => setIsEditModalOpened(false)}
        style={{ content: { padding: 0 } }}
      >
        <div className="h-full bg-black text-white relative">
          <IconX
            className="right-4 top-4 absolute cursor-pointer"
            size={40}
            onClick={() => setIsEditModalOpened(false)}
          />
          <EdicaoCliente
            user={editedUser}
            onEditUser={onEditUser}
            closeModal={setIsEditModalOpened}
          />
        </div>
      </Modal>
      <ToastContainer
        limit={1}
        position="bottom-right"
        toastStyle={{ width: '100%' }}
        autoClose={1000}
        closeButton={false}
      />
    </section>
  );
};

export default ConsultaClientes;
