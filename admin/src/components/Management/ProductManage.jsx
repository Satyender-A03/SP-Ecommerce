import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineInventory2 } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

import API_URL from "../../Constent";

const ProductManage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const getProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/products/`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const selectProduct = (id) => {
    navigate(`/productmanage/updateproduct/${id}`);
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });
      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    } finally {
      setConfirmId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.brand?.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q),
    );
  }, [products, query]);

  const stockBadge = (qty) => {
    if (!qty || qty === 0)
      return "bg-red-500/10 text-red-400 border-red-500/20";
    if (qty <= 10) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  };

  return (
    <div className="w-full min-h-screen bg-[#0f1115] p-8">
      <div className="text-white flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
              Catalog
            </p>
            <h2 className="text-2xl font-bold tracking-tight">
              Product Management
            </h2>
          </div>

          <Link
            to="/productmanage/productform"
            className="bg-violet-600 hover:bg-violet-500 transition px-4 py-2.5 rounded-lg font-semibold text-sm"
          >
            + New Product
          </Link>
        </div>

        {/* SEARCH */}
        <div className="flex bg-[#171a21] border border-white/5 rounded-xl items-center px-4 py-3 gap-3 focus-within:border-violet-500/50 transition">
          <FaSearch className="text-gray-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product, brand, or category..."
            className="w-full bg-transparent outline-none text-sm placeholder:text-gray-500"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-gray-500 hover:text-white transition shrink-0"
            >
              Clear
            </button>
          )}
        </div>

        {/* TABLE */}
        <div className="bg-[#171a21] border border-white/5 rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-white/[0.03] text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4 text-left font-semibold">Item</th>
                <th className="py-4 px-2 text-left font-semibold">Brand</th>
                <th className="py-4 px-2 text-left font-semibold">Price</th>
                <th className="py-4 px-2 text-left font-semibold">Size</th>
                <th className="py-4 px-2 text-left font-semibold">Color</th>
                <th className="py-4 px-2 text-left font-semibold">Category</th>
                <th className="py-4 px-2 text-left font-semibold">Stock</th>
                <th className="py-4 px-2 text-left font-semibold">Gender</th>
                <th className="py-4 px-2 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 animate-pulse shrink-0" />
                        <div className="h-3.5 w-24 bg-white/5 rounded animate-pulse" />
                      </div>
                    </td>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="py-4 px-2">
                        <div className="h-3.5 w-14 bg-white/5 rounded animate-pulse" />
                      </td>
                    ))}
                    <td className="py-4 px-2" />
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <MdOutlineInventory2 className="text-4xl text-gray-600" />
                      <p className="text-gray-400 font-medium">
                        {query
                          ? `No products match "${query}"`
                          : "No products yet"}
                      </p>
                      {!query && (
                        <Link
                          to="/productmanage/productform"
                          className="text-violet-400 text-sm font-semibold hover:text-violet-300 transition"
                        >
                          Add your first product →
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => {
                  const sizes = Array.isArray(item.size)
                    ? item.size
                    : item.size
                      ? JSON.parse(item.size)
                      : [];

                  return (
                    <tr
                      key={item._id}
                      onClick={() => selectProduct(item._id)}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                            {item.image?.[0] ? (
                              <img
                                src={`${API_URL}/product/${item.image[0]}`}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <MdOutlineInventory2 className="text-gray-600 text-sm" />
                              </div>
                            )}
                          </div>
                          <span className="font-semibold truncate">
                            {item.title}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-2 text-gray-400 truncate">
                        {item.brand?.title || "—"}
                      </td>

                      <td className="py-3.5 px-2 font-semibold">
                        ₹{item.price}
                      </td>

                      <td className="py-3.5 px-2 text-gray-400 truncate">
                        {sizes.length ? sizes.join(", ") : "—"}
                      </td>

                      <td className="py-3.5 px-2 text-gray-400">
                        {item.color || "—"}
                      </td>
                      <td className="py-3.5 px-2 text-gray-400 truncate">
                        {item.category || "—"}
                      </td>
                      <td className="py-3.5 px-2">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full border ${stockBadge(item.qty)}`}
                        >
                          {item.qty ?? 0}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-gray-400">
                        {item.gender || "—"}
                      </td>

                      <td className="py-3.5 px-2 text-center">
                        {confirmId === item._id ? (
                          <div
                            className="flex items-center justify-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => deleteProduct(item._id)}
                              className="text-xs font-bold text-red-400 hover:text-red-300 transition"
                            >
                              Confirm
                            </button>
                            <span className="text-gray-700">/</span>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="text-xs text-gray-500 hover:text-white transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmId(item._id);
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto hover:bg-red-500/10 transition"
                          >
                            <MdDeleteOutline className="text-red-400 text-lg" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && products.length > 0 && (
          <p className="text-xs text-gray-500">
            Showing {filteredProducts.length} of {products.length} product
            {products.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductManage;
