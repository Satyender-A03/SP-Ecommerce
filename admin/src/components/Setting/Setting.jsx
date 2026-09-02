import React, { useEffect, useState } from "react";
import {
  MdPerson,
  MdStorefront,
  MdNotificationsNone,
  MdLock,
  MdCheck,
} from "react-icons/md";

import API_URL from "../../Constent";

const TABS = [
  { id: "profile", label: "Admin Profile", icon: <MdPerson size={18} /> },
  { id: "store", label: "Store Settings", icon: <MdStorefront size={18} /> },
  {
    id: "notifications",
    label: "Notifications",
    icon: <MdNotificationsNone size={18} />,
  },
  { id: "security", label: "Security", icon: <MdLock size={18} /> },
];

const getToken = () => localStorage.getItem("adminToken");

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingStore, setSavingStore] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profile, setProfile] = useState({ name: "", email: "" });
  const [store, setStore] = useState({
    storeName: "ShopEase",
    supportEmail: "",
    currency: "INR",
    shippingCharge: 50,
  });
  const [notifications, setNotifications] = useState({
    newOrder: true,
    lowStock: true,
    newUser: false,
    marketing: false,
  });
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  // ── Load current profile + store settings on mount ──
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const res = await fetch(`${API_URL}/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const adminData = await res.json();
          setProfile({
            name: adminData.name || "",
            email: adminData.email || "",
          });
          if (adminData.notificationPrefs) {
            setNotifications(adminData.notificationPrefs);
          }
          if (adminData.storeSettings) {
            setStore({
              storeName: adminData.storeSettings.storeName ?? "ShopEase",
              supportEmail: adminData.storeSettings.supportEmail ?? "",
              currency: adminData.storeSettings.currency ?? "INR",
              shippingCharge: adminData.storeSettings.shippingCharge ?? 50,
            });
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 4000);
  };

  // ── Save profile ──
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch(`${API_URL}/admin/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok) {
        showSaved();
      } else {
        showError(data.message || "Failed to save profile");
      }
    } catch (err) {
      showError("Something went wrong");
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Save store settings (persisted on the admin profile) ──
  const handleSaveStore = async () => {
    setSavingStore(true);
    try {
      const res = await fetch(`${API_URL}/admin/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ storeSettings: store }),
      });
      const data = await res.json();
      if (res.ok) {
        showSaved();
      } else {
        showError(data.message || "Failed to save store settings");
      }
    } catch (err) {
      showError("Something went wrong");
    } finally {
      setSavingStore(false);
    }
  };

  // ── Save notification prefs (persisted on the admin profile) ──
  const handleSaveNotifications = async (updated) => {
    setNotifications(updated);
    setSavingNotifications(true);
    try {
      const res = await fetch(`${API_URL}/admin/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ notificationPrefs: updated }),
      });
      if (res.ok) {
        showSaved();
      } else {
        showError("Failed to save notification preferences");
      }
    } catch (err) {
      showError("Something went wrong");
    } finally {
      setSavingNotifications(false);
    }
  };

  // ── Change password ──
  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      showError("Please fill all password fields");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      showError("New passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch(`${API_URL}/admin/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.next,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswords({ current: "", next: "", confirm: "" });
        showSaved();
      } else {
        showError(data.message || "Failed to update password");
      }
    } catch (err) {
      showError("Something went wrong");
    } finally {
      setSavingPassword(false);
    }
  };

  const inputClass =
    "w-full border border-white/10 px-4 py-3 rounded-lg bg-[#0f1115] text-white text-sm placeholder:text-gray-600 outline-none focus:border-violet-500/50 transition";
  const labelClass = "text-xs font-semibold text-gray-400 mb-1.5 block";

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 rounded-full shrink-0 transition relative ${
        checked ? "bg-violet-600" : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
          checked ? "left-5" : "left-1"
        }`}
      />
    </button>
  );

  const SaveButton = ({ onClick, saving, label = "Save Changes" }) => (
    <button
      onClick={onClick}
      disabled={saving}
      className="self-start bg-violet-600 hover:bg-violet-500 disabled:opacity-50 transition px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2"
    >
      {saving && (
        <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      )}
      {saving ? "Saving..." : label}
    </button>
  );

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0f1115] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0f1115] text-white p-8">
      <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">
        Admin
      </p>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6 max-w-4xl">
        {/* Tabs */}
        <div className="flex md:flex-col gap-1 md:w-56 shrink-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-violet-600/15 text-violet-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="flex-1 bg-[#171a21] border border-white/5 rounded-xl p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm mb-5">
              {error}
            </div>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-base font-semibold mb-1">Admin Profile</h2>
                <p className="text-xs text-gray-500">
                  Your name and email as shown across the admin panel.
                </p>
              </div>
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Himanshu Sharma"
                  className={inputClass}
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  placeholder="admin@shopease.com"
                  className={inputClass}
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>
              <SaveButton onClick={handleSaveProfile} saving={savingProfile} />
            </div>
          )}

          {/* STORE */}
          {activeTab === "store" && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-base font-semibold mb-1">Store Settings</h2>
                <p className="text-xs text-gray-500">
                  Basic details customers see and defaults used at checkout.
                </p>
              </div>
              <div>
                <label className={labelClass}>Store Name</label>
                <input
                  type="text"
                  className={inputClass}
                  value={store.storeName}
                  onChange={(e) =>
                    setStore({ ...store, storeName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Support Email</label>
                <input
                  type="email"
                  placeholder="support@shopease.com"
                  className={inputClass}
                  value={store.supportEmail}
                  onChange={(e) =>
                    setStore({ ...store, supportEmail: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Currency</label>
                  <select
                    className={inputClass}
                    value={store.currency}
                    onChange={(e) =>
                      setStore({ ...store, currency: e.target.value })
                    }
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Default Shipping (₹)</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={store.shippingCharge}
                    onChange={(e) =>
                      setStore({ ...store, shippingCharge: e.target.value })
                    }
                  />
                </div>
              </div>
              <SaveButton onClick={handleSaveStore} saving={savingStore} />
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-base font-semibold mb-1">Notifications</h2>
                <p className="text-xs text-gray-500">
                  Choose what you want to be notified about.
                </p>
              </div>

              {[
                {
                  key: "newOrder",
                  label: "New order placed",
                  desc: "Get notified when a customer places an order",
                },
                {
                  key: "lowStock",
                  label: "Low stock alerts",
                  desc: "Get notified when a product falls below 10 units",
                },
                {
                  key: "newUser",
                  label: "New user signups",
                  desc: "Get notified when someone creates an account",
                },
                {
                  key: "marketing",
                  label: "Marketing tips",
                  desc: "Occasional tips on growing your store",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between border-b border-white/5 last:border-0 pb-4 last:pb-0"
                >
                  <div className="pr-4">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle
                    checked={notifications[item.key]}
                    onChange={(val) =>
                      handleSaveNotifications({
                        ...notifications,
                        [item.key]: val,
                      })
                    }
                  />
                </div>
              ))}
              {savingNotifications && (
                <p className="text-xs text-gray-500">Saving...</p>
              )}
            </div>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-base font-semibold mb-1">Security</h2>
                <p className="text-xs text-gray-500">
                  Update the password used to sign in to the admin panel.
                </p>
              </div>
              <div>
                <label className={labelClass}>Current Password</label>
                <input
                  type="password"
                  className={inputClass}
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>New Password</label>
                <input
                  type="password"
                  className={inputClass}
                  value={passwords.next}
                  onChange={(e) =>
                    setPasswords({ ...passwords, next: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Confirm New Password</label>
                <input
                  type="password"
                  className={inputClass}
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                />
              </div>
              <SaveButton
                onClick={handleChangePassword}
                saving={savingPassword}
                label="Update Password"
              />
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
          <MdCheck /> Changes saved
        </div>
      )}
    </div>
  );
};

export default Settings;
