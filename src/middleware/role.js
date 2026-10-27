module.exports = function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        status: false,
        message: "Unauthorized"
      });
    }

    // Admins always have access
    if (req.user.role === "admin") {
      return next();
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        status: false,
        message: `Forbidden: requires one of [${allowedRoles.join(", ")}] role`
      });
    }

    next();
  };
};
