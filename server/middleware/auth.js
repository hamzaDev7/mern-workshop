const jwt = require("jsonwebtoken");

function protect(req, res, next) {
  let token = req.cookies.token; // 1. browser

  const header = req.headers["authorization"];
  if (!token && header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1]; // 2. Postman
  }

  if (!token)
    return res.status(401).json({ msg: "Not authorised — no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next(); // go to the route
  } catch (err) {
    res.status(401).json({ msg: "Token invalid or expired" });
  }
}

module.exports = { protect };
