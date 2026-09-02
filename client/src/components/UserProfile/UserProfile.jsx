import React, { useContext, useState } from "react";
import { Auth } from "../../Context/Auth";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiHeart,
  FiLogOut,
  FiEdit2,
  FiCheck,
  FiX,
  FiChevronRight,
} from "react-icons/fi";
import API_URL from "../../Constent";

const UserProfile = () => {
  const { user, logout, setUser } = useContext(Auth);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({});

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const startEdit = () => {
    const nameParts = (user?.name || "").split(" ");
    setForm({
      fName: user?.fName || nameParts[0] || "",
      lName: user?.lName || nameParts.slice(1).join(" ") || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setError("");
    setEditMode(true);
  };

  const handleUpdate = async () => {
    if (!form.fName || !form.email) {
      setError("Name and email are required.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const response = await fetch(`${API_URL}/auth/update/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        // 🔥 Server se aaya hua data use karo — sab fields aayenge
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        if (setUser) setUser(updatedUser);
        setEditMode(false);
      } else {
        setError(data.message || "Update failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const avatarLetter =
    user?.fName?.charAt(0)?.toUpperCase() ||
    user?.name?.charAt(0)?.toUpperCase() ||
    "U";
  const fullName =
    user?.name || `${user?.fName || ""} ${user?.lName || ""}`.trim() || "User";

  return (
    <div className="w-full min-h-screen bg-[#e8e8e8] px-6 md:px-10 pt-20 pb-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">
        My Profile
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Avatar card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-black shrink-0">
              {avatarLetter}
            </div>
            <div className="flex-1">
              {editMode ? (
                <div className="flex gap-2">
                  <input
                    value={form.fName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, fName: e.target.value }))
                    }
                    placeholder="First name"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black"
                  />
                  <input
                    value={form.lName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, lName: e.target.value }))
                    }
                    placeholder="Last name"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </div>
              ) : (
                <>
                  <p className="text-xl font-black text-gray-900">{fullName}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    @{user?.uName || "username"}
                  </p>
                </>
              )}
            </div>
            {!editMode ? (
              <button
                onClick={startEdit}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition shrink-0"
              >
                <FiEdit2 /> Edit
              </button>
            ) : (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-60"
                >
                  <FiCheck /> {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setError("");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
                >
                  <FiX /> Cancel
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          {/* Personal Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
              Personal Info
            </h3>
            <div className="flex flex-col gap-4">
              {[
                {
                  icon: <FiUser className="text-gray-400" />,
                  label: "Full Name",
                  value: fullName,
                  editKey: null,
                },
                {
                  icon: <FiMail className="text-gray-400" />,
                  label: "Email",
                  value: user?.email || "—",
                  editKey: "email",
                  type: "email",
                },
                {
                  icon: <FiPhone className="text-gray-400" />,
                  label: "Phone",
                  value: user?.phone || "—",
                  editKey: "phone",
                },
                {
                  icon: <FiMapPin className="text-gray-400" />,
                  label: "Address",
                  value: user?.address || "—",
                  editKey: "address",
                },
              ].map((field, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    {field.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium">
                      {field.label}
                    </p>
                    {editMode && field.editKey ? (
                      <input
                        type={field.type || "text"}
                        value={form[field.editKey] || ""}
                        maxLength={field.editKey === "phone" ? 10 : undefined}
                        onChange={(e) => {
                          const v =
                            field.editKey === "phone"
                              ? e.target.value.replace(/\D/g, "")
                              : e.target.value;
                          setForm((p) => ({ ...p, [field.editKey]: v }));
                        }}
                        className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-black transition"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">
                        {editMode && field.editKey === null
                          ? `${form.fName || ""} ${form.lName || ""}`.trim() ||
                            "—"
                          : field.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 px-6 pt-5 pb-3">
              Quick Links
            </h3>
            {[
              {
                icon: <FiShoppingBag size={18} className="text-gray-600" />,
                label: "My Orders",
                sub: "View your order history",
                onClick: () => navigate("/order"),
                color: "bg-gray-100",
              },
              {
                icon: <FiHeart size={18} className="text-red-500" />,
                label: "Wishlist",
                sub: "Items you saved",
                onClick: () => navigate("/wishlist"),
                color: "bg-red-50",
              },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.onClick}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-0"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}
                >
                  {item.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-400">{item.sub}</p>
                </div>
                <FiChevronRight className="text-gray-300" />
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
              Account
            </h3>
            <div className="flex items-center gap-3 py-2">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <FiUser size={16} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Username</p>
                <p className="text-sm font-semibold text-gray-800">
                  @{user?.uName || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-2">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <FiMail size={16} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-semibold text-gray-800 truncate max-w-[160px]">
                  {user?.email || "—"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white text-red-500 border border-red-200 py-3.5 rounded-2xl font-bold text-sm hover:bg-red-50 transition shadow-sm"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
