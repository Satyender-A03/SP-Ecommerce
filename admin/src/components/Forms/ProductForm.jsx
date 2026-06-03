import { useState, useEffect } from "react";

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

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full bg-black p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-5 text-white">Add Product</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <input
          type="text"
          placeholder="Product Title"
          className="border px-3 py-3 rounded bg-black text-white"
          value={product.title}
          onChange={(e) => setProduct({ ...product, title: e.target.value })}
          required
        />

        <select
          className="border px-3 py-3 rounded bg-black text-white"
          value={product.brand}
          onChange={(e) => setProduct({ ...product, brand: e.target.value })}
          required
        >
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>
              {b.title}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Price"
          className="border px-3 py-3 rounded bg-black text-white"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Discount %"
          className="border px-3 py-3 rounded bg-black text-white"
          value={product.discount}
          onChange={(e) => setProduct({ ...product, discount: e.target.value })}
        />

        <input
          type="text"
          placeholder="Color"
          className="border px-3 py-3 rounded bg-black text-white"
          value={product.color}
          onChange={(e) => setProduct({ ...product, color: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Size (S, M, L)"
          className="border px-3 py-3 rounded bg-black text-white"
          value={product.size}
          onChange={(e) => setProduct({ ...product, size: e.target.value })}
          required
        />

        <select
          className="border px-3 py-3 rounded bg-black text-white"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          <option value="Shoes">Shoes</option>
          <option value="Fashion">Fashion</option>
          <option value="Electronics">Electronics</option>
        </select>

        <select
          className="border px-3 py-3 rounded bg-black text-white"
          value={product.gender}
          onChange={(e) => setProduct({ ...product, gender: e.target.value })}
          required
        >
          <option value="">Select Gender</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Unisex">Unisex</option>
        </select>

        <input
          type="number"
          placeholder="Quantity"
          className="border px-3 py-3 rounded bg-black text-white"
          value={product.qty}
          onChange={(e) => setProduct({ ...product, qty: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          className="border px-3 py-3 rounded bg-black text-white md:col-span-2"
          value={product.desc}
          onChange={(e) => setProduct({ ...product, desc: e.target.value })}
          required
        />

        {/* MULTIPLE IMAGE INPUT */}
        <input
          type="file"
          multiple
          accept="image/*"
          className="border px-3 py-3 rounded bg-black text-white md:col-span-2"
          onChange={(e) =>
            setProduct({
              ...product,
              images: Array.from(e.target.files),
            })
          }
          required
        />

        {/* PREVIEW */}
        <div className="flex gap-3 flex-wrap md:col-span-2">
          {product.images.map((img, i) => (
            <img
              key={i}
              src={URL.createObjectURL(img)}
              alt="preview"
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>

        <button
          type="submit"
          className="md:col-span-2 bg-blue-700 py-3 rounded text-white"
        >
          Save Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
