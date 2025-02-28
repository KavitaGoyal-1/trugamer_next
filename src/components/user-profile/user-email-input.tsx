import Image from "next/image";

interface IProps {
  email: string;
}

const UserEmailInput = ({ email }: IProps) => {
  const isDisabled = true;
  return (
    <div className="grid grid-cols-[1] gap-2 justify-items-start	 content-center">
      <label htmlFor="email" className="text-[14px] font-medium ">
        Email
      </label>
      <div className={`grid grid-cols-[max-content_1fr] w-full`}>
        <div
          className={`${
            isDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-white"
          }  grid place-content-center rounded-l-none  rounded-r-none rounded-tl-lg rounded-bl-lg h-[44px]	py-2.5 pl-3.5 pr-2`}
        >
          <Image
            src="/profile/mail.svg"
            alt="email icon"
            title="email icon"
            width={20}
            height={20}
          />
        </div>
        <input
          type="email"
          name="email"
          defaultValue={email && email}
          disabled={isDisabled}
          placeholder="Enter your email"
          className={`${
            isDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-white"
          } rounded-br-lg rounded-l-none rounded-tr-lg h-[44px]	py-2.5 px-3.5 w-full text-base text-cBlue-navy font-normal placeholder:text-base placeholder:text-cPurple-light focus:outline-0`}
        />
      </div>
    </div>
  );
};

export default UserEmailInput;
