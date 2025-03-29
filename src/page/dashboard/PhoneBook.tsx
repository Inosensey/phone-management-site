// Components
import DashboardHeader from "../../components/dashboardComponents/DashboardHeader";
import PhoneBookManagement from "../../components/dashboardComponents/phoneBookManagement/PhoneBookManagement";

// Icons
import MaterialSymbolsBook2OutlineRounded from "../../assets/icons/MaterialSymbolsBook2OutlineRounded";
const PhoneBook = () => {
  return (
    <div className="px-4 mt-4 w-full">
      <title>PhoneBook Management</title>
      <div className="flex flex-col gap-3 h-[99%]">
        <DashboardHeader
          headerText="Phone Books"
          headerDescription="Manage and organize your contacts"
          Icon={MaterialSymbolsBook2OutlineRounded}
        />
        <PhoneBookManagement />
      </div>
    </div>
  );
};

export default PhoneBook;
