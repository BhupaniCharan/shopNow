import express from "express";
import authUser from "../middlewares/authUser.js";
import authTechnician from "../middlewares/authTechnician.js";
import {
  createRequest,
  getMyRequests,
  getRequestById,
  getOpenRequests,
  claimRequest,
  updateStatus,
  addTechnicianUpdate,
  suggest,
} from "../controllers/requestController.js";
import jwt from "jsonwebtoken";

const requestRouter = express.Router();

// helper: allow either user or technician auth
const eitherAuth = (req, res, next) => {
  try {
    const { token, techToken } = req.cookies || {};
    const secret = process.env.JWT_SECRET;

    if (token) {
      try {
        const d = jwt.verify(token, secret);
        if (d?.id) req.user = { userId: d.id };
      } catch (_) {}
    }
    if (techToken) {
      try {
        const d = jwt.verify(techToken, secret);
        if (d?.id) req.technician = { technicianId: d.id };
      } catch (_) {}
    }

    if (req.user?.userId || req.technician?.technicianId) return next();
    return res.status(401).json({ success: false, message: "Not Authorized" });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }
};

// User routes
requestRouter.post("/", authUser, createRequest);
requestRouter.get("/", authUser, getMyRequests);
requestRouter.get("/:id", eitherAuth, getRequestById);

// Technician routes
requestRouter.get("/open/list", authTechnician, getOpenRequests);
requestRouter.post("/:id/claim", authTechnician, claimRequest);
requestRouter.patch("/:id/status", authTechnician, updateStatus);
requestRouter.post("/:id/updates", authTechnician, addTechnicianUpdate);

// AI Suggestion (optional)
requestRouter.post("/suggest", suggest);

export default requestRouter;
