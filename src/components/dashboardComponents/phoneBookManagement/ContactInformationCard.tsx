// Icons
import TablerTrashX from "../../../assets/icons/TablerTrashX";
import TablerEdit from "../../../assets/icons/TablerEdit";
import MaterialSymbolsShareOutline from "../../../assets/icons/MaterialSymbolsShareOutline";
import { contactInfoTypes } from "../../../types/contactTypes";
import {
  deleteContact,
  deleteSharedContact,
} from "../../../lib/contactInformationQueries";
import { AnimatePresence } from "motion/react";
import LoadingPopUp from "../../reusableComponents/LoadingPopUp";
import { useState } from "react";

// Types
interface props {
  contactType: string;
  id?: string;
  name: string;
  email: string;
  contactNumber: string;
  profilePhoto?: string;
  index: number;
  userId: number;
  setSelectedContact: React.Dispatch<React.SetStateAction<number>>;
  setToggleShareContactForm: React.Dispatch<React.SetStateAction<boolean>>;
  setToggleContactInformationForm: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setFormAction: React.Dispatch<React.SetStateAction<string>>;
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
  setMySharedContactList?: React.Dispatch<
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
  userShareToEmail?: string;
  userShareToFirstName?: string;
  userShareToLastName?: string;
  userShareToUserId?: string;
  contactSharesId?: number;
}

const ContactInformationCard = ({
  contactType,
  contactNumber,
  email,
  name,
  profilePhoto,
  index,
  setFormAction,
  setSelectedContact,
  setToggleContactInformationForm,
  id,
  setContactList,
  setToggleShareContactForm,
  userId,
  userShareToEmail,
  userShareToFirstName,
  userShareToLastName,
  contactSharesId,
  setMySharedContactList,
}: props) => {
  const loggedUser = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userId="))
    ?.split("=")[1];

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>("")

  return (
    <>
      <div className="flex flex-col gap-2 p-2 rounded-lg bg-lightPrimary max-h-[270px] phone:w-[95%] tablet:w-[300px]">
        <div className="flex flex-col gap-1 text-white">
          <p className="font-semibold text-sm">
            Contact ID:{" "}
            <span className="text-lightSecondary underline">{id}</span>
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-[70px] h-[70px] rounded-full">
              <img
                src={`${profilePhoto ? profilePhoto : "/cute-dogoo.jpeg"}`}
                alt="phonebook"
                className="w-full h-full rounded-full"
              />
            </div>
            <div className="flex flex-col gap-1 text-white text-sm">
              <p className="font-semibold text-lightSecondary">{name}</p>
              <p>{email}</p>
            </div>
          </div>
          {parseInt(loggedUser!) === userId &&
            contactType === "Contact List" && (
              <div className="flex items-center justify-center gap-1">
                <span
                  onClick={async () => {
                    setIsLoading(true)
                    setLoadingMessage("Deleting Contact please wait.")
                    const response = await deleteContact(id!);
                    setIsLoading(false)
                    setLoadingMessage("")
                    if (response!.Result) {
                      setContactList((prev) =>
                        prev.filter(
                          (contact: contactInfoTypes) => contact._id !== id
                        )
                      );
                    }
                  }}
                  title="Delete"
                  className="cursor-pointer"
                >
                  <TablerTrashX color="#dc3545" width="1.5em" height="1.5em" />
                </span>
              </div>
            )}
        </div>
        <div className="flex items-center gap-2 text-white text-sm">
          <p className="font-bold text-lightSecondary underline">
            Contact Number:
          </p>
          <p className="font-bold">{contactNumber}</p>
        </div>
        {parseInt(loggedUser!) === userId &&
          contactType === "My Shared Contacts" && (
            <div className="flex flex-col gap-1 text-white">
              <p className="text-lightSecondary underline font-semibold text-sm">
                Contact Shared To:
              </p>
              <div className="flex flex-col">
                <p className=" text-sm">
                  {userShareToFirstName + " " + userShareToLastName}
                </p>
                <p className=" text-sm">{userShareToEmail}</p>
              </div>
            </div>
          )}
        {parseInt(loggedUser!) === userId &&
          contactType === "My Shared Contacts" && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={async () => {
                  setIsLoading(true)
                  setLoadingMessage("Removing contact access please wait.")
                  const response = await deleteSharedContact(contactSharesId!);
                  setIsLoading(false)
                  setLoadingMessage("")
                  if (response!.Result) {
                    setMySharedContactList!((prev) =>
                      prev.filter(
                        (
                          contact: contactInfoTypes & {
                            userShareToEmail: string;
                            userShareToFirstName: string;
                            userShareToLastName: string;
                            userShareToUserId: number;
                            contactSharesId: number;
                          }
                        ) => contact.contactSharesId !== contactSharesId
                      )
                    );
                  }
                  // setSelectedContact(index);
                  // setToggleShareContactForm(true);
                }}
                className="flex items-center gap-1 cursor-pointer rounded-md py-2 px-4 w-max text-[0.8rem] font-semibold text-statusText bg-deactivated opacity-90 hover:opacity-100 transition ease-in-out duration-300"
              >
                Stop Sharing
                <MaterialSymbolsShareOutline
                  color="#fff"
                  width="1.3em"
                  height="1.3em"
                />
              </button>
            </div>
          )}
        {parseInt(loggedUser!) === userId && contactType === "Contact List" && (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => {
                setSelectedContact(index);
                setToggleShareContactForm(true);
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
            <button
              onClick={() => {
                setFormAction("Update");
                setSelectedContact(index);
                setToggleContactInformationForm(true);
              }}
              className="flex items-center gap-1 cursor-pointer rounded-md py-2 px-4 w-max text-[0.8rem] font-semibold text-statusText bg-pending opacity-90 hover:opacity-100 transition ease-in-out duration-300"
            >
              Update
              <TablerEdit color="#fff" width="1.3em" height="1.3em" />
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

export default ContactInformationCard;
