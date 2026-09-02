import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdCloudUpload, MdArrowBack } from "react-icons/md";

import API_URL from "../../Constent";

const UpdateBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [brand, setBrand] = useState({
    title: "",
    desc: "",
    image: null,
  });
  const [existingImage, setExistingImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // GET BRAND
  useEffect(() => {
    const getBrand = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/brands/${id}`);
        const data = await res.json();
        setBrand({
          title: data.title || "",
          desc: data.desc || "",
          image: null,
        });
        setExistingImage(data.image || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getBrand();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBrand({ ...brand, image: file });
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", brand.title);
      formData.append("desc", brand.desc);
      if (brand.image) formData.append("image", brand.image);

      const res = await fetch(`${API_URL}/brands/${id}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert("Brand Updated Successfully");
      navigate("/brandmanage");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this brand permanently?")) return;
    try {
      await fetch(`${API_URL}/brands/${id}`, { method: "DELETE" });
      navigate("/brandmanage");
    } catch (err) {
      console.log(err);
    }
  };

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
        onClick={() => navigate("/brandmanage")}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition mb-4"
      >
        <MdArrowBack /> Back to Brands
      </button>

      <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
        Catalog
      </p>
      <h2 className="text-2xl font-bold mb-6 text-white">Update Brand</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
        {/* Brand Title */}
        <div>
          <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
            Brand Title
          </label>
          <input
            type="text"
            placeholder="e.g. Nike"
            className="w-full border border-white/10 px-4 py-3 rounded-lg bg-[#0f1115] text-white text-sm placeholder:text-gray-600 outline-none focus:border-violet-500/50 transition"
            value={brand.title}
            onChange={(e) => setBrand({ ...brand, title: e.target.value })}
            required
          />
        </div>

        {/* Brand Description */}
        <div>
          <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
            Description
          </label>
          <textarea
            placeholder="What makes this brand distinct..."
            rows="4"
            className="w-full border border-white/10 px-4 py-3 rounded-lg bg-[#0f1115] text-white text-sm placeholder:text-gray-600 outline-none focus:border-violet-500/50 transition resize-none"
            value={brand.desc}
            onChange={(e) => setBrand({ ...brand, desc: e.target.value })}
            required
          />
        </div>

        {/* Brand Image */}
        <div>
          <label className="text-xs font-semibold text-gray-400 mb-1.5 block">
            Brand Logo
          </label>
          <label
            htmlFor="brand-image"
            className="flex items-center gap-4 border border-dashed border-white/15 rounded-lg px-4 py-4 cursor-pointer hover:border-violet-500/50 transition bg-[#0f1115]"
          >
            {preview || existingImage ? (
              <img
                src={preview || `${API_URL}/brand/${existingImage}`}
                alt="Preview"
                className="w-14 h-14 rounded-lg object-cover shrink-0 border border-white/10"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <MdCloudUpload className="text-gray-500 text-2xl" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm text-gray-300 font-medium truncate">
                {brand.image ? brand.image.name : "Click to replace logo"}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Leave empty to keep current image
              </p>
            </div>
            <input
              id="brand-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-1">
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

export default UpdateBrand;
