import Logo from '../assets/logo.png';
import { Link } from 'react-router';

const Inicio = () => {
  return (
    <section className="p-4 bg-black relative h-full flex flex-col">
      <div className="flex justify-center flex-col items-center">
        <img src={Logo} className="w-100" alt="Logo Studio Winner" />
        <h1 className="text-white text-[40px]">
          Sistema de Cadastro de Clientes
        </h1>
        <div className="mt-5 flex gap-x-5 w-[50%]">
          <Link
            to="/cadastro-clientes"
            className="bg-green-700 text-white p-4 rounded-md flex-1 text-center hover:bg-green-950"
          >
            Cadastro de Clientes
          </Link>
          <Link
            to="/consulta-clientes"
            className="bg-green-700 text-white p-4 rounded-md flex-1 text-center hover:bg-green-950"
          >
            Consulta de Clientes
          </Link>
          <Link
            to="/graficos"
            className="bg-green-700 text-white p-4 rounded-md flex-1 text-center hover:bg-green-950"
          >
            Gráficos
          </Link>
        </div>
      </div>
      <small className="text-white text-[18px] justify-center items-end w-full flex flex-1">
        &copy; Studio Winner 2025.
      </small>
    </section>
  );
};

export default Inicio;
