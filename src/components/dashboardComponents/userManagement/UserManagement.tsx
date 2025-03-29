import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";

// Components
import UserInformationForm from "./UserInformationForm";

// lib
import { getAccountRequest, getUsers } from "../../../lib/userQueries";

// Icons
import MaterialSymbolsAddCircleOutline from "../../../assets/icons/MaterialSymbolsAddCircleOutline";
import UserCard from "./UserCard";
import { userInfoType } from "../../../types/userTypes";

// Fixed values
const statusTabValues: Array<string> = [
  "Active",
  "Pending Request",
  "Deactivated",
];

const UserManagement = () => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>("Active");
  const [formAction, setFormAction] = useState<string>("Add");
  const [toggleUserInformationForm, setToggleUserInformationForm] =
    useState(false);
  const [userList, setUserList] = useState<Array<userInfoType>>([]);
  const [filteredUserList, setFilteredUserList] = useState<Array<userInfoType>>(
    []
  );
  const [selectedUser, setSelectedUser] = useState<number>(0);
  const [accountRequestList, setAccountRequestList] = useState<
    Array<userInfoType>
  >([]);
  const [fetchingUsers, setFetchingUsers] = useState<boolean | null>(null);

  const getUserList = useCallback(async () => {
    setFetchingUsers(true);
    try {
      const [users, accountRequest]: [userInfoType[], userInfoType[]] =
        await Promise.all([getUsers(), getAccountRequest()]);
      setUserList(users);
      setFilteredUserList(
        users.filter((user) => user.status_name === "Active" && user.role_id !== 2)
      );
      setAccountRequestList(accountRequest);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setFetchingUsers(false);
    }
  }, []);

  const filterUsers = (tab: string) => {
    if (tab === "Pending Request") {
      setFilteredUserList(accountRequestList);
    } else {
      setFilteredUserList(userList.filter((user) => user.status_name === tab && user.role_id !== 2));
    }
  };
  useEffect(() => {
    getUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (userList.length === 0) return;
    if (selectedStatusTab === "Pending Request") {
      setFilteredUserList(accountRequestList);
    } else {
      setFilteredUserList(
        userList.filter((user) => user.status_name === selectedStatusTab && user.role_id !== 2)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userList]);

  return (
    <>
      <div className="flex-1 bg-black h-[80%] w-full p-4 rounded-lg">
        <div className="w-full h-full">
          <div className="flex flex-col w-full h-full">
            <div className="flex gap-1 items-center justify-between border-b-[1px] border-lightSecondary pb-1 phone:flex-col laptop:flex-row">
              <div className="flex flex-wrap items-center gap-1 phone:justify-center ">
                {statusTabValues.map((tab: string, index: number) => (
                  <p
                    onClick={() => {
                      setSelectedStatusTab(tab);
                      filterUsers(tab);
                    }}
                    key={index}
                    style={{
                      background:
                        selectedStatusTab === tab ? "#1E1E1E" : "#333333",
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
                  setToggleUserInformationForm(true);
                }}
                className="bg-[#5d897b] text-white font-quickSand font-semibold px-2 py-1 text-sm rounded-md flex items-center cursor-pointer justify-center gap-1 transition duration-200 hover:bg-secondary"
              >
                Add a User
                <MaterialSymbolsAddCircleOutline
                  color="#fff"
                  width="1.5em"
                  height="1.5em"
                />
              </button>
            </div>
            <div className="w-full max-h-[95%] flex flex-wrap gap-2 mt-2 overflow-auto phone:justify-center tablet:justify-start">
              {fetchingUsers !== null && fetchingUsers === true ? (
                <p className="text-white">Fetching Users...</p>
              ) : userList.length === 0 ? (
                <p className="text-white">No Users Found</p>
              ) : (
                filteredUserList.map((user: userInfoType, index: number) => (
                  <div key={index}>
                    <UserCard
                      setToggleUserInformationForm={
                        setToggleUserInformationForm
                      }
                      setSelectedUser={setSelectedUser}
                      setFormAction={setFormAction}
                      userList={userList}
                      selectedIndex={index}
                      setAccountRequestList={setAccountRequestList}
                      setUserList={setUserList}
                      filterUsers={filterUsers}
                      setSelectedStatusTab={setSelectedStatusTab}
                      email={user.email}
                      status={
                        user.status_name === undefined
                          ? "Pending"
                          : user.status_name
                      }
                      id={user.id}
                      fullName={`${user.first_name} ${user.last_name}`}
                      userName={user.username}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {toggleUserInformationForm && (
          <UserInformationForm
            setUserList={setUserList}
            action={formAction}
            setToggleUserInformationForm={setToggleUserInformationForm}
            selectedUser={userList[selectedUser]}
            selectedIndex={selectedUser}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default UserManagement;
