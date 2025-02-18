import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not Authorized" });
    }
  } else {
    return res.status(401).json({ message: "No Token Provided" });
  }
};

const isBuilder = (req, res, next) => {
  if (req.user.role === "builder") {
    next();
  } else {
    return res.status(403).json({ message: "Only Builders Can Post Jobs" });
  }
};

export { protect, isBuilder };