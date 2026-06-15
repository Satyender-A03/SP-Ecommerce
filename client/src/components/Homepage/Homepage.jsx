import { useEffect, useState, useRef, useContext } from "react";

import image from "../../assets/image.jpeg";
import image1 from "../../assets/image1.jpg";
import image2 from "../../assets/image2.jpg";
import homeHeroImage from "../../assets/home.png";

import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { FiHeart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { WishlistContext } from "../../Context/Wishlist";
import { Auth } from "../../Context/Auth";

const featuredCards = [
  { title: "Signature Leather Handbag", tag: "Featured", image: image },
  {
    title: "Refined Timepieces",
    description: "Minimal designs crafted for everyday elegance",
    image: image1,
  },
  { title: "Style Details", image: image2 },
];

const Homepage = () => {
  const [productList, setProductList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const navigate = useNavigate();
  const brandScrollRef = useRef(null);

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);
  const { isLoggedIn } = useContext(Auth);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products");
      const responseData = await response.json();
      setProductList(responseData);
    } catch (error) {
      setProductList([]);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch("http://localhost:5000/brands");
      const responseData = await response.json();
      setBrandList(responseData);
    } catch (error) {
      setBrandList([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [productList, brandList]);

  const scrollBrands = (direction) => {
    if (brandScrollRef.current) {
      brandScrollRef.current.scrollBy({
        left: direction === "next" ? 360 : -360,
        behavior: "smooth",
      });
    }
  };

  const handleWishlist = (e, product) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }
    isInWishlist(product._id)
      ? removeFromWishlist(product._id)
      : addToWishlist(product);
  };

  return (
    <section className="text-white bg-[#c9d0cd] pt-18">
      {/* ── HERO ── */}
      <div className="p-4">
        <div className="relative w-full h-[88vh] flex items-center justify-center rounded-3xl overflow-hidden">
          <img
            src={homeHeroImage}
            alt="New collection hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" />
          <div className="relative z-10 text-center px-4">
            <p
              className="reveal font-playfair font-semibold text-black/90 tracking-[0.35em] text-sm mb-2 uppercase"
              style={{ animationDelay: "0.1s" }}
            >
              Summer 2025
            </p>
            <h1
              className="reveal font-poppins font-semibold text-6xl md:text-8xl text-black leading-none"
              style={{ animationDelay: "0.2s" }}
            >
              New
            </h1>
            <h1
              className="reveal font-poppins font-black text-6xl md:text-8xl text-black leading-none tracking-tight"
              style={{ animationDelay: "0.3s" }}
            >
              Collection
            </h1>
            <p
              className="reveal text-black/70 text-sm md:text-base mt-4 font-medium tracking-wide"
              style={{ animationDelay: "0.4s" }}
            >
              Fresh Textures · Light Layers · Summer-Ready Styles
            </p>
            <div
              className="reveal flex gap-4 items-center justify-center mt-8"
              style={{ animationDelay: "0.5s" }}
            >
              <button
                onClick={() => navigate("/products?gender=Men")}
                className="bg-white text-[#1a2a33] px-10 py-3 text-sm font-bold tracking-widest uppercase rounded-full hover:bg-[#1a2a33] hover:text-white transition duration-300"
              >
                Men
              </button>
              <button
                onClick={() => navigate("/products?gender=Women")}
                className="bg-white text-[#1a2a33] px-10 py-3 text-sm font-bold tracking-widest uppercase rounded-full hover:bg-[#1a2a33] hover:text-white transition duration-300"
              >
                Women
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURE CARDS ── */}
      <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {featuredCards.map((card, cardIndex) => (
          <div
            key={cardIndex}
            className="reveal relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
            style={{ animationDelay: `${0.1 * cardIndex}s` }}
          >
            <img
              src={card.image}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="relative z-10 p-5 h-full flex flex-col justify-between">
              {card.tag && (
                <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full w-fit border border-white/20">
                  {card.tag}
                </span>
              )}
              <div>
                <h3 className="text-base font-semibold text-white">
                  {card.title}
                </h3>
                {card.description && (
                  <p className="text-sm text-white/70 mt-1">
                    {card.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── PRODUCTS ── */}
      <div className="w-full px-4 md:px-10 py-12">
        <div className="reveal flex justify-between items-start mb-10">
          <div className="flex flex-col gap-1">
            <p className="text-xs tracking-widest text-gray-500 uppercase">
              New Arrival
            </p>
            <div className="w-8 h-0.5 bg-gray-400" />
          </div>
          <h2 className="text-black font-black text-center text-3xl md:text-5xl leading-tight">
            Fresh Fits For Your <br /> Next Function
          </h2>
          <div className="flex flex-col items-end gap-1">
            <p className="text-xs tracking-widest text-gray-500 uppercase">
              Top Picks
            </p>
            <div className="w-8 h-0.5 bg-gray-400 self-end" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {productList.slice(0, 8).map((product, productIndex) => (
            <div
              key={productIndex}
              onClick={() => navigate(`/singleproduct/${product._id}`)}
              className="reveal relative rounded-2xl cursor-pointer overflow-hidden group shadow-sm"
              style={{ animationDelay: `${0.08 * productIndex}s` }}
            >
              <img
                src={`http://localhost:5000/product/${product.image[0]}`}
                alt={product.title}
                className="w-full h-[58vh] object-cover object-top transition duration-500 group-hover:scale-105"
              />

              {/* Brand badge */}
              <div className="absolute top-3 right-3">
                <span className="text-xs text-gray-800 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 font-semibold shadow-sm">
                  {product.brand?.title}
                </span>
              </div>

              {/* 🔥 Wishlist button */}
              <button
                onClick={(e) => handleWishlist(e, product)}
                className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition duration-200"
              >
                <FiHeart
                  className={`text-sm ${isInWishlist(product._id) ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                />
              </button>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 m-3 bg-white/90 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {product.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    INR {product.price}
                  </p>
                </div>
                <Link
                  to={`/singleproduct/${product._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-full bg-gray-200 w-9 h-9 flex items-center justify-center hover:bg-black hover:text-white transition duration-300 shrink-0 ml-2"
                >
                  <MdKeyboardArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BRANDS ── */}
      <div className="w-full px-10 py-12 bg-gray-200">
        <div className="reveal flex items-center justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest text-gray-500 uppercase mb-1">
              Partners
            </p>
            <h2 className="text-3xl font-black text-black">Our Brands</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollBrands("prev")}
              className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xl text-gray-700 hover:bg-black hover:text-white hover:border-black transition duration-300"
            >
              <MdKeyboardArrowLeft />
            </button>
            <button
              onClick={() => scrollBrands("next")}
              className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xl text-gray-700 hover:bg-black hover:text-white hover:border-black transition duration-300"
            >
              <MdKeyboardArrowRight />
            </button>
          </div>
        </div>
        <div
          ref={brandScrollRef}
          className="flex gap-5 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {brandList.map((brand, brandIndex) => (
            <div
              key={brandIndex}
              className="reveal min-w-[160px] h-24 bg-white rounded-2xl flex items-center justify-center border border-gray-200 hover:border-gray-400 transition duration-300 shrink-0"
              style={{ animationDelay: `${0.08 * brandIndex}s` }}
            >
              <img
                src={`http://localhost:5000/brand/${brand.image[0]}`}
                alt={brand.title}
                className="max-h-14 max-w-[120px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Homepage;
