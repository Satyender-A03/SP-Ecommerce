import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/Cart";
import { WishlistContext } from "../../Context/Wishlist";
import { Auth } from "../../Context/Auth";
import {
  FiHeart,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiShare2,
  FiImage,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cart, addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);
  const { isLoggedIn, user } = useContext(Auth);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  // ── Review states ──
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [toast, setToast] = useState("");
  const fileRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const getProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/products/${id}`);
      const data = await res.json();
      setProduct(data);
      if (data.image?.length > 0) setSelectedImage(data.image[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:5000/review/product/${id}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProduct();
    fetchReviews();
  }, [id]);

  if (!product) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sizes = Array.isArray(product.size)
    ? product.size
    : product.size?.split(",") || [];

  const isInCart = cart.some((item) => {
    const p = item.product || item;
    return p._id === product._id && p.selectedSize === selectedSize;
  });

  const stock = product.qty || 0;
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 10;

  const handleWishlist = () => {
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }
    isInWishlist(product._id)
      ? removeFromWishlist(product._id)
      : addToWishlist(product);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    setError("");
    if (isInCart) {
      navigate("/addtocart");
      return;
    }
    addToCart({ ...product, selectedSize }, qty);
    try {
      await fetch(`http://localhost:5000/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty: stock - qty }),
      });
      setProduct((prev) => ({ ...prev, qty: prev.qty - qty }));
    } catch (err) {
      console.log("Stock update failed:", err);
    }
    navigate("/addtocart");
  };

  // ── Review handlers ──
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 3) {
      showToast("Maximum 3 photos allowed");
      return;
    }
    setPhotos((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReviewSubmit = async () => {
    if (!isLoggedIn) {
      showToast("Please login to add a review");
      return;
    }
    if (!rating) {
      showToast("Please select a rating");
      return;
    }
    if (!reviewText.trim()) {
      showToast("Please write a review");
      return;
    }

    setReviewLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("productId", id);
      formData.append("rating", rating);
      formData.append("reviews", reviewText);
      photos.forEach((photo) => formData.append("photos", photo));

      const res = await fetch("http://localhost:5000/review", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Review added successfully!");
        setRating(0);
        setReviewText("");
        setPhotos([]);
        setPreviews([]);
        fetchReviews();
      } else {
        showToast(data.message || "Something went wrong");
      }
    } catch (err) {
      showToast("Error submitting review");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await fetch(`http://localhost:5000/review/${reviewId}`, {
        method: "DELETE",
      });
      fetchReviews();
    } catch (err) {
      console.log(err);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : 0;

  const StarRow = ({ value, interactive = false }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && setRating(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          {star <= (interactive ? hoverRating || rating : value) ? (
            <FaStar className="text-yellow-400 text-lg" />
          ) : (
            <FaRegStar className="text-gray-300 text-lg" />
          )}
        </button>
      ))}
    </div>
  );

  return (
    <section className="w-full pt-20 bg-[#e8e8e8] min-h-screen">
      {/* ── PRODUCT DETAILS ── */}
      <div className="max-w-7xl mx-auto flex gap-16 py-5 justify-between px-3">
        {/* LEFT THUMBNAILS */}
        <div className="w-[10%]">
          <div className="flex flex-col gap-3">
            {product.image?.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:5000/product/${img}`}
                onClick={() => setSelectedImage(img)}
                className={`cursor-pointer border-2 rounded-lg h-40 object-cover ${
                  selectedImage === img
                    ? "border-black p-1 transition-all duration-300"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* MAIN IMAGE */}
        <div className="w-[40%] flex justify-center">
          <img
            src={`http://localhost:5000/product/${selectedImage}`}
            alt={product.title}
            className="w-[600px] object-cover shadow rounded-xl"
          />
        </div>

        {/* RIGHT DETAILS */}
        <div className="w-[40%] flex flex-col gap-4 relative">
          {/* Wishlist + Share */}
          <div className="absolute top-0 right-0 flex flex-col gap-2">
            <button
              onClick={handleWishlist}
              className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-red-400 transition"
              title="Wishlist"
            >
              <FiHeart
                className={`text-lg ${isInWishlist(product._id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
              />
            </button>
            <button
              onClick={() =>
                navigator.share?.({
                  title: product.title,
                  url: window.location.href,
                })
              }
              className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-black transition"
              title="Share"
            >
              <FiShare2 className="text-lg text-gray-400 hover:text-black" />
            </button>
          </div>

          <p className="text-gray-500 text-sm uppercase tracking-wide">
            Brand: {product.brand?.title}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 pr-14">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400 text-sm">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalfAlt />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              ({avgRating > 0 ? avgRating : "4.5"})
            </span>
            <span className="text-sm text-gray-400">
              {reviews.length} Reviews
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            {product.originalPrice && (
              <p className="text-gray-400 line-through text-lg">
                ₹{product.originalPrice}
              </p>
            )}
            <p className="text-2xl font-bold text-gray-900">
              ₹ {product.price}
            </p>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed">
            {product.desc}
          </p>

          {/* Stock */}
          {isOutOfStock ? (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2 w-fit">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-semibold text-red-600">
                Out of Stock
              </span>
            </div>
          ) : isLowStock ? (
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 w-fit">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-sm font-semibold text-orange-600">
                Only {stock} items available
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2 w-fit">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-green-600">
                In Stock
              </span>
            </div>
          )}

          <div className="flex gap-6">
            <p className="text-sm">
              <span className="font-semibold">Color:</span> {product.color}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Category:</span>{" "}
              {product.category}
            </p>
          </div>

          {/* Size */}
          <div>
            <p className="font-semibold text-sm mb-2 text-gray-700">
              Select Size:
            </p>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedSize(s.trim());
                    setError("");
                  }}
                  className={`w-12 h-10 border-2 rounded-xl text-sm font-bold transition ${
                    selectedSize === s.trim()
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-700 hover:border-black"
                  }`}
                >
                  {s.trim()}
                </button>
              ))}
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>

          {/* Qty + Add to Cart */}
          <div className="flex gap-3 items-center">
            <div className="flex items-center border-2 border-gray-400 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-10 flex items-center justify-center text-lg font-bold hover:bg-gray-100 transition"
              >
                −
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(stock, q + 1))}
                disabled={isOutOfStock}
                className="w-9 h-10 flex items-center justify-center text-lg font-bold hover:bg-gray-100 transition disabled:opacity-40"
              >
                +
              </button>
            </div>
            <button
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : isInCart
                    ? "bg-gray-700 hover:bg-gray-800 text-white"
                    : "bg-black hover:bg-gray-800 text-white"
              }`}
            >
              {isOutOfStock
                ? "Out of Stock"
                : isInCart
                  ? "GO TO CART"
                  : "ADD TO CART"}
            </button>
          </div>

          {/* Buy Now */}
          <button
            disabled={isOutOfStock}
            onClick={() => {
              if (!selectedSize) {
                setError("Please select a size");
                return;
              }
              if (!isInCart) addToCart({ ...product, selectedSize }, qty);
              navigate("/checkout");
            }}
            className="w-full py-3 rounded-xl font-bold text-sm border-2 border-black text-black hover:bg-black hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            BUY NOW
          </button>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mt-1">
            {[
              { icon: <FiTruck className="text-xl" />, label: "Fast Delivery" },
              {
                icon: <FiRefreshCw className="text-xl" />,
                label: "Easy Returns",
              },
              {
                icon: <FiShield className="text-xl" />,
                label: "Secure Payments",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="border border-gray-500 rounded-xl p-3 flex flex-col items-center gap-2 text-gray-600"
              >
                {f.icon}
                <span className="text-xs font-semibold text-center">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── REVIEW SECTION ── */}
      <div className="bg-[#e8e8e8] mt-10 rounded-t-3xl px-6 md:px-3 pt-2 pb-16 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-gray-900">
            Reviews {reviews.length > 0 && `(${reviews.length})`}
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400 text-xl" />
              <span className="text-xl font-black text-gray-900">
                {avgRating}
              </span>
              <span className="text-sm text-gray-400">out of 5</span>
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div className="bg-black text-white text-sm px-4 py-3 rounded-xl mb-4 w-fit">
            {toast}
          </div>
        )}

        {/* Write Review box */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>

          {/* Stars */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Your Rating</p>
            <StarRow value={rating} interactive={true} />
          </div>

          {/* Text */}
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={
              isLoggedIn
                ? "Share your experience..."
                : "Please login to write a review"
            }
            disabled={!isLoggedIn}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-black transition disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          {/* 🔥 Photo upload */}
          <div className="mt-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
            />

            {/* Previews */}
            {previews.length > 0 && (
              <div className="flex gap-3 mb-3 flex-wrap">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center"
                    >
                      <FiX className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add photo button */}
            {photos.length < 3 && (
              <button
                onClick={() => fileRef.current.click()}
                disabled={!isLoggedIn}
                className="flex items-center gap-2 text-sm text-gray-500 border border-dashed border-gray-300 px-4 py-2 rounded-xl hover:border-black hover:text-black transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiImage />
                Add Photos ({photos.length}/3)
              </button>
            )}
          </div>

          <button
            onClick={handleReviewSubmit}
            disabled={reviewLoading || !isLoggedIn}
            className="mt-4 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {reviewLoading && (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {reviewLoading ? "Submitting..." : "Submit Review"}
          </button>
        </div>

        {/* Reviews list */}
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-lg font-semibold">No reviews yet</p>
            <p className="text-sm mt-1">Be the first to review this product</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {r.userId?.fName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        {r.userId?.fName} {r.userId?.lName}
                      </p>
                      <p className="text-xs text-gray-400">
                        @{r.userId?.uName}
                      </p>
                    </div>
                  </div>
                  {user?._id === r.userId?._id && (
                    <button
                      onClick={() => handleDeleteReview(r._id)}
                      className="text-red-400 hover:text-red-600 transition"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  )}
                </div>

                <div className="mt-3">
                  <StarRow value={r.rating} />
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {r.reviews}
                  </p>

                  {/* Review photos */}
                  {r.photos?.length > 0 && (
                    <div className="flex gap-3 mt-3 flex-wrap">
                      {r.photos.map((photo, i) => (
                        <img
                          key={i}
                          src={`http://localhost:5000/review/${photo}`}
                          alt=""
                          className="w-24 h-24 object-cover rounded-xl border border-gray-200 cursor-pointer hover:opacity-90 transition"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SingleProduct;
