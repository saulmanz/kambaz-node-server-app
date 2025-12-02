import mongoose from "mongoose";
const AssignmentSchema = new mongoose.Schema({
   _id: String,
   title: String,
   course: String,
   available: String,
   due: String,
   points: Number,
    role: {
      type: String,
      enum: ["ASSIGNMENTS"],
      default: "ASSIGNMENTS",
    },
}, { collection: "assignments" });

export default AssignmentSchema;