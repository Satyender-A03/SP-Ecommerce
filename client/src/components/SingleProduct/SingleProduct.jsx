import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/Cart";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cart, addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(""); // ✅ NEW

  const getProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/products/${id}`);
      const data = await res.json();

      setProduct(data);

      if (data.image?.length > 0) {
        setSelectedImage(data.image[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  if (!product) {
    return <p className="text-center pt-10">Loading...</p>;
  }

  const sizes = Array.isArray(product.size)
    ? product.size
    : product.size?.split(",") || [];

  const isInCart = cart.some((item) => {
    const p = item.product || item;
    return p._id === product._id && p.selectedSize === selectedSize;
  });

  return (
    <section className="w-full pt-20 bg-white">
      <div className="max-w-7xl mx-auto flex gap-16 py-5 justify-between">
        {/* LEFT THUMBNAILS */}
        <div className="w-[10%]">
          <div className="flex flex-col gap-4">
            {product.image?.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:5000/product/${img}`}
                onClick={() => setSelectedImage(img)}
                className={`cursor-pointer border-2 ${
                  selectedImage === img ? "border-black" : "border-gray-300"
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
            className="w-[400px] object-cover shadow"
          />
        </div>

        {/* RIGHT DETAILS */}
        <div className="w-[40%] flex flex-col gap-5">
          <p className="text-gray-500 text-sm uppercase">
            Brand: {product.brand?.title}
          </p>

          <h1 className="text-3xl font-bold">{product.title}</h1>

          <p className="text-xl font-semibold">Price: ₹ {product.price}</p>

          {/* SIZE */}
          <div>
            <p className="font-semibold mb-2">Select Size:</p>
            <div className="flex gap-3">
              {sizes.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedSize(s);
                    setError(""); // clear error
                  }}
                  className={`px-4 py-2 border ${
                    selectedSize === s
                      ? "bg-black text-white"
                      : "border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* 🔥 ERROR MESSAGE */}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <p>
            <span className="font-semibold">Color:</span> {product.color}
          </p>

          <p>
            <span className="font-semibold">Category:</span> {product.category}
          </p>

          <p>
            <span className="font-semibold">Stock:</span> {product.qty}
          </p>

          {/* DESCRIPTION */}
          <div>
            <p className="font-semibold">About the product:</p>
            <p className="text-gray-600">{product.desc}</p>
          </div>

          {/* 🔥 BUTTON */}
          <button
            className={`w-full py-3 text-white font-bold rounded-lg transition ${
              isInCart ? "bg-gray-800" : "bg-black"
            }`}
            onClick={() => {
              // ❌ size select नहीं
              if (!selectedSize) {
                setError("Please select a size");
                return;
              }

              setError("");

              if (isInCart) {
                navigate("/addtocart");
              } else {
                addToCart({ ...product, selectedSize }); // 🔥 size भेजा
                navigate("/addtocart");
              }
            }}
          >
            {isInCart ? "GO TO CART" : "ADD TO CART"}
          </button>

          {/* SHIPPING */}
          {product.qty > 0 && (
            <p className="text-gray-600 mt-2 text-sm">
              Ships within 2-3 business days
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SingleProduct;
