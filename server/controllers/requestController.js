import ServiceRequest from "../models/ServiceRequest.js";
import { suggestCategoryAndDuration } from "../utils/ai.js";

export const createRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      description,
      deviceType,
      category: categoryInput,
      address,
      preferredTime,
    } = req.body;

    if (!description || !address) {
      return res.json({ success: false, message: "Description and address are required" });
    }

    const suggestion = suggestCategoryAndDuration({ description, deviceType });
    const category = categoryInput || suggestion.category;
    const estimatedDurationMinutes = suggestion.estimatedDurationMinutes;

    const created = await ServiceRequest.create({
      userId,
      description,
      deviceType,
      category,
      address,
      preferredTime,
      estimatedDurationMinutes,
      updates: [
        { status: "requested", message: "Request created" },
      ],
    });

    return res.json({ success: true, request: created, suggestion: { category, estimatedDurationMinutes } });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.userId;
    const requests = await ServiceRequest.find({ userId }).sort({ createdAt: -1 });
    return res.json({ success: true, requests });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ServiceRequest.findById(id);
    if (!request) return res.status(404).json({ success: false, message: "Not found" });

    const userId = req.user?.userId;
    const technicianId = req.technician?.technicianId;
    const isOwner = userId && String(request.userId) === String(userId);
    const isAssignedTech = technicianId && String(request.technicianId) === String(technicianId);
    if (!isOwner && !isAssignedTech) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return res.json({ success: true, request });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getOpenRequests = async (req, res) => {
  try {
    const open = await ServiceRequest.find({ technicianId: null, status: "requested" }).sort({ createdAt: -1 });
    return res.json({ success: true, requests: open });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const claimRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const technicianId = req.technician.technicianId;

    const request = await ServiceRequest.findById(id);
    if (!request) return res.status(404).json({ success: false, message: "Not found" });
    if (request.technicianId) {
      return res.json({ success: false, message: "Already assigned" });
    }

    request.technicianId = technicianId;
    request.status = "accepted";
    request.updates.push({ status: "accepted", message: "Technician accepted the job" });
    await request.save();

    return res.json({ success: true, request });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const technicianId = req.technician.technicianId;

    const allowed = ["accepted", "en_route", "started", "paused", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }

    const request = await ServiceRequest.findById(id);
    if (!request) return res.status(404).json({ success: false, message: "Not found" });
    if (String(request.technicianId) !== String(technicianId)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    request.status = status;
    request.updates.push({ status, message: `Status updated to ${status}` });
    await request.save();

    return res.json({ success: true, request });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const addTechnicianUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const technicianId = req.technician.technicianId;

    const request = await ServiceRequest.findById(id);
    if (!request) return res.status(404).json({ success: false, message: "Not found" });
    if (String(request.technicianId) !== String(technicianId)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    request.updates.push({ status: request.status, message });
    await request.save();

    return res.json({ success: true, request });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const suggest = async (req, res) => {
  try {
    const { description = "", deviceType = "" } = req.body;
    const suggestion = suggestCategoryAndDuration({ description, deviceType });
    return res.json({ success: true, suggestion });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
