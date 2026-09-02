import { useNavigate } from "react-router-dom";
import {
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiStar,
  FiUsers,
  FiPackage,
} from "react-icons/fi";

const About = () => {
  const navigate = useNavigate();

  const stats = [
    { value: "10K+", label: "Happy Customers" },
    { value: "500+", label: "Brands" },
    { value: "50K+", label: "Products" },
    { value: "4.9★", label: "Avg Rating" },
  ];

  const values = [
    {
      icon: <FiTruck size={24} />,
      title: "Fast Delivery",
      desc: "Orders shipped within 24 hours. Free delivery on orders above ₹999.",
    },
    {
      icon: <FiShield size={24} />,
      title: "Secure Payments",
      desc: "100% secure checkout with encrypted payment processing.",
    },
    {
      icon: <FiRefreshCw size={24} />,
      title: "Easy Returns",
      desc: "7-day hassle-free returns. No questions asked.",
    },
    {
      icon: <FiStar size={24} />,
      title: "Quality Products",
      desc: "Every product is verified and sourced from trusted brands.",
    },
    {
      icon: <FiUsers size={24} />,
      title: "24/7 Support",
      desc: "Our team is always here to help you with anything.",
    },
    {
      icon: <FiPackage size={24} />,
      title: "Wide Selection",
      desc: "From fashion to electronics — everything in one place.",
    },
  ];

  const team = [
    {
      name: "Aakash Sharma",
      role: "Founder & CEO",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      quote:
        "We built ShopEase to make quality shopping accessible to everyone.",
    },
    {
      name: "Priya Mehta",
      role: "Head of Design",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
      quote: "Design is how we make people feel welcome the moment they land.",
    },
    {
      name: "Rahul Verma",
      role: "Tech Lead",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      quote: "Speed and reliability aren't features — they're the foundation.",
    },
  ];

  return (
    <div className="w-full bg-[#e8e8e8] min-h-screen pt-22">
      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-black text-white px-6 md:px-16 py-20 md:py-28">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=600&fit=crop"
          alt="store"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-200 font-semibold mb-4">
            About ShopEase
          </p>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
            Shopping, <br />
            <span className="text-white/70">made simple.</span>
          </h1>
          <p className="text-gray-200 text-lg leading-relaxed max-w-xl">
            ShopEase was born from a simple idea — that great products should be
            easy to find, easy to buy, and easy to love. We're a team of
            shoppers building for shoppers.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="mt-8 px-7 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition text-sm"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="bg-white px-6 md:px-16 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-black text-black">
                {s.value}
              </p>
              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── STORY ── */}
      <div className="px-6 md:px-16 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
              Our Story
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-5 leading-tight">
              Started with a cart, <br /> built a community.
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              In 2022, a small team of friends frustrated with complicated
              e-commerce experiences decided to build something better. ShopEase
              launched with just 50 products and a dream to make online shopping
              feel as natural as walking into your favorite store.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Today, we serve thousands of customers across India with a curated
              selection of fashion, electronics, home essentials, and more — all
              under one roof, with prices that never compromise on quality.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop"
              alt="store"
              className="rounded-2xl object-cover w-full h-44"
            />
            <img
              src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop"
              alt="team"
              className="rounded-2xl object-cover w-full h-44 mt-6"
            />
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop"
              alt="delivery"
              className="rounded-2xl object-cover w-full h-44 -mt-6"
            />
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop"
              alt="fashion"
              className="rounded-2xl object-cover w-full h-44"
            />
          </div>
        </div>
      </div>

      {/* ── VALUES ── */}
      <div className="bg-white px-6 md:px-16 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 text-center">
            Why ShopEase
          </p>
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
            Built around you.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-[#f5f5f5] rounded-2xl p-6 hover:shadow-sm transition"
              >
                <div className="w-11 h-11 bg-black text-white rounded-xl flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="font-black text-gray-900 mb-1.5">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TEAM ── */}
      <div className="px-6 md:px-16 py-16 max-w-5xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 text-center">
          The Team
        </p>
        <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
          People behind ShopEase.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <img
                src={t.img}
                alt={t.name}
                className="w-full h-52 object-cover object-top"
              />
              <div className="p-5">
                <p className="font-black text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mt-0.5 mb-3">
                  {t.role}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-black text-white px-6 md:px-16 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-4">
          Ready to shop smarter?
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Join thousands of happy customers and discover products you'll love.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="px-8 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition text-sm"
        >
          Explore Products
        </button>
      </div>
    </div>
  );
};

export default About;
