import { useState } from "react";
import { AnimatePresence, motion, useAnimation } from "motion/react";
import { NavLink, useNavigate } from "react-router";

// lib
import { userSignOut } from "../../lib/userQueries";

// Icons
import MaterialSymbolsAccountCircleFull from "../../assets/icons/MaterialSymbolsAccountCircleFull";
import MaterialSymbolsBook2OutlineRounded from "../../assets/icons/MaterialSymbolsBook2OutlineRounded";
import SolarExitLineDuotone from "../../assets/icons/SolarExitLineDuotone";
import LoadingPopUp from "../reusableComponents/LoadingPopUp";

// Variants
const sidebarVariant = {
  hidden: {
    left: "-100%",
    transition: {
      type: "tween",
    },
  },
  show: {
    left: "0%",
    transition: {
      type: "tween",
    },
  },
};

const Sidebar = () => {
  const roleId = document.cookie
    .split("; ")
    .find((row) => row.startsWith("roleId="))
    ?.split("=")[1];

  // Initials
  const navigate = useNavigate();

  // states
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  // useAnimation
  const sidebarAnimation = useAnimation();

  const animateSidebar = (toggleSidebar: boolean) => {
    if (toggleSidebar) {
      sidebarAnimation.start("show");
    } else {
      sidebarAnimation.start("hidden");
    }
  };
  return (
    <>
      <div
        style={{
          width: toggleSidebar ? "100%" : "max-content",
          height: "100vh",
          backgroundColor: toggleSidebar ? "rgb(0, 0, 0, .54)" : "transparent",
        }}
        className="fixed z-50 top-0 left-0 h-full bg-black/[.54] phone:fixed laptop:relative"
      >
        <motion.div
          variants={sidebarVariant}
          animate={sidebarAnimation}
          className="top-0 left-0 h-full bg-black overflow-x-hidden overflow-y-auto phone:fixed phone:-left-[100%] laptop:relative laptop:-left-[0%] phone:w-[280px] laptop:w-[280px]"
        >
          <div className="py-4 flex flex-col items-center gap-1 ">
            <MaterialSymbolsBook2OutlineRounded
              color="#D3F0D1"
              width="1.3em"
              height="1.3em"
            />
            <header className="text-lg font-quickSand text-lightSecondary font-bold">
              PhoneBook Management
            </header>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            {parseInt(roleId!) === 2 && (
              <NavLink
                onClick={() => {
                  if (window.innerWidth <= 991) {
                    setToggleSidebar(false);
                    animateSidebar(false);
                  }
                }}
                to={"/dashboard"}
              >
                <motion.div
                  whileHover={{
                    x: "10px",
                    transition: { duration: 0.2 },
                  }}
                  className="flex flex-col py-2 px-[0.6rem]"
                >
                  <div className="flex gap-1">
                    <p className="font-dmSans font-semibold text-lightSecondary">
                      Users
                    </p>
                    <MaterialSymbolsAccountCircleFull
                      color="#D3F0D1"
                      width="1.3em"
                      height="1.3em"
                    />
                  </div>
                  <p className="font-quickSand text-[0.8rem] text-[#b3b3b3]">
                    View and manage user accounts
                  </p>
                </motion.div>
              </NavLink>
            )}
            <NavLink
              onClick={() => {
                if (window.innerWidth <= 991) {
                  setToggleSidebar(false);
                  animateSidebar(false);
                }
              }}
              to={"/dashboard/phone-book"}
            >
              <motion.div
                whileHover={{
                  x: "10px",
                  transition: { duration: 0.2 },
                }}
                className="flex flex-col py-2 px-[0.6rem]"
              >
                <div className="flex gap-1">
                  <p className="font-dmSans font-semibold text-lightSecondary">
                    PhoneBooks
                  </p>
                  <MaterialSymbolsBook2OutlineRounded
                    color="#D3F0D1"
                    width="1.3em"
                    height="1.3em"
                  />
                </div>
                <p className="font-quickSand text-[0.8rem] text-[#b3b3b3]">
                  Manage and organize your contacts
                </p>
              </motion.div>
            </NavLink>
            <motion.div
              onClick={async () => {
                setIsLoading(true);
                setLoadingMessage("Logging Out Please Wait");
                const signOutResult = await userSignOut();
                console.log(signOutResult);
                if (signOutResult!.Result) {
                  document.cookie =
                    "token=; userId=; path=/; max-age=0; secure; samesite=strict";
                  document.cookie =
                    "userId=; userId=; path=/; max-age=0; secure; samesite=strict";
                  navigate("/");
                } else {
                  console.log(signOutResult?.Message);
                }
              }}
              whileHover={{
                x: "10px",
                transition: { duration: 0.2 },
              }}
              className="flex flex-col py-2 px-[0.6rem] cursor-pointer"
            >
              <div className="flex gap-1">
                <p className="font-dmSans font-semibold text-lightSecondary">
                  Sign Out
                </p>
                <SolarExitLineDuotone
                  color="#D3F0D1"
                  width="1.3em"
                  height="1.3em"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Hamburger Icon */}
      <div
        onClick={() => {
          setToggleSidebar((prev) => !prev);
          animateSidebar(!toggleSidebar);
        }}
        className="fixed w-8 h-8 bottom-5 right-5 flex flex-col justify-center items-center gap-2 cursor-pointer z-50 mobile:block laptop:hidden"
      >
        <span
          style={{ transform: toggleSidebar ? "rotate(45deg)" : "rotate(0)" }}
          className="w-[100%] h-[3px] bg-lightSecondary rounded-md origin-top-left transition-all duration-100 ease-in-out"
        ></span>
        <span
          style={{ opacity: toggleSidebar ? "0" : "1" }}
          className="w-[100%] h-[3px] bg-lightSecondary rounded-md origin-center transition-all duration-100 ease-in-out"
        ></span>
        <span
          style={{ transform: toggleSidebar ? "rotate(-45deg)" : "rotate(0)" }}
          className="w-[100%] h-[3px] bg-lightSecondary rounded-md origin-bottom-left transition-all duration-100 ease-in-out"
        ></span>
      </div>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        <LoadingPopUp isLoading={isLoading} message={loadingMessage} />
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
