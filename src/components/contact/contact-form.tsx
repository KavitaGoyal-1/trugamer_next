
const ContactForm = () => {
  return (
    <form className="grid grid-cols-1 gap-[18px]">
      <div className="grid grid-cols-1 gap-2 justify-items-start	 content-center">
        <label htmlFor="email" className="text-[14px] font-medium ">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="bg-white rounded-lg	py-2 px-4 w-full
                                text-base text-cPurple-light font-normal
                                placeholder:text-base placeholder:text-cPurple-light
                                "
        />
      </div>

      <div className="grid grid-cols-1 gap-2 justify-items-start	 content-center">
        <label htmlFor="phone" className="text-[14px] font-medium ">
          Phone Number
        </label>
        <input
          type="text"
          name="phone"
          placeholder="Enter yout name"
          className="bg-white rounded-lg	py-2 px-4 w-full
                                    text-base text-cPurple-light font-normal
                                    placeholder:text-base placeholder:text-cPurple-light
                                    "
        />
      </div>

      <div className="grid grid-cols-1 gap-2 justify-items-start	 content-center">
        <label htmlFor="message" className="text-[14px] font-medium">
          How can we help?
        </label>
        <textarea
          name="message"
          placeholder="Tell us a little about the project..."
          className="bg-white rounded-lg	py-2 px-4 w-full
                            text-base text-cPurple-light font-normal
                            placeholder:text-base placeholder:text-cPurple-light
                            min-h-[128px]
                            "
        />
      </div>

      <button className="bg-cBlue-light py-4 w-full rounded-2xl cursor-pointer ease-in-out duration-300 capitalize font-semibold">
        Get started
      </button>
    </form>
  );
};

export default ContactForm;
