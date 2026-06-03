import { useEffect, useState } from "react";

import image from "../../assets/image.jpeg";
import image1 from "../../assets/image1.jpg";
import image2 from "../../assets/image2.jpg";
import home from "../../assets/home.png";
import image4 from "../../assets/image4.jpg";
import image5 from "../../assets/image5.jpg";
import image6 from "../../assets/image6.jpg";

import { MdKeyboardArrowRight } from "react-icons/md";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

const contentData = {
  fashion: {
    cards: [
      { title: "Signature Leather Handbag", tag: "Featured", img: image },
      {
        title: "Refined Timepieces",
        desc: "Minimal designs crafted for everyday elegance",
        img: image1,
      },
      { title: "Style Details", img: image2 },
    ],
  },
};

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  const data = contentData.fashion;

  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  };

  const getBrands = async () => {
    try {
      const response = await fetch("http://localhost:5000/brands");
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.log(error);
      setBrands([]);
    }
  };

  useEffect(() => {
    getProducts();
    getBrands();
  }, []);

  const selectProduct = async (id) => {
    navigate(`/singleproduct/${id}`);
  };

  return (
    <section className="text-white bg-[#c9d0cd] pt-18">
      {/* HERO SECTION */}
      <div className="p-4">
        <div className="relative w-full h-[80vh] flex items-center justify-center text-black rounded-2xl overflow-hidden">
          <img
            src={home}
            alt="hero"
            className="absolute w-full h-full object-cover"
          />

          {/* Center Overlay Content */}
          <div className="relative z-20 text-center">
            <h1 className="text-5xl lg:text-7xl text-black">
              <p className="mr-70 font-playfair">NEW</p>
              <span className="font-bold font-poppins">COLLECTION</span>
            </h1>

            <p className="text-md font-semibold mt-2">
              Fresh Textures, Light Layers and Summer-ready styles.
            </p>

            <div className="flex gap-8 items-center justify-center mt-4">
              <button className="bg-[#f2f2f2] cursor-pointer text-[#25343f] mt-4 px-11 py-2 text-xl hover:text-[#f2f2f2] hover:bg-[#25343f] font-semibold rounded-md transition duration-300">
                Men
              </button>
              <button className="bg-[#f2f2f2] cursor-pointer text-[#25343f] mt-4 px-8 py-2 text-xl hover:text-[#f2f2f2] hover:bg-[#25343f] font-semibold rounded-md transition duration-300">
                Women
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* CARDS */}
      <div className="px-4 flex flex-wrap justify-between gap-8">
        {data.cards.map((card, index) => (
          <div
            key={index}
            className="relative h-56 rounded-3xl overflow-hidden w-full md:w-[48%] lg:w-[30%]"
          >
            <img
              src={card.img}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/25" />

            <div className="relative z-10 p-5 h-full flex flex-col justify-between">
              {card.tag && (
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full w-fit">
                  {card.tag}
                </span>
              )}

              <div>
                <h3 className="text-lg font-semibold">{card.title}</h3>
                {card.desc && (
                  <p className="text-sm text-white/70 mt-1">{card.desc}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="w-full min-h-screen px-4 md:px-10 py-8">
        <div className="flex justify-between items-center mb-9">
          <p className="text-xs text-gray-400">NEW ARRIVAL</p>

          <h1 className="text-black font-bold text-center text-4xl md:text-6xl">
            FRESH FITS FOR YOU <br /> NEXT FUNCTION!
          </h1>

          <p className="text-xs text-gray-400">TOP PICKS</p>
        </div>

        <div className="flex flex-wrap justify-between gap-5">
          {products.slice(0, 8).map((product, index) => (
            <div
              key={index}
              onClick={() => selectProduct(product._id)}
              className="relative rounded-2xl cursor-pointer overflow-hidden w-full sm:w-[48%] md:w-[31%] lg:w-[23%] group"
            >
              {/* IMAGE */}
              <img
                src={`http://localhost:5000/product/${product.image[0]}`}
                alt={product.title}
                className="w-full h-[60vh] object-cover object-top transition duration-300 group-hover:scale-105"
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 p-3 flex flex-col justify-between">
                {/* ✅ BRAND FIX */}
                <div className="flex justify-end">
                  <span className="text-black bg-gray-100 rounded-xl px-2 py-1 font-bold">
                    {product.brand?.title}
                  </span>
                </div>

                {/* BOTTOM */}
                <div className="font-semibold text-black bg-gray-100 flex items-center justify-between rounded-2xl p-2">
                  <div>
                    <p>{product.title}</p>
                    <p>INR {product.price}</p>
                  </div>

                  {/* ✅ LINK FIX */}
                  <Link
                    to={`/singleproduct/${product._id}`}
                    onClick={(e) => e.stopPropagation()} // important
                    className="rounded-full bg-gray-300 w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition"
                  >
                    <MdKeyboardArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BRANDS */}
      <div className="w-full px-10 py-8 bg-gray-300">
        <h2 className="text-4xl font-bold text-center mb-8 text-black">
          OUR BRANDS
        </h2>

        <div
          className="flex gap-5 overflow-x-auto no-scrollbar overflow-hidden "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {brands.map((brand, index) => (
            <div
              key={index}
              className="min-w-[180px] h-28 bg-gray-100 rounded-2xl flex items-center justify-center shadow-md relative"
            >
              <img
                src={`http://localhost:5000/brand/${brand.image[0]}`}
                alt={brand.title}
                className="absolute object-cover rounded-2xl p-5"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Homepage;
