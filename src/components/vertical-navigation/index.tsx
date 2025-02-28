//Must change the design for this component to match the figma design

import Image from "next/image";

//but it's too complex, so can wait.
const VerticalNavigation = () => {
  return (
    <>
      {/**Line at the right */}
      <span className="fixed top-0 bottom-0 left-0 w-[12px] h-screen bg-cBlue-navy"></span>

      <aside
        className="absolute top-0 left-0 w-[70px] h-[500px] bg-cBlue-navy px-4 py-8 
    rounded-br-[25px]
    rounded-tr-[25px]
    "
      >
        {/**This is the top */}
        <div>
          <div className="grid justify-items-center	justify-center gap-5">
            {/**Logo */}
            <div className="h-[38px] w-[38px] grid place-content-center p-1 bg-[#00adff1f] rounded">
              <Image
                src="/home-logo.svg"
                alt="Trugamer icon"
                title="Trugamer icon"
                height={30}
                width={27}
              />
            </div>
            {/**Division */}
            <span className="hidden lg:block bg-white h-[1px] w-full mx-4"></span>
          </div>

          {/**Menu at the top */}
          <nav className="mt-16">
            <ul className="grid justify-center gap-4">
              <li>
                <a>
                  <Image
                    src="/navigation/home.svg"
                    alt="home icon"
                    title="home icon"
                    width={19}
                    height={19}
                  />
                  <span className={`hidden`}>Home</span>
                </a>
              </li>

              <li>
                <a>
                  <Image
                    src="/navigation/bar-chart.svg"
                    alt="home icon"
                    title="home icon"
                    width={19}
                    height={19}
                  />
                  <span className={`hidden`}>Dashboard</span>
                </a>
              </li>

              <li>
                <a>
                  <Image
                    src="/navigation/book.svg"
                    alt="home icon"
                    title="home icon"
                    width={19}
                    height={19}
                  />
                  <span className={`hidden`}>Game Library</span>
                </a>
              </li>

              <li>
                <a>
                  <Image
                    src="/navigation/search.svg"
                    alt="home icon"
                    title="home icon"
                    width={19}
                    height={19}
                  />
                  <span className={`hidden`}>Game Calendar</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/**This is the bottom */}
        <div className="grid gap-5 justify-items-center ">
          {/**Menu at the bottom */}
          <nav className="mt-16">
            <ul className="grid justify-center gap-4">
              <li>
                <a>
                  <Image
                    src="/navigation/help-circle.svg"
                    alt="home icon"
                    title="home icon"
                    width={19}
                    height={19}
                  />
                  <span className={`hidden`}>Suppot</span>
                </a>
              </li>

              <li>
                <a>
                  <Image
                    src="/navigation/settings.svg"
                    alt="home icon"
                    title="home icon"
                    width={19}
                    height={19}
                  />
                  <span className={`hidden`}>Settings</span>
                </a>
              </li>
            </ul>
          </nav>
          {/**Division */}
          <span className=" block bg-white h-[1px] w-full mx-4"></span>
          {/**User Image */}

          <div>
            <Image
              src="/dashboard/Avatar.png"
              alt="user image"
              title="user image"
              width={38}
              height={38}
            />
          </div>
        </div>
      </aside>

      <Image
        src="/navigation/mask-for-borders.svg"
        alt="mask"
        title="mask"
        width={64}
        height={64}
        className="absolute top-[499px] left-[11.5px]"
      />
    </>
  );
};
export default VerticalNavigation;
