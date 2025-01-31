import FileModel from "../Model/document_schema.js";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid"; // For unique filename generation

// Upload a single file
export const uploadFile = async (req, res) => {
  try {
    // Ensure the user is authenticated and has the correct role (HR or Admin)
    if (!req.user || (req.user.role !== "manager" && req.user.role !== "admin")) {
      return res.status(403).json({ message: "Permission denied" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, description, accessRoles } = req.body;

    // Ensure required fields are provided
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Generate a unique filename to avoid conflicts
    const fileUrl = `/uploads/${uuidv4()}_${req.file.originalname}`;

    // Ensure req.user._id is populated correctly
    const uploadedBy = req.user.id; // This should be set by the authentication middleware

    if (!uploadedBy) {
      return res.status(400).json({ message: "UploadedBy user ID is missing" });
    }

    // Save file details to database
    const newFile = new FileModel({
      title,
      description,
      fileUrl,
      uploadedBy,
      accessRoles,
    });

    await newFile.save();

    res.status(200).json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    console.error("Error uploading file: ", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all files accessible by the user
export const getAllFiles = async (req, res) => {
  try {
    // console.log(req.body)
    // Get the user's role from the authenticated session or JWT token
    const userRole = req.user.role;  // Assuming `req.user.role` contains the user's role

    // Find all files where the user role is included in the accessRoles array
    const files = await FileModel.find({
      accessRoles: { $in: [userRole, "all"] },  // "all" means everyone can access
    });

    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get file by ID with access control
export const getFileById = async (req, res) => {
  try {
    const userRole = req.user.role;

    const file = await FileModel.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the file's accessRoles array includes the user's role
    if (!file.accessRoles.includes(userRole) && !file.accessRoles.includes("all")) {
      return res.status(403).json({ message: "Permission denied" });
    }

    res.status(200).json(file);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



// Update a file
export const updateFile = async (req, res) => {
  try {
    const { fileId } = req.params; // File ID from URL params to identify the file
    const { title, description, uploadedBy, accessRoles } = req.body; // New details for the file

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Find the file by ID
    const existingFile = await FileModel.findById(fileId);
    if (!existingFile) {
      return res.status(404).json({ message: "File not found" });
    }

    // If an old file exists, delete it (from the file system)
    const oldFilePath = path.join(__dirname, "uploads", existingFile.fileUrl);
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath); // Delete the old file
    }

    // Generate a new unique filename for the new file
    const newFileUrl = `/uploads/${uuidv4()}_${req.file.originalname}`;

    // Update the file record in the database with the new file and other details
    existingFile.title = title || existingFile.title;
    existingFile.description = description || existingFile.description;
    existingFile.fileUrl = newFileUrl; // Update with the new file URL
    existingFile.uploadedBy = uploadedBy || existingFile.uploadedBy;
    existingFile.accessRoles = accessRoles || existingFile.accessRoles;

    // Save the updated file record
    await existingFile.save();

    // Send the response
    res.status(200).json({ message: "File updated successfully", file: existingFile });
  } catch (error) {
    console.error("Error updating file: ", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteFiles = async (req, res) => {
  try {
      const userRole = req.user.role; // Get the role from the authenticated user
      const fileId = req.params.id;  // Get file ID from request parameters

      // Check if the user has the required role
      if (userRole !== "admin" && userRole !== "hr") {
          return res.status(403).json({ message: "Unauthorized! Only admin and HR can delete files." });
      }

      // Find the file by ID
      const file = await FileModel.findById(fileId);
      if (!file) {
          return res.status(404).json({ message: "File not found" });
      }

      // Delete the file
      await FileModel.findByIdAndDelete(fileId);

      res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ message: "Internal server error", error });
  }
};
