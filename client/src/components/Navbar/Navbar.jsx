import React, { useState, useContext, useEffect, useRef } from "react";
import {
  FiShoppingCart,
  FiUser,
  FiLogIn,
  FiHeart,
  FiLogOut,
  FiPackage,
} from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import { SearchContext } from "../../Context/Search";
import { Auth } from "../../Context/Auth"; // 🔥 Auth (same as context file)

const Navbar = () => {
  const [inputValue, setInputValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { setSearch } = useContext(SearchContext);
  const { isLoggedIn, user, logout } = useContext(Auth); // 🔥 Auth context

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      setInputValue(q);
      setSearch(q);
    }
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const query = inputValue.trim();
    setSearch(query);
    navigate(`/searchproduct?q=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
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
              className="w-full opacity-0 group-hover:opacity-100 focus-within:opacity-100 text-black outline-none transition"
            />
            <button type="submit">
              <IoSearchSharp className="text-2xl" />
            </button>
          </form>

          {/* WISHLIST */}
          <Link to="/wishlist" className="hover:text-red-300 transition">
            <FiHeart className="text-2xl" />
          </Link>

          {/* CART */}
          <Link to="/addtocart" className="hover:text-gray-300 transition">
            <FiShoppingCart className="text-2xl" />
          </Link>

          {/* PROFILE ICON — always visible, dropdown me login check */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="hover:text-gray-300 transition"
            >
              <FiUser className="text-2xl" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl overflow-hidden z-50 text-black">
                {isLoggedIn ? (
                  <>
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="font-semibold text-sm truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email || ""}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <FiUser className="text-gray-400" />
                      My Profile
                    </Link>

                    <Link
                      to="/order"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <FiPackage className="text-gray-400" />
                      My Orders
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <FiHeart className="text-gray-400" />
                      Wishlist
                    </Link>

                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
                      >
                        <FiLogOut className="text-red-400" />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm text-gray-500">Not logged in</p>
                    </div>
                    <Link
                      to="/signin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <FiLogIn className="text-gray-400" />
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
