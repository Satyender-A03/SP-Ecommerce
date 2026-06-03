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
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`${
        open ? "w-74" : "w-16"
      } h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
        {open && <span className="text-lg font-bold">Admin</span>}
        <button onClick={() => setOpen(!open)}>
          <MdMenu size={22} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <Link to="/admin">
          <Item
            icon={<MdDashboard size={22} />}
            label="Dashboard"
            open={open}
          />
        </Link>
        <Item icon={<MdShoppingCart size={22} />} label="Orders" open={open} />
        <Link to="/productmanage">
          <Item icon={<MdInventory size={22} />} label="Products" open={open} />
        </Link>
        <Link to="/brandmanage">
          <Item icon={<MdPeople size={22} />} label="Brands" open={open} />
        </Link>
        <Link to="analytics">
          {" "}
          <Item icon={<MdBarChart size={22} />} label="Analytics" open={open} />
        </Link>
        <Item icon={<MdSettings size={22} />} label="Settings" open={open} />
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-700">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600 cursor-pointer">
          <MdLogout size={22} />
          {open && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
};

const Item = ({ icon, label, open }) => (
  <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 cursor-pointer">
    {icon}
    {open && <span>{label}</span>}
  </div>
);

export default Sidebar;
