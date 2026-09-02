import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../../Context/Auth";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdKeyboardArrowRight } from "react-icons/md";
import API_URL from "../../Constent";

const OrderPage = () => {
  const { user } = useContext(Auth);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState(null);

  useEffect(() => {
    const info = localStorage.getItem("customerInfo");
    if (info) setCustomerInfo(JSON.parse(info));
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/order`);
      const data = await res.json();
      const userId = user?._id || "guest";
      const myOrders = Array.isArray(data)
        ? data.filter((o) => o.userId === userId)
        : [];
      setOrders(myOrders);

      const productMap = {};
      await Promise.all(
        myOrders.map(async (order) => {
          if (!productMap[order.productId]) {
            try {
              const pRes = await fetch(
                `${API_URL}/products/${order.productId}`,
              );
              const pData = await pRes.json();
              productMap[order.productId] = pData;
            } catch {
              productMap[order.productId] = null;
            }
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

  const statusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const goToProduct = (product, order) => {
    if (!product) return;
    navigate(`/singleproduct/${product._id}`, {
      state: { selectedSize: order.size },
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#e8e8e8] px-6 md:px-10 pt-20 pb-10">
      <div className="flex items-center gap-3 mb-6">
        <FiPackage className="text-2xl text-gray-700" />
        <h2 className="text-2xl sm:text-3xl font-bold text-black">My Orders</h2>
        {!loading && orders.length > 0 && (
          <span className="bg-black text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {orders.length}
          </span>
        )}
      </div>

      {/* Customer Info */}
      {customerInfo && (
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm flex flex-wrap gap-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
              Delivered To
            </p>
            <p className="font-bold text-gray-900">{customerInfo.name}</p>
            <p className="text-sm text-gray-500">{customerInfo.phone}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
              Address
            </p>
            <p className="text-sm text-gray-700">{customerInfo.address}</p>
            <p className="text-sm text-gray-500">
              {customerInfo.city}, {customerInfo.state} — {customerInfo.pincode}
            </p>
          </div>
          {customerInfo.paymentId && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                Payment ID
              </p>
              <p className="text-sm font-mono text-gray-700">
                {customerInfo.paymentId}
              </p>
            </div>
          )}
          {customerInfo.date && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                Order Date
              </p>
              <p className="text-sm text-gray-700">
                {new Date(customerInfo.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Orders */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 animate-pulse flex gap-4"
            >
              <div className="w-20 h-20 bg-gray-200 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <FiShoppingBag className="text-6xl text-gray-300 mb-4" />
          <p className="text-xl font-bold text-gray-600">No orders yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Start shopping to see your orders here
          </p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-black text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order, i) => {
            const pid = Array.isArray(order.productId)
              ? order.productId[0]
              : order.productId;
            const product = products[pid];
            return (
              <div
                key={order._id || i}
                className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 items-start hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div
                  className="w-24 h-24 rounded-xl overflow-hidden shrink-0 cursor-pointer bg-gray-100"
                  onClick={() => goToProduct(product, order)}
                >
                  {product?.image?.[0] ? (
                    <img
                      src={`${API_URL}/product/${product.image[0]}`}
                      alt={product?.title}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiPackage className="text-gray-400 text-2xl" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-base truncate">
                    {product?.title || "Product"}
                  </p>

                  {/* Description */}
                  {product?.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="text-sm font-semibold text-gray-800">
                      ₹ {order.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      Qty: {order.qty}
                    </span>
                    {order.size && order.size !== "-" && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        Size: {order.size}
                      </span>
                    )}
                    {order.color && order.color !== "-" && (
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        Color:
                        <span
                          className="inline-block w-4 h-4 rounded-full border border-gray-300"
                          style={{ background: order.color }}
                        />
                      </span>
                    )}
                    {product?.category && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                    )}
                  </div>

                  {/* Payment ID */}
                  <p className="text-xs text-gray-300 font-mono mt-1.5 truncate">
                    #{order.paymentId}
                  </p>
                </div>

                {/* Status + Arrow */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyle(order.status)}`}
                  >
                    {order.status || "Processing"}
                  </span>
                  {order.awbCode && (
                    <a
                      href={`https://shiprocket.co/tracking/${order.awbCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-purple-600 font-semibold bg-purple-50 px-3 py-1 rounded-full border border-purple-200 hover:bg-purple-100 transition"
                    >
                      🚚 Track
                    </a>
                  )}
                  {product && (
                    <button
                      onClick={() => goToProduct(product, order)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-black hover:text-white transition"
                    >
                      <MdKeyboardArrowRight />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
