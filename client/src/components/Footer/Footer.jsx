import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaFacebookF, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#1a2a33] text-white">
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-black tracking-tight">ShopEase</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Premium fashion for every occasion. Fresh styles, top brands,
            delivered fast.
          </p>
          {/* Social Icons */}
          <div className="flex gap-3 mt-2">
            {[
              { icon: <FaInstagram />, href: "#" },
              { icon: <FaTwitter />, href: "#" },
              { icon: <FaFacebookF />, href: "#" },
              { icon: <FaYoutube />, href: "#" },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-[#1a2a33] flex items-center justify-center text-sm transition duration-300"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">
            Quick Links
          </h3>
          {[
            { label: "Home", to: "/" },
            { label: "Products", to: "/products" },
            { label: "Men", to: "/products?gender=Men" },
            { label: "Women", to: "/products?gender=Women" },
          ].map((link, i) => (
            <Link
              key={i}
              to={link.to}
              className="text-sm text-gray-300 hover:text-white transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Support */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">
            Support
          </h3>
          {[
            "FAQ",
            "Shipping Policy",
            "Return & Exchange",
            "Track Order",
            "Contact Us",
          ].map((item, i) => (
            <span
              key={i}
              className="text-sm text-gray-300 hover:text-white cursor-pointer transition"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">
            Newsletter
          </h3>
          <p className="text-sm text-gray-400">
            Subscribe to get the latest deals and new arrivals.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
            />
            <button className="bg-white text-[#1a2a33] px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-200 transition">
              Go
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-gray-500 text-xs">
          © {new Date().getFullYear()} ShopEase. All rights reserved.
        </p>
        <div className="flex gap-5">
          {["Privacy Policy", "Terms of Service", "Cookies"].map((item, i) => (
            <span
              key={i}
              className="text-gray-500 text-xs hover:text-white cursor-pointer transition"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
