import React, { useContext, useEffect } from "react";
import { CartContext } from "../../Context/Cart";
import { Link } from "react-router-dom";

const AddtoCart = () => {
  const { cart, incQty, decQty, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    console.log(cart);
  }, []);

  const shipping = 50;

  const subtotal = cart.reduce((total, item) => {
    const product = item.product || item;
    const price = product?.price || 0;
    const qty = item.qty || 1;

    return total + price * qty;
  }, 0);

  const totalPrice = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto pt-28 px-6">
      <h2 className="text-4xl font-bold mb-10">Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <div className="space-y-8">
          {cart.map((item, index) => {
            const product = item.product || item;

            if (!product?._id) return null;

            const currentQty = item.qty || 1;
            const stock = product.qty || 0;

            return (
              <div
                key={product._id + product.selectedSize}
                className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-lg"
              >
                {/* LEFT */}
                <div className="flex gap-6 items-center">
                  <img
                    src={`http://localhost:5000/product/${product.image?.[0]}`}
                    className="w-28 h-28 object-cover rounded-xl"
                  />

                  <div>
                    <h3 className="font-bold text-xl">{product.title}</h3>
                    <p className="text-lg text-gray-600">₹ {product.price}</p>

                    <p className="text-sm text-gray-500">
                      Size: {product.selectedSize}
                    </p>

                    {/* 🔥 STOCK SHOW */}
                    <p className="text-xs text-gray-400">Available: {stock}</p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-5">
                  {/* DECREASE */}
                  <button
                    onClick={() => decQty(product._id, product.selectedSize)}
                    className="px-4 py-2 text-lg bg-gray-200 rounded-lg"
                  >
                    -
                  </button>

                  {/* QTY */}
                  <span className="text-lg font-semibold">{currentQty}</span>

                  {/* INCREASE */}
                  <button
                    onClick={() =>
                      incQty(product._id, product.selectedSize, stock)
                    }
                    disabled={currentQty >= stock} // 🔥 limit
                    className={`px-4 py-2 text-lg rounded-lg ${
                      currentQty >= stock
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gray-200"
                    }`}
                  >
                    +
                  </button>

                  {/* REMOVE */}
                  <button
                    onClick={() =>
                      removeFromCart(product._id, product.selectedSize)
                    }
                    className="text-red-500 text-lg font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          {/* SUMMARY */}
          <div className="bg-gray-100 p-8 rounded-2xl shadow-lg">
            <p className="text-lg mb-2">Subtotal: ₹ {subtotal}</p>
            <p className="text-lg mb-2">Shipping: ₹ {shipping}</p>
            <h3 className="font-bold text-2xl">Total: ₹ {totalPrice}</h3>

            <Link to="/checkout">
              <button className="mt-6 w-full bg-gray-800 text-white py-3 rounded hover:bg-gray-900 transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddtoCart;
