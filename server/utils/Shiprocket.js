const https = require("https");

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL || "upt98830@gmail.com";
const SHIPROCKET_PASSWORD =
  process.env.SHIPROCKET_PASSWORD || "ATnw@LB1&2!P8C!%8TE&7zC8pBYt1NR^";

let cachedToken = null;
let tokenExpiry = null;

// ── Get Token ────────────────────────────────────────────────────────────────
const getToken = () => {
  return new Promise((resolve, reject) => {
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
      return resolve(cachedToken);
    }

    const body = JSON.stringify({
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD,
    });
    const options = {
      hostname: "apiv2.shiprocket.in",
      path: "/v1/external/auth/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.token) {
            cachedToken = parsed.token;
            tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // 9 days
            console.log("✅ Shiprocket token obtained");
            resolve(cachedToken);
          } else {
            reject(new Error("Token not found: " + data));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
};

// ── Create Order ─────────────────────────────────────────────────────────────
const createShiprocketOrder = async (orderData) => {
  const token = await getToken();

  const body = JSON.stringify({
    order_id: orderData.orderId,
    order_date: new Date().toISOString().split("T")[0],
    pickup_location: "Primary",
    channel_id: "",
    comment: "ShopEase Order",
    billing_customer_name: orderData.name,
    billing_last_name: "",
    billing_address: orderData.address,
    billing_address_2: "",
    billing_city: orderData.city || "Delhi",
    billing_pincode: orderData.pincode,
    billing_state: orderData.state || "Delhi",
    billing_country: "India",
    billing_email: orderData.email,
    billing_phone: orderData.phone,
    shipping_is_billing: true,
    order_items: orderData.items.map((item) => ({
      name: item.title || "Product",
      sku: item.productId,
      units: item.qty || 1,
      selling_price: item.price,
      discount: 0,
      tax: 0,
      hsn: 0,
    })),
    payment_method: "Prepaid",
    shipping_charges: 50,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
    sub_total: orderData.subtotal,
    length: 10,
    breadth: 10,
    height: 10,
    weight: 0.5,
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: "apiv2.shiprocket.in",
      path: "/v1/external/orders/create/adhoc",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          console.log(
            "📦 Shiprocket full response:",
            JSON.stringify(parsed, null, 2),
          );
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
};

// ── Track Order ───────────────────────────────────────────────────────────────
const trackOrder = async (awbCode) => {
  const token = await getToken();

  return new Promise((resolve, reject) => {
    const options = {
      hostname: "apiv2.shiprocket.in",
      path: `/v1/external/courier/track/awb/${awbCode}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
};

module.exports = { getToken, createShiprocketOrder, trackOrder };
