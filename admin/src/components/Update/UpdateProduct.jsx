import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdCloudUpload,
  MdClose,
  MdSearch,
  MdKeyboardArrowDown,
  MdArrowBack,
} from "react-icons/md";

import API_URL from "../../Constent";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    images: [], // newly selected files (optional replacement)
  });

  const [existingImages, setExistingImages] = useState([]); // filenames already on server
  const [brands, setBrands] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── Brand searchable dropdown state ──
  const [brandOpen, setBrandOpen] = useState(false);
  const [brandQuery, setBrandQuery] = useState("");
  const brandBoxRef = useRef(null);

  // GET BRANDS
  useEffect(() => {
    const getBrands = async () => {
      try {
        const res = await fetch(`${API_URL}/brands`);
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        console.log(err);
      }
    };
    getBrands();
  }, []);

  // GET PRODUCT
  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        const sizes = Array.isArray(data.size)
          ? data.size
          : data.size
            ? JSON.parse(data.size)
            : [];
        setProduct({
          title: data.title || "",
          desc: data.desc || "",
          price: data.price || "",
          discount: data.discount || "",
          color: data.color || "",
          size: sizes.join(", "),
          category: data.category || "",
          gender: data.gender || "",
          qty: data.qty ?? "",
          brand: data.brand?._id || data.brand || "",
          images: [],
        });
        setExistingImages(data.image || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

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

  // Build/clean up preview URLs for newly selected images
  useEffect(() => {
    const urls = product.images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [product.images]);

  const selectedBrand = brands.find((b) => b._id === product.brand);
  const filteredBrands = brands.filter((b) =>
    b.title?.toLowerCase().includes(brandQuery.toLowerCase()),
  );

  const handleImages = (files) => {
    setProduct({ ...product, images: Array.from(files) });
  };

  const removeNewImage = (index) => {
    setProduct({
      ...product,
      images: product.images.filter((_, i) => i !== index),
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
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

      // Only send new images if the user picked replacements;
      // otherwise the backend keeps the existing ones (see updateProduct controller)
      product.images.forEach((file) => {
        formData.append("image", file);
      });

      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert("Product Updated Successfully");
      navigate("/productmanage");
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
      navigate("/productmanage");
    } catch (err) {
      console.log(err);
    }
  };

  const inputClass =
    "w-full border border-white/10 px-4 py-3 rounded-lg bg-[#0f1115] text-white text-sm placeholder:text-gray-600 outline-none focus:border-violet-500/50 transition";
  const labelClass = "text-xs font-semibold text-gray-400 mb-1.5 block";

  if (loading) {
    return (
      <div className="w-full bg-[#171a21] border border-white/5 p-6 rounded-xl flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#171a21] border border-white/5 p-6 rounded-xl">
      <button
        onClick={() => navigate("/productmanage")}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition mb-4"
      >
        <MdArrowBack /> Back to Products
      </button>

      <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
        Catalog
      </p>
      <h2 className="text-2xl font-bold mb-6 text-white">Update Product</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div>
          <label className={labelClass}>Product Title</label>
          <input
            type="text"
            className={inputClass}
            value={product.title}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
            required
          />
        </div>

        {/* Searchable Brand Dropdown */}
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

          {brandOpen && (
            <div className="absolute z-20 mt-2 w-full bg-[#0f1115] border border-white/10 rounded-lg shadow-xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/10">
                <MdSearch className="text-gray-500 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search brand..."
                  value={brandQuery}
                  onChange={(e) => setBrandQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-white placeholder:text-gray-600"
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
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
            className={inputClass}
            value={product.qty}
            onChange={(e) => setProduct({ ...product, qty: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            rows="4"
            className={`${inputClass} resize-none`}
            value={product.desc}
            onChange={(e) => setProduct({ ...product, desc: e.target.value })}
            required
          />
        </div>

        {/* EXISTING IMAGES */}
        {existingImages.length > 0 && (
          <div className="md:col-span-2">
            <label className={labelClass}>Current Images</label>
            <div className="flex gap-3 flex-wrap">
              {existingImages.map((img, i) => (
                <div key={i} className="relative w-20 h-20 shrink-0">
                  <img
                    src={`${API_URL}/product/${img}`}
                    alt="existing"
                    className="w-full h-full object-cover rounded-lg border border-white/10"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Uploading new images below will replace all current images.
            </p>
          </div>
        )}

        {/* NEW IMAGE UPLOAD */}
        <div className="md:col-span-2">
          <label className={labelClass}>Replace Images (optional)</label>
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
                  ? `${product.images.length} new image${product.images.length > 1 ? "s" : ""} selected`
                  : "Click to upload new images"}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Leave empty to keep current images
              </p>
            </div>
            <input
              id="product-images"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImages(e.target.files)}
            />
          </label>
        </div>

        {/* NEW PREVIEWS */}
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
                  onClick={() => removeNewImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center border border-white/10 hover:bg-red-600 transition"
                >
                  <MdClose className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="md:col-span-2 flex gap-3 mt-1">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-5 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-lg font-semibold text-sm transition"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
