export const isManager = (req, res, next) => {
  if (!req.user || (req.user.role !== "manager" && req.user.role !== "admin")) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
