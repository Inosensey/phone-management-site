import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";

// Components
import ContactInformationForm from "./ContactInformationForm";
import ShareContactForm from "./ShareContactForm";

// Lib
import {
  getMySharedContacts,
  getSharedContacts,
  getUserContactInformations,
} from "../../../lib/contactInformationQueries";

// Icons
import MaterialSymbolsAddCircleOutline from "../../../assets/icons/MaterialSymbolsAddCircleOutline";
import ContactInformationCard from "./ContactInformationCard";

// Types
import { contactInfoTypes } from "../../../types/contactTypes";
import { userInfoType } from "../../../types/userTypes";
import { getUsers } from "../../../lib/userQueries";

// Fixed values
const tabValues: Array<string> = ["Phone Books", "Shared Phone Books"];

const PhoneBookManagement = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Phone Books");
  const [formAction, setFormAction] = useState<string>("Add");
  const [filteredUserList, setFilteredUserList] = useState<Array<userInfoType>>(
    []
  );
  const [contactList, setContactList] = useState<
    Array<
      contactInfoTypes & {
        profileBlob: string | null;
        filename: string;
      }
    >
  >([]);
  const [sharedContactList, setSharedContactList] = useState<
    Array<contactInfoTypes>
  >([]);
  const [mySharedContactList, setMySharedContactList] = useState<
    Array<
      contactInfoTypes & {
        userShareToEmail: string;
        userShareToFirstName: string;
        userShareToLastName: string;
        userShareToUserId: number;
        contactSharesId: number;
      }
    >
  >([]);
  const [fetchingContacts, setFetchingContacts] = useState<boolean | null>(
    null
  );
  const [selectedContact, setSelectedContact] = useState<number>(0);
  const [toggleContactInformationForm, setToggleContactInformationForm] =
    useState(false);
  const [toggleShareContactForm, setToggleShareContactForm] = useState(false);

  const getContactList = useCallback(async () => {
    const userId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userId="))
      ?.split("=")[1];
    setFetchingContacts(true);
    try {
      const [contacts, sharedContact, mySharedContacts]: [
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
        >,
        Array<
          contactInfoTypes & {
            profileBlob: string | null;
            filename: string;
            userShareToEmail: string;
            userShareToFirstName: string;
            userShareToLastName: string;
            userShareToUserId: number;
            contactSharesId: number;
          }
        >
      ] = await Promise.all([
        getUserContactInformations(parseInt(userId!)),
        getSharedContacts(parseInt(userId!)),
        getMySharedContacts(parseInt(userId!)),
      ]);
      setContactList([...contacts, ...sharedContact]);
      setSharedContactList(sharedContact);
      setMySharedContactList(mySharedContacts);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setFetchingContacts(false);
    }
  }, []);

  console.log(sharedContactList);

  const getUserList = useCallback(async () => {
    try {
      const [users]: [userInfoType[]] = await Promise.all([getUsers()]);
      setFilteredUserList(
        users.filter((user) => user.status_name === "Active")
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    getContactList();
    getUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="flex-1 bg-black h-[80%] w-full p-4 rounded-lg">
        <div className="w-full h-full">
          <div className="flex flex-col w-full h-full">
            <div className="flex gap-1 items-center justify-between border-b-[1px] border-lightSecondary pb-1 phone:flex-col laptop:flex-row">
              <div className="flex flex-wrap items-center gap-1 phone:justify-center ">
                {tabValues.map((tab: string, index: number) => (
                  <p
                    onClick={() => {
                      setSelectedTab(tab);
                    }}
                    key={index}
                    style={{
                      background: selectedTab === tab ? "#1E1E1E" : "#333333",
                    }}
                    className="text-white p-2 rounded-md font-semibold text-sm cursor-pointer transition ease-in"
                  >
                    {tab}
                  </p>
                ))}
              </div>
            </div>
            <div className="mt-2">
              <button
                onClick={() => {
                  setFormAction("Add");
                  setToggleContactInformationForm(true);
                }}
                className="bg-[#5d897b] text-white font-quickSand font-semibold px-2 py-1 text-sm rounded-md flex items-center cursor-pointer justify-center gap-1 transition duration-200 hover:bg-secondary"
              >
                Add a Contact Information
                <MaterialSymbolsAddCircleOutline
                  color="#fff"
                  width="1.5em"
                  height="1.5em"
                />
              </button>
            </div>
            {selectedTab === "Phone Books" && (
              <div className="w-full max-h-[95%] flex flex-wrap gap-2 mt-2 overflow-auto phone:justify-center tablet:justify-start">
                {fetchingContacts !== null && fetchingContacts === true ? (
                  <p className="text-white">Fetching Contacts...</p>
                ) : contactList.length === 0 ? (
                  <p className="text-white">No Contacts Found</p>
                ) : (
                  contactList.map(
                    (contact: contactInfoTypes, index: number) => (
                      <div key={index}>
                        <ContactInformationCard
                          contactType="Contact List"
                          setToggleShareContactForm={setToggleShareContactForm}
                          setContactList={setContactList}
                          id={contact._id}
                          userId={contact.user_id}
                          name={`${contact.first_name} ${contact.last_name}`}
                          email={contact.email_address}
                          contactNumber={contact.contact_number}
                          profilePhoto={contact.contact_profile_photo}
                          index={index}
                          setFormAction={setFormAction}
                          setSelectedContact={setSelectedContact}
                          setToggleContactInformationForm={
                            setToggleContactInformationForm
                          }
                        />
                      </div>
                    )
                  )
                )}
              </div>
            )}
            {selectedTab === "Shared Phone Books" && (
              <div className="w-full max-h-[95%] flex flex-wrap gap-2 mt-2 overflow-auto phone:justify-center tablet:justify-start">
                {mySharedContactList.length === 0 ? (
                  <p className="text-white">No Contacts Found</p>
                ) : (
                  mySharedContactList.map(
                    (
                      contact: contactInfoTypes & {
                        userShareToEmail: string;
                        userShareToFirstName: string;
                        userShareToLastName: string;
                        userShareToUserId: number;
                        contactSharesId: number;
                      },
                      index: number
                    ) => (
                      <div key={index}>
                        <ContactInformationCard
                          setMySharedContactList={setMySharedContactList}
                          contactType="My Shared Contacts"
                          setToggleShareContactForm={setToggleShareContactForm}
                          setContactList={setContactList}
                          id={contact._id}
                          userId={contact.user_id}
                          name={`${contact.first_name} ${contact.last_name}`}
                          email={contact.email_address}
                          contactNumber={contact.contact_number}
                          profilePhoto={contact.contact_profile_photo}
                          index={index}
                          setFormAction={setFormAction}
                          setSelectedContact={setSelectedContact}
                          setToggleContactInformationForm={
                            setToggleContactInformationForm
                          }
                          userShareToEmail={contact.userShareToEmail}
                          userShareToFirstName={contact.userShareToFirstName}
                          userShareToLastName={contact.userShareToLastName}
                          contactSharesId={contact.contactSharesId}
                        />
                      </div>
                    )
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {toggleContactInformationForm && (
          <ContactInformationForm
          setMySharedContactList={setMySharedContactList}
            setContactList={setContactList}
            formAction={formAction}
            setToggleContactInformationForm={setToggleContactInformationForm}
            contactInformation={contactList[selectedContact]}
          />
        )}
        {toggleShareContactForm && (
          <ShareContactForm
            userList={filteredUserList}
            contactInformation={contactList[selectedContact]}
            setToggleShareContactForm={setToggleShareContactForm}
            setMySharedContactList={setMySharedContactList}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PhoneBookManagement;
