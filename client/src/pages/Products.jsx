import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true); // 🔥 NEW

  const [filterData, setFilterData] = useState({
    genders: [],
    sizes: [],
    colors: [],
    categories: [],
  });

  const [genderFilter, setGenderFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");

  // 🔥 PRODUCTS API
  const getProducts = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/products/");
      const data = await res.json();

      setProducts(data);

      const genders = [...new Set(data.map((item) => item.gender))];
      const colors = [...new Set(data.map((item) => item.color))];
      const categories = [...new Set(data.map((item) => item.category))];

      const sizes = [
        ...new Set(
          data.flatMap((item) =>
            Array.isArray(item.size) ? item.size : item.size?.split(",") || [],
          ),
        ),
      ];

      setFilterData({ genders, sizes, colors, categories });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // 🔥 IMPORTANT
    }
  };

  // 🔥 BRANDS API
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

  const selectProduct = (id) => {
    navigate(`/singleproduct/${id}`);
  };

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

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 pt-20 py-10 bg-gray-200 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-black">
        All Products
      </h2>

      {/* FILTER */}
      <div className="flex flex-wrap gap-3 md:gap-4 mb-6">
        <select
          onChange={(e) => setGenderFilter(e.target.value)}
          className="border rounded w-full sm:w-auto text-sm sm:text-md sm:p-1"
        >
          <option value="all">Gender</option>
          {filterData.genders.map((g, i) => (
            <option key={i} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setSizeFilter(e.target.value)}
          className="border rounded w-full sm:w-auto text-sm sm:text-md sm:p-1"
        >
          <option value="all">Size</option>
          <option>S</option>
          <option>M</option>
          <option>L</option>
          <option>XL</option>
          <option>XXL</option>
        </select>

        <select
          onChange={(e) => setColorFilter(e.target.value)}
          className="border rounded w-full sm:w-auto text-sm sm:text-md sm:p-1"
        >
          <option value="all">Color</option>
          {filterData.colors.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded w-full sm:w-auto text-sm sm:text-md sm:p-1"
        >
          <option value="all">Category</option>
          {filterData.categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setBrandFilter(e.target.value)}
          className="border rounded w-full sm:w-auto text-sm sm:text-md sm:p-1"
        >
          <option value="all">Brand</option>
          {brands.map((b) => (
            <option key={b._id} value={b.title}>
              {b.title}
            </option>
          ))}
        </select>
      </div>

      {/* 🔥 PRODUCTS */}
      <div className="flex flex-wrap gap-6 md:gap-8">
        {loading ? (
          <p className="w-full text-center text-lg font-semibold">Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="w-full text-center text-lg font-semibold">
            No Products Found
          </p>
        ) : (
          filteredProducts.map((item) => (
            <div
              key={item._id}
              onClick={() => selectProduct(item._id)}
              className="w-full sm:w-[48%] md:w-[31%] lg:w-[23%] relative rounded-2xl overflow-hidden cursor-pointer group"
            >
              {/* IMAGE */}
              <img
                src={`http://localhost:5000/product/${item.image[0]}`}
                alt={item.title}
                className="w-full h-[50vh] sm:h-[55vh] md:h-[60vh] object-cover object-top transition duration-300 group-hover:scale-105"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 p-3 flex flex-col justify-between">
                <div className="flex justify-end">
                  <span className="bg-white px-3 py-1 rounded-xl font-semibold text-sm">
                    {item.brand?.title}
                  </span>
                </div>

                <div className="bg-white flex justify-between items-center rounded-2xl p-3">
                  <div>
                    <p className="font-semibold text-sm md:text-base">
                      {item.title}
                    </p>
                    <p className="text-sm md:text-base">₹ {item.price}</p>
                  </div>

                  <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-200 rounded-full text-xl md:text-2xl group-hover:bg-black group-hover:text-white transition">
                    <MdKeyboardArrowRight />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
