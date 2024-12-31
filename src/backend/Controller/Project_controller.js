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
    teamMembers, // New field for team members
  } = req.body;

  const { role } = req.user;

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
  if (!project_name || typeof project_name !== "string" || project_name.trim() === "") {
    return res.status(400).json({
      status: false,
      message: "Project name is required and must be a valid string.",
    });
  }

  if (startDate && isNaN(Date.parse(startDate))) {
    return res.status(400).json({
      status: false,
      message: "Invalid start date format.",
    });
  }

  if (endDate && isNaN(Date.parse(endDate))) {
    return res.status(400).json({
      status: false,
      message: "Invalid end date format.",
    });
  }

  if (!estimated_hours || typeof estimated_hours !== "number" || estimated_hours <= 0) {
    return res.status(400).json({
      status: false,
      message: "Estimated hours are required and must be a positive number.",
    });
  }

  if (teamMembers && !Array.isArray(teamMembers)) {
    return res.status(400).json({
      status: false,
      message: "Team members must be an array.",
    });
  }
  const uniqueTeamMembers = new Set(teamMembers);
  if (uniqueTeamMembers.size !== teamMembers.length) {
    return res.status(400).json({
      status: false,
      message: "Duplicate team members are not allowed.",
    });
  }
  try {
    // Create a new project
    const newProject = new ProjectModel({
      project_name,
      project_description,
      project_ownership: req.user.id,
      startDate,
      endDate,
      project_status,
      estimated_hours,
      teamMembers, // Include team members
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
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const projects = await ProjectModel.find({ is_deleted: false })
      .populate("project_ownership", "name mail")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalProjects = await ProjectModel.countDocuments({
      is_deleted: false,
    }); 

    return res.status(200).json({
      status: true,
      data: {
        total: totalProjects,
        projects,
      },
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
      .populate("project_ownership", "name mail")
      .populate("teamMembers", "name mail");

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
  const { id } = req.body;
  console.log(req.query);
  const {
    project_name,
    startDate,
    endDate,
    estimated_hours,
    teamMembers,
    ...otherFields
  } = req.body;

  if (!id) {
    return res.status(400).json({
      status: false,
      message: "Project ID is required.",
    });
  }

  // Validation
  if (project_name && (typeof project_name !== "string" || project_name.trim() === "")) {
    return res.status(400).json({
      status: false,
      message: "Project name must be a valid string.",
    });
  }

  if (startDate && isNaN(Date.parse(startDate))) {
    return res.status(400).json({
      status: false,
      message: "Invalid start date format.",
    });
  }

  if (endDate && isNaN(Date.parse(endDate))) {
    return res.status(400).json({
      status: false,
      message: "Invalid end date format.",
    });
  }

  if (estimated_hours && (typeof estimated_hours !== "number" || estimated_hours <= 0)) {
    return res.status(400).json({
      status: false,
      message: "Estimated hours must be a positive number.",
    });
  }

  if (teamMembers) {
    if (!Array.isArray(teamMembers)) {
      return res.status(400).json({
        status: false,
        message: "Team members must be an array.",
      });
    }

    // Check for duplicate team members in the input
    const uniqueTeamMembers = new Set(teamMembers);
    if (uniqueTeamMembers.size !== teamMembers.length) {
      return res.status(400).json({
        status: false,
        message: "Duplicate team members are not allowed.",
      });
    }
  }

  try {
    // Retrieve the existing project
    const existingProject = await ProjectModel.findById(id);

    if (!existingProject || existingProject.is_deleted) {
      return res.status(404).json({
        status: false,
        message: "Project not found or already deleted.",
      });
    }

    // Merge existing team members with new ones, avoiding duplicates
    const updatedTeamMembers = teamMembers
      ? [...new Set([...(existingProject.teamMembers || []), ...teamMembers])]
      : existingProject.teamMembers;

    // Update the project with merged team members and other fields
    const updatedProject = await ProjectModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...otherFields,
          project_name,
          startDate,
          endDate,
          estimated_hours,
          teamMembers: updatedTeamMembers,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while updating the project.",
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
