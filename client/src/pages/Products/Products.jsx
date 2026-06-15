import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FiHeart } from "react-icons/fi";
import { WishlistContext } from "../../Context/Wishlist";
import { Auth } from "../../Context/Auth";

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);
  const { isLoggedIn } = useContext(Auth);

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterData, setFilterData] = useState({
    genders: [],
    colors: [],
    categories: [],
  });

  const [genderFilter, setGenderFilter] = useState(
    searchParams.get("gender") || "all",
  );
  const [sizeFilter, setSizeFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");

  const getProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/products/");
      const data = await res.json();
      setProducts(data);
      const genders = [...new Set(data.map((item) => item.gender))];
      const colors = [...new Set(data.map((item) => item.color))];
      const categories = [...new Set(data.map((item) => item.category))];
      setFilterData({ genders, colors, categories });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getBrands = async () => {
    try {
      const res = await fetch("http://localhost:5000/brands/");
      const data = await res.json();
      setBrands(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProducts();
    getBrands();
  }, []);

  useEffect(() => {
    const genderFromUrl = searchParams.get("gender");
    if (genderFromUrl) setGenderFilter(genderFromUrl);
    else setGenderFilter("all");
  }, [searchParams]);

  const filteredProducts = products.filter((item) => {
    const matchGender = genderFilter === "all" || item.gender === genderFilter;
    const matchSize =
      sizeFilter === "all" ||
      (Array.isArray(item.size)
        ? item.size.includes(sizeFilter)
        : item.size?.includes(sizeFilter));
    const matchColor = colorFilter === "all" || item.color === colorFilter;
    const matchCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchBrand =
      brandFilter === "all" || item.brand?.title === brandFilter;
    return (
      matchGender && matchSize && matchColor && matchCategory && matchBrand
    );
  });

  const handleWishlist = (e, item) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate("/signin");
      return;
    }
    isInWishlist(item._id) ? removeFromWishlist(item._id) : addToWishlist(item);
  };

  return (
    <div className="w-full min-h-screen bg-[#e8e8e8] px-6 md:px-10 pt-20 pb-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
        All Products
      </h2>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-2 mb-6">
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="border border-gray-400 bg-white rounded-md px-3 py-1.5 text-sm font-medium text-gray-800 cursor-pointer focus:outline-none"
        >
          <option value="all">Gender</option>
          {filterData.genders.map((g, i) => (
            <option key={i} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className="border border-gray-400 bg-white rounded-md px-3 py-1.5 text-sm font-medium text-gray-800 cursor-pointer focus:outline-none"
        >
          <option value="all">Size</option>
          {["S", "M", "L", "XL", "XXL"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={colorFilter}
          onChange={(e) => setColorFilter(e.target.value)}
          className="border border-gray-400 bg-white rounded-md px-3 py-1.5 text-sm font-medium text-gray-800 cursor-pointer focus:outline-none"
        >
          <option value="all">Color</option>
          {filterData.colors.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-400 bg-white rounded-md px-3 py-1.5 text-sm font-medium text-gray-800 cursor-pointer focus:outline-none"
        >
          <option value="all">Category</option>
          {filterData.categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="border border-gray-400 bg-white rounded-md px-3 py-1.5 text-sm font-medium text-gray-800 cursor-pointer focus:outline-none"
        >
          <option value="all">Brand</option>
          {brands.map((b) => (
            <option key={b._id} value={b.title}>
              {b.title}
            </option>
          ))}
        </select>
      </div>

      {/* PRODUCTS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden animate-pulse bg-white"
            >
              <div className="h-[50vh] bg-gray-300" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-2/3" />
                <div className="h-4 bg-gray-300 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-xl font-bold text-gray-600">No Products Found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try changing your filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/singleproduct/${item._id}`)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-shadow duration-300 h-[50vh]"
            >
              {/* Image */}
              <img
                src={`http://localhost:5000/product/${item.image[0]}`}
                alt={item.title}
                className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
              />

              {/* Brand badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {item.brand?.title}
                </span>
              </div>

              {/* 🔥 Wishlist button */}
              <button
                onClick={(e) => handleWishlist(e, item)}
                className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition duration-200"
              >
                <FiHeart
                  className={`text-sm ${isInWishlist(item._id) ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                />
              </button>

              {/* Bottom overlay */}
              <div className="absolute bottom-0 left-0 right-0 m-3 bg-white/85 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center justify-between">
                <div className="overflow-hidden">
                  <p className="font-bold text-gray-900 text-[15px] truncate">
                    {item.title}
                  </p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    INR {item.price}
                  </p>
                </div>
                <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-gray-200 rounded-full text-xl ml-3 group-hover:bg-black group-hover:text-white transition duration-300">
                  <MdKeyboardArrowRight />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
