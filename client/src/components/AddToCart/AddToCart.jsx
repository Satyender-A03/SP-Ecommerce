import React, { useContext, useEffect } from "react";
import { CartContext } from "../../Context/Cart";
import { Link } from "react-router-dom";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import API_URL from "../../Constent";

const AddtoCart = () => {
  const { cart, incQty, decQty, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    console.log(cart);
  }, []);

  const subtotal = cart.reduce((total, item) => {
    const product = item.product || item;
    const price = product?.price || 0;
    const qty = item.qty || 1;

    return total + price * qty;
  }, 0);

  const itemCount = cart.reduce((n, item) => n + (item.qty || 1), 0);

  return (
    <div className="max-w-6xl mx-auto pt-24 px-6 pb-16">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FiShoppingBag className="text-6xl text-gray-300 mb-4" />
          <p className="text-lg font-semibold text-gray-600">
            Your cart is empty
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Add something you like and it'll show up here
          </p>
          <Link
            to="/products"
            className="mt-6 bg-black text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* ITEMS */}
          <div className="flex flex-col gap-4">
            {cart.map((item) => {
              const product = item.product || item;

              if (!product?._id) return null;

              const currentQty = item.qty || 1;
              const stock = product.qty || 0;

              return (
                <div
                  key={product._id + product.selectedSize}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* LEFT */}
                  <Link
                    to={`/singleproduct/${product._id}`}
                    state={{ selectedSize: product.selectedSize }}
                    className="flex gap-4 items-center min-w-0 group"
                  >
                    <img
                      src={`${API_URL}/product/${product.image?.[0]}`}
                      className="w-20 h-20 object-cover rounded-xl shrink-0 bg-gray-100"
                      alt={product.title}
                    />

                    <div className="min-w-0">
                      <h3 className="font-semibold text-base text-gray-900 truncate group-hover:text-black">
                        {product.title}
                      </h3>
                      <p className="text-sm font-bold text-gray-800 mt-0.5">
                        ₹{product.price}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        {product.selectedSize && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            Size: {product.selectedSize}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {stock > 0 ? `${stock} in stock` : "Out of stock"}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* RIGHT */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() =>
                          decQty(product._id, product.selectedSize)
                        }
                        className="w-9 h-9 flex items-center justify-center text-lg font-medium hover:bg-gray-50 transition"
                      >
                        −
                      </button>
                      <span className="w-9 text-center font-semibold text-sm">
                        {currentQty}
                      </span>
                      <button
                        onClick={() =>
                          incQty(product._id, product.selectedSize, stock)
                        }
                        disabled={currentQty >= stock}
                        className="w-9 h-9 flex items-center justify-center text-lg font-medium hover:bg-gray-50 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(product._id, product.selectedSize)
                      }
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                      title="Remove"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SUMMARY */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              Order Summary
            </h3>

            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Items ({itemCount})</span>
              <span>₹{subtotal}</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Shipping calculated at checkout
            </p>

            <hr className="border-gray-100 mb-4" />

            <div className="flex justify-between items-baseline mb-6">
              <span className="font-semibold text-gray-900">Subtotal</span>
              <span className="font-bold text-xl text-gray-900">
                ₹{subtotal}
              </span>
            </div>

            <Link to="/checkout">
              <button className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition">
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
