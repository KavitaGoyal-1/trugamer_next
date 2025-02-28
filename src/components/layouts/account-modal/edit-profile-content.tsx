import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { CiCamera } from "react-icons/ci";
import { FaAngleDown, FaAngleUp, FaCheck, FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { toastMessage } from "@/utills/toast";
import { logOut, selectAuthState, signIn } from "@/store/slices/auth-slice";
import { uploadImage } from "@/utills/upload-image";
import { getApi } from "@/utills/get-api";
import { getToken } from "@/utills/cookies";
import LoaderSpinner from "@/components/loader-spinner";
import FavoriteGamesUpdated from "@/components/user-profile/favorite-games-updated";
import gamesSettingsData from "@/utills/games/genres-and-modes";
import Image from "next/image";

const EditProfileContent = () => {
  const token = getToken();
  const dispatch = useDispatch();
  const router = useRouter();

  // get user data form redux
  const { userData: user } = useSelector(selectAuthState);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundImageRef = useRef<HTMLInputElement>(null);
  const [userData, setUserData] = useState<any>(user);
  const [loading, setLoading] = useState(false);
  const [favoriteGenres, setFavoriteGenres] = useState(
    gamesSettingsData?.genres
  );
  const [favoriteGameModes, setFavoriteGameModes] = useState(
    gamesSettingsData?.gamemodes
  );
  const [viewMore, setViewMore] = useState(false);
  const [viewMoreGames, setViewMoreGames] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const initialItemsToShow = 10;
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);
  const [newGamesSettingsData, setNewGamesSettingsData] = useState(
    gamesSettingsData?.genres
  );
  const [newGamesSettingsGamemodesData, setNewGamesSettingsGamemodesData] =
    useState(gamesSettingsData?.gamemodes);

  const hasMoreItems = itemsToShow < gamesSettingsData?.genres?.length;

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    // Reorder the newGamesSettingsData array (just for UI order)
    const reordered = Array.from(newGamesSettingsData);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    // Update the UI order
    setNewGamesSettingsData(reordered);

    // Reorder only the favorite genres that are already selected
    const selectedReordered = reordered.filter((genre) =>
      userData?.favouriteGenres?.includes(genre)
    );

    setUserData((prev: any) => ({
      ...prev,
      favouriteGenres: selectedReordered, // Preserve only the selected genres
    }));
  };

  console.log(user);

  // Toggle selection
  const toggleGenre = (genre: string) => {
    setUserData((prev: any) => {
      const updatedGenres = prev?.favouriteGenres?.includes(genre)
        ? prev?.favouriteGenres?.filter((item: string) => item !== genre) // Remove if exists
        : [...(prev?.favouriteGenres || []), genre]; // Add if not exists

      // setFavoriteGenres((current) => {
      //   const withoutSelected = current.filter((item) => item !== genre);
      //   return [genre, ...withoutSelected];
      // });

      return { ...prev, favouriteGenres: updatedGenres };
    });
  };

  useEffect(() => {
    setNewGamesSettingsData((currentDevices) => {
      const selected = currentDevices?.filter((device) =>
        userData?.favouriteGenres?.includes(device)
      );
      const unselected = currentDevices?.filter(
        (device) => !userData?.favouriteGenres?.includes(device)
      );

      return [...selected, ...unselected];
    });
  }, [userData?.favouriteGenres]);

  const toggleGameMode = (mode: string) => {
    setUserData((prevUserData: any) => {
      // Check if the mode is already in favouriteGameModes
      const updatedGameModes = prevUserData?.favouriteGameModes?.includes(mode)
        ? prevUserData?.favouriteGameModes?.filter(
            (item: string) => item !== mode
          ) // Remove if exists
        : [...(prevUserData.favouriteGameModes || []), mode]; // Add if not exists

      // Return the updated userData
      return {
        ...prevUserData,
        favouriteGameModes: updatedGameModes,
      };
    });

    // // Update the local drag-and-drop state
    // setFavoriteGameModes((current) => {
    //   const withoutSelected = current.filter((item) => item !== mode);
    //   return current.includes(mode)
    //     ? withoutSelected
    //     : [mode, ...withoutSelected];
    // });
  };
  // newGamesSettingsGamemodesData

  useEffect(() => {
    setNewGamesSettingsGamemodesData((currentDevices) => {
      const selected = currentDevices?.filter((device) =>
        userData?.favouriteGameModes?.includes(device)
      );
      const unselected = currentDevices?.filter(
        (device) => !userData?.favouriteGameModes?.includes(device)
      );

      return [...selected, ...unselected];
    });
  }, [userData?.favouriteGameModes]);

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBackgroundClick = () => {
    if (backgroundImageRef.current) {
      backgroundImageRef.current.click();
    }
  };

  const handleCameraClickForPicture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file && token) {
      try {
        console.log("this is profile profile image change  ");
        const apiResponse: any = await uploadImage(file, token);
        if (apiResponse.status === 200 && apiResponse.response?.data[0]?.url) {
          const uploadedImageUrl = apiResponse.response.data[0]?.url;
          console.log("Uploaded image URL:", apiResponse.response.data[0]);
          setUserData((prev: any) => {
            const updatedUserData = {
              ...prev,
              picture: apiResponse.response.data[0],
            };
            return updatedUserData;
          });
        } else {
          console.error("Image upload failed or invalid response");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const handleBackgroundImageChange = async (event: any) => {
    console.log("this is Background  image change  ");
    const file = event.target.files[0];
    if (file && token) {
      try {
        const apiResponse: any = await uploadImage(file, token);
        if (apiResponse.status === 200 && apiResponse.response?.data[0]?.url) {
          const uploadedBackgroundImageUrl = apiResponse.response.data[0]?.url;
          setUserData((prev: any) => {
            const updatedUserData = {
              ...prev,
              backgroundPicture: apiResponse.response.data[0],
            };
            return updatedUserData;
          });
        } else {
          console.error("Background image upload failed or invalid response");
        }
      } catch (error) {
        console.error("Error uploading background image:", error);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logOut());
    return router.push("/sign-in");
  };

  const getUserData = async () => {
    try {
      // this function is to get user data // use REDux
      const { data: user } = await axios.get(
        `${getApi()}/users-permissions/user-data`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData(user);
    } catch (error) {
      console.error("Error fetching user data or images:", error);
    }
  };

  useEffect(() => {
    if (isProfileSaved) {
      getUserData(); // Fetch the updated user data
    }
    if (!token) {
      handleLogout();
    }
    setIsProfileSaved(false); // Reset the state
  }, [isProfileSaved]);

  const handleSaveChanges = async (e?: any) => {
    e.preventDefault();
    let payload = {
      userData: {
        ...userData,
      },
    };

    let payload1 = {
      userData: {
        favouriteGenres: userData.favouriteGenres,
        favouriteGameModes: userData.favouriteGameModes,
        picture: userData.picture,
        backgroundPicture: userData.backgroundPicture,
        bio: userData.bio,
      },
    };

    // const payload2 = {
    //   userData: {
    //     ...userData,
    //     favouriteGenres: userData.favouriteGenres
    //   },
    // }
    // let payload1 = {
    //   userData: {
    //     ...data,
    //     xboxLiveGamerTagId: updateProfile?.xboxLiveGamerTagId || 0,
    //     twitchId: updateProfile?.twitchId || 0,
    //     playstationNetworkId: updateProfile?.playstationNetworkId || 0,
    //     nintendoNetworkId: updateProfile?.nintendoNetworkId || 0,
    //     eaAppId: updateProfile?.eaAppId || 0,
    //     ubiSoftConnetId: updateProfile?.ubiSoftConnetId || 0,
    //     steamId: updateProfile?.steamId || 0,
    //     nintendoSwitchId: updateProfile?.nintendoSwitchId || 0,
    //     gamer_tag: updateProfile?.gamer_tag || null,
    //   },
    // };
    try {
      setLoading(true);
      await axios.put(
        `${getApi()}/users-permissions/user/me`,
        payload1?.userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(signIn(payload));

      setLoading(false);
      setIsProfileSaved(true);
      toastMessage("success", "Profile updated successfully");
    } catch (error: any) {
      setLoading(false);
      setIsProfileSaved(false);
      if (
        error?.response?.data?.error?.message ===
        "gamer_tag must be at least 3 characters"
      ) {
        toastMessage("error", "Gamer tag must be at least 3 characters");
      } else {
        toastMessage("error", "Something went wrong");
      }
    }
  };
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    // Ensure bio doesn't exceed the 275 character limit
    if (value?.length <= 275) {
      setUserData((prev: any) => ({
        ...prev,
        bio: value,
      }));
    }
  };

  useEffect(() => {
    if (userData) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [userData]);

  return (
    <>
      {userData ? (
        <div className="w-full py-4 pt-0 md:pt-4 bg-[#0F111F] rounded-lg pb-0 overflow-auto h-full md:h-[75vh] lg:h-[500px] 2xl:h-[540px] xxl:h-[60vh] relative">
          <div className="w-full max-w-[100%] pb-4 rounded-[14px] line-botom relative px-4 hidden md:flex">
            <h3 className="text-lg font-bold my-0 ">Edit profile</h3>
          </div>

          <div className="px-0 md:px-4 ">
            <div className="mt-0 md:mt-5">
              {/* Profile Header */}
              <div className="relative">
                <div
                  className="h-52 xxl:h-64 bg-center rounded-xl bg-cover bg-no-repeat"
                  // style={{
                  //   backgroundImage: `url(${
                  //     userData?.backgroundPicture?.url || "/dummyimg.png"
                  //   })`,
                  // }}

                  style={{
                    backgroundImage: `linear-gradient(0deg, #020612 0%, rgba(10,11,24,0.7988445378151261) 58%, rgba(9,10,22,0.20220588235294112) 100%), 
                    url(${
                      userData?.backgroundPicture?.url || "/Account/dummy.png"
                    })`,
                    backgroundPosition: "center center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="absolute bottom-[-18px] md:bottom-[-20px] left-3 md:left-6 flex items-start gap-1 md:gap-3">
                    <div className="relative">
                      <Image
                        src={
                          userData?.picture?.url
                            ? userData?.picture?.url
                            : "/dummyimg.png"
                        }
                        alt="User Image"
                        width={45}
                        height={45}
                        className="rounded-full h-[60px] w-[60px] sm:h-[80px] sm:w-[80px] object-cover border-[3px] border-[#00ADFF] cursor-pointer object-center"
                      />
                      <span
                        className="bg-[#0F111F] p-1 absolute right-0 bottom-1 cursor-pointer rounded-full"
                        onClick={(e) => handleCameraClickForPicture()}
                      >
                        {" "}
                        <CiCamera className="" />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => handleFileChange(e)}
                          accept="image/*"
                          className="hidden"
                        />
                      </span>
                    </div>
                    {/* User Info */}
                    <div className=" text-center">
                      <h2 className="text-sm md:text-base text-[#EEEEEE]  font-normal">
                        {userData?.username}
                      </h2>
                      {/* <p className="text-[10px] md:text-sm text-[#B3B3B3]">
                        Current Plan{" "}
                      </p> */}
                    </div>
                  </div>
                  <button
                    className=" bg-cBlue-light py-1 md:py-2 px-2 md:px-3 cursor-pointer text-white text-[10px] md:text-xs font-semibold rounded-[10px] flex items-center justify-center gap-2 absolute right-3 md:right-5 bottom-4"
                    onClick={(e) => handleBackgroundClick()}
                  >
                    Edit Background <FaRegEdit size={20} />
                    <input
                      type="file"
                      ref={backgroundImageRef}
                      onChange={(e) => handleBackgroundImageChange(e)}
                      accept="image/*"
                      className="hidden"
                    />
                    {/* This is back ground  use these things   */}
                  </button>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mt-10 px-4 md:px-0">
                <label className="block text-start text-sm font-medium mb-2">
                  Bio
                </label>
                <textarea
                  className="w-full h-24 bg-white text-[#101828] p-3 rounded-lg outline-none resize-none text-sm md:text-base"
                  placeholder="Who are you and what brings you to the Trugamer community"
                  value={userData?.bio}
                  onChange={handleBioChange}
                  maxLength={275}
                ></textarea>
                <div
                  className={`mt-2 text-left text-sm ${
                    275 - (userData?.bio?.length || 0) === 0
                      ? "text-red-500"
                      : "text-[#999DB0]"
                  }`}
                >
                  {275 - (userData?.bio?.length || 0)} characters left
                </div>
              </div>
            </div>
          </div>

          <div className="w-full  pb-4  px-4 mt-4">
            {userData ? (
              <section className="max-md:mt-5 ">
                {/* <FavoriteGamesNew data={userData} /> */}
                <FavoriteGamesUpdated data={userData} />
              </section>
            ) : (
              <div className="w-full flex justify-center items-center pt-2">
                <LoaderSpinner />
              </div>
            )}
          </div>

          <div className="w-full px-4 mb-6">
            <h3 className="text-sm font-medium my-0 ">Favorite Genres</h3>
            <div className="flex flex-wrap gap-2 mt-3">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="favorite-genres" direction="horizontal">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex flex-wrap overflow-x-auto gap-2 mt-0"
                    >
                      {newGamesSettingsData
                        ?.slice(0, itemsToShow)
                        .map((genre, index) => (
                          <Draggable
                            key={genre}
                            draggableId={genre}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 text-[10px] md:text-sm cursor-pointer ${
                                  userData?.favouriteGenres?.includes(genre)
                                    ? "bg-[#00ADFF66] text-white border-[#00ADFF]"
                                    : "bg-[#272935] text-[#999DB0] border-[#272935]"
                                } ${snapshot.isDragging ? "opacity-75" : ""}`}
                                onClick={() => toggleGenre(genre)} // Make the whole element clickable
                              >
                                {genre}
                                {userData?.favouriteGenres?.includes(genre) && (
                                  <span className="ml-2">
                                    <FaCheck />
                                  </span>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {newGamesSettingsData?.length > initialItemsToShow && (
                        <span
                          onClick={
                            () =>
                              hasMoreItems
                                ? setItemsToShow((prev) => prev + 10) // Show 10 more items
                                : setItemsToShow(initialItemsToShow) // Reset to initial 10 items
                          }
                          className="text-xs font-semibold flex items-center justify-center text-[#00ADFF] cursor-pointer pp"
                        >
                          {hasMoreItems ? (
                            <>
                              View More <FaAngleDown className="ml-1" />
                            </>
                          ) : (
                            <>
                              View Less <FaAngleUp className="ml-1" />
                            </>
                          )}
                        </span>
                      )}
                      {/* <span
                        onClick={() => setViewMore(!viewMore)}
                        className="text-xs font-semibold flex items-center justify-center text-[#00ADFF] cursor-pointer pp"
                      >
                        {viewMore ? (
                          <>
                            View Less <FaAngleUp className="ml-1" />
                          </>
                        ) : (
                          <>
                            View More <FaAngleDown className="ml-1" />
                          </>
                        )}
                      </span> */}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>

          <div className="w-full px-4 mb-6">
            <h3 className="text-sm font-medium my-0">Favorite Game Modes</h3>

            <div className="flex flex-wrap gap-2 mt-3">
              <DragDropContext
                onDragEnd={(result) => {
                  if (!result.destination) return;

                  const reorderedModes = Array.from(favoriteGameModes);
                  const [removed] = reorderedModes.splice(
                    result.source.index,
                    1
                  );
                  reorderedModes.splice(result.destination.index, 0, removed);

                  setFavoriteGameModes(reorderedModes);
                }}
              >
                <Droppable
                  droppableId="favorite-game-modes"
                  direction="horizontal"
                >
                  {(provided) => (
                    <div
                      className="flex flex-wrap gap-2 mt-0"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {newGamesSettingsGamemodesData?.map((mode, index) => (
                        <Draggable key={mode} draggableId={mode} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 text-[10px] md:text-sm cursor-pointer ${
                                userData?.favouriteGameModes?.includes(mode)
                                  ? "bg-[#00ADFF66] text-white border-[#00ADFF]"
                                  : "bg-[#272935] text-[#999DB0] border-[#272935]"
                              } ${snapshot.isDragging ? "opacity-75" : ""}`}
                              onClick={() => toggleGameMode(mode)} // Make the whole element clickable
                            >
                              {mode}
                              {userData?.favouriteGameModes?.includes(mode) && (
                                <span className="ml-2">
                                  <FaCheck />
                                </span>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <span
                        onClick={() => setViewMoreGames(!viewMoreGames)}
                        className="text-xs font-semibold flex items-center justify-center text-[#00ADFF] cursor-pointer"
                      >
                        {newGamesSettingsGamemodesData?.length > 10 && (
                          <span
                            onClick={() => setViewMoreGames(!viewMoreGames)}
                            className="text-xs font-semibold flex items-center justify-center text-[#00ADFF] cursor-pointer pp"
                          >
                            {viewMoreGames ? (
                              <>
                                View Less <FaAngleUp className="ml-1" />
                              </>
                            ) : (
                              <>
                                View More <FaAngleDown className="ml-1" />
                              </>
                            )}
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            <div className="save-btm mt-6 flex items-start justify-start">
              <button
                onClick={handleSaveChanges}
                className=" bg-cBlue-light py-3 md:py-2 px-3 cursor-pointer text-white text-xs md:text-base font-semibold rounded-[10px]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-4 w-4 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute top-[250px] left-1/2 transform -translate-x-1/2">
            <LoaderSpinner />
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfileContent;
