import React, { useContext, useState } from "react";
import { CartContext } from "../../Context/Cart";
import { Auth } from "../../Context/Auth";
import { useNavigate } from "react-router-dom";
import { MdCheckCircle, MdError, MdInfo } from "react-icons/md";

// 🔥 Toast component
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
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(Auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // 🔥 Toast state
  const [toast, setToast] = useState({ message: "", type: "info" });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    // 4 sec baad auto hide
    setTimeout(() => setToast({ message: "", type: "info" }), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
        setForm((prev) => ({
          ...prev,
          city: postOffice.District,
          state: postOffice.State,
        }));
      } else {
        showToast("Invalid Pincode. Please check and try again.", "error");
      }
    } catch (err) {
      showToast(
        "Could not fetch pincode data. Check your connection.",
        "error",
      );
    }
  };

  const shipping = 50;

  const subtotal = cart.reduce((total, item) => {
    const product = item.product || item;
    return total + (product.price || 0) * (item.qty || 1);
  }, 0);

  const totalPrice = subtotal + shipping;

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const saveOrderToDB = async (paymentId) => {
    const orderPromises = cart.map((item) => {
      const product = item.product || item;
      return fetch("http://localhost:5000/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?._id || "guest",
          productId: product._id,
          price: product.price,
          qty: item.qty || 1,
          color: product.color || "-",
          paymentId,
        }),
      });
    });
    await Promise.all(orderPromises);
  };

  const handlePayment = async () => {
    // 🔥 Validation — fields check
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
      const result = await fetch("http://localhost:5000/payment", {
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

        // 🔥 Payment success
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

          localStorage.setItem("paymentDone", "true"); // 🔥
          navigate("/order");
        },

        // 🔥 Payment cancel / modal close
        modal: {
          ondismiss: function () {
            showToast(
              "Payment was cancelled. You can try again anytime.",
              "info",
            );
          },
        },

        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },

        theme: { color: "#000000" },
      };

      const paymentObject = new window.Razorpay(options);

      // 🔥 Payment failed
      paymentObject.on("payment.failed", function (response) {
        showToast(`Payment failed: ${response.error.description}`, "error");
      });

      paymentObject.open();
    } catch (err) {
      console.log(err);
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-24 px-6 pb-16">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      {/* 🔥 Toast message */}
      <Toast message={toast.message} type={toast.type} />

      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT - FORM */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Shipping Details</h3>

          <div className="grid gap-4">
            <input
              name="name"
              placeholder="Full Name *"
              onChange={handleChange}
              className="p-3 border rounded focus:outline-none focus:border-black"
            />
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="p-3 border rounded focus:outline-none focus:border-black"
            />
            <input
              name="phone"
              placeholder="Phone *"
              onChange={handleChange}
              className="p-3 border rounded focus:outline-none focus:border-black"
            />
            <input
              name="address"
              placeholder="Address *"
              onChange={handleChange}
              className="p-3 border rounded focus:outline-none focus:border-black"
            />
            <input
              name="pincode"
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

        {/* RIGHT - SUMMARY */}
        <div className="w-full lg:w-[350px] bg-gray-100 p-6 rounded-xl shadow h-fit">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

          {cart.map((item, i) => {
            const product = item.product || item;
            return (
              <div key={i} className="flex justify-between mb-3 text-sm">
                <span className="text-gray-700">
                  {product.title} × {item.qty || 1}
                </span>
                <span className="font-medium">
                  ₹ {product.price * (item.qty || 1)}
                </span>
              </div>
            );
          })}

          <hr className="my-3" />

          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal</span>
            <span>₹ {subtotal}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Shipping</span>
            <span>₹ {shipping}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-3">
            <span>Total</span>
            <span>₹ {totalPrice}</span>
          </div>

          <button
            onClick={handlePayment}
            className="mt-6 w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
          >
            Pay Now ₹ {totalPrice}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
