import { useState } from "react";

const BrandForm = () => {
  const [brand, setBrand] = useState({
    title: "",
    desc: "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", brand.title);
      formData.append("desc", brand.desc);
      formData.append("image", brand.image);

      console.log("SENDING DATA:", brand);

      const response = await fetch("http://localhost:5000/brands/upload", {
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

      alert("Brand Added Successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full bg-black p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-5 text-white">Add Brand</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6"
        encType="multipart/form-data"
      >
        {/* Brand Title */}
        <input
          type="text"
          placeholder="Brand Title"
          className="border px-3 py-4 rounded bg-black text-white"
          value={brand.title}
          onChange={(e) => setBrand({ ...brand, title: e.target.value })}
          required
        />

        {/* Brand Description */}
        <textarea
          placeholder="Brand Description"
          rows="4"
          className="border px-3 py-3 rounded bg-black text-white"
          value={brand.desc}
          onChange={(e) => setBrand({ ...brand, desc: e.target.value })}
          required
        />

        {/* Brand Image */}
        <input
          type="file"
          accept="image/*"
          className="border px-3 py-3 rounded bg-black text-white"
          onChange={(e) => setBrand({ ...brand, image: e.target.files[0] })}
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-900 text-white py-3 rounded hover:bg-blue-800"
        >
          Save Brand
        </button>
      </form>
    </div>
  );
};

export default BrandForm;
