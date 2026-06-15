import { createContext, useState } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  // 🔥 localStorage se initial state lo
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // 🔥 helper — save to state + localStorage dono
  const saveWishlist = (updated) => {
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const addToWishlist = (product) => {
    const exists = wishlist.some((item) => item._id === product._id);
    if (!exists) {
      saveWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (productId) => {
    saveWishlist(wishlist.filter((item) => item._id !== productId));
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
