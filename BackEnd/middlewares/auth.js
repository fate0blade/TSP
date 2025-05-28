const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = function (allowedRoles) {
  allowedRoles = allowedRoles || [];

  return async function (req, res, next) {
    try {
      const token = req.cookies.jwt;
      console.log("Token:", token); // Debugging line to check the token

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      console.log("Decoded user:", req.user); // Debugging line to check the decoded user

      console.log("Allowed roles:", allowedRoles);
      
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token", error: error.message });
    }
  };
};

module.exports = auth;
