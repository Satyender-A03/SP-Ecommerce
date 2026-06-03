import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdDeleteOutline, MdNotificationsNone } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const BrandManage = () => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  // 🔥 GET DATA
  const getBrand = async () => {
    try {
      const res = await fetch("http://localhost:5000/brands/");
      const data = await res.json();
      setBrands(data);
    } catch (err) {
      console.log(err.message);
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
      await fetch(`http://localhost:5000/brands/${id}`, {
        method: "DELETE",
      });

      setBrands((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-[85%] bg-[#15171cfc] p-6 flex flex-col items-center">
      <div className="w-full text-white rounded-xl flex flex-col gap-4">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Brand Management</h2>

          <div className="flex gap-3">
            <Link
              to="/brandmanage/brandform"
              className="bg-blue-700 px-4 py-2 rounded-md font-semibold"
            >
              + New Brand
            </Link>
            <Link
              to="/brandmanage/updatebrand"
              className="bg-blue-700 px-4 py-2 rounded-md font-semibold"
            >
              + Update Brand
            </Link>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex bg-gray-800 rounded-xl items-center px-4 py-3 gap-3">
          <FaSearch />
          <input
            type="text"
            placeholder="Search brand..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        {/* TABLE */}
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <table className="w-full text-sm table-fixed">
            {/* HEAD */}
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="py-4 w-[20%]">Brand</th>
                <th className="py-4 w-[30%]">Brand ID</th>
                <th className="py-4 w-[40%]">Description</th>
                <th className="py-4 w-[10%] text-center">Action</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {brands.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    No Brands Found
                  </td>
                </tr>
              ) : (
                brands.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => selectBrand(item._id)}
                    className="border-b border-gray-800 hover:bg-gray-800 transition cursor-pointer"
                  >
                    <td className="py-4 px-2">{item.title}</td>

                    <td className="py-4 px-2 text-blue-400 truncate">
                      {item._id}
                    </td>

                    {/* ✅ Description controlled */}
                    <td className="py-4 px-2 truncate" title={item.desc}>
                      {item.desc}
                    </td>

                    {/* ✅ Action centered */}
                    <td
                      className="py-4 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBrand(item._id);
                      }}
                    >
                      <MdDeleteOutline className="text-red-500 text-xl mx-auto hover:scale-110 transition" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BrandManage;
