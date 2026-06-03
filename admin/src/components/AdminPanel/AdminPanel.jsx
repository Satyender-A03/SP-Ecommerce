import {
  MdShoppingCart,
  MdInventory,
  MdPeople,
  MdCurrencyRupee,
} from "react-icons/md";

const AdminPanel = () => {
  return (
    <div className="w-full h-screen bg-black text-white p-6 overflow-y-auto">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value="1,245"
          icon={<MdShoppingCart size={28} />}
        />
        <StatCard
          title="Total Products"
          value="320"
          icon={<MdInventory size={28} />}
        />
        <StatCard title="Customers" value="860" icon={<MdPeople size={28} />} />
        <StatCard
          title="Revenue"
          value="₹4,25,000"
          icon={<MdCurrencyRupee size={28} />}
        />
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-gray-800 rounded-xl p-5 shadow h-72 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b border-gray-700 pb-2">
              <span>#ORD1023</span>
              <span>₹2,400</span>
            </li>
            <li className="flex justify-between border-b border-gray-700 pb-2">
              <span>#ORD1024</span>
              <span>₹1,250</span>
            </li>
            <li className="flex justify-between border-b border-gray-700 pb-2">
              <span>#ORD1025</span>
              <span>₹3,600</span>
            </li>
          </ul>
        </div>

        {/* Low Stock */}
        <div className="bg-gray-800 rounded-xl p-5 shadow h-72 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Low Stock Products</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b border-gray-700 pb-2">
              <span>Nike Shoes</span>
              <span className="text-red-400">5 left</span>
            </li>
            <li className="flex justify-between border-b border-gray-700 pb-2">
              <span>iPhone Case</span>
              <span className="text-red-400">3 left</span>
            </li>
            <li className="flex justify-between border-b border-gray-700 pb-2">
              <span>T-Shirt</span>
              <span className="text-red-400">8 left</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-gray-800 rounded-xl p-5 flex items-center justify-between shadow h-28">
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
    <div className="text-blue-500">{icon}</div>
  </div>
);

export default AdminPanel;
