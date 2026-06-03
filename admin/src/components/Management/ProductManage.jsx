import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const ProductManage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const getProduct = async () => {
    try {
      const res = await fetch("http://localhost:5000/products/");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const selectProduct = (id) => {
    navigate(`/singleproduct/${id}`);
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-[85%] bg-[#15171cfc] p-6">
      <div className="text-white flex flex-col gap-4">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Product Management</h2>

          <Link
            to="/productmanage/productform"
            className="bg-blue-700 px-4 py-2 rounded-md"
          >
            + New Product
          </Link>
        </div>

        {/* SEARCH */}
        <div className="flex bg-gray-800 rounded-xl items-center px-4 py-3 gap-3">
          <FaSearch />
          <input
            type="text"
            placeholder="Search product..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        {/* TABLE */}
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="py-4">Item</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Size</th>
                <th>Color</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Gender</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-6 text-gray-400">
                    No Products Found
                  </td>
                </tr>
              ) : (
                products.map((item) => {
                  // ✅ SIZE FIX
                  const sizes = Array.isArray(item.size)
                    ? item.size
                    : item.size
                      ? JSON.parse(item.size)
                      : [];

                  return (
                    <tr
                      key={item._id}
                      onClick={() => selectProduct(item._id)}
                      className="border-b border-gray-800 hover:bg-gray-800 cursor-pointer"
                    >
                      <td className="py-4">{item.title}</td>

                      {/* ✅ BRAND FIX */}
                      <td>{item.brand?.title}</td>

                      <td>₹{item.price}</td>

                      {/* ✅ SIZE FIX */}
                      <td>{sizes.join(", ")}</td>

                      <td>{item.color}</td>
                      <td>{item.category}</td>
                      <td>{item.qty}</td>
                      <td>{item.gender}</td>

                      {/* ✅ ACTION FIX */}
                      <td
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProduct(item._id);
                        }}
                        className="text-red-500 text-xl cursor-pointer"
                      >
                        <MdDeleteOutline />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManage;
