import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../../Context/Wishlist";
import { CartContext } from "../../Context/Cart";
import { MdKeyboardArrowRight, MdClose } from "react-icons/md";
import { FiHeart, FiTrash2, FiShoppingCart } from "react-icons/fi";
import API_URL from "../../Constent";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart, cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [sizeModal, setSizeModal] = useState(null); // selected product for size
  const [selectedSize, setSelectedSize] = useState("");

  const openSizeModal = (product) => {
    const sizes = Array.isArray(product.size)
      ? product.size
      : product.size
        ? [product.size]
        : [];
    if (sizes.length <= 1) {
      // sirf ek ya koi size nahi — direct add
      handleAddToCart(product, sizes[0] || "");
    } else {
      setSelectedSize("");
      setSizeModal(product);
    }
  };

  const handleAddToCart = (product, size) => {
    const alreadyInCart = cart.some(
      (item) => (item.product || item)._id === product._id,
    );
    if (!alreadyInCart) {
      addToCart({ ...product, selectedSize: size });
    }
    setSizeModal(null);
    navigate("/addtocart");
  };

  return (
    <div className="w-full min-h-screen bg-[#e8e8e8] px-6 md:px-10 pt-20 pb-10">
      <div className="flex items-center gap-3 mb-6">
        <FiHeart className="text-2xl text-red-500" />
        <h2 className="text-2xl sm:text-3xl font-bold text-black">
          My Wishlist
        </h2>
        {wishlist.length > 0 && (
          <span className="bg-black text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {wishlist.length}
          </span>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <FiHeart className="text-6xl text-gray-300 mb-4" />
          <p className="text-xl font-bold text-gray-600">
            Your wishlist is empty
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Save items you love to your wishlist
          </p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-black text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="absolute top-3 left-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition"
              >
                <FiTrash2 className="text-sm" />
              </button>
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {item.brand?.title}
                </span>
              </div>
              <div
                className="h-[48vh] overflow-hidden cursor-pointer"
                onClick={() => navigate(`/singleproduct/${item._id}`)}
              >
                <img
                  src={`${API_URL}/product/${item.image?.[0]}`}
                  alt={item.title}
                  className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x500?text=No+Image";
                  }}
                />
              </div>
              <div className="p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 text-[15px] truncate">
                      {item.title}
                    </p>
                    <p className="text-gray-500 text-sm mt-0.5">
                      ₹ {item.price}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/singleproduct/${item._id}`)}
                    className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-full text-xl hover:bg-black hover:text-white transition duration-300 flex-shrink-0"
                  >
                    <MdKeyboardArrowRight />
                  </button>
                </div>
                <button
                  onClick={() => openSizeModal(item)}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
                >
                  <FiShoppingCart className="text-base" /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 Size Select Modal */}
      {sizeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Select Size</h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  {sizeModal.title}
                </p>
              </div>
              <button
                onClick={() => setSizeModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                <MdClose />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {(Array.isArray(sizeModal.size)
                ? sizeModal.size
                : [sizeModal.size]
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition ${
                    selectedSize === s
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                if (selectedSize) handleAddToCart(sizeModal, selectedSize);
              }}
              disabled={!selectedSize}
              className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition disabled:opacity-40"
            >
              {selectedSize
                ? `Add Size ${selectedSize} to Cart`
                : "Select a size first"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
