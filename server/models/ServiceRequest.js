import mongoose from "mongoose";

const updateSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "requested",
        "accepted",
        "en_route",
        "started",
        "paused",
        "completed",
        "cancelled",
      ],
    },
    message: { type: String },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const serviceRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "technician",
      default: null,
    },
    description: { type: String, required: true },
    deviceType: { type: String },
    category: { type: String },
    address: { type: String, required: true },
    preferredTime: { type: Date },
    status: {
      type: String,
      enum: [
        "requested",
        "accepted",
        "en_route",
        "started",
        "paused",
        "completed",
        "cancelled",
      ],
      default: "requested",
    },
    estimatedDurationMinutes: { type: Number, default: 60 },
    updates: { type: [updateSchema], default: [] },
  },
  { timestamps: true }
);

serviceRequestSchema.index({ userId: 1, createdAt: -1 });
serviceRequestSchema.index({ technicianId: 1, status: 1 });

const ServiceRequest =
  mongoose.models["service-request"] ||
  mongoose.model("service-request", serviceRequestSchema);

export default ServiceRequest;
