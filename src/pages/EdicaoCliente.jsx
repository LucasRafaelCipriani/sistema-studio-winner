/* eslint-disable react/prop-types */
import MaskedInput from 'react-text-mask';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { useMoney } from '../hooks/useMoney';
import { useState } from 'react';

const EdicaoCliente = ({ user, onEditUser, closeModal }) => {
  const [date, setDate] = useState(user?.vencimento ?? null);
  const { register, handleSubmit, control, formState } = useForm({
    defaultValues: user,
  });
  const money = useMoney();

  const onSubmit = (data) => {
    if (Object.keys(formState.errors).length <= 0) {
      if (window.electron) {
        window.electron.editUserData({
          ...data,
          mensalidade: money.formatMoney(data.mensalidade),
        });
        onEditUser(data);
        closeModal(false);
      }
    }
  };

  return (
    <section className="p-4 bg-black">
      <h1 className="text-[40px] font-bold text-white">
        Edição de <span className="text-green-700">Cliente</span>
      </h1>
      <form
        className="mt-5 border-white rounded-lg py-4 text-white"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center mb-6 gap-y-6">
          <div className="flex flex-row gap-x-6 w-full">
            <div className="flex flex-col items-end flex-1 border rounded-md p-4">
              <div className="flex flex-row w-full">
                <label htmlFor="nome" className="text-[20px]">
                  Nome:
                </label>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  placeholder="Carlos Alberto"
                  className="w-full border-b text-[20px] ml-3 focus-within:outline-none"
                  {...register('nome', { required: true })}
                />
              </div>
            </div>
            <div className="flex flex-col items-end flex-1 border rounded-md p-4">
              <div className="flex flex-row w-full">
                <label htmlFor="telefone" className="text-[20px]">
                  Telefone:
                </label>
                <Controller
                  name="telefone"
                  rules={{ required: true }}
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
                      className="w-full border-b text-[20px] ml-3 focus-within:outline-none"
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
            </div>
          </div>
          <div className="flex flex-row gap-x-6 w-full">
            <div className="flex flex-col items-end flex-1 border rounded-md p-4">
              <div className="flex flex-row w-full">
                <label htmlFor="mensalidade" className="text-[20px]">
                  Mensalidade:
                </label>
                <Controller
                  name="mensalidade"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <MaskedInput
                      {...field}
                      mask={money.moneyMask}
                      type="text"
                      name="mensalidade"
                      id="mensalidade"
                      className="w-full border-b text-[20px] ml-3 focus-within:outline-none"
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
            </div>
            <div className="flex flex-col items-end flex-1 border rounded-md p-4">
              <div className="flex flex-row w-full">
                <label className="text-[20px]">Método de Pagamento:</label>
                <div className="flex flex-col ml-3 gap-y-2">
                  <label className="text-[20px] flex gap-x-2">
                    <input
                      type="radio"
                      value="pix"
                      name="metodo"
                      {...register('metodo', { required: true })}
                    />
                    Pix
                  </label>
                  <label className="text-[20px] flex gap-x-2">
                    <input
                      type="radio"
                      value="cartao"
                      name="metodo"
                      {...register('metodo', { required: true })}
                    />
                    Cartão Débito/Crédito
                  </label>
                  <label className="text-[20px] flex gap-x-2">
                    <input
                      type="radio"
                      value="dinheiro"
                      name="metodo"
                      {...register('metodo', { required: true })}
                    />
                    Dinheiro
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-x-6 w-full">
            <div className="flex flex-col items-end flex-1 border rounded-md p-4">
              <div className="flex flex-row w-full">
                <label htmlFor="instagram" className="text-[20px]">
                  Instagram:
                </label>
                <input
                  type="text"
                  name="instagram"
                  id="instagram"
                  placeholder="@carlos.alberto"
                  className="w-full border-b text-[20px] ml-3 focus-within:outline-none"
                  {...register('instagram', { required: false })}
                />
              </div>
            </div>
            <div className="flex flex-col items-end flex-1 border rounded-md p-4">
              <div className="flex flex-row w-full">
                <label className="text-[20px]" htmlFor="plano">
                  Plano:
                </label>
                <select
                  name="plano"
                  id="plano"
                  className="w-full border-b text-[20px] ml-3 focus-within:outline-none"
                  {...register('plano', { required: true })}
                >
                  <option value="" disabled>
                    Selecione um plano
                  </option>
                  <option className="text-black">Mensal</option>
                  <option className="text-black">Semestral</option>
                  <option className="text-black">Anual</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-x-6 w-full">
            <div className="flex flex-col items-end flex-1 border rounded-md p-4">
              <div className="flex flex-row w-full vencimento-input">
                <label htmlFor="vencimento" className="text-[20px]">
                  Vencimento:
                </label>
                <div className="w-full">
                  <Controller
                    name="vencimento"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DatePicker
                        selected={date}
                        onChange={(newDate) => {
                          field.onChange(newDate);
                          setDate(newDate);
                        }}
                        minDate={new Date()}
                        showMonthDropdown
                        autoComplete="off"
                        locale={{
                          ...ptBR,
                          localize: {
                            ...ptBR.localize,
                            month: (n, options) => {
                              const month = ptBR.localize.month(n, options);
                              return (
                                month.charAt(0).toUpperCase() + month.slice(1)
                              );
                            },
                          },
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Selecione uma data"
                        customInput={
                          <MaskedInput
                            mask={[
                              /\d/,
                              /\d/,
                              '/',
                              /\d/,
                              /\d/,
                              '/',
                              /\d/,
                              /\d/,
                              /\d/,
                              /\d/,
                            ]}
                            className="w-full border-b text-[20px] ml-3 focus-within:outline-none"
                            placeholder="Selecione uma data"
                            guide={false}
                          />
                        }
                        ref={(ref) => {
                          field.ref({
                            focus: ref?.setFocus,
                          });
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end flex-1 border rounded-md p-4">
              <div className="flex flex-row w-full">
                <label className="text-[20px]" htmlFor="observacoes">
                  Observações:
                </label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  className="w-full border-b text-[20px] ml-3 focus-within:outline-none resize-none"
                  rows={5}
                  maxLength={150}
                  placeholder="Observações sobre o cliente..."
                  {...register('observacoes', { required: false })}
                />
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={!formState.isValid || formState.isLoading}
          className="rounded-md bg-green-700 text-white text-[20px] px-4 py-2 w-full hover:bg-green-950 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Salvar
        </button>
      </form>
    </section>
  );
};

export default EdicaoCliente;
