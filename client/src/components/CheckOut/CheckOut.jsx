import React, { useContext, useState } from "react";
import { CartContext } from "../../Context/Cart";

const Checkout = () => {
  const { cart } = useContext(CartContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // 🔥 handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    // 🔥 pincode detect
    if (name === "pincode") {
      fetchPincodeData(value);
    }
  };

  // 🔥 PINCODE API
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
        alert("Invalid Pincode");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const shipping = 50;

  const subtotal = cart.reduce((total, item) => {
    const product = item.product || item;
    return total + (product.price || 0) * (item.qty || 1);
  }, 0);

  const totalPrice = subtotal + shipping;

  // 🔥 Razorpay loader
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 🔥 Payment
  const handlePayment = async () => {
    if (!form.name || !form.phone || !form.address || !form.pincode) {
      alert("Please fill all required fields");
      return;
    }

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js",
    );

    if (!res) {
      alert("Razorpay SDK failed");
      return;
    }

    try {
      const result = await fetch("http://localhost:5000/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

        handler: function (response) {
          console.log("Payment Success:", response);
          alert("Payment Successful 🎉");
        },

        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },

        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-24 px-6">
      <h2 className="text-3xl font-bold mb-8">Checkout</h2>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* LEFT - FORM */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Shipping Details</h3>

          <div className="grid gap-4">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="p-3 border rounded"
            />
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="p-3 border rounded"
            />
            <input
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              className="p-3 border rounded"
            />
            <input
              name="address"
              placeholder="Address"
              onChange={handleChange}
              className="p-3 border rounded"
            />

            {/* 🔥 CITY AUTO */}
            <input
              name="city"
              value={form.city}
              placeholder="City"
              readOnly
              className="p-3 border rounded bg-gray-100"
            />

            {/* 🔥 STATE AUTO */}
            <input
              name="state"
              value={form.state}
              placeholder="State"
              readOnly
              className="p-3 border rounded bg-gray-100"
            />

            {/* 🔥 PINCODE */}
            <input
              name="pincode"
              placeholder="Pincode"
              onChange={handleChange}
              className="p-3 border rounded"
            />
          </div>
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="w-full lg:w-[350px] bg-gray-100 p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

          {cart.map((item, i) => {
            const product = item.product || item;

            return (
              <div key={i} className="flex justify-between mb-3">
                <span>
                  {product.title} × {item.qty}
                </span>
                <span>₹ {product.price * item.qty}</span>
              </div>
            );
          })}

          <hr className="my-3" />

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹ {subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹ {shipping}</span>
          </div>

          <div className="flex justify-between font-bold text-lg mt-3">
            <span>Total</span>
            <span>₹ {totalPrice}</span>
          </div>

          <button
            onClick={handlePayment}
            className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
