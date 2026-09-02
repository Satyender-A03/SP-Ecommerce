import { useEffect, useMemo, useState } from "react";
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

import API_URL from "../../Constent";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Analytics = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [orderRes, productRes] = await Promise.all([
          fetch(`${API_URL}/order`),
          fetch(`${API_URL}/products`),
        ]);
        const orderData = await orderRes.json();
        const productData = await productRes.json();

        const orderList = Array.isArray(orderData) ? orderData : [];
        setOrders(orderList);

        const productMap = {};
        (Array.isArray(productData) ? productData : []).forEach((p) => {
          productMap[p._id] = p;
        });
        setProducts(productMap);
      } catch (err) {
        console.log(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const validOrders = useMemo(
    () => orders.filter((o) => o.status?.toLowerCase() !== "cancelled"),
    [orders],
  );

  // ── Top Stats ──
  const totalRevenue = useMemo(
    () =>
      validOrders.reduce((sum, o) => sum + (o.price || 0) * (o.qty || 1), 0),
    [validOrders],
  );

  const totalOrders = validOrders.length;

  const totalCustomers = useMemo(
    () => new Set(validOrders.map((o) => o.userId)).size,
    [validOrders],
  );

  const revenueGrowth = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);

    let current = 0;
    let previous = 0;
    validOrders.forEach((o) => {
      if (!o.createdAt) return;
      const d = new Date(o.createdAt);
      const amt = (o.price || 0) * (o.qty || 1);
      if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
        current += amt;
      } else if (
        d.getMonth() === lastMonthDate.getMonth() &&
        d.getFullYear() === lastMonthDate.getFullYear()
      ) {
        previous += amt;
      }
    });

    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }, [validOrders]);

  // ── Monthly Sales (last 6 months, real data) ──
  const salesData = useMemo(() => {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        month: MONTHS[d.getMonth()],
        sales: 0,
      });
    }
    validOrders.forEach((o) => {
      if (!o.createdAt) return;
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = buckets.find((b) => b.key === key);
      if (bucket) bucket.sales += (o.price || 0) * (o.qty || 1);
    });
    return buckets;
  }, [validOrders]);

  // ── Orders by Category (via linked product) ──
  const orderData = useMemo(() => {
    const counts = {};
    validOrders.forEach((o) => {
      const pid = Array.isArray(o.productId) ? o.productId[0] : o.productId;
      const key = pid?._id || pid;
      const category = products[key]?.category || "Other";
      counts[category] = (counts[category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, orders]) => ({ name, orders }));
  }, [validOrders, products]);

  return (
    <div className="w-full min-h-screen bg-[#0f1115] text-white p-8 overflow-y-auto">
      {/* Heading */}
      <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
        Insights
      </p>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Analytics</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat
          title="Revenue Growth"
          value={
            loading ? "—" : `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth}%`
          }
          icon={<MdTrendingUp />}
          positive={revenueGrowth >= 0}
        />
        <Stat
          title="Total Orders"
          value={loading ? "—" : totalOrders.toLocaleString("en-IN")}
          icon={<MdShoppingCart />}
        />
        <Stat
          title="Customers"
          value={loading ? "—" : totalCustomers.toLocaleString("en-IN")}
          icon={<MdPeople />}
        />
        <Stat
          title="Revenue"
          value={loading ? "—" : `₹${totalRevenue.toLocaleString("en-IN")}`}
          icon={<MdCurrencyRupee />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Line Chart */}
        <div className="bg-[#171a21] border border-white/5 rounded-xl p-5 h-80">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">
            Monthly Sales
          </h2>
          {loading ? (
            <div className="w-full h-[85%] bg-white/[0.02] rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#0f1115",
                    border: "1px solid #ffffff1a",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                  formatter={(value) => [
                    `₹${value.toLocaleString("en-IN")}`,
                    "Sales",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Orders Bar Chart */}
        <div className="bg-[#171a21] border border-white/5 rounded-xl p-5 h-80">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">
            Orders by Category
          </h2>
          {loading ? (
            <div className="w-full h-[85%] bg-white/[0.02] rounded-lg animate-pulse" />
          ) : orderData.length === 0 ? (
            <div className="w-full h-[85%] flex items-center justify-center text-gray-500 text-sm">
              No orders yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#0f1115",
                    border: "1px solid #ffffff1a",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Bar dataKey="orders" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ title, value, icon, positive }) => (
  <div className="bg-[#171a21] border border-white/5 rounded-xl p-5 flex items-center justify-between h-28">
    <div>
      <p className="text-gray-500 text-xs font-medium mb-1">{title}</p>
      <h2
        className={`text-2xl font-bold ${
          positive === false
            ? "text-red-400"
            : positive === true
              ? "text-emerald-400"
              : "text-white"
        }`}
      >
        {value}
      </h2>
    </div>
    <div className="text-violet-400 text-2xl bg-violet-500/10 w-11 h-11 rounded-lg flex items-center justify-center shrink-0">
      {icon}
    </div>
  </div>
);

export default Analytics;
