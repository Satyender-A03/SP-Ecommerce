import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Har route change pe window ko top pe scroll kar deta hai
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
