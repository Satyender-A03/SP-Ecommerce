const allowedOrigins = require("./allowedOrigin");

const corsOptions = {
  origin: function (origin, cb) {
    if (allowedOrigins !== -1 || !origin) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed By CORS"));
    }
  },
};
module.exports = corsOptions;
