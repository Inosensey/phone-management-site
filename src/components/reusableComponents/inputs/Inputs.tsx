import { useState } from "react";

import MdiEyeOutline from "../../../assets/icons/MdiEyeOutline"
import MdiEyeOffOutline from "../../../assets/icons/MdiEyeOffOutline"

// Types
interface inputParams<T> {
  state: T extends string ? T : string;
  type?: string;
  name: string;
  placeholder?: string;
  label?: string;
  shortDescription?: string;
  valid?: null | boolean | undefined;
  validationMessage?: string;
  autoComplete?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}
interface fileInputParam {
  state: string;
  name: string;
  customButtonName: string;
  label: string;
  valid?: null | boolean | undefined;
  validationMessage?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = <T extends string | number>({
    state,
    type,
    name,
    autoComplete,
    onChange,
    onBlur,
    onInput,
    placeholder,
    label,
    shortDescription,
    valid,
    validationMessage,
  }: inputParams<T>) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const toggleShowPassword = () => setShowPassword(!showPassword);
  
    return (
      <div className={`flex flex-col w-full laptop:w-full gap-1`}>
        {label && (
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <label className="phone:text-sm font-quickSand font-semibold">
                {label}
              </label>
              {shortDescription && (
                <p className="text-[#999999] text-xs font-semibold font-dmSans">
                  {shortDescription}
                </p>
              )}
            </div>
          </div>
        )}
        <div
          className="w-full relative bg-[#121212] overflow-hidden p-1"
          style={{
            border: valid === null ? "" : valid ? "" : "1px solid rgb(239 68 68)",
          }}
        >
          <input
            value={state}
            onChange={onChange}
            onBlur={onBlur}
            onInput={onInput}
            type={type !== "password" ? type : showPassword ? "text" : "password"}
            name={name}
            placeholder={placeholder}
            className={`bg-transparent w-[92%] text-white px-2 py-2 phone:text-sm font-quickSand`}
            autoComplete={autoComplete}
            // required
          />
          {type === "password" && (
            <>
              {showPassword && (
                <MdiEyeOutline
                  onClick={toggleShowPassword}
                  color="#e0e1dd"
                  className="cursor-pointer absolute -translate-y-[50%] top-[50%] right-2"
                  width="1.4em"
                  height="1.4em"
                />
              )}
              {!showPassword && (
                <MdiEyeOffOutline
                  onClick={toggleShowPassword}
                  color="#e0e1dd"
                  className="cursor-pointer absolute -translate-y-[50%] top-[50%] right-2"
                  width="1.4em"
                  height="1.4em"
                />
              )}
            </>
          )}
  
          <div
            className={`h-[4px] w-full bg-LightPrimary absolute`}
          ></div>
        </div>
        {valid != null ? (
          valid === true ? (
            ""
          ) : (
            <span className="text-[0.75rem] text-red-500 font-bold font-dmSans">
              {validationMessage}
            </span>
          )
        ) : (
          ""
        )}
      </div>
    );
  };

  export const CustomFileInput = ({
    label,
    name,
    state,
    valid,
    customButtonName,
    validationMessage,
    onChange,
  }: fileInputParam) => {
    return (
      <div
        className="flex flex-col phone:w-full gap-2 px-2 py-1 w-full rounded-lg"
        style={{
          border: valid === null ? "" : valid ? "" : "1px solid rgb(239 68 68)",
        }}
      >
        <label className="phone:text-sm font-quickSand font-semibold">
          {label}
        </label>
  
        <div className="w-full relative">
          <input
            type="file"
            name={name}
            id={name}
            value={state}
            onChange={onChange}
            className="hidden"
          />
          <label
            className="cursor-pointer bg-[#5d897b] text-white font-quickSand font-semibold text-sm w-1/2 rounded-md py-1 px-2 flex flex-col-reverse items-center justify-center gap-1 transition duration-200 hover:bg-secondary"
            htmlFor={name}
          >
            {customButtonName}
          </label>
        </div>
        {valid != null ? (
          valid === true ? (
            ""
          ) : (
            <span className="text-[0.75rem] text-red-500 font-bold font-dmSans">
              {validationMessage}
            </span>
          )
        ) : (
          ""
        )}
      </div>
    );
  };