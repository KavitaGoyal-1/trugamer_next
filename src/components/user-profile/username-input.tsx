
interface IProps {
    username: string
}

const UsernameInput = ({username}:IProps) => {
    return (
        <div className="grid grid-cols-[1] gap-2 justify-items-start	 content-center">
            <label htmlFor="userName" className="text-[14px] font-medium ">
                User Name
            </label>
            <div className="grid grid-cols-[max-content_1fr] w-full">
                <div className="bg-white rounded-tl-lg rounded-bl-lg h-[44px]	py-2.5 px-3.5 border-r-[1px] border-[#D0D5DD]">
                    <p className="text-base text-cGray-500 font-normal">
                        trugamer.com/
                    </p>
                </div>
                <input
                    type="text"
                    name="userName"
                    defaultValue={username && username}
                    placeholder="rfox22"
                    className="bg-white rounded-br-lg rounded-tr-lg h-[44px]	py-2.5 px-3.5 w-full 
                                        text-base text-cBlue-navy font-normal
                                        placeholder:text-base placeholder:text-cPurple-light
                                        focus:outline-0
                                        "
                />
            </div>
        </div>
    );
};

export default UsernameInput;
