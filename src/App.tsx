import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NavLink, useNavigate } from "react-router";

import "./App.css";

// Components
import { Input } from "./components/reusableComponents/inputs/Inputs";
import { userSignIn } from "./lib/userQueries";
import LoadingPopUp from "./components/reusableComponents/LoadingPopUp";

// Types
type loginInputType = {
  emailInput: string;
  passwordInput: string;
};
type notificationType = {
  result: boolean | null;
  message: string;
};

// Initials
const loginInputInitials: loginInputType = {
  emailInput: "",
  passwordInput: "",
};
const notificationInitials: notificationType = {
  result: null,
  message: "",
};

function App() {
  // initials
  const navigate = useNavigate();

  const [loginInputs, setLoginInputs] =
    useState<loginInputType>(loginInputInitials);
  const [notification, setNotification] =
    useState<notificationType>(notificationInitials);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  // events
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setLoginInputs((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    if (token) navigate("/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <p className="text-lg text-[#D3F0D1] underline">Sign In</p>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <Input
                label="Email"
                type="text"
                name="emailInput"
                state={loginInputs.emailInput}
                placeholder="Enter Your Email"
                autoComplete="off"
                onChange={onChangeHandler}
                valid={null}
              />
              <Input
                label="Password"
                type="password"
                name="passwordInput"
                state={loginInputs.passwordInput}
                placeholder="Enter Your Password"
                autoComplete="off"
                onChange={onChangeHandler}
                valid={null}
              />
            </div>
            {notification.result !== null && notification.result === false && (
              <div className="bg-[#ff8080] border-1 border-[#ff1a1a] w-max rounded-sm px-2 py-[0.2rem] mx-auto mt-2">
                <p className="text-[#721c24] text-sm font-semibold">
                  {notification.message}
                </p>
              </div>
            )}
            <div className="mt-1 flex items-center justify-between">
              <NavLink to="/sign-up" end>
                <p className="text-[#D3F0D1] underline font-semi cursor-pointer">
                  Sign Up
                </p>
              </NavLink>
              <p
                onClick={() => {
                  navigate("/forgot-password");
                }}
                className="text-sm underline cursor-pointer font-semibold"
              >
                Forgot Password
              </p>
            </div>
            <div className="mt-4 w-28 mx-auto">
              <motion.button
                type="button"
                onClick={async () => {
                  setIsLoading(true);
                  setLoadingMessage("Logging in please wait");
                  const signInResult = await userSignIn({
                    email: loginInputs.emailInput,
                    password: loginInputs.passwordInput,
                  });
                  setNotification((prev) => ({
                    ...prev,
                    result: signInResult!.Result,
                    message: signInResult!.Message,
                  }));
                  console.log(signInResult);
                  if (signInResult!.Result) {
                    document.cookie = `token=${
                      signInResult!.Token
                    }; path=/; secure=${
                      import.meta.env.PROD
                    }; samesite=strict; max-age=86400`;

                    document.cookie = `userId=${
                      signInResult!.userId
                    }; path=/; secure=${
                      import.meta.env.PROD
                    }; samesite=strict; max-age=86400`;

                    document.cookie = `roleId=${
                      signInResult!.roleId
                    }; path=/; secure=${
                      import.meta.env.PROD
                    }; samesite=strict; max-age=86400`;
                    navigate("/dashboard");
                  }
                  setIsLoading(false);
                  setLoadingMessage("");
                }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.9 }}
                className=" bg-[#4B6F64] text-white font-quickSand font-bold w-full rounded-md p-1 cursor-pointer"
              >
                Login
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
}

export default App;
