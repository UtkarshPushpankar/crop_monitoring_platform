const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyUser = async (req, res, next) => {
  console.log("Cookies received:", req.cookies);
  const token = req.cookies?.token;
  
  if (!token) return res.status(401).json({ error: "No token." });

  try {
    console.log("Token to verify:", token);
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", decoded);
    
    const user = await User.findById(decoded.id).select("_id name email");
    console.log("User found:", user);
    
    if (!user) return res.status(401).json({ error: "User not found." });

    req.user = user;
    next();
  } catch (err) {
    console.log("JWT verification error:", err.message); // This will show the exact error
    res.status(401).json({ error: "Invalid token." });
  }
};
module.exports = verifyUser;
