import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { storeOutsideToggle } from "@/store/slices/auth-slice";
import { getApi } from "@/utills/get-api";
import NewVerticalNavigation from "@/components/vertical-navigation/new-vertical-navigation";
import NavigationPublic from "@/components/layouts/navigation-public";
import { getToken } from "@/utills/cookies";
import PlatformTable from "@/components/import-wizard/select-platform";

const ImportWizard = () => {
  const token = getToken();
  const user = useSelector((state: any) => state?.authState?.userData);
  let steamId = useSelector((state: any) => state?.steamIdSlice?.steamId);
  const [steamData, setSteamData] = useState([]);
  const isToggle = useSelector((state: any) => state?.authState?.headerToggle);

  const fetchSteamRecords = async (sortOrder?: boolean) => {
    try {
      // Conditionally include sorting string based on sortOrder
      const sortingString =
        sortOrder !== undefined
          ? `?sortBy=lastPlayed&order=${sortOrder ? "asc" : "desc"}`
          : "";

      const url = `${getApi()}/steam/steam-games/${user.id}${sortingString}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setSteamData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const dispatch = useDispatch();
  const navRef = useRef<HTMLDivElement | null>(null);

  // Close NewVerticalNavigation when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        // Close the sidebar if a click is outside
        if (isToggle) {
          dispatch(storeOutsideToggle(false));
          // Dispatch action to close sidebar (if managed via Redux)
          console.log("Clicked outside");
          // Alternatively, use local state to manage `isToggle` and update here
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isToggle]);

  return (
    <>
      <section className="relative min-h-screen bg-cBlack-dark">
        <NavigationPublic text={"Dashboard"} token={token} />
        <div
          className={
            isToggle ? "menucomon mobile-menus" : "menucomon mobile-right"
          }
          ref={navRef}
        >
          {token && <NewVerticalNavigation token={token} />}
        </div>

        <div className="flex items-center justify-center ">
          <PlatformTable
            steamData={steamData}
            steamId={steamId}
            userId={user?.id}
            userData={user}
            fetchSteamRecords={fetchSteamRecords}
            setSteamData={setSteamData}
          />
        </div>
      </section>
    </>
  );
};

export default ImportWizard;
