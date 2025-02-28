// components/HowItWorksDrawer.js

import Image from "next/image";

const Welcome = ({ isOpenWel, onNext }: any) => {
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
          <div className='pb-0 m-8 w-full max-w-[90%] lg:max-w-[1000px] shadow-lg mx-auto rounded-xl  border border-[#FFFFFF5C]  bg-[url("/home/pop1.png")] bg-top  bg-cover bg-no-repeat '>
            <div className="relative rounded-lg p-4 md:p-6">
              <div className="text-center">
                <Image
                  src="/logo.svg"
                  alt="logo icon"
                  className="mx-auto"
                  width={20}
                  height={20}
                />
              </div>
              <h2 className="text-center text-white text-2xl font-bold mb-2 mt-4">
                Welcome to{" "}
                <span className="italic text-[#00ADFF]">Trugamer!</span>
              </h2>
              <p className="italic font-light text-xs md:text-sm text-[#9DACECCC] mb-2">
                Our mission is to build the best gaming platform for those who
                love games. We plan on doing this by making something that
                useful, interesting, and entertaining. We are just getting
                started. This will only be possible with our community. Welcome
                and thank you for joining!
              </p>
              <p className="italic font-semibold text-xs md:text-sm text-[#9DACECCC] mb-3">
                -Replikent
              </p>
              <div className="flex flex-wrap md:flex-nowrap justify-between gap-4">
                <div className="w-full md:w-1/2">
                  {/* Profile section */}
                  <div className="bg-[#21283D]  flex  rounded-xl p-2 pl-4 pb-0 gap-2 justify-center text-center text-white">
                    <div className="relative pb-2 flex items-start flex-col justify-center">
                      <h3 className="text-lg font-bold">Profile</h3>
                      <p className="text-xs md:text-sm text-[#9DACECCC] mt-1">
                        Set up your profile and curate your gaming queues.
                      </p>
                    </div>
                    <Image
                      src="/home/howit/how1.png"
                      alt="Profile Icon"
                      className="object-cover w-[102px] md:w-[182px] h-20 md:h-28"
                      width={185}
                      height={111}
                    />
                  </div>

                  <div className="flex mt-3 gap-4">
                    <div className="w-full md:w-1/2">
                      <div className="bg-[#21283D]  flex flex-col rounded-xl p-2 pl-3 pb-0 gap-2 justify-center text-center text-white">
                        <div className="relative pb-2 flex items-start flex-col justify-center">
                          <h3 className="text-lg font-bold">Library</h3>
                          <p className="text-xs md:text-sm text-[#9DACECCC] mt-1">
                            Import your gaming library from Steam, PSN, or Xbox.
                            Track your playtime and progression.
                          </p>
                        </div>
                        <Image
                          src="/home/howit/how3.png"
                          alt="Profile Icon"
                          className="object-cover h-28"
                          width={159}
                          height={111}
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-1/2">
                      <div className="bg-[#21283D] flex-col flex rounded-xl p-2 pl-3  gap-2 justify-center text-center text-white">
                        <Image
                          src="/home/howit/how2.png"
                          alt="Profile Icon"
                          className="object-cover h-20"
                          width={180}
                          height={111}
                        />
                        <div className="relative pb-2 flex items-start flex-col justify-center">
                          <h3 className="text-lg font-bold">Calendar</h3>
                          <p className="text-xs md:text-sm text-[#9DACECCC] mt-1">
                            Stay ahead of new releases with a personalized
                            calendar. Find new games using advanced filters and
                            sorting options.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#21283D] mt-3 flex rounded-xl p-2 pl-3 gap-2 justify-center items-center text-center text-white">
                    <Image
                      src="/home/howit/how4.svg"
                      alt="Profile Icon"
                      className="object-cover h-11"
                      width={125}
                      height={46}
                    />
                    <div className="relative pb-2 flex items-start flex-col justify-center">
                      <h3 className="text-lg font-bold">News</h3>
                      <p className="text-xs md:text-sm text-[#9DACECCC] mt-1">
                        Get the latest news aggregated\from across various
                        gaming news sites.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#21283D] relative mt-5 flex rounded-xl p-2 pl-3 gap-2 justify-center items-center text-center text-white">
                    <div className="relative pb-2 flex items-start flex-col justify-center">
                      <h3 className="text-lg font-bold">Lists</h3>
                      <p className="text-xs md:text-sm text-[#9DACECCC] mt-1">
                        Create and explore curated game lists (top 10, tiers,
                        collections, etc), and tracking your completion
                        progress.
                      </p>
                    </div>
                    <Image
                      src="/home/howit/how5.svg"
                      alt="Profile Icon"
                      className="object-cover h-14"
                      width={50}
                      height={56}
                    />
                    <Image
                      src="/home/howit/coming.svg"
                      alt="Profile Icon"
                      className="object-cover h-20 w-28 absolute top-[-7px] right-[-24px]"
                      width={112}
                      height={80}
                    />
                  </div>
                </div>

                {/* Add other sections here */}
                <div className="w-full md:w-1/2 h-full">
                  <div className="bg-[#21283D] relative h-full flex flex-col rounded-xl p-4 pl-4 gap-2 justify-center items-center text-center text-white">
                    <div className="relative pb-2 flex items-start flex-col justify-center">
                      <h3 className="text-lg font-bold">Game Hubs</h3>
                      <p className="text-xs md:text-sm text-[#9DACECCC] mt-1">
                        Dive into discussions about your favorite games. Earn
                        points, engage with the community, and shape the
                        conversation.
                      </p>
                    </div>
                    <Image
                      src="/home/howit/how6.png"
                      alt="Profile Icon"
                      className="object-cover h-full"
                      width={50}
                      height={56}
                    />
                    <Image
                      src="/home/howit/coming.svg"
                      alt="Profile Icon"
                      className="object-cover h-20 w-28 absolute top-[-7px] right-[-24px]"
                      width={112}
                      height={80}
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
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Welcome;
