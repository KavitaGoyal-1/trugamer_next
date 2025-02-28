import HeaderUserItems from "./header-user-Items";

interface IProfileNavigaion {
  title: string;
}
const ProfileNavigaion = ({ title }: IProfileNavigaion) => {
  return (
    <header className="absolute w-full px-[5%] md:px-[10%] top-[20px] right-0 left-0 flex justify-between items-center max-w-[2550px] mx-auto z-[2]">
      <div className="flex justify-start	items-center">
        <h1 className="font-bold lg:text-[40px] md:text-[32px] text-[28px] lg:mr-0 mr-2 capitalize">
          {title}
        </h1>
      </div>
      <HeaderUserItems />
    </header>
  );
};

export default ProfileNavigaion;
