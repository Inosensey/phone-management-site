// Components
import DashboardHeader from "../../components/dashboardComponents/DashboardHeader";

// Icons
import MaterialSymbolsAccountCircleFull from "../../assets/icons/MaterialSymbolsAccountCircleFull";
import UserManagement from "../../components/dashboardComponents/userManagement/UserManagement";

const Dashboard = () => {
  return (
    <div className="px-4 mt-4 w-full">
      <title>PhoneBook Management</title>
      <div className="flex flex-col gap-3 h-[99%]">
        <DashboardHeader
          headerText="Users"
          headerDescription="View and manage user accounts"
          Icon={MaterialSymbolsAccountCircleFull}
        />
        <UserManagement />
      </div>
    </div>
  );
};

export default Dashboard;
