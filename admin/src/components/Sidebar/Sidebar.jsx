import { useState } from "react";
import {
  MdDashboard,
  MdShoppingCart,
  MdInventory,
  MdPeople,
  MdBarChart,
  MdSettings,
  MdLogout,
  MdMenu,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { icon: <MdDashboard size={22} />, label: "Dashboard", path: "/admin" },
  { icon: <MdDashboard size={22} />, label: "Users", path: "/users" },
  { icon: <MdShoppingCart size={22} />, label: "Orders", path: "/orders" },
  {
    icon: <MdInventory size={22} />,
    label: "Products",
    path: "/productmanage",
  },
  { icon: <MdPeople size={22} />, label: "Brands", path: "/brandmanage" },
  { icon: <MdBarChart size={22} />, label: "Analytics", path: "/analytics" },
  { icon: <MdSettings size={22} />, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("adminToken");
    navigate("/signin");
  };

  return (
    <div
      className={`${open ? "w-60" : "w-[56px]"} h-screen sticky top-0 self-start bg-[#111827] text-white flex flex-col transition-all duration-300 flex-shrink-0`}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3.5 border-b border-white/8">
        {open && (
          <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap">
            Admin Panel
          </span>
        )}
        <button
          onClick={() => setOpen(!open)}
          className={`p-1.5 rounded-lg hover:bg-white/10 transition text-gray-400 hover:text-white flex-shrink-0 ${!open ? "mx-auto" : ""}`}
        >
          <MdMenu size={22} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[14px] transition-all whitespace-nowrap overflow-hidden
                ${isActive ? "bg-white/15 text-white" : "text-gray-400 hover:bg-white/8 hover:text-gray-100"}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {open && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-white/8">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[14px] text-gray-400 hover:bg-red-500/15 hover:text-red-400 transition-all whitespace-nowrap overflow-hidden ${!open ? "justify-center" : ""}`}
        >
          <span className="flex-shrink-0">
            <MdLogout size={22} />
          </span>
          {open && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
