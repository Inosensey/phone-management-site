import { useEffect, useState } from "react";

// components
import Overlay from "../../reusableComponents/Overlay";
import { CustomFileInput, Input } from "../../reusableComponents/inputs/Inputs";

// Icons
import MaterialSymbolsCancelOutline from "../../../assets/icons/MaterialSymbolsCancelOutline";
import MaterialSymbolsBook2OutlineRounded from "../../../assets/icons/MaterialSymbolsBook2OutlineRounded";
import {
  addContactInformation,
  getSharedContacts,
  getUserContactInformations,
  updateContactInformation,
} from "../../../lib/contactInformationQueries";

// Types
import { contactInfoTypes } from "../../../types/contactTypes";
import { AnimatePresence } from "motion/react";
import LoadingPopUp from "../../reusableComponents/LoadingPopUp";
type contactInformationType = {
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  profilePhoto: string;
  profilePhotoInformation: {
    fileName: string;
    height: number;
    width: number;
    file: File | null;
  };
};
interface props {
  setToggleContactInformationForm: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  formAction: string;
  contactInformation?: contactInfoTypes & {
    profileBlob: string | null;
    filename: string;
  };
  setContactList: React.Dispatch<
    React.SetStateAction<
      Array<
        contactInfoTypes & {
          profileBlob: string | null;
          filename: string;
        }
      >
    >
  >;
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
const ContactInformationForm = ({
  setToggleContactInformationForm,
  formAction,
  contactInformation,
  setContactList,
  setMySharedContactList,
}: props) => {
  // Initials
  const contactInformationInitials: contactInformationType = {
    firstName: formAction !== "Add" ? contactInformation!.first_name : "",
    lastName: formAction !== "Add" ? contactInformation!.last_name : "",
    contactNumber:
      formAction !== "Add" ? contactInformation!.contact_number : "",
    email: formAction !== "Add" ? contactInformation!.email_address : "",
    profilePhoto:
      formAction !== "Add" ? contactInformation!.contact_profile_photo : "",
    profilePhotoInformation: {
      fileName: "",
      height: 0,
      width: 0,
      file: null,
    },
  };

  // States
  const [contactInformationInputs, setContactInformationInputs] =
    useState<contactInformationType>(contactInformationInitials);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  // Event
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setContactInformationInputs((prev) => ({ ...prev, [name]: value }));
  };
  const fileInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const files = event.target.files;

    if (files && files[0]) {
      const file = files[0];
      if (!allowedTypes.includes(file.type)) {
        event.target.value = "";
        console.log(
          "Invalid file type. Please select a JPEG, PNG, or GIF file"
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("File content as base64:", e.target?.result);
        setContactInformationInputs((prev) => ({
          ...prev,
          profilePhoto: e.target?.result as string,
          profilePhotoInformation: {
            fileName: file.name,
            height: file.size,
            width: file.size,
            file: file,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchFileFromUrl = (fileName: string) => {
    try {
      const blob = contactInformation!.profileBlob as unknown as Blob;

      const file = new File([blob!], fileName, { type: "image/jpeg" });
      return file;
    } catch (error) {
      console.error("Error fetching file:", error);
      return null;
    }
  };

  useEffect(() => {
    if (formAction !== "Add") {
      const loadFile = () => {
        const file = fetchFileFromUrl(contactInformation!.filename);
        if (file) {
          setContactInformationInputs((prev) => ({
            ...prev,
            profilePhotoInformation: {
              fileName: file.name,
              height: file.size,
              width: file.size,
              file: file,
            },
          }));
        }
      };
      loadFile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Overlay>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="bg-lightPrimary rounded-lg p-4 overflow-auto max-h-[96%] phone:w-[95%] tablet:w-[60%] laptop:w-[35%]">
          <div className="w-full flex justify-between items-center">
            <p className="text-[#a3e09f] font-dmSans text-lg font-semibold">
              {formAction === "Add" ? "Create" : "Update"} Contact Information
            </p>
            <div
              onClick={() => setToggleContactInformationForm(false)}
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
                  label="First Name"
                  type="text"
                  name="firstName"
                  state={contactInformationInputs.firstName}
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
                  name="lastName"
                  state={contactInformationInputs.lastName}
                  placeholder="Enter Your Last Name"
                  autoComplete="off"
                  onChange={onChangeHandler}
                  valid={null}
                />
              </div>
              <div className="phone:w-12/12">
                <Input
                  label="Contact Number"
                  type="text"
                  name="contactNumber"
                  state={contactInformationInputs.contactNumber}
                  placeholder="Enter Your Contact Number"
                  autoComplete="off"
                  onChange={onChangeHandler}
                  valid={null}
                />
              </div>
              <div className="phone:w-12/12">
                <Input
                  label="Email"
                  type="text"
                  name="email"
                  state={contactInformationInputs.email}
                  placeholder="Enter Your Email"
                  autoComplete="off"
                  onChange={onChangeHandler}
                  valid={null}
                />
              </div>
              <div className="w-2/2 flex flex-col gap-2">
                <CustomFileInput
                  customButtonName="Choose a File"
                  label="Upload an image for your Photo."
                  name="profilePhoto"
                  state={""}
                  valid={null}
                  onChange={fileInputOnChange}
                />
                {contactInformationInputs.profilePhoto !== "" && (
                  <div className="w-[200px] h-[200px] pl-2">
                    <img
                      src={`${contactInformationInputs.profilePhoto}`}
                      alt="profile-photo"
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="w-max mx-auto mt-4">
              <button
                onClick={async () => {
                  const formData = new FormData();
                  const userId = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("userId="))
                    ?.split("=")[1];

                  // Append image file if available
                  if (contactInformationInputs.profilePhotoInformation?.file) {
                    console.log(
                      "File detected:",
                      contactInformationInputs.profilePhotoInformation.file
                    );
                    formData.append(
                      "image",
                      contactInformationInputs.profilePhotoInformation.file
                    );
                  } else {
                    console.log("No file detected.");
                  }
                  if (formAction === "Add") {
                    const contactData = {
                      user_id: parseInt(userId!),
                      first_name: contactInformationInputs.firstName,
                      last_name: contactInformationInputs.lastName,
                      contact_number: contactInformationInputs.contactNumber,
                      email_address: contactInformationInputs.email,
                      contact_profile_photo:
                        contactInformationInputs.profilePhoto,
                    };

                    formData.append("contactData", JSON.stringify(contactData));
                    setIsLoading(true);
                    setLoadingMessage("Creating Contact please wait.");
                    const response = await addContactInformation(formData);
                    setIsLoading(false);
                    setLoadingMessage("");
                    if (response.Result) {
                      setToggleContactInformationForm(false);
                      const [contacts, sharedContact]: [
                        Array<
                          contactInfoTypes & {
                            profileBlob: string | null;
                            filename: string;
                          }
                        >,
                        Array<
                          contactInfoTypes & {
                            profileBlob: string | null;
                            filename: string;
                          }
                        >
                      ] = await Promise.all([
                        getUserContactInformations(parseInt(userId!)),
                        getSharedContacts(parseInt(userId!)),
                      ]);
                      setContactList([...contacts, ...sharedContact]);
                    }
                  } else {
                    const contactData = {
                      _id: contactInformation!._id,
                      user_id: parseInt(userId!),
                      first_name: contactInformationInputs.firstName,
                      last_name: contactInformationInputs.lastName,
                      contact_number: contactInformationInputs.contactNumber,
                      email_address: contactInformationInputs.email,
                      contact_profile_photo:
                        contactInformationInputs.profilePhoto,
                    };

                    formData.append("contactData", JSON.stringify(contactData));
                    setIsLoading(true);
                    setLoadingMessage("Updating Contact please wait.");
                    const response = await updateContactInformation(formData);
                    setIsLoading(false);
                    setLoadingMessage("");
                    if (response.Result) {
                      setContactList((prev) => {
                        return prev.map((contact) =>
                          contact._id === contactData._id
                            ? {
                                ...contact,
                                _id: contactData._id,
                                contact_number:
                                  contactInformationInputs.contactNumber,
                                contact_profile_photo:
                                  contactInformationInputs.profilePhoto,
                                email_address: contactInformationInputs.email,
                                first_name: contactInformationInputs.firstName,
                                last_name: contactInformationInputs.lastName,
                                user_id: contactInformation!.user_id,
                              }
                            : contact
                        );
                      });
                      setMySharedContactList((prev) => {
                        return prev.map((contact) =>
                          contact._id === contactData._id
                            ? {
                                ...contact,
                                _id: contactData._id,
                                contact_number:
                                  contactInformationInputs.contactNumber,
                                contact_profile_photo:
                                  contactInformationInputs.profilePhoto,
                                email_address: contactInformationInputs.email,
                                first_name: contactInformationInputs.firstName,
                                last_name: contactInformationInputs.lastName,
                                user_id: contactInformation!.user_id,
                              }
                            : contact
                        );
                      });
                      setToggleContactInformationForm(false);
                    }
                    console.log(response);
                  }
                }}
                className="cursor-pointer flex gap-1 items-center bg-[#5d897b] text-white font-quickSand font-semibold w-full rounded-md p-1 px-2 transition duration-200 hover:bg-secondary"
                type="button"
              >
                <MaterialSymbolsBook2OutlineRounded
                  color="#D3F0D1"
                  width="1.3em"
                  height="1.3em"
                />
                {formAction === "Add" ? "Create" : "Update"} Contact Information
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

export default ContactInformationForm;
