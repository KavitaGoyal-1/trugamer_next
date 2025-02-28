import { useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getApi } from "@/utills/get-api";
import PrivacyContent from "./privacy-content";
import MyDevicesContent from "./my-devices-content";
import { getToken, clearToken } from "@/utills/cookies";
import { logOut } from "@/store/slices/auth-slice";
import AccountLeft from "./account-left";
import IntegrationsContent from "./integrations-content";
import EditProfileContent from "./edit-profile-content";
import BillingContent from "./billing-content";
import SettingsContent from "./setting-content";
import Image from "next/image";

const AccountModal = ({ isOpenWel, onCloseWel }: any) => {
  const token = getToken();
  const [activeTab, setActiveTab] = useState("Integrations");
  const [userData, setUserData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    clearToken();
    dispatch(logOut());
    return router.push("/");
  };

  useEffect(() => {
    if (isOpenWel) {
      getUserData();
    }
  }, [loading, isOpenWel]);

  const getUserData = async () => {
    const { data: user } = await axios.get(
      `${getApi()}/users-permissions/user-data`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUserData(user);
  };

  useEffect(() => {
    if (isOpenWel) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpenWel, activeTab]);

  return (
    <>
      {isOpenWel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-[999999998]" />
      )}
      <div
        className={`fixed pb-0 lg:pb-10 top-0 left-0 w-full max-w-[1000px] 2xl:max-w-[1400px] xxl:max-w-[1600px] mx-auto right-0  h-full overflow-auto  rounded-xl z-[9999999999] transition-transform duration-500 flex items-start xl:items-center px-3 ${
          isOpenWel ? "translate-y-0" : "-translate-y-full"
        } z-40 custom-scrollbar`}
      >
        <div className="pb-0 m-8 relative w-full max-w-[100%] md:max-w-[93%]  shadow-lg mx-auto rounded-xl bg-[#15182B] ">
          <div className=" rounded-lg  m-4">
            <button
              className="absolute top-[-10px] right-[-10px] text-white font-bold text-lg"
              onClick={onCloseWel}
            >
              <Image
                src="/home/close.svg"
                alt="close icon"
                width={20}
                height={20}
              />
            </button>
          </div>

          <div className="flex gap-4 p-4 pt-0 text-white items-start flex-col md:flex-row">
            {/* Left Sidebar */}
            <div className="w-full md:w-1/4 bg-[#0F111F] rounded-lg relative">
              <AccountLeft setActiveTab={setActiveTab} activeTab={activeTab} />
            </div>

            {/* Main Content */}
            <div
              className={`w-full md:w-3/4 py-4 bg-[#0F111F] rounded-lg pb-0 ${
                activeTab === "Edit Profile" ? "pt-0 md:pt-4" : "pt-4"
              } `}
            >
              {activeTab === "Integrations" && (
                <div>
                  <IntegrationsContent data={userData} />
                </div>
              )}
              {activeTab === "Edit Profile" && (
                <div>
                  <EditProfileContent />
                </div>
              )}
              {activeTab === "Billing" && (
                <div>
                  <BillingContent />
                </div>
              )}
              {activeTab === "Settings" && (
                <div>
                  <SettingsContent
                    data={userData}
                    loading={loading}
                    setLoading={setLoading}
                  />
                </div>
              )}

              {activeTab === "My Devices" && (
                <div>
                  <MyDevicesContent />
                </div>
              )}

              {activeTab === "Privacy" && (
                <div>
                  <PrivacyContent />
                </div>
              )}
              {/* Other tabs content can go here */}
            </div>

            <div className=" bottom-0 w-full py-1 bg-[#0F111F] rounded-lg flex md:hidden">
              <button className="w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-2  rounded-br-xl rounded-bl-xl ">
                <div onClick={handleLogout}>
                  <MdLogout className=" group-hover:block cursor-pointer text-white text-[20px]" />
                </div>{" "}
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountModal;
