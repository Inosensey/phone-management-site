import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NavLink, useLocation } from "react-router";

// Components
import { Input } from "../../components/reusableComponents/inputs/Inputs";

// Lib
import { registerUser } from "../../lib/userQueries";
import LoadingPopUp from "../../components/reusableComponents/LoadingPopUp";

// Types
type registerInputType = {
  usernameInput: string;
  emailInput: string;
  firstNameInput: string;
  lastNameInput: string;
  passwordInput: string;
  roleId: number;
};
type notificationType = {
  result: boolean | null;
  message: string;
};

// Initials
const notificationInitials: notificationType = {
  result: null,
  message: "",
};

const SignUp = () => {
  // URL query parameters
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userType = params.get("userType");

  // Initials
  const registerInputInitials: registerInputType = {
    usernameInput: "",
    emailInput: "",
    firstNameInput: "",
    lastNameInput: "",
    passwordInput: "",
    roleId: userType ? (userType === "admin" ? 2 : 1) : 1,
  };

  //States
  const [registerInputs, setRegisterInputs] = useState<registerInputType>(
    registerInputInitials
  );
  const [notification, setNotification] =
    useState<notificationType>(notificationInitials);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  // events
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setRegisterInputs((prev) => ({ ...prev, [name]: value }));
  };

  const clearInputs = () => {
    setRegisterInputs(registerInputInitials);
  };

  const checkResponse = ({
    Result,
    Message,
  }: {
    Result: boolean;
    Message: string;
  }) => {
    if (Result) {
      const message =
        registerInputs.roleId === 1
          ? "Your account request has been submitted. You will receive an email once it is activated."
          : "Welcome, Admin!";
      setNotification({ result: Result, message: message });
      clearInputs();
    } else {
      setNotification({ result: Result, message: Message });
    }
  };
  return (
    <>
      <div className="bg-[#0d0d0d] w-screen h-screen">
        <title>PhoneBook Management</title>
        <div className="w-full h-full flex items-center justify-center">
          <form className="bg-black rounded-sm text-white px-4 py-5 max-w-[450px] phone:w-[95%]">
            <div>
              <p className="text-lg text-[#D3F0D1] font-semibold">
                PhoneBook Management
              </p>
              <p className="text-lg text-[#D3F0D1] underline">Sign Up</p>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <Input
                label="Username"
                type="text"
                name="usernameInput"
                state={registerInputs.usernameInput}
                placeholder="Enter Your Username"
                autoComplete="off"
                onChange={onChangeHandler}
                valid={null}
              />
              <Input
                label="Email"
                type="text"
                name="emailInput"
                state={registerInputs.emailInput}
                placeholder="Enter Your Email"
                autoComplete="off"
                onChange={onChangeHandler}
                valid={null}
              />
              <Input
                label="First Name"
                type="text"
                name="firstNameInput"
                state={registerInputs.firstNameInput}
                placeholder="Enter Your First Name"
                autoComplete="off"
                onChange={onChangeHandler}
                valid={null}
              />
              <Input
                label="Last Name"
                type="text"
                name="lastNameInput"
                state={registerInputs.lastNameInput}
                placeholder="Enter Your Last Name"
                autoComplete="off"
                onChange={onChangeHandler}
                valid={null}
              />
              <Input
                label="Password"
                type="password"
                name="passwordInput"
                state={registerInputs.passwordInput}
                placeholder="Enter Your Password"
                autoComplete="off"
                onChange={onChangeHandler}
                valid={null}
              />
            </div>
            {notification.result !== null &&
              (notification.result === false ? (
                <div className="bg-[#ff8080] border-1 border-[#ff1a1a] w-full rounded-sm px-2 py-[0.2rem] mx-auto mt-2">
                  <p className="text-[#721c24] text-sm font-semibold">
                    {notification.message}
                  </p>
                </div>
              ) : (
                <div className="bg-[#00ff55] border-1 border-[#00b33c] w-full rounded-sm px-2 py-[0.2rem] mx-auto mt-2">
                  <p className="text-[#00802b] text-sm font-semibold">
                    {notification.message}
                  </p>
                </div>
              ))}

            <div className="mt-1 flex items-center justify-between">
              <p>
                Already have an Account?{" "}
                <span className="text-[#D3F0D1] underline font-semi cursor-pointer ">
                  <NavLink to={"/"} end>
                    Sign In
                  </NavLink>{" "}
                </span>
              </p>
            </div>
            <div className="mt-4 w-28 mx-auto">
              <motion.button
                type="button"
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 },
                }}
                onClick={async () => {
                  setIsLoading(true);
                  setLoadingMessage("Signing Up please wait");
                  const response = await registerUser({
                    username: registerInputs.usernameInput,
                    email: registerInputs.emailInput,
                    firstName: registerInputs.firstNameInput,
                    lastName: registerInputs.lastNameInput,
                    password: registerInputs.passwordInput,
                    roleId: registerInputs.roleId,
                  });
                  setIsLoading(false);
                  setLoadingMessage("");
                  checkResponse({
                    Result: response!.Result,
                    Message: response!.Message,
                  });
                }}
                whileTap={{ scale: 0.9 }}
                className=" bg-[#4B6F64] text-white font-quickSand font-bold w-full rounded-md p-1 cursor-pointer"
              >
                Register
              </motion.button>
            </div>
          </form>
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        <LoadingPopUp isLoading={isLoading} message={loadingMessage} />
      </AnimatePresence>
    </>
  );
};

export default SignUp;
