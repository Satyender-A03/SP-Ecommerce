import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineStorefront } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../../Constent";

// Small deterministic color set so each brand avatar gets a stable accent
const AVATAR_COLORS = [
  "bg-violet-500/15 text-violet-300",
  "bg-sky-500/15 text-sky-300",
  "bg-amber-500/15 text-amber-300",
  "bg-emerald-500/15 text-emerald-300",
  "bg-rose-500/15 text-rose-300",
];

const avatarColor = (id) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const BrandManage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();

  // 🔥 GET DATA
  const getBrand = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/brands/`);
      const data = await res.json();
      setBrands(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrand();
  }, []);

  // 🔥 NAVIGATE
  const selectBrand = (id) => {
    navigate(`/brandmanage/updatebrand/${id}`);
  };

  // 🔥 DELETE
  const deleteBrand = async (id) => {
    try {
      await fetch(`${API_URL}/brands/${id}`, {
        method: "DELETE",
      });
      setBrands((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    } finally {
      setConfirmId(null);
    }
  };

  const filteredBrands = useMemo(() => {
    if (!query.trim()) return brands;
    const q = query.toLowerCase();
    return brands.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) || b.desc?.toLowerCase().includes(q),
    );
  }, [brands, query]);

  return (
    <div className="w-full min-h-screen bg-[#0f1115] p-8 flex flex-col items-center">
      <div className="w-full text-white flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
              Catalog
            </p>
            <h2 className="text-2xl font-bold tracking-tight">
              Brand Management
            </h2>
          </div>

          <div className="flex gap-3">
            <Link
              to="/brandmanage/brandform"
              className="bg-violet-600 hover:bg-violet-500 transition px-4 py-2.5 rounded-lg font-semibold text-sm"
            >
              + New Brand
            </Link>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex bg-[#171a21] border border-white/5 rounded-xl items-center px-4 py-3 gap-3 focus-within:border-violet-500/50 transition">
          <FaSearch className="text-gray-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by brand name or description..."
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
        <div className="bg-[#171a21] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-white/[0.03] text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4 w-[28%] text-left font-semibold">
                  Brand
                </th>
                <th className="py-4 px-2 w-[28%] text-left font-semibold">
                  Brand ID
                </th>
                <th className="py-4 px-2 w-[34%] text-left font-semibold">
                  Description
                </th>
                <th className="py-4 px-2 w-[10%] text-center font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse shrink-0" />
                        <div className="h-3.5 w-24 bg-white/5 rounded animate-pulse" />
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="h-3.5 w-32 bg-white/5 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-2">
                      <div className="h-3.5 w-40 bg-white/5 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-2" />
                  </tr>
                ))
              ) : filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <MdOutlineStorefront className="text-4xl text-gray-600" />
                      <p className="text-gray-400 font-medium">
                        {query ? `No brands match "${query}"` : "No brands yet"}
                      </p>
                      {!query && (
                        <Link
                          to="/brandmanage/brandform"
                          className="text-violet-400 text-sm font-semibold hover:text-violet-300 transition"
                        >
                          Add your first brand →
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBrands.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => selectBrand(item._id)}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(item._id)}`}
                        >
                          {item.title?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="font-semibold truncate">
                          {item.title}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-2 text-gray-500 font-mono text-xs truncate">
                      {item._id}
                    </td>

                    <td
                      className="py-3.5 px-2 text-gray-400 truncate"
                      title={item.desc}
                    >
                      {item.desc || (
                        <span className="text-gray-600 italic">
                          No description
                        </span>
                      )}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && brands.length > 0 && (
          <p className="text-xs text-gray-500">
            Showing {filteredBrands.length} of {brands.length} brand
            {brands.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default BrandManage;
