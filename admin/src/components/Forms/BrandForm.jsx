import { useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import API_URL from "../../Constent";

const BrandForm = () => {
  const [brand, setBrand] = useState({
    title: "",
    desc: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

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
      formData.append("image", brand.image);

      console.log("SENDING DATA:", brand);

      const response = await fetch(`${API_URL}/brands/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("RESPONSE:", data);

      if (!response.ok || data.success === false) {
        alert(data.message || "Brand already exists");
        return;
      }
      setBrand({
        title: "",
        desc: "",
        image: null,
      });
      setPreview(null);

      alert("Brand Added Successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full bg-[#171a21] border border-white/5 p-6 rounded-xl">
      <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
        Catalog
      </p>
      <h2 className="text-2xl font-bold mb-6 text-white">Add Brand</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5"
        encType="multipart/form-data"
      >
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
            {preview ? (
              <img
                src={preview}
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
                {brand.image ? brand.image.name : "Click to upload logo"}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">PNG, JPG up to 5MB</p>
            </div>
            <input
              id="brand-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              required
            />
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 mt-1"
        >
          {saving && (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          {saving ? "Saving..." : "Save Brand"}
        </button>
      </form>
    </div>
  );
};

export default BrandForm;
