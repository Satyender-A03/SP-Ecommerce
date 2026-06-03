import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MdTrendingUp,
  MdShoppingCart,
  MdPeople,
  MdCurrencyRupee,
} from "react-icons/md";

const salesData = [
  { month: "Jan", sales: 40000 },
  { month: "Feb", sales: 30000 },
  { month: "Mar", sales: 50000 },
  { month: "Apr", sales: 45000 },
  { month: "May", sales: 60000 },
  { month: "Jun", sales: 70000 },
];

const orderData = [
  { name: "Electronics", orders: 120 },
  { name: "Fashion", orders: 220 },
  { name: "Grocery", orders: 90 },
];

const Analytics = () => {
  return (
    <div className="w-full h-screen bg-black text-white p-6 overflow-y-auto">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Stat title="Revenue Growth" value="+18%" icon={<MdTrendingUp />} />
        <Stat title="Total Orders" value="1,245" icon={<MdShoppingCart />} />
        <Stat title="Customers" value="860" icon={<MdPeople />} />
        <Stat title="Revenue" value="₹7,50,000" icon={<MdCurrencyRupee />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Line Chart */}
        <div className="bg-gray-800 rounded-xl p-5 h-80">
          <h2 className="text-lg font-semibold mb-3">Monthly Sales</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Bar Chart */}
        <div className="bg-gray-800 rounded-xl p-5 h-80">
          <h2 className="text-lg font-semibold mb-3">Orders by Category</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="orders" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ title, value, icon }) => (
  <div className="bg-gray-800 rounded-xl p-5 flex items-center justify-between h-28">
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
    <div className="text-blue-500 text-3xl">{icon}</div>
  </div>
);

export default Analytics;
