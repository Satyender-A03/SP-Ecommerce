import React, { useState, useContext, useEffect } from "react";
import { FiShoppingCart, FiUser, FiLogIn } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import { SearchContext } from "../../Context/Search";
import { Auth } from "../../Context/Auth";

const Navbar = () => {
  const [inputValue, setInputValue] = useState("");

  const { setSearch } = useContext(SearchContext);
  const { isLoggedIn } = useContext(Auth);

  const navigate = useNavigate();
  const location = useLocation();

  // 🔍 SEARCH SYNC
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      setInputValue(q);
      setSearch(q);
    }
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const query = inputValue.trim();
    setSearch(query);
    navigate(`/searchproduct?q=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="fixed top-3 left-4 right-4 bg-gray-600/30 backdrop-blur-sm text-white z-50 rounded-3xl">
      <div className="flex justify-between items-center h-16 p-6 relative">
        {/* LEFT */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* CENTER */}
        <div className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold font-serif">
          ShopEase
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* SEARCH */}
          <form
            onSubmit={handleSearch}
            className="group flex items-center border-0 hover:border rounded-full px-3 py-1 w-12 hover:w-64 focus-within:w-64 transition-all duration-300 overflow-hidden"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search Product"
              className="w-full opacity-0 md:group-hover:opacity-100 text-black outline-none transition"
            />
            <button type="submit">
              <IoSearchSharp className="text-2xl" />
            </button>
          </form>

          {/* CART */}
          <Link to="/addtocart">
            <FiShoppingCart className="text-2xl" />
          </Link>

          {/* USER / LOGIN */}
          {isLoggedIn ? (
            <Link to="/profile">
              <FiUser className="text-2xl text-black" />
            </Link>
          ) : (
            <Link to="/signin">
              <FiLogIn className="text-2xl text-white" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
