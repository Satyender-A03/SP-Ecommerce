import { useState, useEffect, useRef } from "react";
import {
  MdCloudUpload,
  MdClose,
  MdSearch,
  MdKeyboardArrowDown,
} from "react-icons/md";
import API_URL from "../../Constent";

const ProductForm = () => {
  const [product, setProduct] = useState({
    title: "",
    desc: "",
    price: "",
    discount: "",
    color: "",
    size: "",
    category: "",
    gender: "",
    qty: "",
    brand: "",
    images: [],
  });

  const [brands, setBrands] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);

  // ── Brand searchable dropdown state ──
  const [brandOpen, setBrandOpen] = useState(false);
  const [brandQuery, setBrandQuery] = useState("");
  const brandBoxRef = useRef(null);

  // GET BRANDS
  useEffect(() => {
    const getBrands = async () => {
      try {
        const res = await fetch("http://localhost:5000/brands");
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        console.log(err);
      }
    };
    getBrands();
  }, []);

  // Close brand dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (brandBoxRef.current && !brandBoxRef.current.contains(e.target)) {
        setBrandOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedBrand = brands.find((b) => b._id === product.brand);

  const filteredBrands = brands.filter((b) =>
    b.title?.toLowerCase().includes(brandQuery.toLowerCase()),
  );

  // Build/clean up preview URLs whenever images change (avoids leaking object URLs)
  useEffect(() => {
    const urls = product.images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [product.images]);

  const handleImages = (files) => {
    setProduct({ ...product, images: Array.from(files) });
  };

  const removeImage = (index) => {
    setProduct({
      ...product,
      images: product.images.filter((_, i) => i !== index),
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      // normal fields
      formData.append("title", product.title);
      formData.append("desc", product.desc);
      formData.append("price", product.price);
      formData.append("discount", product.discount);
      formData.append("color", product.color);
      formData.append(
        "size",
        JSON.stringify(product.size.split(",").map((s) => s.trim())),
      );
      formData.append("category", product.category);
      formData.append("gender", product.gender);
      formData.append("qty", product.qty);
      formData.append("brand", product.brand);

      // multiple images
      product.images.forEach((file) => {
        formData.append("image", file);
      });

      // DEBUG
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await fetch("http://localhost:5000/products/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      // RESET FORM
      setProduct({
        title: "",
        desc: "",
        price: "",
        discount: "",
        color: "",
        size: "",
        category: "",
        gender: "",
        qty: "",
        brand: "",
        images: [],
      });

      alert("Product Added Successfully");
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full border border-white/10 px-4 py-3 rounded-lg bg-[#0f1115] text-white text-sm placeholder:text-gray-600 outline-none focus:border-violet-500/50 transition";
  const labelClass = "text-xs font-semibold text-gray-400 mb-1.5 block";

  return (
    <div className="w-full bg-[#171a21] border border-white/5 p-6 rounded-xl">
      <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
        Catalog
      </p>
      <h2 className="text-2xl font-bold mb-6 text-white">Add Product</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div>
          <label className={labelClass}>Product Title</label>
          <input
            type="text"
            placeholder="e.g. Air Zoom Runner"
            className={inputClass}
            value={product.title}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
            required
          />
        </div>

        <div className="relative" ref={brandBoxRef}>
          <label className={labelClass}>Brand</label>
          <button
            type="button"
            onClick={() => setBrandOpen((v) => !v)}
            className={`${inputClass} flex items-center justify-between text-left ${!selectedBrand ? "text-gray-600" : ""}`}
          >
            <span className="truncate">
              {selectedBrand ? selectedBrand.title : "Select Brand"}
            </span>
            <MdKeyboardArrowDown
              className={`text-gray-500 shrink-0 transition-transform ${brandOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* hidden input keeps native `required` validation working */}
          <input
            type="text"
            value={product.brand}
            onChange={() => {}}
            required
            tabIndex={-1}
            className="sr-only"
          />

          {brandOpen && (
            <div className="absolute z-20 mt-2 w-full bg-[#0f1115] border border-white/10 rounded-lg shadow-xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/10 ">
                <MdSearch className="text-gray-500 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search brand..."
                  value={brandQuery}
                  onChange={(e) => setBrandQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-white placeholder:text-gray-600 "
                />
              </div>
              <div className="max-h-48 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {filteredBrands.length === 0 ? (
                  <p className="px-3 py-3 text-sm text-gray-500 text-center">
                    No brands match "{brandQuery}"
                  </p>
                ) : (
                  filteredBrands.map((b) => (
                    <button
                      type="button"
                      key={b._id}
                      onClick={() => {
                        setProduct({ ...product, brand: b._id });
                        setBrandOpen(false);
                        setBrandQuery("");
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm truncate transition ${
                        product.brand === b._id
                          ? "bg-violet-600/20 text-violet-300"
                          : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      {b.title}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className={labelClass}>Price (₹)</label>
          <input
            type="number"
            placeholder="0"
            className={inputClass}
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Discount %</label>
          <input
            type="number"
            placeholder="0"
            className={inputClass}
            value={product.discount}
            onChange={(e) =>
              setProduct({ ...product, discount: e.target.value })
            }
          />
        </div>

        <div>
          <label className={labelClass}>Color</label>
          <input
            type="text"
            placeholder="e.g. Black"
            className={inputClass}
            value={product.color}
            onChange={(e) => setProduct({ ...product, color: e.target.value })}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Sizes</label>
          <input
            type="text"
            placeholder="S, M, L"
            className={inputClass}
            value={product.size}
            onChange={(e) => setProduct({ ...product, size: e.target.value })}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select
            className={inputClass}
            value={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
            required
          >
            <option value="">Select Category</option>
            <option value="Shoes">Shoes</option>
            <option value="Fashion">Fashion</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Gender</label>
          <select
            className={inputClass}
            value={product.gender}
            onChange={(e) => setProduct({ ...product, gender: e.target.value })}
            required
          >
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Quantity</label>
          <input
            type="number"
            placeholder="0"
            className={inputClass}
            value={product.qty}
            onChange={(e) => setProduct({ ...product, qty: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            placeholder="What makes this product stand out..."
            rows="4"
            className={`${inputClass} resize-none`}
            value={product.desc}
            onChange={(e) => setProduct({ ...product, desc: e.target.value })}
            required
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div className="md:col-span-2">
          <label className={labelClass}>Product Images</label>
          <label
            htmlFor="product-images"
            className="flex items-center gap-4 border border-dashed border-white/15 rounded-lg px-4 py-4 cursor-pointer hover:border-violet-500/50 transition bg-[#0f1115]"
          >
            <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
              <MdCloudUpload className="text-gray-500 text-2xl" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-300 font-medium">
                {product.images.length > 0
                  ? `${product.images.length} image${product.images.length > 1 ? "s" : ""} selected`
                  : "Click to upload images"}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                PNG, JPG — multiple allowed
              </p>
            </div>
            <input
              id="product-images"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImages(e.target.files)}
              required={product.images.length === 0}
            />
          </label>
        </div>

        {/* PREVIEW */}
        {previews.length > 0 && (
          <div className="flex gap-3 flex-wrap md:col-span-2">
            {previews.map((src, i) => (
              <div key={i} className="relative w-20 h-20 shrink-0">
                <img
                  src={src}
                  alt="preview"
                  className="w-full h-full object-cover rounded-lg border border-white/10"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center border border-white/10 hover:bg-red-600 transition"
                >
                  <MdClose className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="md:col-span-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 mt-1"
        >
          {saving && (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          {saving ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
