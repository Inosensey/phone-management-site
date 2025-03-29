import { useState } from "react";

// Components
import Overlay from "../../reusableComponents/Overlay";
import { Input } from "../../reusableComponents/inputs/Inputs";

// Icons
import MaterialSymbolsCancelOutline from "../../../assets/icons/MaterialSymbolsCancelOutline";
import MaterialSymbolsAccountCircleFull from "../../../assets/icons/MaterialSymbolsAccountCircleFull";
import { userInfoType } from "../../../types/userTypes";
import { addUserThroughAdmin, updateAccount } from "../../../lib/userQueries";
import { AnimatePresence } from "motion/react";
import LoadingPopUp from "../../reusableComponents/LoadingPopUp";

// Types
type userInputType = {
  usernameInput: string;
  emailInput: string;
  firstNameInput: string;
  lastNameInput: string;
  roleId: number;
};

interface props {
  setToggleUserInformationForm: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser?: userInfoType;
  action: string;
  setUserList: React.Dispatch<React.SetStateAction<userInfoType[]>>;
  selectedIndex?: number;
}
const UserInformationForm = ({
  setToggleUserInformationForm,
  action,
  selectedUser,
  setUserList,
}: props) => {
  // Initials
  const userInputInitials: userInputType = {
    usernameInput: action === "Add" ? "" : selectedUser!.username,
    emailInput: action === "Add" ? "" : selectedUser!.email,
    firstNameInput: action === "Add" ? "" : selectedUser!.first_name,
    lastNameInput: action === "Add" ? "" : selectedUser!.last_name,
    roleId: 1,
  };

  const [userInputs, setUserInputs] =
    useState<userInputType>(userInputInitials);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>("")

  // events
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setUserInputs((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Overlay>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="bg-lightPrimary rounded-lg p-4 overflow-auto max-h-[96%] phone:w-[95%] tablet:w-[60%] laptop:w-[35%]">
          <div className="w-full flex justify-between items-center">
            <p className="text-[#a3e09f] font-dmSans text-lg font-semibold">
              {action === "Add" ? "Add" : "Update"} User Information
            </p>
            <div
              onClick={() => setToggleUserInformationForm(false)}
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
            <div className="flex flex-col gap-2 mt-2 text-white">
              <div className="phone:w-12/12">
                <Input
                  label="Username"
                  type="text"
                  name="usernameInput"
                  state={userInputs.usernameInput}
                  placeholder="Enter Your Username"
                  autoComplete="off"
                  onChange={onChangeHandler}
                  valid={null}
                />
              </div>
              <div className="phone:w-12/12">
                <Input
                  label="Email"
                  type="text"
                  name="emailInput"
                  state={userInputs.emailInput}
                  placeholder="Enter Your Email"
                  autoComplete="off"
                  onChange={onChangeHandler}
                  valid={null}
                />
              </div>
              <div className="phone:w-12/12">
                <Input
                  label="First Name"
                  type="text"
                  name="firstNameInput"
                  state={userInputs.firstNameInput}
                  placeholder="Enter Your First Name"
                  autoComplete="off"
                  onChange={onChangeHandler}
                  valid={null}
                />
              </div>
              <div className="phone:w-12/12">
                <Input
                  label="Last Name"
                  type="text"
                  name="lastNameInput"
                  state={userInputs.lastNameInput}
                  placeholder="Enter Your Last Name"
                  autoComplete="off"
                  onChange={onChangeHandler}
                  valid={null}
                />
              </div>
            </div>

            <div className="w-max mx-auto mt-4">
              <button
                onClick={async () => {
                  if (action === "Update") {
                    setIsLoading(true)
                    setLoadingMessage("Updating User please wait.")
                    const response = await updateAccount({
                      id: selectedUser!.id,
                      email: userInputs.emailInput,
                      firstName: userInputs.firstNameInput,
                      lastName: userInputs.lastNameInput,
                      username: userInputs.usernameInput,
                    });
                    setIsLoading(false)
                    setLoadingMessage("")
                    if (response!.Result) {
                      setUserList((prev) => {
                        return prev.map((user) =>
                          user.id === selectedUser!.id
                            ? {
                                ...user,
                                email: userInputs.emailInput,
                                username: userInputs.usernameInput,
                                first_name: userInputs.firstNameInput,
                                last_name: userInputs.lastNameInput,
                              }
                            : user
                        );
                      });
                      setToggleUserInformationForm(false);
                    }
                  }
                  if (action === "Add") {
                    setIsLoading(true)
                    setLoadingMessage("Creating User please wait.")
                    const response = await addUserThroughAdmin({
                      email: userInputs.emailInput,
                      firstName: userInputs.firstNameInput,
                      lastName: userInputs.lastNameInput,
                      username: userInputs.usernameInput,
                    });
                    setIsLoading(false)
                    setLoadingMessage("")
                    if (response!.Result) {
                      const newUser = response!.user;
                      setUserList((prev) => [...prev, newUser]);
                      setToggleUserInformationForm(false);
                    }
                  }
                }}
                className="cursor-pointer flex gap-1 items-center bg-[#5d897b] text-white font-quickSand font-semibold w-full rounded-md p-1 px-2 transition duration-200 hover:bg-secondary"
                type="button"
              >
                <MaterialSymbolsAccountCircleFull
                  color="#D3F0D1"
                  width="1.3em"
                  height="1.3em"
                />
                {action === "Add" ? "Create" : "Update"} User Information
              </button>
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

export default UserInformationForm;
