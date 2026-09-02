import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { MdOutlinePeopleAlt, MdDeleteOutline } from "react-icons/md";

import API_URL from "../../Constent";

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

const UserManage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();

  const getUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/users`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      await fetch(`${API_URL}/auth/users/${id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.log(err);
    } finally {
      setConfirmId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter((u) => {
      const name = `${u.fName || ""} ${u.lName || ""}`.toLowerCase();
      return (
        name.includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        u.uName?.toLowerCase().includes(q)
      );
    });
  }, [users, query]);

  return (
    <div className="w-full min-h-screen bg-[#0f1115] p-8">
      <div className="text-white flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
              Accounts
            </p>
            <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          </div>
          {!loading && users.length > 0 && (
            <span className="text-xs text-gray-500">
              {users.length} registered user{users.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* SEARCH */}
        <div className="flex bg-[#171a21] border border-white/5 rounded-xl items-center px-4 py-3 gap-3 focus-within:border-violet-500/50 transition">
          <FaSearch className="text-gray-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, username, email, or phone..."
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
          <table className="w-full text-sm min-w-[820px]">
            <thead className="bg-white/[0.03] text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4 text-left font-semibold">User</th>
                <th className="py-4 px-2 text-left font-semibold">Email</th>
                <th className="py-4 px-2 text-left font-semibold">Phone</th>
                <th className="py-4 px-2 text-left font-semibold">Joined</th>
                <th className="py-4 px-2 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse shrink-0" />
                        <div className="h-3.5 w-28 bg-white/5 rounded animate-pulse" />
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="h-3.5 w-36 bg-white/5 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-2">
                      <div className="h-3.5 w-24 bg-white/5 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-2">
                      <div className="h-3.5 w-20 bg-white/5 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-2" />
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <MdOutlinePeopleAlt className="text-4xl text-gray-600" />
                      <p className="text-gray-400 font-medium">
                        {query ? `No users match "${query}"` : "No users yet"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const fullName =
                    `${u.fName || ""} ${u.lName || ""}`.trim() ||
                    u.uName ||
                    "User";
                  return (
                    <tr
                      key={u._id}
                      onClick={() => navigate(`/users/${u._id}`)}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(u._id)}`}
                          >
                            {fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{fullName}</p>
                            {u.uName && (
                              <p className="text-xs text-gray-500 truncate">
                                @{u.uName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-2 text-gray-400 truncate">
                        {u.email || "—"}
                      </td>

                      <td className="py-3.5 px-2 text-gray-400">
                        {u.phone || "—"}
                      </td>

                      <td className="py-3.5 px-2 text-gray-500 text-xs">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      <td
                        className="py-3.5 px-2 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {confirmId === u._id ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => deleteUser(u._id)}
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
                            onClick={() => setConfirmId(u._id)}
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

        {!loading && users.length > 0 && (
          <p className="text-xs text-gray-500">
            Showing {filteredUsers.length} of {users.length} user
            {users.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserManage;
