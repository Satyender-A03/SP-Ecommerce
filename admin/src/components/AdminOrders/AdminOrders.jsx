import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineReceiptLong, MdCheckCircle } from "react-icons/md";

import API_URL from "../../Constent";
const STATUS_OPTIONS = [
  "Processing",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "cancelled":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "shipped":
      return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    case "confirmed":
      return "bg-violet-500/10 text-violet-400 border-violet-500/20";
    default:
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/order`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setOrders(list);

      // fetch product details for display (title/image), same pattern as customer OrderPage
      const productMap = {};
      await Promise.all(
        list.map(async (order) => {
          const pid = Array.isArray(order.productId)
            ? order.productId[0]
            : order.productId;
          const key = pid?._id || pid;
          if (!key || productMap[key]) return;
          try {
            const pRes = await fetch(`${API_URL}/products/${key}`);
            const pData = await pRes.json();
            productMap[key] = pData;
          } catch {
            productMap[key] = null;
          }
        }),
      );
      setProducts(productMap);
    } catch (err) {
      console.log(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_URL}/order/status/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Status update failed");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
      );
    } catch (err) {
      console.log(err);
      alert(
        "Could not update order status. Check the /order/:id/status route.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (statusFilter !== "All") {
      list = list.filter(
        (o) =>
          (o.status || "Processing").toLowerCase() ===
          statusFilter.toLowerCase(),
      );
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((o) => {
        const pid = Array.isArray(o.productId) ? o.productId[0] : o.productId;
        const key = pid?._id || pid;
        const product = products[key];
        return (
          o.paymentId?.toLowerCase().includes(q) ||
          o.userId?.toLowerCase().includes(q) ||
          product?.title?.toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [orders, query, statusFilter, products]);

  return (
    <div className="w-full min-h-screen bg-[#0f1115] p-8">
      <div className="text-white flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
              Fulfillment
            </p>
            <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          </div>
          {!loading && (
            <span className="text-xs text-gray-500">
              {orders.length} total order{orders.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-1 min-w-[240px] bg-[#171a21] border border-white/5 rounded-xl items-center px-4 py-3 gap-3 focus-within:border-violet-500/50 transition">
            <FaSearch className="text-gray-500 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product, payment ID, or user..."
              className="w-full bg-transparent outline-none text-sm placeholder:text-gray-500"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["All", ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition border ${
                  statusFilter === s
                    ? "bg-violet-600 border-violet-600 text-white"
                    : "bg-[#171a21] border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-[#171a21] border border-white/5 rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-white/[0.03] text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4 text-left font-semibold">Item</th>
                <th className="py-4 px-2 text-left font-semibold">Qty</th>
                <th className="py-4 px-2 text-left font-semibold">Size</th>
                <th className="py-4 px-2 text-left font-semibold">Price</th>
                <th className="py-4 px-2 text-left font-semibold">
                  Payment ID
                </th>
                <th className="py-4 px-2 text-left font-semibold">Status</th>
                <th className="py-4 px-2 text-center font-semibold">
                  Delivery
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 animate-pulse shrink-0" />
                        <div className="h-3.5 w-24 bg-white/5 rounded animate-pulse" />
                      </div>
                    </td>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="py-4 px-2">
                        <div className="h-3.5 w-14 bg-white/5 rounded animate-pulse" />
                      </td>
                    ))}
                    <td className="py-4 px-2" />
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <MdOutlineReceiptLong className="text-4xl text-gray-600" />
                      <p className="text-gray-400 font-medium">
                        {query || statusFilter !== "All"
                          ? "No orders match your filters"
                          : "No orders yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const pid = Array.isArray(order.productId)
                    ? order.productId[0]
                    : order.productId;
                  const key = pid?._id || pid;
                  const product = products[key];
                  const isDelivered =
                    order.status?.toLowerCase() === "delivered";
                  const isCancelled =
                    order.status?.toLowerCase() === "cancelled";

                  return (
                    <tr
                      key={order._id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                            {product?.image?.[0] ? (
                              <img
                                src={`${API_URL}/product/${product.image[0]}`}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <MdOutlineReceiptLong className="text-gray-600 text-sm" />
                              </div>
                            )}
                          </div>
                          <span className="font-semibold truncate">
                            {product?.title || "Product"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-2 text-gray-400">
                        {order.qty || 1}
                      </td>

                      <td className="py-3.5 px-2 text-gray-400">
                        {order.size && order.size !== "-" ? order.size : "—"}
                      </td>

                      <td className="py-3.5 px-2 font-semibold">
                        ₹{order.price}
                      </td>

                      <td className="py-3.5 px-2 text-gray-500 font-mono text-xs truncate">
                        {order.paymentId || "—"}
                      </td>

                      <td className="py-3.5 px-2">
                        <select
                          value={order.status || "Processing"}
                          onChange={(e) =>
                            updateStatus(order._id, e.target.value)
                          }
                          disabled={updatingId === order._id}
                          className={`text-xs font-semibold px-2 py-1.5 rounded-full border bg-transparent outline-none cursor-pointer disabled:opacity-50 ${statusStyle(order.status)}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option
                              key={s}
                              value={s}
                              className="bg-[#171a21] text-white"
                            >
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-2 text-center">
                        {isDelivered ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                            <MdCheckCircle /> Confirmed
                          </span>
                        ) : isCancelled ? (
                          <span className="text-xs text-gray-500">—</span>
                        ) : (
                          <button
                            onClick={() => updateStatus(order._id, "Delivered")}
                            disabled={updatingId === order._id}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition disabled:opacity-50"
                          >
                            {updatingId === order._id
                              ? "Updating..."
                              : "Mark Delivered"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
