import { useState } from "react";

// lib
import {
  activateAccount,
  approveAccount,
  deactivateAccount,
  deleteAccount,
} from "../../../lib/userQueries";

// Icons
import MaterialSymbolsCheckCircleOutline from "../../../assets/icons/MaterialSymbolsCheckCircleOutline";
import MaterialSymbolsCancelOutline from "../../../assets/icons/MaterialSymbolsCancelOutline";
import MaterialSymbolsPendingOutline from "../../../assets/icons/MaterialSymbolsPendingOutline";

//types
import { userInfoType } from "../../../types/userTypes";
import TablerTrashX from "../../../assets/icons/TablerTrashX";
import { AnimatePresence } from "motion/react";
import LoadingPopUp from "../../reusableComponents/LoadingPopUp";
interface props {
  id?: number;
  email: string;
  fullName: string;
  userName: string;
  status: string;
  setSelectedStatusTab: React.Dispatch<React.SetStateAction<string>>;
  filterUsers: (tab: string) => void;
  setUserList: React.Dispatch<React.SetStateAction<userInfoType[]>>;
  setAccountRequestList: React.Dispatch<React.SetStateAction<userInfoType[]>>;
  selectedIndex: number;
  userList: userInfoType[];
  setFormAction: React.Dispatch<React.SetStateAction<string>>;
  setToggleUserInformationForm: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<number>>;
}

const UserCard = ({
  email,
  status,
  fullName,
  userName,
  setSelectedStatusTab,
  filterUsers,
  setUserList,
  setAccountRequestList,
  id,
  selectedIndex,
  setFormAction,
  setToggleUserInformationForm,
  setSelectedUser,
}: props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("")
  return (
    <>
      <div className="flex flex-col gap-3 p-2 rounded-lg bg-lightPrimary max-h-[170px] phone:w-[95%] tablet:w-[300px]">
        <div className="flex items-center gap-4 w-full">
          <div className="flex flex-col gap-1 text-sm w-full">
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <p className="text-white font-semibold">Email:</p>
                  <p className="text-lightSecondary">{email}</p>
                </div>
                <div className="flex gap-1">
                  <p className="text-white font-semibold">Username:</p>
                  <p className="text-lightSecondary">{userName}</p>
                </div>
                <div className="flex gap-1">
                  <p className="text-white font-semibold">Full Name:</p>
                  <p className="text-lightSecondary">{fullName}</p>
                </div>
              </div>
              <div className="flex` justify-center gap-1">
                <span
                  onClick={async () => {
                    setIsLoading(true)
                    setLoadingMessage("Deleting User please wait.")
                    const response = await deleteAccount(id!);
                    setIsLoading(false)
                    setLoadingMessage("")
                    if(response!.Result) {
                      setUserList((prev) => prev.filter((user:userInfoType) => user.id !== id))
                    }
                  }}
                  title="Delete"
                  className="cursor-pointer"
                >
                  <TablerTrashX color="#dc3545" width="1.7em" height="1.7em" />
                </span>
              </div>
            </div>
            <div className="flex gap-1 items-center">
              {status === "Active" && (
                <p className="px-[0.4rem] py-[0.5] bg-active rounded-sm w-max text-statusText flex items-center gap-1 font-semibold">
                  Active
                  <MaterialSymbolsCheckCircleOutline
                    color="#D3F0D1"
                    width="1.1em"
                    height="1.1em"
                  />
                </p>
              )}
              {status === "Pending" && (
                <div className="flex gap-1 items-center">
                  <p className="px-[0.4rem] py-[0.5] bg-pending rounded-sm w-max text-statusText flex items-center gap-1 font-semibold">
                    Pending
                    <MaterialSymbolsPendingOutline
                      color="#fff"
                      width="1.1em"
                      height="1.1em"
                    />
                  </p>
                </div>
              )}
              {status === "Deactivated" && (
                <div className="flex gap-1 items-center">
                  <p className="px-[0.4rem] py-[0.5] bg-deactivated rounded-sm w-max text-statusText flex items-center gap-1 font-semibold">
                    Deactivate
                    <MaterialSymbolsCancelOutline
                      color="#fff"
                      width="1.1em"
                      height="1.1em"
                    />
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {status === "Active" && (
          <div className="w-full flex items-center gap-2">
            <button
              onClick={async () => {
                setIsLoading(true)
                setLoadingMessage("Deactivating User please wait.")
                const response = await deactivateAccount(id!);
                setIsLoading(false)
                setLoadingMessage("")
                if (response!.Result) {
                  setUserList((prev) => {
                    return prev.map((user, index) =>
                      index === selectedIndex
                        ? { ...user, status_id: 2, status_name: "Deactivated" }
                        : user
                    );
                  });
                  setSelectedStatusTab("Deactivated");
                  filterUsers("Deactivated");
                }
              }}
              className="flex items-center gap-1 cursor-pointer rounded-md py-1 px-2 w-max text-[0.8rem] font-semibold text-statusText bg-deactivated opacity-80 hover:opacity-100 transition ease-in-out duration-300"
            >
              Deactivate
              <MaterialSymbolsCancelOutline
                color="#fff"
                width="1.3em"
                height="1.3em"
              />
            </button>
            <button
              onClick={async () => {
                setFormAction("Update");
                setSelectedUser(selectedIndex);
                setToggleUserInformationForm(true);
              }}
              className="flex items-center gap-1 cursor-pointer rounded-md py-1 px-2 w-max text-[0.8rem] font-semibold text-statusText bg-pending opacity-80 hover:opacity-100 transition ease-in-out duration-300"
            >
              Update
              <MaterialSymbolsCancelOutline
                color="#fff"
                width="1.3em"
                height="1.3em"
              />
            </button>
          </div>
        )}
        {status === "Pending" && (
          <div className="w-full">
            <button
              onClick={async () => {
                setIsLoading(true)
                setLoadingMessage("Approving User please wait.")
                const response = await approveAccount(id!);
                setIsLoading(false)
                setLoadingMessage("")
                if (response!.Result) {
                  const newUser = response!.user;
                  setUserList((prev) => [...prev, newUser]);
                  setSelectedStatusTab("Active");
                  filterUsers("Active");
                  setAccountRequestList((prev) =>
                    prev.filter((data: userInfoType) => data.id !== id)
                  );
                }
              }}
              className="flex items-center gap-1 cursor-pointer rounded-md py-1 px-2 w-max text-[0.8rem] font-semibold text-statusText bg-active opacity-80 hover:opacity-100 transition ease-in-out duration-300"
            >
              Accept
              <MaterialSymbolsCheckCircleOutline
                color="#D3F0D1"
                width="1.3em"
                height="1.3em"
              />
            </button>
          </div>
        )}
        {status === "Deactivated" && (
          <div className="w-full flex items-center gap-2">
            <button
              onClick={async () => {
                setIsLoading(true)
                setLoadingMessage("Activating User please wait.")
                const response = await activateAccount(id!);
                setIsLoading(false)
                setLoadingMessage("")
                if (response!.Result) {
                  setUserList((prev) => {
                    return prev.map((user) =>
                      user.id === id!
                        ? { ...user, status_id: 1, status_name: "Active" }
                        : user
                    );
                  });
                  setSelectedStatusTab("Active");
                  filterUsers("Active");
                }
              }}
              className="flex items-center gap-1 cursor-pointer rounded-md py-1 px-2 w-max text-[0.8rem] font-semibold text-statusText bg-active opacity-80 hover:opacity-100 transition ease-in-out duration-300"
            >
              Activate
              <MaterialSymbolsCheckCircleOutline
                color="#fff"
                width="1.3em"
                height="1.3em"
              />
            </button>
            <button
              onClick={async () => {
                setFormAction("Update");
                setSelectedUser(selectedIndex);
                setToggleUserInformationForm(false);
              }}
              className="flex items-center gap-1 cursor-pointer rounded-md py-1 px-2 w-max text-[0.8rem] font-semibold text-statusText bg-pending opacity-80 hover:opacity-100 transition ease-in-out duration-300"
            >
              Update
              <MaterialSymbolsCheckCircleOutline
                color="#fff"
                width="1.3em"
                height="1.3em"
              />
            </button>
          </div>
        )}
      </div>
      
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        <LoadingPopUp isLoading={isLoading} message={loadingMessage} />
      </AnimatePresence>
    </>
  );
};

export default UserCard;
