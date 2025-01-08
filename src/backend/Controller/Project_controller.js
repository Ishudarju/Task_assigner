import { ProjectModel } from "../Model/Project_schema.js";
import { TaskModel } from "../Model/Task_scheme.js";
import { MilestoneModel } from "../Model/Milestone_schema.js"; // Ensure you import the Milestone model
import { Mongoose } from "mongoose";
// Create a new project

export const createProject = async (req, res) => {
  const {
    project_name,
    project_description,
    project_ownership,
    startDate,
    endDate,
    project_status,
    estimated_hours,
    milestones, // Milestones added
  } = req.body;
  console.log(req.body);
  const { role } = req.user;
  const converthours = parseInt(estimated_hours);

  // Authorization check
  if (role !== "admin" && role !== "manager") {
    return res.status(403).json({
      status: false,
      message: "No authorization to create a project",
    });
  }

  // Validation
  if (!project_name) {
    return res.status(400).json({
      status: false,
      message: "Project name is required",
    });
  }

  if (
    !project_name ||
    typeof project_name !== "string" ||
    project_name.trim() === ""
  ) {
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

  if (
    !estimated_hours ||
    typeof converthours !== "number" ||
    estimated_hours <= 0
  ) {
    return res.status(400).json({
      status: false,
      message: "Estimated hours are required and must be a positive number.",
    });
  }

  if (milestones && !Array.isArray(milestones)) {
    return res.status(400).json({
      status: false,
      message: "Milestones must be an array.",
    });
  }

  try {
    // Step 1: Create the project first (without milestones)
    const newProject = new ProjectModel({
      project_name,
      project_description,
      project_ownership,
      startDate,
      endDate,
      project_status,
      estimated_hours,
    });

    const project = await newProject.save();

    // Step 2: Create milestones and associate them with the project
    const milestoneIdsArray = [];

    for (const milestoneName of milestones) {
      // Insert new milestone and associate it with the project
      const milestone = new MilestoneModel({
        name: milestoneName,
        project: project._id, // Associate milestone with the new project
      });
      await milestone.save();

      // Store the milestone ObjectId
      milestoneIdsArray.push(milestone._id);
    }

    // Step 3: Update the project with the milestone references
    project.milestones = milestoneIdsArray;
    await project.save();

    return res.status(201).json({
      status: true,
      message: "Project and milestones created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error creating project and milestones:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while creating the project and milestones",
    });
  }
};

// export const createProject = async (req, res) => {
//   const {
//     project_name,
//     project_description,
//     project_ownership,
//     startDate,
//     endDate,
//     project_status,
//     estimated_hours,
//     milestones, // Milestones added
//   } = req.body;
//   console.log(req.body);
//   const { role } = req.user;
//   const converthours = parseInt(estimated_hours);

//   // Authorization check
//   if (role !== "admin" && role !== "manager") {
//     return res.status(403).json({
//       status: false,
//       message: "No authorization to create a project",
//     });
//   }

//   // Validation
//   if (!project_name) {
//     return res.status(400).json({
//       status: false,
//       message: "Project name is required",
//     });
//   }

//   if (
//     !project_name ||
//     typeof project_name !== "string" ||
//     project_name.trim() === ""
//   ) {
//     return res.status(400).json({
//       status: false,
//       message: "Project name is required and must be a valid string.",
//     });
//   }

//   if (startDate && isNaN(Date.parse(startDate))) {
//     return res.status(400).json({
//       status: false,
//       message: "Invalid start date format.",
//     });
//   }

//   if (endDate && isNaN(Date.parse(endDate))) {
//     return res.status(400).json({
//       status: false,
//       message: "Invalid end date format.",
//     });
//   }

//   if (
//     !estimated_hours ||
//     typeof converthours !== "number" ||
//     estimated_hours <= 0
//   ) {
//     return res.status(400).json({
//       status: false,
//       message: "Estimated hours are required and must be a positive number.",
//     });
//   }

//   if (milestones && !Array.isArray(milestones)) {
//     return res.status(400).json({
//       status: false,
//       message: "Milestones must be an array.",
//     });
//   }

//   try {
//     // Create a new project
//     const newProject = new ProjectModel({
//       project_name,
//       project_description,
//       project_ownership,
//       startDate,
//       endDate,
//       project_status,
//       estimated_hours,
//       milestones, // Include milestones
//     });

//     const project = await newProject.save();

//     return res.status(201).json({
//       status: true,
//       message: "Project created successfully",
//       data: project,
//     });
//   } catch (error) {
//     console.error("Error creating project:", error);
//     return res.status(500).json({
//       status: false,
//       message: "An error occurred while creating the project",
//     });
//   }
// };

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
// export const getAllProjects = async (req, res) => {
//   try {
//     // Fetching projects with active status and populating ownership details
//     const projects = await ProjectModel.find({ is_deleted: false })
//       .populate("project_ownership", "name mail");

//     const totalProjects = await ProjectModel.countDocuments({
//       is_deleted: false,
//     });
//     console.log(projects)
//     return res.status(200).json({
//       status: true,
//       projects,
//       total: totalProjects, // Corrected key
//       message: "Projects fetched successfully",
//     });
//   } catch (error) {
//     console.error("Error fetching projects:", error.message);
//     return res.status(500).json({
//       status: false,
//       message: "An error occurred while fetching projects",
//     });
//   }
// };


export const getAllProjectsPagination = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const projects = await ProjectModel.find({ is_deleted: false })

      .populate("project_ownership", "name mail")
      .populate("milestones", "name status") // Populate milestones details
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
    console.error("Error fetching projects:", error.message);
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching projects",
    });
  }
};
export const getAllProject = async (req, res) => {
  try {
    if (req.user.role == "admin" || req.user.role == "manager") {
      const projects = await ProjectModel.find({ is_deleted: false })
        .select("_id project_name project_ownership") // Fetch only non-deleted projects
        .populate("project_ownership", "name mail")
        .populate("milestones", "name status"); // Populate ownership details with specific fields

      if (!projects.length) {
        return res.status(404).json({ message: "No projects found" });
      }
      return res.status(200).json({ success: true, projects });
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Fetch a single project by ID
// export const getProjectById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const project = await ProjectModel.findById(id)
//       .populate("project_ownership", "name mail")
//       .populate("teamMembers", "name mail")
//       .populate("milestones", "name status"); // Populate milestones details

//     if (!project || project.is_deleted) {
//       return res.status(404).json({
//         status: false,
//         message: "Project not found",
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       data: project,
//     });
//   } catch (error) {
//     console.error("Error fetching project:", error);
//     return res.status(500).json({
//       status: false,
//       message: "An error occurred while fetching the project",
//     });
//   }
// };
export const getProjectById = async (req, res) => {
  const { id } = req.body;
  console.log(req.params);
  console.log(req.body);
  // Validate ObjectId
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).json({
  //     status: false,
  //     message: "Invalid project ID format",
  //   });
  // }

  try {
    // Fetch project with populated fields
    console.log(id);
    const project = await ProjectModel.findById(id)
      .populate("project_ownership", "name mail")
      .populate("milestones", "name status");

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
    console.error("Error fetching project by ID:", {
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching the project",
    });
  }
};

// Update a project
export const updateProject = async (req, res) => {
  console.log(req.body);
  const {
    _id,
    project_name,
    project_description,
    project_ownership,
    startDate,
    endDate,
    estimated_hours,
    project_status,
    // teamMembers,
    ...otherFields
  } = req.body;
  console.log(req.body);
  const converthours = parseInt(estimated_hours);
  if (!_id) {
    return res.status(400).json({
      status: false,
      message: "Project ID is required.",
    });
  }

  // Validation
  if (
    project_name &&
    (typeof project_name !== "string" || project_name.trim() === "")
  ) {
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

  if (
    estimated_hours &&
    (typeof converthours !== "number" || estimated_hours <= 0)
  ) {
    return res.status(400).json({
      status: false,
      message: "Estimated hours must be a positive number.",
    });
  }

  // if (teamMembers) {
  //   if (!Array.isArray(teamMembers)) {
  //     return res.status(400).json({
  //       status: false,
  //       message: "Team members must be an array.",
  //     });
  //   }

  //   // Check for duplicate team members in the input
  //   const uniqueTeamMembers = new Set(teamMembers);
  //   if (uniqueTeamMembers.size !== teamMembers.length) {
  //     return res.status(400).json({
  //       status: false,
  //       message: "Duplicate team members are not allowed.",
  //     });
  //   }
  // }

  try {
    // Retrieve the existing project
    const existingProject = await ProjectModel.findById(_id);

    if (!existingProject || existingProject.is_deleted) {
      return res.status(404).json({
        status: false,
        message: "Project not found or already deleted.",
      });
    }

    // Merge existing team members with new ones, avoiding duplicates
    // const updatedTeamMembers = teamMembers
    //   ? [...new Set([...(existingProject.teamMembers || []), ...teamMembers])]
    //   : existingProject.teamMembers;

    // Update the project with merged team members and other fields
    const updatedProject = await ProjectModel.findByIdAndUpdate(
      _id,
      {
        $set: {
          ...otherFields,
          project_name,
          project_description,
          project_ownership: project_ownership.id,
          startDate,
          endDate,
          estimated_hours: converthours,
          project_status,
          // teamMembers: updatedTeamMembers,
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

export const updateProjectnew = async (req, res) => {
  const {
    _id,
    project_name,
    project_description,
    project_ownership,
    startDate,
    endDate,
    estimated_hours,
    project_status,
    milestones, // Adding milestones to the request body
    ...otherFields
  } = req.body;

  const converthours = parseInt(estimated_hours);

  if (!_id) {
    return res.status(400).json({
      status: false,
      message: "Project ID is required.",
    });
  }

  // Validation
  if (
    project_name &&
    (typeof project_name !== "string" || project_name.trim() === "")
  ) {
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

  if (
    estimated_hours &&
    (typeof converthours !== "number" || estimated_hours <= 0)
  ) {
    return res.status(400).json({
      status: false,
      message: "Estimated hours must be a positive number.",
    });
  }

  // Handle milestones if provided
  if (milestones && !Array.isArray(milestones)) {
    return res.status(400).json({
      status: false,
      message: "Milestones must be an array.",
    });
  }

  try {
    // Retrieve the existing project
    const existingProject = await ProjectModel.findById(_id);

    if (!existingProject || existingProject.is_deleted) {
      return res.status(404).json({
        status: false,
        message: "Project not found or already deleted.",
      });
    }

    // Update milestones if provided (this can be a separate operation)
    let updatedMilestones = existingProject.milestones;
    if (milestones) {
      // If new milestones are provided, update or add them
      updatedMilestones = await MilestoneModel.updateMany(
        { _id: { $in: milestones.map((id) => mongoose.Types.ObjectId(id)) } },
        { $set: { project: _id } }
      );
    }

    // Update the project with new fields
    const updatedProject = await ProjectModel.findByIdAndUpdate(
      _id,
      {
        $set: {
          ...otherFields,
          project_name,
          project_description,
          project_ownership: project_ownership.id,
          startDate,
          endDate,
          estimated_hours: converthours,
          project_status,
          milestones: updatedMilestones, // Updated milestones
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

// export const getTaskRelatedToProject = async (req, res) => {
//   const { projectId } = req.body;

//   try {
//     const tasks = await TaskModel.find({
//       project: projectId,
//       is_deleted: false,
//     });

//     if (!tasks.length) {
//       return res.status(404).json({
//         status: false,
//         message: "No tasks found for this project",
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       tasks,
//       message: "Tasks fetched successfully",
//     });
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     return res.status(500).json({
//       status: false,
//       message: "An error occurred while fetching tasks",
//     });
//   }
// };
export const getTaskRelatedToProject = async (req, res) => {
  const { projectId } = req.body;

  try {
    const tasks = await TaskModel.find({
      project: projectId,
      is_deleted: false,
    })
      .populate("project", "project_name") // Populate project details
      .populate("assigned_to", "name mail") // Populate assigned_to details
      .populate("assigned_by", "name mail") // Populate assigned_by details
      .populate("report_to", "name mail"); // Populate report_to details

    if (!tasks.length) {
      return res.status(404).json({
        status: false,
        message: "No tasks found for this project",
      });
    }

    return res.status(200).json({
      status: true,
      tasks,
      message: "Tasks fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching tasks",
    });
  }
};
