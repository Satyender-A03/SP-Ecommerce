import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MdShoppingCart,
  MdInventory,
  MdPeople,
  MdCurrencyRupee,
  MdOutlineReceiptLong,
  MdOutlineWarningAmber,
} from "react-icons/md";

import API_URL from "../../Constent";

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [productMap, setProductMap] = useState({});
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
        const productList = Array.isArray(productData) ? productData : [];

        setOrders(orderList);
        setProducts(productList);

        const map = {};
        productList.forEach((p) => (map[p._id] = p));
        setProductMap(map);
      } catch (err) {
        console.log(err);
        setOrders([]);
        setProducts([]);
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

  const totalRevenue = useMemo(
    () =>
      validOrders.reduce((sum, o) => sum + (o.price || 0) * (o.qty || 1), 0),
    [validOrders],
  );

  const totalCustomers = useMemo(
    () => new Set(validOrders.map((o) => o.userId)).size,
    [validOrders],
  );

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [orders],
  );

  const lowStockProducts = useMemo(
    () =>
      [...products]
        .filter((p) => (p.qty ?? 0) <= 10)
        .sort((a, b) => (a.qty ?? 0) - (b.qty ?? 0))
        .slice(0, 6),
    [products],
  );

  return (
    <div className="w-full min-h-screen bg-[#0f1115] text-white p-8">
      {/* Heading */}
      <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
        Overview
      </p>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Orders"
          value={loading ? "—" : orders.length.toLocaleString("en-IN")}
          icon={<MdShoppingCart size={22} />}
        />
        <StatCard
          title="Total Products"
          value={loading ? "—" : products.length.toLocaleString("en-IN")}
          icon={<MdInventory size={22} />}
        />
        <StatCard
          title="Customers"
          value={loading ? "—" : totalCustomers.toLocaleString("en-IN")}
          icon={<MdPeople size={22} />}
        />
        <StatCard
          title="Revenue"
          value={loading ? "—" : `₹${totalRevenue.toLocaleString("en-IN")}`}
          icon={<MdCurrencyRupee size={22} />}
        />
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-[#171a21] border border-white/5 rounded-xl p-5 h-80 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300">
              Recent Orders
            </h2>
            <Link
              to="/orders"
              className="text-xs text-violet-400 hover:text-violet-300 transition font-semibold"
            >
              View all →
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-white/[0.02] rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-500">
                <MdOutlineReceiptLong className="text-3xl" />
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              <ul className="space-y-1 text-sm">
                {recentOrders.map((o) => {
                  const pid = Array.isArray(o.productId)
                    ? o.productId[0]
                    : o.productId;
                  const key = pid?._id || pid;
                  const product = productMap[key];
                  return (
                    <li
                      key={o._id}
                      className="flex justify-between items-center border-b border-white/5 last:border-0 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {product?.title || "Product"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {o.status || "Processing"}
                        </p>
                      </div>
                      <span className="font-semibold shrink-0 ml-3">
                        ₹
                        {((o.price || 0) * (o.qty || 1)).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-[#171a21] border border-white/5 rounded-xl p-5 h-80 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300">
              Low Stock Products
            </h2>
            <Link
              to="/productmanage"
              className="text-xs text-violet-400 hover:text-violet-300 transition font-semibold"
            >
              View all →
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-white/[0.02] rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : lowStockProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-500">
                <MdOutlineWarningAmber className="text-3xl" />
                <p className="text-sm">All products well stocked</p>
              </div>
            ) : (
              <ul className="space-y-1 text-sm">
                {lowStockProducts.map((p) => (
                  <li
                    key={p._id}
                    className="flex justify-between items-center border-b border-white/5 last:border-0 py-2.5"
                  >
                    <span className="truncate">{p.title}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full border shrink-0 ml-3 ${
                        p.qty === 0
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {p.qty === 0 ? "Out of stock" : `${p.qty} left`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-[#171a21] border border-white/5 rounded-xl p-5 flex items-center justify-between h-28">
    <div>
      <p className="text-gray-500 text-xs font-medium mb-1">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
    <div className="text-violet-400 bg-violet-500/10 w-11 h-11 rounded-lg flex items-center justify-center shrink-0">
      {icon}
    </div>
  </div>
);

export default AdminPanel;
