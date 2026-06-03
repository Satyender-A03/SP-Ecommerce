const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json("Unauthorized");
  }

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET),
      (err, decoded) => {
        if (err) {
          console.log(err);
          return res.status(401).json({ error: "Unauthorized" });
        }
        req.userInfo = {};
        req.userInfo.id = decoded.id;
        req.userInfo.userName = decoded.userName;
        next();
      };
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = verifyJWT;
