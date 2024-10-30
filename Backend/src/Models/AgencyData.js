// models/AgencyUser.js
import mongoose from "mongoose";

const agencyUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

const AgencyUser = mongoose.model("AgencyUser", agencyUserSchema);
export default AgencyUser;
