import express from "express";
import authTechnician from "../middlewares/authTechnician.js";
import {
  login,
  register,
  isAuth,
  logout,
  getAssignedRequests,
} from "../controllers/technicianController.js";

const technicianRouter = express.Router();

// Note: In production, registration would be restricted. Enabled here for prototype/demo.
technicianRouter.post("/register", register);

technicianRouter.post("/login", login);
technicianRouter.get("/is-auth", authTechnician, isAuth);
technicianRouter.get("/logout", authTechnician, logout);
technicianRouter.get("/requests", authTechnician, getAssignedRequests);

export default technicianRouter;
