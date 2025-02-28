// components/HowItWorksDrawer.js

import Image from "next/image";

const HowItWorksDrawer = ({ isOpen, onClose }: any) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-0 backdrop-blur-none z-[99999998]"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 bottom-0 mt-auto my-auto mb-auto md:mb-5 rounded-bl-[0px] rounded-tl-[0px] md:rounded-bl-[25px] md:rounded-tl-[25px] right-0 w-full max-w-full md:max-w-[1000px] xl:max-w-[950px] 2xl:max-w-[1345px] shadow-lg h-[100%] md:h-[83%] 2xl:h-[85%] overflow-x-hidden md:overflow-auto bg-[url("/home/howWOrk.png")] bg-top  bg-cover bg-no-repeat z-[99999999] transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } z-40`}
      >
        <div className="relative rounded-lg p-4 md:p-6 ">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white font-bold text-lg"
            onClick={onClose}
          >
            <Image
              src="/home/close.svg"
              alt="close icon"
              width={20}
              height={20}
            />
          </button>

          {/* Drawer content */}
          <h2 className="text-center text-white text-2xl font-bold mb-6 mt-6 md:mb-5 md:mt-5 2xl:mb-10 2xl:mt-10">
            How it Works
          </h2>
          <div className="flex justify-between gap-6 flex-col md:flex-row hows-Works">
            <div className="w-full md:w-1/2">
              {/* Profile section */}
              <div className="bg-[#21283D]  flex rounded-xl p-3 pl-4 pb-0 gap-2 justify-center text-center text-white">
                <div className="relative pb-2 flex items-start flex-col justify-center">
                  <h3 className="text-lg font-bold">Profile</h3>
                  <p className="text-sm text-[#9DACECCC] mt-1">
                    Set up your profile and curate your gaming queues.
                  </p>
                </div>
                <Image
                  src="/home/howit/how1.svg"
                  alt="Profile Icon"
                  className="object-cover h-28"
                  width={185}
                  height={111}
                />
              </div>

              <div className="flex mt-5 gap-4">
                <div className="w-1/2">
                  <div className="bg-[#21283D]  flex flex-col rounded-xl p-2 pl-3 pb-0 gap-2 justify-center text-center text-white">
                    <div className="relative pb-2 flex items-start flex-col justify-center">
                      <h3 className="text-lg font-bold">Library</h3>
                      <p className="text-sm text-[#9DACECCC] mt-1">
                        Import your gaming library from Steam, PSN, or Xbox.
                        Track your playtime and progression.
                      </p>
                    </div>
                    <Image
                      src="/home/howit/how3.svg"
                      alt="Profile Icon"
                      className="object-cover h-28"
                      width={159}
                      height={111}
                    />
                  </div>
                </div>
                <div className="w-1/2">
                  <div className="bg-[#21283D] flex-col flex rounded-xl p-2 pl-3  gap-2 justify-center text-center text-white">
                    <Image
                      src="/home/howit/how2.svg"
                      alt="Profile Icon"
                      className="object-cover h-20 height-cls"
                      width={180}
                      height={111}
                    />
                    <div className="relative pb-2 flex items-start flex-col justify-center">
                      <h3 className="text-lg font-bold">Calendar</h3>
                      <p className="text-sm text-[#9DACECCC] mt-1">
                        Stay ahead of new releases with a personalized calendar.
                        Find new games using advanced filters and sorting
                        options.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#21283D] mt-5 flex rounded-xl p-2 pl-3 gap-2 justify-center items-center text-center text-white">
                <Image
                  src="/home/howit/how4.svg"
                  alt="Profile Icon"
                  className="object-cover h-11"
                  width={125}
                  height={46}
                />
                <div className="relative pb-2 flex items-start flex-col justify-center">
                  <h3 className="text-lg font-bold">News</h3>
                  <p className="text-sm text-[#9DACECCC] mt-1">
                    Get the latest news aggregated\from across various gaming
                    news sites.
                  </p>
                </div>
              </div>

              <div className="bg-[#21283D] relative mt-5 flex rounded-xl p-2 pl-3 gap-2 justify-center items-center text-center text-white">
                <div className="relative pb-2 flex items-start flex-col justify-center">
                  <h3 className="text-lg font-bold">Lists</h3>
                  <p className="text-sm text-[#9DACECCC] mt-1">
                    Create and explore curated game lists (top 10, tiers,
                    collections, etc), and tracking your completion progress.
                  </p>
                </div>
                <Image
                  src="/home/howit/how5.svg"
                  alt="Profile Icon"
                  className="object-cover h-14"
                  width={56}
                  height={56}
                />
                <Image
                  src="/home/howit/coming.svg"
                  alt="Profile Icon"
                  className="object-cover h-20 w-28 absolute top-[-7px] right-[-24px]"
                  width={80}
                  height={112}
                />
              </div>
            </div>

            <span className="hidden md:block">
              <Image
                src="/home/howit/Divider.svg"
                alt="Profile Icon"
                className=" h-full"
                width={80}
                height={112}
              />
            </span>

            {/* Add other sections here */}
            <div className="w-full md:w-1/2 h-full">
              <div className="bg-[#21283D] relative h-full flex flex-col rounded-xl pt-5 p-4 pl-4 gap-2 justify-center items-center text-center text-white heifht-cls">
                <div className="relative pb-3 flex items-start flex-col justify-center">
                  <h3 className="text-lg font-bold">Game Hubs</h3>
                  <p className="text-sm text-[#9DACECCC] mt-2">
                    Dive into discussions about your favorite games. Earn
                    points, engage with the community, and shape the
                    conversation.
                  </p>
                </div>
                <Image
                  src="/home/howit/how6.svg"
                  alt="Profile Icon"
                  className="object-cover h-full"
                  width={112}
                  height={80}
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
    </>
  );
};

export default HowItWorksDrawer;
