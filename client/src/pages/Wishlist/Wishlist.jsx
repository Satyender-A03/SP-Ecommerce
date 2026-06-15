import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../../Context/Wishlist";
import { CartContext } from "../../Context/Cart";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FiHeart, FiTrash2, FiShoppingCart } from "react-icons/fi";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart, cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    const alreadyInCart = cart.some((item) => {
      const p = item.product || item;
      return p._id === product._id;
    });
    if (!alreadyInCart) {
      addToCart({
        ...product,
        selectedSize: product.size?.[0] || product.size,
      });
    }
    navigate("/addtocart");
  };

  return (
    <div className="w-full min-h-screen bg-[#e8e8e8] px-6 md:px-10 pt-20 pb-10">
      {/* HEADING */}
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

      {/* EMPTY STATE */}
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
              {/* Remove button */}
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="absolute top-3 left-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition"
              >
                <FiTrash2 className="text-sm" />
              </button>

              {/* Brand badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {item.brand?.title}
                </span>
              </div>

              {/* Image */}
              <div
                className="h-[48vh] overflow-hidden cursor-pointer"
                onClick={() => navigate(`/singleproduct/${item._id}`)}
              >
                <img
                  src={`http://localhost:5000/product/${item.image?.[0]}`}
                  alt={item.title}
                  className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
                />
              </div>

              {/* Bottom info */}
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

                {/* Add to Cart */}
                <button
                  onClick={() => handleAddToCart(item)}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
                >
                  <FiShoppingCart className="text-base" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
