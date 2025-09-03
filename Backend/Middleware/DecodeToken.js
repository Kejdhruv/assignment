// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;  
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
} 

export const adminAuth = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }
  next();
};