const jwt = require("jsonwebtoken");

// Works for both customer and admin tokens — both are signed with the same
// ACCESS_TOKEN_SECRET. The "type" claim (set at login) just tells us how to
// label the decoded info on the request (req.admin vs req.userInfo).
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);

        return res.status(403).json({
          message: "Forbidden",
        });
      }

      if (decoded.type === "admin") {
        req.admin = {
          id: decoded.id,
          role: decoded.role,
        };
      } else {
        req.userInfo = {
          id: decoded.id,
          userName: decoded.userName,
        };
      }

      next();
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "SERVER ERROR",
    });
  }
};

module.exports = verifyJWT;
