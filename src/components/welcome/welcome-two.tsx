import Image from "next/image";

const WelcomeTwo = ({ isOpenWel, onClose }: any) => {
  return (
    <>
      {isOpenWel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-[99999998]" />
      )}
      <div
        className={`fixed pb-10 top-0 left-0 w-full max-w-[950px] mx-auto right-0  h-full overflow-auto  rounded-xl z-[99999999] transition-transform duration-500 ${
          isOpenWel ? "translate-y-0" : "-translate-y-full"
        } z-40 custom-scrollbar`}
      >
        <div className="shadow-[0px_7px_24px_0px_#FFFFFF2E] m-2 rounded-3xl">
          <div className='pb-0 m-8 w-full max-w-[90%] lg:max-w-[1000px] shadow-lg mx-auto rounded-xl border border-[#FFFFFF5C]  bg-[url("/home/pop1.png")] bg-top  bg-cover bg-no-repeat '>
            <div className="relative rounded-lg p-4 md:p-6 ">
              <div className="flex flex-wrap md:flex-nowrap justify-between gap-4">
                <div className="w-full md:w-1/2">
                  {/* Profile section */}
                  <div className="bg-[#21283D] flex-col flex rounded-xl p-2 pl-4 pb-0 gap-2 justify-center text-center text-white">
                    <div className="relative pb-2 flex items-start flex-col justify-center">
                      <h3 className="text-lg font-bold">
                        1. Import your gaming library
                      </h3>
                      <p className="text-sm text-[#9DACECCC] mt-0">
                        This will update every night pulling in the latest
                        playtimes.
                      </p>
                      <p className="text-sm text-[#9DACECCC] mt-0">
                        Add new games by using the import wizard. Import Wizard
                        FAQ
                      </p>
                    </div>
                    <Image
                      src="/home/howit/how7.png"
                      alt="Profile Icon"
                      className="object-cover h-36 w-full mx-auto"
                      width={185}
                      height={111}
                    />
                  </div>

                  <div className="flex mt-5 gap-4">
                    <div className="bg-[#21283D]  flex flex-col rounded-xl p-2 pl-3 pb-2 gap-0 justify-center text-center text-white">
                      <div className="relative pb-2 flex items-start flex-col justify-center">
                        <h3 className="text-lg font-bold">
                          3. Build out your gaming queues.
                        </h3>
                        <p className="text-sm text-[#9DACECCC] mt-0">
                          Add games to your playing now, playing next, or
                          shelved queues.
                        </p>
                      </div>
                      <Image
                        src="/home/howit/how8.png"
                        alt="Profile Icon"
                        className="object-cover h-20 w-full"
                        width={159}
                        height={111}
                      />
                    </div>
                  </div>

                  <div className="bg-[#21283D] mt-5 flex flex-col rounded-xl p-2 pb-0 pl-3 gap-2 justify-center items-center text-center text-white">
                    <div className="relative pb-2 flex items-start flex-col justify-center">
                      <h3 className="text-lg font-bold">
                        4. Join game hubs for your favorite games
                      </h3>
                      <p className="text-sm text-[#9DACECCC] mt-0">
                        join or found game hubs where you can discuss your
                        favorite games with others who like that game.
                      </p>
                    </div>
                    <Image
                      src="/home/howit/how9.png"
                      alt="Profile Icon"
                      className="object-cover h-28 w-[338px]"
                      width={125}
                      height={46}
                    />
                  </div>
                </div>

                {/* Add other sections here */}
                <div className="w-full md:w-1/2 h-full">
                  <div className="bg-[#21283D] relative h-full flex flex-col rounded-xl p-4 pl-4 pb-0 gap-2 justify-center items-center text-center text-white">
                    <div className="relative pb-2 flex items-start flex-col justify-center">
                      <h3 className="text-lg font-bold">
                        2. Update Beat Status and add Reviews
                      </h3>
                      <p className="text-sm text-[#9DACECCC] mt-2">
                        Add beat status and reviews for your games in your
                        library
                      </p>
                    </div>
                    <Image
                      src="/home/howit/how10.png"
                      alt="Profile Icon"
                      className="object-cover h-full"
                      width={20}
                      height={20}
                    />
                  </div>

                  <div className="bg-[#21283D] relative mt-5 flex flex-col md:flex-row h-full md:h-[199px] overflow-hidden rounded-xl  gap-2 justify-center items-center text-center text-white">
                    <div className="relative pb-2 p-2 pl-3 flex items-start flex-col justify-center">
                      <h3 className="text-lg font-bold">
                        5. Finalize Your Profile
                      </h3>
                      <p className="text-sm text-[#9DACECCC] mt-0">
                        join or found game hubs where you can discuss your
                        favorite games with others who like that game.
                      </p>
                    </div>
                    <Image
                      src="/home/howit/how11.png"
                      alt="Profile Icon"
                      className="object-cover h-[199px] w-[200px] md:w-[264px] static md:absolute right-0 top-0"
                      width={125}
                      height={46}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Close button */}
        <button
          className=" max-w-[90%] justify-center mx-auto w-full sm:w-auto font-semibold flex items-center sm:max-w-[100%]  bg-cBlue-light hover:bg-cBlue-main text-white text-sm md:text-base py-2 md:py-3 px-14 rounded-lg cursor-pointer ease-in-out duration-300 capitalize shadow-cShadow-main"
          onClick={onClose}
        >
          Setup Your Account
        </button>
      </div>
    </>
  );
};

export default WelcomeTwo;
