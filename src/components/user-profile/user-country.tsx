import Image from "next/image";

const UserCountryInput = () => {
  return (
    <div className="grid grid-cols-[1] gap-2 justify-items-start	 content-center">
      <label htmlFor="location" className="text-[14px] font-medium ">
        Country
      </label>
      <div className="grid grid-cols-[max-content_1fr_max-content] w-full">
        <div className="grid place-content-center bg-white rounded-tl-lg rounded-bl-lg h-[44px]	py-2.5 pl-3.5 pr-2 ">
          <Image
            src="/profile/US-flag.svg"
            alt="email icon"
            title="email icon"
            width={20}
            height={20}
          />
        </div>
        <input
          type="text"
          name="location"
          placeholder="Select your location"
          className="bg-white  h-[44px]	py-2.5 w-full 
                                    text-base text-cBlue-navy font-normal
                                    placeholder:text-base placeholder:text-cPurple-light
                                    focus:outline-0
                                    "
        />
        <div className="grid place-content-center bg-white h-[44px]	py-2.5 pr-3.5 pl-2 rounded-br-lg rounded-tr-lg">
          <Image
            src="/profile/chevron-down.svg"
            alt="email icon"
            title="email icon"
            width={20}
            height={20}
          />
        </div>
      </div>
    </div>
  );
};

export default UserCountryInput;
