import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheck,
  FiInstagram,
  FiTwitter,
  FiFacebook,
} from "react-icons/fi";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    // Simulate send — replace with your actual API call
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  const inputClass =
    "w-full bg-[#f5f5f5] border border-transparent rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-black transition placeholder-gray-400";

  return (
    <div className="w-full bg-[#e8e8e8] min-h-screen pt-20">
      {/* ── HERO ── */}
      <div className="relative bg-black text-white px-6 md:px-16 py-20 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1400&h=500&fit=crop"
          alt="contact"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-300 font-semibold mb-4">
            Get in Touch
          </p>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-4">
            We'd love to <br />
            <span className="text-white/70">hear from you.</span>
          </h1>
          <p className="text-gray-200 text-base leading-relaxed">
            Have a question, complaint, or just want to say hi? Our team
            typically responds within 24 hours.
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* LEFT — Contact Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
              Contact Info
            </h2>
            <p className="text-gray-500 text-sm">
              Reach us through any of these channels.
            </p>
          </div>

          {[
            {
              icon: <FiMail size={20} />,
              label: "Email",
              value: "support@shopease.in",
              href: "mailto:support@shopease.in",
            },
            {
              icon: <FiPhone size={20} />,
              label: "Phone",
              value: "+91 98765 43210",
              href: "tel:+919876543210",
            },
            {
              icon: <FiMapPin size={20} />,
              label: "Address",
              value: "Uttam Nagar, New Delhi, Delhi 110059",
              href: null,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm"
            >
              <div className="w-11 h-11 bg-black text-white rounded-xl flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-0.5">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm font-semibold text-gray-900 hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Hours */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-3">
              Business Hours
            </p>
            <div className="space-y-2">
              {[
                { day: "Mon – Fri", time: "9:00 AM – 7:00 PM" },
                { day: "Saturday", time: "10:00 AM – 5:00 PM" },
                { day: "Sunday", time: "Closed" },
              ].map((h, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-500">{h.day}</span>
                  <span
                    className={`font-semibold ${h.time === "Closed" ? "text-red-400" : "text-gray-900"}`}
                  >
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-3">
              Follow Us
            </p>
            <div className="flex gap-3">
              {[
                {
                  icon: <FiInstagram size={18} />,
                  label: "Instagram",
                  href: "#",
                },
                { icon: <FiTwitter size={18} />, label: "Twitter", href: "#" },
                {
                  icon: <FiFacebook size={18} />,
                  label: "Facebook",
                  href: "#",
                },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-10 h-10 bg-[#f5f5f5] rounded-xl flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-5">
                  <FiCheck size={28} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Thanks for reaching out. We'll get back to you within 24
                  hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-6 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-gray-900 mb-1">
                  Send a Message
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Fill in the form and we'll respond as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">
                        Your Name
                      </label>
                      <input
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Rahul Verma"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, email: e.target.value }))
                        }
                        placeholder="rahul@email.com"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">
                      Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, subject: e.target.value }))
                      }
                      className={inputClass + " cursor-pointer"}
                    >
                      <option value="">Select a topic</option>
                      <option value="order">Order Issue</option>
                      <option value="return">Return / Refund</option>
                      <option value="product">Product Query</option>
                      <option value="payment">Payment Problem</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">
                      Message
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      placeholder="Tell us how we can help..."
                      rows={5}
                      required
                      className={inputClass + " resize-none"}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-black text-white font-bold text-sm rounded-xl hover:bg-gray-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend size={15} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── MAP ── */}
      <div className="px-6 md:px-16 pb-16 max-w-6xl mx-auto">
        <a
          href="https://www.google.com/maps/search/Uttam+Nagar,+New+Delhi,+Delhi"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl overflow-hidden shadow-sm h-72 relative group cursor-pointer"
        >
          <iframe
            title="ShopEase Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9!2d77.0588!3d28.6295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d053b9c0a7a71%3A0x5a8c8a3b5b5b5b5b!2sUttam%20Nagar%2C%20New%20Delhi%2C%20Delhi%20110059!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="pointer-events-none w-full h-full"
          />
          <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors flex items-end justify-center pb-5">
            <div className="bg-white rounded-2xl px-5 py-3 text-center shadow-lg flex items-center gap-3">
              <FiMapPin size={18} className="text-black shrink-0" />
              <div className="text-left">
                <p className="font-black text-gray-900 text-sm">ShopEase HQ</p>
                <p className="text-gray-400 text-xs">
                  Uttam Nagar, New Delhi · Click to open in Maps
                </p>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default ContactUs;
