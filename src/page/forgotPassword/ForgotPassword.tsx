import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Components
import { Input } from "../../components/reusableComponents/inputs/Inputs";

// lib
import { changePassword, forgotPasswordRequest } from "../../lib/userQueries";
import { useNavigate } from "react-router";
import LoadingPopUp from "../../components/reusableComponents/LoadingPopUp";

// Types
type forgotPasswordType = {
  emailInput: string;
  secretCodeInput: string;
  newPasswordInput: string;
  confirmPassword: string;
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
const forgotPasswordInputInitials: forgotPasswordType = {
  emailInput: "",
  secretCodeInput: "",
  newPasswordInput: "",
  confirmPassword: "",
};

const ForgotPassword = () => {
  // navigate
  const navigate = useNavigate();

  const [forgotPasswordInputs, setForgotPasswordInputs] =
    useState<forgotPasswordType>(forgotPasswordInputInitials);
  const [secretCode, setSecretCode] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [notification, setNotification] =
    useState<notificationType>(notificationInitials);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  // Events
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForgotPasswordInputs((prev) => ({ ...prev, [name]: value }));
  };

  const progressHandler = async () => {
    let response;

    switch (progress) {
      case 0:
        response = "";
        setIsLoading(true);
        setLoadingMessage("Sending Password Reset Code. Please Wait");
        response = await sendSecretCode();
        setIsLoading(false);
        setLoadingMessage("");
        if (response!.Result) setProgress((prev) => prev + 1);
        break;
      case 1:
        if (checkSecretCode()) {
          setProgress((prev) => prev + 1);
          setNotification((prev) => ({
            ...prev,
            result: true,
            message: "",
          }));
        } else {
          setNotification((prev) => ({
            ...prev,
            result: false,
            message: "Invalid Code!",
          }));
        }
        break;
      case 2:
        if (
          forgotPasswordInputs.newPasswordInput !==
          forgotPasswordInputs.confirmPassword
        ) {
          setNotification((prev) => ({
            ...prev,
            result: false,
            message: "Password doesn't match!",
          }));
        } else {
          response = "";
          setNotification((prev) => ({
            ...prev,
            result: true,
            message: "",
          }));
          setIsLoading(true);
          setLoadingMessage("Resetting Password. Please wait.");
          response = await changePassword({
            email: forgotPasswordInputs.emailInput,
            password: forgotPasswordInputs.newPasswordInput,
          });
          setIsLoading(false);
          setLoadingMessage("");
          if (response!.Result) setProgress((prev) => prev + 1);
        }
        break;
      default:
        break;
    }
  };

  const sendSecretCode = async () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    setSecretCode(randomNumber);
    const response = await forgotPasswordRequest({
      email: forgotPasswordInputs.emailInput,
      code: randomNumber,
    });
    setNotification((prev) => ({
      ...prev,
      result: response!.Result,
      message: response!.Message,
    }));
    return response;
  };

  const checkSecretCode = () => {
    if (secretCode === parseInt(forgotPasswordInputs.secretCodeInput)) {
      return true;
    }
    return false;
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
              <p className="text-lg text-[#D3F0D1] underline">
                Forgot Password
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              {progress === 0 && (
                <Input
                  label="Enter your registered email"
                  type="text"
                  name="emailInput"
                  state={forgotPasswordInputs.emailInput}
                  placeholder="Enter Your Email"
                  autoComplete="off"
                  onChange={onChangeHandler}
                  valid={null}
                />
              )}
              {progress === 1 && (
                <div className="w-full flex flex-col gap-1">
                  <Input
                    label="Enter the 6-digit code that was sent from your email"
                    type="text"
                    name="secretCodeInput"
                    state={forgotPasswordInputs.secretCodeInput}
                    placeholder="6-digit code"
                    autoComplete="off"
                    onChange={onChangeHandler}
                    valid={null}
                  />
                  <p
                    onClick={async () => {
                      setIsLoading(true);
                      setLoadingMessage(
                        "Sending Password Reset Code. Please Wait"
                      );
                      await sendSecretCode();
                      setIsLoading(false);
                      setLoadingMessage("");
                    }}
                    className="text-sm underline cursor-pointer font-semibold"
                  >
                    Resend Code
                  </p>
                </div>
              )}
              {progress === 2 && (
                <>
                  <Input
                    label="Enter your New Password"
                    type="password"
                    name="newPasswordInput"
                    state={forgotPasswordInputs.newPasswordInput}
                    placeholder="New Password"
                    autoComplete="off"
                    onChange={onChangeHandler}
                    valid={null}
                  />
                  <Input
                    label="Confirm your Password"
                    type="password"
                    name="confirmPassword"
                    state={forgotPasswordInputs.confirmPassword}
                    placeholder="Confirm Password"
                    autoComplete="off"
                    onChange={onChangeHandler}
                    valid={null}
                  />
                </>
              )}
              {progress === 3 && (
                <div className="flex flex-col gap-1">
                  <p>Your password has been reset successfully!</p>
                  <p>
                    Click{" "}
                    <span
                      onClick={() => navigate("/")}
                      className="underline text-lightSecondary cursor-pointer"
                    >
                      Here
                    </span>{" "}
                    to return to Sign In page.
                  </p>
                </div>
              )}
            </div>

            {notification.result !== null && notification.result === false && (
              <div className="bg-[#ff8080] border-1 border-[#ff1a1a] w-max rounded-sm px-2 py-[0.2rem] mx-auto mt-2">
                <p className="text-[#721c24] text-sm font-semibold">
                  {notification.message}
                </p>
              </div>
            )}
            {progress !== 3 && (
              <div className="mt-4 w-max mx-auto">
                <motion.button
                  type="button"
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2 },
                  }}
                  onClick={async () => {
                    await progressHandler();
                  }}
                  whileTap={{ scale: 0.9 }}
                  className=" bg-[#4B6F64] text-white font-quickSand font-semibold w-full rounded-md p-1 cursor-pointer"
                >
                  {progress === 0 && "Send Code"}
                  {progress === 1 && "Verify Code"}
                  {progress === 2 && "Changed Password"}
                </motion.button>
              </div>
            )}
          </form>
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        <LoadingPopUp isLoading={isLoading} message={loadingMessage} />
      </AnimatePresence>
    </>
  );
};

export default ForgotPassword;
