import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../../Context/Cart";
import { Auth } from "../../Context/Auth";
import { useNavigate } from "react-router-dom";
import { MdCheckCircle, MdError, MdInfo } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import API_URL from "../../Constent";

const Toast = ({ message, type }) => {
  if (!message) return null;
  const styles = {
    success: "bg-green-50 border-green-400 text-green-800",
    error: "bg-red-50 border-red-400 text-red-800",
    info: "bg-blue-50 border-blue-400 text-blue-800",
  };
  const icons = {
    success: <MdCheckCircle className="text-green-500 text-xl shrink-0" />,
    error: <MdError className="text-red-500 text-xl shrink-0" />,
    info: <MdInfo className="text-blue-500 text-xl shrink-0" />,
  };
  return (
    <div
      className={`flex items-center gap-3 border rounded-xl px-4 py-3 mb-6 ${styles[type]}`}
    >
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

const Checkout = () => {
  const { cart, clearCart, removeFromCart } = useContext(CartContext);
  const { user } = useContext(Auth);
  const navigate = useNavigate();

  const savedForm = JSON.parse(localStorage.getItem("shippingInfo") || "{}");

  const [form, setForm] = useState({
    name:
      savedForm.name ||
      user?.name ||
      `${user?.fName || ""} ${user?.lName || ""}`.trim() ||
      "",
    email: savedForm.email || user?.email || "",
    phone: savedForm.phone || user?.phone || "",
    address: savedForm.address || user?.address || "",
    city: savedForm.city || "",
    state: savedForm.state || "",
    pincode: savedForm.pincode || "",
  });

  const [toast, setToast] = useState({ message: "", type: "info" });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "info" }), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    localStorage.setItem("shippingInfo", JSON.stringify(updated));
    if (name === "pincode") fetchPincodeData(value);
  };

  const fetchPincodeData = async (pincode) => {
    if (pincode.length !== 6) return;
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await res.json();
      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        const updated = {
          ...form,
          pincode,
          city: postOffice.District,
          state: postOffice.State,
        };
        setForm(updated);
        localStorage.setItem("shippingInfo", JSON.stringify(updated));
      } else {
        showToast("Invalid Pincode. Please check and try again.", "error");
      }
    } catch {
      showToast(
        "Could not fetch pincode data. Check your connection.",
        "error",
      );
    }
  };

  const [shipping, setShipping] = useState(50); // fallback until store info loads

  const subtotal = cart.reduce((total, item) => {
    const product = item.product || item;
    return total + (product.price || 0) * (item.qty || 1);
  }, 0);
  const totalPrice = subtotal + shipping;

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/store-info`);
        const data = await res.json();
        if (res.ok && data.shippingCharge !== undefined) {
          setShipping(data.shippingCharge);
        }
      } catch (err) {
        console.log("Could not fetch store info, using default shipping:", err);
      }
    };
    fetchStoreInfo();
  }, []);

  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const saveOrderToDB = async (paymentId) => {
    const subtotal = cart.reduce(
      (t, item) => t + (item.product || item).price * (item.qty || 1),
      0,
    );
    const allItems = cart.map((item) => {
      const product = item.product || item;
      return {
        title: product.title,
        productId: product._id,
        price: product.price,
        qty: item.qty || 1,
      };
    });

    // 🔥 Pehli item me shippingInfo aur allItems bhejo — Shiprocket ke liye
    await Promise.all(
      cart.map((item, index) => {
        const product = item.product || item;
        // 🔥 selectedSize product ke andar store hota hai (addToCart spread ki wajah se),
        // isliye item.selectedSize hamesha undefined hota tha — ab product se + fallback se le rahe hain
        const size = product.selectedSize || item.selectedSize || "-";
        return fetch(`${API_URL}/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?._id || "guest",
            productId: product._id,
            price: product.price,
            qty: item.qty || 1,
            color: product.color || "-",
            size,
            paymentId,
            // 🔥 Shiprocket ke liye — sirf pehli item me
            ...(index === 0 && {
              shippingInfo: form,
              allItems,
              subtotal,
            }),
          }),
        });
      }),
    );
  };

  const handlePayment = async () => {
    if (!form.name || !form.phone || !form.address || !form.pincode) {
      showToast("Please fill all required fields marked with *", "error");
      return;
    }
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js",
    );
    if (!res) {
      showToast("Payment gateway failed to load. Please try again.", "error");
      return;
    }
    try {
      const result = await fetch(`${API_URL}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalPrice }),
      });
      const data = await result.json();
      const options = {
        key: "rzp_test_3WbPzeexWFf3Wx",
        amount: data.amount,
        currency: data.currency,
        name: "ShopEase",
        description: "Order Payment",
        order_id: data.id,
        handler: async function (response) {
          const paymentId = response.razorpay_payment_id;
          showToast("Payment successful! Saving your order...", "success");
          await saveOrderToDB(paymentId);
          localStorage.setItem(
            "customerInfo",
            JSON.stringify({
              ...form,
              paymentId,
              date: new Date().toISOString(),
            }),
          );
          clearCart();
          navigate("/order");
        },
        modal: {
          ondismiss: () =>
            showToast(
              "Payment was cancelled. You can try again anytime.",
              "info",
            ),
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#000000" },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", (response) =>
        showToast(`Payment failed: ${response.error.description}`, "error"),
      );
      paymentObject.open();
    } catch (err) {
      console.log(err);
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  const isAutoFilled = !!(user?.phone || user?.address || savedForm.name);

  return (
    <div className="max-w-7xl mx-auto pt-24 px-6 pb-16">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>
      <Toast message={toast.message} type={toast.type} />

      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT - FORM */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Shipping Details</h3>
            {isAutoFilled && (
              <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full border border-green-200">
                ✓ Auto-filled from profile
              </span>
            )}
          </div>
          <div className="grid gap-4">
            <input
              name="name"
              value={form.name}
              placeholder="Full Name *"
              onChange={handleChange}
              className="p-3 border rounded focus:outline-none focus:border-black"
            />
            <input
              name="email"
              value={form.email}
              placeholder="Email"
              onChange={handleChange}
              className="p-3 border rounded focus:outline-none focus:border-black"
            />
            <input
              name="phone"
              value={form.phone}
              placeholder="Phone *"
              onChange={handleChange}
              className="p-3 border rounded focus:outline-none focus:border-black"
            />
            <input
              name="address"
              value={form.address}
              placeholder="Address *"
              onChange={handleChange}
              className="p-3 border rounded focus:outline-none focus:border-black"
            />
            <input
              name="pincode"
              value={form.pincode}
              placeholder="Pincode *"
              onChange={handleChange}
              maxLength={6}
              className="p-3 border rounded focus:outline-none focus:border-black"
            />
            <input
              name="city"
              value={form.city}
              placeholder="City (auto)"
              readOnly
              className="p-3 border rounded bg-gray-100 text-gray-500"
            />
            <input
              name="state"
              value={form.state}
              placeholder="State (auto)"
              readOnly
              className="p-3 border rounded bg-gray-100 text-gray-500"
            />
          </div>
        </div>

        {/* RIGHT - ORDER SUMMARY */}
        <div className="w-full lg:w-[420px] flex flex-col gap-4">
          {/* 🔥 Product Cards */}
          <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
            <h3 className="text-base font-bold text-gray-800 mb-1">
              Items ({cart.length})
            </h3>
            {cart.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No items in cart
              </p>
            ) : (
              cart.map((item, i) => {
                const product = item.product || item;
                const displaySize = product.selectedSize || item.selectedSize;
                return (
                  <div
                    key={i}
                    className="flex gap-3 items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                  >
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                      {product.image?.[0] ? (
                        <img
                          src={`${API_URL}/product/${product.image[0]}`}
                          alt={product.title}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.target.src =
                              "https://placehold.co/100x100?text=?";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                          No img
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">
                        {product.title}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {displaySize && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            Size: {displaySize}
                          </span>
                        )}
                        {product.color && product.color !== "-" && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                            Color:{" "}
                            <span
                              className="w-3 h-3 rounded-full inline-block border"
                              style={{ background: product.color }}
                            />
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          Qty: {item.qty || 1}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-800 mt-1">
                        ₹ {product.price * (item.qty || 1)}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart?.(product._id)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition shrink-0 mt-0.5"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Price Summary */}
          <div className="bg-gray-100 rounded-xl shadow p-5">
            <h3 className="text-base font-bold mb-3">Price Summary</h3>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Shipping</span>
              <span>₹ {shipping}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹ {totalPrice}</span>
            </div>
            <button
              onClick={handlePayment}
              disabled={cart.length === 0}
              className="mt-4 w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-40"
            >
              Pay Now ₹ {totalPrice}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
