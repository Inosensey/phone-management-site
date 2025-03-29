// Components
import Overlay from "../../reusableComponents/Overlay";

// Icons
import MaterialSymbolsCancelOutline from "../../../assets/icons/MaterialSymbolsCancelOutline";
import MaterialSymbolsShareOutline from "../../../assets/icons/MaterialSymbolsShareOutline";

// Types
import { userInfoType } from "../../../types/userTypes";
import { contactInfoTypes } from "../../../types/contactTypes";
import { useState } from "react";
import {
  getMySharedContacts,
  shareContactInformation,
} from "../../../lib/contactInformationQueries";
import { AnimatePresence } from "motion/react";
import LoadingPopUp from "../../reusableComponents/LoadingPopUp";
interface props {
  setToggleShareContactForm: React.Dispatch<React.SetStateAction<boolean>>;
  userList: Array<userInfoType>;
  contactInformation?: contactInfoTypes & {
    profileBlob: string | null;
    filename: string;
  };

  setMySharedContactList: React.Dispatch<
    React.SetStateAction<
      Array<
        contactInfoTypes & {
          userShareToEmail: string;
          userShareToFirstName: string;
          userShareToLastName: string;
          userShareToUserId: number;
          contactSharesId: number;
        }
      >
    >
  >;
}

const ShareContactForm = ({
  setToggleShareContactForm,
  userList,
  contactInformation,
  setMySharedContactList,
}: props) => {
  const userId = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userId="))
    ?.split("=")[1];
  //States
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("")

  // Events

  const selectOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    setSelectedUser(value);
  };
  return (
    <Overlay>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="bg-lightPrimary rounded-lg p-4 overflow-auto max-h-[96%] phone:w-[95%] tablet:w-[60%] laptop:w-[35%]">
          <div className="w-full flex justify-between items-center">
            <p className="text-[#a3e09f] font-dmSans text-lg font-semibold">
              Share Contact Information
            </p>
            <div
              onClick={() => setToggleShareContactForm(false)}
              className="cursor-pointer"
            >
              <MaterialSymbolsCancelOutline
                color="#a3e09f"
                width="1.3em"
                height="1.3em"
              />
            </div>
          </div>
          <form>
            <div className="w-full relative mt-[0.05rem] phone:w-[96%] mdphone:w-11/12 laptop:w-full">
              <div className={`flex flex-col w-full gap-2 bg-primary`}>
                <select
                  className={`bg-transparent text-white h-[2.7rem] phone:text-sm `}
                  name="selectedUser"
                  defaultValue={"0"}
                  onChange={selectOnChange}
                >
                  <option className="bg-primary " value="0" disabled>
                    Users
                  </option>
                  {userList
                    .filter(
                      (user: userInfoType) => user.id !== parseInt(userId!)
                    )
                    .map((user: userInfoType) => (
                      <option
                        className="bg-primary "
                        key={user.id}
                        value={user.id}
                      >
                        {user.first_name + " " + user.last_name} - {user.role_name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-center items-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={async () => {
                    setIsLoading(true)
                    setLoadingMessage("Sharing Contact please wait.")
                    const response = await shareContactInformation({
                      contactId: contactInformation!._id,
                      contactOwnerId: contactInformation!.user_id,
                      contactShareTo: parseInt(selectedUser),
                    });
                    setIsLoading(false)
                    setLoadingMessage("")
                    if (response.Result) {
                      const sharedContacts: Array<
                        contactInfoTypes & {
                          userShareToEmail: string;
                          userShareToFirstName: string;
                          userShareToLastName: string;
                          userShareToUserId: number;
                          contactSharesId: number;
                        }
                      > = await getMySharedContacts(parseInt(userId!));
                      setMySharedContactList(sharedContacts);
                      setToggleShareContactForm(false);
                    }
                  }}
                  className="flex items-center gap-1 cursor-pointer rounded-md py-2 px-4 w-max text-[0.8rem] font-semibold text-statusText bg-active opacity-90 hover:opacity-100 transition ease-in-out duration-300"
                >
                  Share
                  <MaterialSymbolsShareOutline
                    color="#fff"
                    width="1.3em"
                    height="1.3em"
                  />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        <LoadingPopUp isLoading={isLoading} message={loadingMessage} />
      </AnimatePresence>
    </Overlay>
  );
};

export default ShareContactForm;
