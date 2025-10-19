import jwt from "jsonwebtoken";

const authTechnician = async (req, res, next) => {
  const { techToken } = req.cookies || {};
  if (!techToken) {
    return res
      .status(401)
      .json({ success: false, message: "Technician not authorized" });
  }
  try {
    const decoded = jwt.verify(techToken, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res
        .status(401)
        .json({ success: false, message: "Technician not authorized" });
    }
    req.technician = { technicianId: decoded.id };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired technician token" });
  }
};

export default authTechnician;
