import { useContext, useEffect, useState } from "react";
import { Auth } from "../../Context/Auth";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

const Review = ({ productId }) => {
  const { user, isLoggedIn } = useContext(Auth);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/review/product/${productId}`,
      );
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async () => {
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

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          productId,
          rating,
          reviews: reviewText,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Review added successfully!");
        setRating(0);
        setReviewText("");
        fetchReviews();
      } else {
        showToast(data.message || "Something went wrong");
      }
    } catch (err) {
      showToast("Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/review/${id}`, { method: "DELETE" });
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
    <div className="max-w-7xl mx-auto px-6 pb-16 pt-15">
      <hr className="border-gray-100 mb-10" />

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

      {/* Write Review */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Your Rating</p>
          <StarRow value={rating} interactive={true} />
        </div>

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

        <button
          onClick={handleSubmit}
          disabled={loading || !isLoggedIn}
          className="mt-3 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && (
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Submitting..." : "Submit Review"}
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
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
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
                    <p className="text-xs text-gray-400">@{r.userId?.uName}</p>
                  </div>
                </div>

                {/* Delete — sirf apna review */}
                {user?._id === r.userId?._id && (
                  <button
                    onClick={() => handleDelete(r._id)}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Review;
