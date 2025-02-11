import Logo from '../assets/logo.png';

const Inicio = () => {
  return (
    <section className="p-4 bg-black relative h-full flex flex-col">
      <div className="flex justify-center flex-col items-center">
        <img src={Logo} className="w-100" alt="Logo Studio Winner" />
        <h1 className="text-white text-[40px]">Sistema de Cadastro</h1>
      </div>
      <small className="text-white text-[18px] justify-center items-end w-full flex flex-1">
        &copy; Studio Winner 2025.
      </small>
    </section>
  );
};

export default Inicio;
