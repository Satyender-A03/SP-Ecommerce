import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdOutlineEmail,
  MdOutlinePhone,
  MdOutlineLocationOn,
  MdOutlineReceiptLong,
} from "react-icons/md";

import API_URL from "../../Constent";

const AVATAR_COLORS = [
  {
    bg: "bg-violet-500/15",
    text: "text-violet-300",
    ring: "ring-violet-500/20",
  },
  { bg: "bg-sky-500/15", text: "text-sky-300", ring: "ring-sky-500/20" },
  { bg: "bg-amber-500/15", text: "text-amber-300", ring: "ring-amber-500/20" },
  {
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    ring: "ring-emerald-500/20",
  },
  { bg: "bg-rose-500/15", text: "text-rose-300", ring: "ring-rose-500/20" },
];

const avatarStyle = (id) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const STATUS_DOT = {
  delivered: "bg-emerald-400",
  cancelled: "bg-red-400",
  shipped: "bg-sky-400",
  confirmed: "bg-violet-400",
  processing: "bg-amber-400",
};

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

const ACTIVITY_MONTHS = 6;
const MONTH_LABELS = [
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

const buildActivity = (orders) => {
  const now = new Date();
  const months = [];
  for (let i = ACTIVITY_MONTHS - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: MONTH_LABELS[d.getMonth()],
      count: 0,
    });
  }
  orders.forEach((o) => {
    if (!o.createdAt) return;
    const d = new Date(o.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.count += 1;
  });
  return months;
};

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, orderRes] = await Promise.all([
          fetch(`${API_URL}/auth/users/${id}`),
          fetch(`${API_URL}/order`),
        ]);
        const userData = await userRes.json();
        const orderData = await orderRes.json();

        setUser(userData);

        const myOrders = (Array.isArray(orderData) ? orderData : []).filter(
          (o) => o.userId === id,
        );
        setOrders(myOrders);

        const map = {};
        await Promise.all(
          myOrders.map(async (o) => {
            const pid = Array.isArray(o.productId)
              ? o.productId[0]
              : o.productId;
            const key = pid?._id || pid;
            if (!key || map[key]) return;
            try {
              const pRes = await fetch(`${API_URL}/products/${key}`);
              map[key] = await pRes.json();
            } catch {
              map[key] = null;
            }
          }),
        );
        setProductMap(map);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const validOrders = useMemo(
    () => orders.filter((o) => o.status?.toLowerCase() !== "cancelled"),
    [orders],
  );

  const totalSpent = useMemo(
    () =>
      validOrders.reduce((sum, o) => sum + (o.price || 0) * (o.qty || 1), 0),
    [validOrders],
  );

  const avgOrderValue = validOrders.length
    ? Math.round(totalSpent / validOrders.length)
    : 0;

  const activity = useMemo(() => buildActivity(orders), [orders]);
  const maxActivity = Math.max(1, ...activity.map((m) => m.count));

  const sortedOrders = useMemo(
    () =>
      [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders],
  );

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0f1115] p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-[#0f1115] p-8 text-white">
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition mb-6"
        >
          <MdArrowBack /> Back to users
        </button>
        <p className="text-gray-500 text-sm">
          This account doesn't exist — it may have been deleted.
        </p>
      </div>
    );
  }

  const fullName =
    `${user.fName || ""} ${user.lName || ""}`.trim() || user.uName;
  const avatar = avatarStyle(user._id);

  return (
    <div className="w-full min-h-screen bg-[#0f1115] p-8">
      <div className="text-white flex flex-col gap-8 max-w-4xl">
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition w-fit"
        >
          <MdArrowBack /> Back to users
        </button>

        {/* Identity block */}
        <div className="flex flex-wrap items-start gap-5">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-semibold shrink-0 ${avatar.bg} ${avatar.text} ring-1 ${avatar.ring}`}
          >
            {fullName.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-[240px]">
            <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
              {user.uName && <span>@{user.uName}</span>}
              {user.createdAt && (
                <>
                  <span className="text-gray-700">·</span>
                  <span>
                    Customer since{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contact + stats row */}
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-4">
          <div className="bg-[#171a21] border border-white/5 rounded-xl p-5 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold">
              Contact
            </p>
            <div className="flex items-center gap-2.5 text-sm text-gray-300">
              <MdOutlineEmail className="text-gray-600 shrink-0" size={16} />
              <span className="truncate">{user.email || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-300">
              <MdOutlinePhone className="text-gray-600 shrink-0" size={16} />
              <span>{user.phone || "Not provided"}</span>
            </div>
            <div className="flex items-start gap-2.5 text-sm text-gray-300">
              <MdOutlineLocationOn
                className="text-gray-600 shrink-0 mt-0.5"
                size={16}
              />
              <span>{user.address || "Not provided"}</span>
            </div>
          </div>

          <div className="bg-[#171a21] border border-white/5 rounded-xl p-5 flex flex-col justify-between gap-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-xl font-bold">{orders.length}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Orders</p>
              </div>
              <div>
                <p className="text-xl font-bold">
                  ₹
                  {totalSpent >= 1000
                    ? `${(totalSpent / 1000).toFixed(1)}k`
                    : totalSpent}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Lifetime spend
                </p>
              </div>
              <div>
                <p className="text-xl font-bold">
                  ₹
                  {avgOrderValue >= 1000
                    ? `${(avgOrderValue / 1000).toFixed(1)}k`
                    : avgOrderValue}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">Avg. order</p>
              </div>
            </div>

            {/* Activity signature strip */}
            <div>
              <p className="text-[11px] text-gray-600 mb-1.5">
                Order activity — last 6 months
              </p>
              <div className="flex items-end gap-1 h-6">
                {activity.map((m) => (
                  <div
                    key={m.key}
                    title={`${m.label} — ${m.count} order${m.count !== 1 ? "s" : ""}`}
                    className={`flex-1 rounded-sm transition-all ${
                      m.count > 0 ? "bg-violet-500/60" : "bg-white/5"
                    }`}
                    style={{
                      height:
                        m.count > 0
                          ? `${(m.count / maxActivity) * 100}%`
                          : "15%",
                    }}
                  />
                ))}
              </div>
              <div className="flex gap-1 mt-1">
                {activity.map((m) => (
                  <span
                    key={m.key}
                    className="flex-1 text-center text-[9px] text-gray-600"
                  >
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order history */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-300">
              Order history
            </h2>
            {orders.length > 0 && (
              <span className="text-xs text-gray-600">
                {orders.length} order{orders.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="bg-[#171a21] border border-white/5 rounded-xl py-14 flex flex-col items-center gap-2 text-gray-600">
              <MdOutlineReceiptLong className="text-3xl" />
              <p className="text-sm text-gray-500">No orders placed yet</p>
            </div>
          ) : (
            <div className="bg-[#171a21] border border-white/5 rounded-xl divide-y divide-white/5">
              {sortedOrders.map((o) => {
                const pid = Array.isArray(o.productId)
                  ? o.productId[0]
                  : o.productId;
                const key = pid?._id || pid;
                const product = productMap[key];
                const dotColor =
                  STATUS_DOT[o.status?.toLowerCase()] || STATUS_DOT.processing;

                return (
                  <div key={o._id} className="flex items-center gap-4 p-4">
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-white/5 shrink-0">
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

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {product?.title || "Product"}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 mt-0.5 text-xs text-gray-500">
                        <span>Qty {o.qty || 1}</span>
                        {o.size && o.size !== "-" && (
                          <>
                            <span className="text-gray-700">·</span>
                            <span>Size {o.size}</span>
                          </>
                        )}
                        {o.createdAt && (
                          <>
                            <span className="text-gray-700">·</span>
                            <span>
                              {new Date(o.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-3">
                      <p className="font-semibold text-sm">
                        ₹
                        {((o.price || 0) * (o.qty || 1)).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5 ${statusStyle(o.status)}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${dotColor}`}
                        />
                        {o.status || "Processing"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
