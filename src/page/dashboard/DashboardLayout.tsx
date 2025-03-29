import { Outlet, useNavigate } from "react-router"
import Sidebar from "../../components/dashboardComponents/Sidebar"
import { useEffect } from "react";

const DashboardLayout = () => {
  // navigate
  const navigate = useNavigate();

    useEffect(() => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      
      const roleId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("roleId="))
      ?.split("=")[1];
      if (!token) navigate("/");
      if (parseInt(roleId!) === 1) navigate("/dashboard/phone-book");
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  return (
    <div className="bg-[#0d0d0d] w-full h-screen flex relative">
        <Sidebar />
        <Outlet />
    </div>
  )
}

export default DashboardLayout