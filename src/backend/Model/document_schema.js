// import mongoose from "mongoose";

// const fileSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true }, // Name of the file
//     description: { type: String },          // Optional file description
//     fileUrl: { type: String, required: true }, // File location (cloud storage or server)
//     fileName: { type: String, required: true }, // Store the original file name
//     uploadedBy: { 
//       type: mongoose.Schema.Types.ObjectId, // Referencing the HRUser model
//       ref: 'user',                        // This tells MongoDB to use the 'HRUser' collection
//       required: true 
//     }, // Who uploaded the file (HR user ID)
//     accessRoles: {
//       type: [String], // Array of roles that can access the file (e.g., ["all", "hr", "manager"])
//       default: ["all"], // Default to "all" (visible to everyone)
//     },
//     createdAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// const FileModel = mongoose.model("File", fileSchema);
// export default FileModel;




import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // File title
    description: { type: String }, // Optional file description
    attachments: {
      file_name: { type: String, trim: true, required: true }, // Original file name
      file_url: { type: String, trim: true, required: true }, // File path or URL
      uploaded_at: { type: Date, default: Date.now }, // Upload timestamp
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the User model
      required: true,
    },
    accessRoles: {
      type: [String], // Array of roles that can access the file
      default: ["all"], // Default visibility to "all"
    },
  },
  { timestamps: true }
);

const FileModel = mongoose.model("File", fileSchema);
export default FileModel;
