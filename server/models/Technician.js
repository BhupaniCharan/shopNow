import mongoose from "mongoose";

const technicianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    jobsCompleted: { type: Number, default: 0 },
    performanceScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Technician =
  mongoose.models.technician || mongoose.model("technician", technicianSchema);

export default Technician;
