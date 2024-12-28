import { ProjectModel } from "../Model/Project_schema.js";

// Create a new project
export const createProject = async (req, res) => {
  const {
    project_name,
    project_description,
    startDate,
    endDate,
    project_status,
    estimated_hours,
  } = req.body;

  const { role } = req.user; // Extract role from the authenticated user

  // Authorization check
  if (role !== "admin" && role !== "manager") {
    return res
      .status(403)
      .json({ status: false, message: "No authorization to create a project" });
  }

  // Validation
  if (!project_name) {
    return res.status(400).json({
      status: false,
      message: "Project name is required",
    });
  }
  console.log(req.user);
  try {
    // Create a new project
    const newProject = new ProjectModel({
      project_name,
      project_description,
      project_ownership : req.user.id,
      startDate,
      endDate,
      project_status,
      estimated_hours,
    });

    const project = await newProject.save();

    return res.status(201).json({
      status: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while creating the project",
    });
  }
};

// Fetch all projects
// export const getAllProjects = async (req, res) => {
//   try {
//     const projects = await ProjectModel.find({ is_deleted: false }).populate(
//       "project_ownership",
//       "name email"
//     ); // Populating team member details
//     const totalProjects = await ProjectModel.countDocuments({
//       is_deleted: false,
//     });

//     return res.status(200).json({
//       status: true,
//       data: projects,
//       totl: totalProjects,
//       message: "Projects fetched successfully",
//     });
//   } catch (error) {
//     console.error("Error fetching projects:", error);
//     return res.status(500).json({
//       status: false,
//       message: "An error occurred while fetching projects",
//     });
//   }
// };
export const getAllProjects = async (req, res) => {
  try {
    // Fetching projects with active status and populating ownership details
    const projects = await ProjectModel.find({ is_deleted: false })
      .populate("project_ownership", "name mail");

    // Counting total active projects
    const totalProjects = await ProjectModel.countDocuments({ is_deleted: false });

    return res.status(200).json({
      status: true,
      data: projects,
      total: totalProjects, // Corrected key
      message: "Projects fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching projects:", error.message); // Improved logging
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching projects",
    });
  }
};


// Fetch a single project by ID
export const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await ProjectModel.findById(id)
      .populate("teamMembers", "name email")
      .populate("tasks", "task_name status");

    if (!project || project.is_deleted) {
      return res.status(404).json({
        status: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      status: true,
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching the project",
    });
  }
};

// Update a project
export const updateProject = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const project = await ProjectModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!project || project.is_deleted) {
      return res.status(404).json({
        status: false,
        message: "Project not found or already deleted",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while updating the project",
    });
  }
};

// Soft delete a project
export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await ProjectModel.findByIdAndUpdate(
      id,
      { $set: { is_deleted: true } },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        status: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while deleting the project",
    });
  }
};
