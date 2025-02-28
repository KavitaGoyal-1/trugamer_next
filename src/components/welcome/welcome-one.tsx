import Image from "next/image";

const WelcomeOne = ({ isOpenWel, onNext }: any) => {
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
          <div className='pb-8 m-8 w-full max-w-[90%] lg:max-w-[1000px]  shadow-lg mx-auto rounded-xl  border border-[#FFFFFF5C] bg-[url("/home/pop1.png")] bg-top  bg-cover bg-no-repeat '>
            <div className="relative rounded-lg p-4 md:p-6 ps-4 md:ps-10">
              <h2 className="text-center text-white text-2xl font-bold mb-2 mt-4">
                Trugamer Community Guidelines
              </h2>

              <div className="mt-8 flex flex-col gap-6">
                <div className="flex gap-3 items-start md:items-center details-gradient relative pb-4">
                  <div>
                    <Image
                      src="/home/welcome/repect.svg"
                      alt="repect icon"
                      className="w-8 h-8 max-w-[32px] "
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">
                      Respect Fellow Gamers
                    </h4>
                    <p className=" text-sm text-[#9DACECCC] mb-2">
                      Treat all members with respect and courtesy. Civil
                      discourse is encouraged, but personal attacks, hate
                      speech, or any form of harassment will not be tolerated.
                      Keep discussions constructive and friendly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start md:items-center details-gradient relative pb-4">
                  <div>
                    <Image
                      src="/home/welcome/topic.svg"
                      alt="topic icon"
                      className="w-8 h-8 max-w-[32px] "
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Stay On-Topic</h4>
                    <p className=" text-sm text-[#9DACECCC] mb-2">
                      All posts and discussions should be directly related to
                      the specific game or genre of the hub. Off-topic content
                      may be removed to keep the community focused and relevant.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start md:items-center details-gradient relative pb-4">
                  <div>
                    <Image
                      src="/home/welcome/hugeicons_spam.svg"
                      alt="spam icon"
                      className="w-8 h-8 max-w-[32px] "
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">
                      No Spam or Self-Promotion
                    </h4>
                    <p className=" text-sm text-[#9DACECCC] mb-2">
                      Avoid excessive self-promotion or spamming. Sharing
                      relevant content is welcome, but repeated promotion of
                      your content without meaningful contribution to the
                      community may result in removal of posts and potentially a
                      ban.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start md:items-center details-gradient relative pb-4">
                  <div>
                    <Image
                      src="/home/welcome/Warning.svg"
                      alt="warning icon"
                      className="w-8 h-8 max-w-[32px] "
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Spoiler Policy</h4>
                    <p className=" text-sm text-[#9DACECCC] mb-2">
                      Use spoiler tags for any content that could potentially
                      spoil the game experience for others. Clearly indicate if
                      your post contains spoilers and use the appropriate tags
                      to protect other members' experiences.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start md:items-center details-gradient relative pb-4">
                  <div>
                    <Image
                      src="/home/welcome/ShieldWarning.svg"
                      alt="ShieldWarning icon"
                      className="w-8 h-8 max-w-[32px] "
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">
                      Bug Reports and Feedback
                    </h4>
                    <p className=" text-sm text-[#9DACECCC] mb-2">
                      Bug reports and constructive feedback are valuable to the
                      community and developers. If you encounter issues or have
                      suggestions, share them clearly and respectfully.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start md:items-center details-gradient relative pb-4">
                  <div>
                    <Image
                      src="/home/welcome/ShieldCheck.svg"
                      alt="ShieldCheck icon"
                      className="w-8 h-8 max-w-[32px] "
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">
                      Keep It Safe for Work (SFW)
                    </h4>
                    <p className=" text-sm text-[#9DACECCC] mb-2">
                      Use spoiler tags for any content that could potentially
                      spoil the game experience for others. Clearly indicate if
                      your post contains spoilers and use the appropriate tags
                      to protect other members' experiences.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start md:items-center details ">
                  <div>
                    <Image
                      src="/home/welcome/icon.svg"
                      alt="icons"
                      className="w-8 h-8 max-w-[32px] "
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">
                      Follow Trugamer and Hub-Specific Guidelines
                    </h4>
                    <p className=" text-sm text-[#9DACECCC] mb-2">
                      Adhere to the broader Trugamer rules, as well as any
                      specific guidelines set for the game hub. This includes
                      avoiding vote manipulation, doxxing, or any other behavior
                      that violates site-wide rules.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          type="button"
          className=" max-w-[90%] justify-center mx-auto w-full sm:w-auto font-semibold flex items-center sm:max-w-[100%]  bg-cBlue-light hover:bg-cBlue-main text-white text-sm md:text-base py-2 md:py-3 px-14 rounded-lg cursor-pointer ease-in-out duration-300 capitalize shadow-cShadow-main"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default WelcomeOne;
