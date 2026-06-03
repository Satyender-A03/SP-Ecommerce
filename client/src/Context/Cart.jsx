import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ✅ localStorage sync (NO console here)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => {
        const p = item.product || item;
        return p._id === product._id && p.selectedSize === product.selectedSize;
      });

      if (exists) {
        return prev.map((item) => {
          const p = item.product || item;

          if (
            p._id === product._id &&
            p.selectedSize === product.selectedSize
          ) {
            return { ...item, qty: (item.qty || 1) + 1 };
          }

          return item;
        });
      }

      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (id, size) => {
    setCart((prev) =>
      prev.filter((item) => {
        const p = item.product || item;
        return !(p._id === id && p.selectedSize === size);
      }),
    );
  };

  const incQty = (id, size) => {
    setCart((prev) =>
      prev.map((item) => {
        const p = item.product || item;

        if (p._id === id && p.selectedSize === size) {
          return { ...item, qty: item.qty + 1 };
        }

        return item;
      }),
    );
  };

  const decQty = (id, size) => {
    setCart((prev) =>
      prev.map((item) => {
        const p = item.product || item;

        if (p._id === id && p.selectedSize === size && item.qty > 1) {
          return { ...item, qty: item.qty - 1 };
        }

        return item;
      }),
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, incQty, decQty }}
    >
      {children}
    </CartContext.Provider>
  );
};
