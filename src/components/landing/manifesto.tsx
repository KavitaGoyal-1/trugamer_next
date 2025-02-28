import LightBlueBtn from "../buttons/light-blue-btn";
// manefesto.png
const Manifesto = () => {
  return (
    <div
      className=" w-full h-[370px] md:h-[400px] 
    bg-[url('/home/BACKGROUND.png')]
     bg-cover bg-center  bg-no-repeat flex flex-col items-center justify-center gap-2 md:gap-3"
    >
      <h2 className="block md:hidden font-primary font-medium uppercase text-[24px] text-cBlue-light">
        JOIN THE REBELS
      </h2>
      <h2 className="text-[2rem] md:text-[36px] text-center font-bold pb-2">
        Trugamer Manifesto
      </h2>

      <LightBlueBtn hrefString="/manifesto" text="Read Our Manifesto" />
    </div>
  );
};

export default Manifesto;
