import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Technician from "../models/Technician.js";
import ServiceRequest from "../models/ServiceRequest.js";

const secret = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, password, skills = [] } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing details" });
    }
    const existing = await Technician.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: "Technician already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const technician = await Technician.create({
      name,
      email,
      password: hashed,
      skills,
    });
    const token = jwt.sign({ id: technician._id }, secret, { expiresIn: "7d" });
    res.cookie("techToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      technician: { id: technician._id, name: technician.name, email: technician.email },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ success: false, message: "Email and password are required" });
    }
    const technician = await Technician.findOne({ email });
    if (!technician) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, technician.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: technician._id }, secret, { expiresIn: "7d" });
    res.cookie("techToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      technician: { id: technician._id, name: technician.name, email: technician.email },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuth = async (req, res) => {
  try {
    // middleware ensures token is valid
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("techToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getAssignedRequests = async (req, res) => {
  try {
    const technicianId = req.technician.technicianId;
    const requests = await ServiceRequest.find({ technicianId }).sort({ createdAt: -1 });
    return res.json({ success: true, requests });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
