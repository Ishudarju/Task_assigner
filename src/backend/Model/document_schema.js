import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Name of the file
    description: { type: String },          // Optional file description
    fileUrl: { type: String, required: true }, // File location (cloud storage or server)
    uploadedBy: { 
      type: mongoose.Schema.Types.ObjectId, // Referencing the HRUser model
      ref: 'user',                        // This tells MongoDB to use the 'HRUser' collection
      required: true 
    }, // Who uploaded the file (HR user ID)
    accessRoles: {
      type: [String], // Array of roles that can access the file (e.g., ["all", "hr", "manager"])
      default: ["all"], // Default to "all" (visible to everyone)
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const FileModel = mongoose.model("File", fileSchema);
export default FileModel;
