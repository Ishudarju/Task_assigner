import ProjectModel from "../Model/Project_schema.js";
import { TaskModel } from "../Model/Task_scheme.js";
import MilestoneModel from "../Model/Milestone_schema.js";
// Ensure you import the Milestone model
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
    milestones,
  } = req.body;

  const { role } = req.user;
  const estimatedHours = parseInt(estimated_hours, 10);

  // Authorization check
  if (role !== "admin" && role !== "manager") {
    return res.status(403).json({
      status: false,
      message: "No authorization to create a project",
    });
  }

  // Validation
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

  if (!estimated_hours || isNaN(estimatedHours) || estimatedHours <= 0) {
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
    // Step 1: Create the project
    const newProject = new ProjectModel({
      project_name,
      project_description,
      project_ownership,
      startDate,
      endDate,
      project_status,
      estimated_hours: estimatedHours,
    });

    const project = await newProject.save();

    // Step 2: Create milestones and associate them with the project
    if (milestones && milestones.length > 0) {
      const milestoneDocuments = milestones.map((milestoneName) => ({
        name: milestoneName,
        project: project._id,
      }));

      const createdMilestones = await MilestoneModel.insertMany(
        milestoneDocuments
      );

      // Update project with milestone references
      project.milestones = createdMilestones.map((milestone) => milestone._id);
      await project.save();
    }

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

// export const getAllProjectsPagination = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;

//     const pageNumber = parseInt(page, 10);
//     const limitNumber = parseInt(limit, 10);

//     const projects = await ProjectModel.find({ is_deleted: false })

//       .populate("project_ownership", "name mail")
//       .populate("milestones", "name status") // Populate milestones details
//       .sort({ createdAt: -1 })
//       .skip((pageNumber - 1) * limitNumber)
//       .limit(limitNumber);

//     const totalProjects = await ProjectModel.countDocuments({
//       is_deleted: false,
//     });

//     return res.status(200).json({
//       status: true,
//       data: {
//         total: totalProjects,
//         projects,
//       },
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




// Function to calculate project progress


// export const getProjectProgress = async (projectId) => {
//   const project = await ProjectModel.findById(projectId);
//   if (!project) {
//     throw new Error("Project not found");
//   }

//   // Fetch all tasks related to the project
//   const tasks = await TaskModel.find({ project: projectId });

//   // Calculate total hours spent on the project
//   let totalHoursSpent = 0;
//   tasks.forEach((task) => {
//     task.daily_updates.forEach((update) => {
//       totalHoursSpent += update.hours_spent;
//     });
//   });

//   // Calculate the percentage of project completion
//   const percentageSpent = ((totalHoursSpent / project.estimated_hours) * 100).toFixed(2);

//   return { totalHoursSpent, percentageSpent };
// };

// // Controller function for route
// export const getProgressByRole = async (req, res) => {
//   try {
//     const { id: projectId } = req.params;
//     const { role } = req.user; // Assume `req.user` contains role information

//     if (!["admin", "manager", "user", "member","team lead"].includes(role)) {
//       return res.status(403).json({ message: "Access denied" });
//     }
 

//     const { totalHoursSpent, percentageSpent } = await getProjectProgress(projectId);

//     return res.status(200).json({
//       role,
//       projectId,
//       totalHoursSpent,
//       percentageSpent,
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };






// export const calculateProjectProgress = async (req, res) => {
//   const { projectId } = req.params; // Project ID passed as a route parameter
//   const { role } = req.user; // Assume role is available in req.user (e.g., "Admin", "Manager", etc.)

//   // Check access for allowed roles
//   const allowedRoles = ["admin", "user", "manager", "tl"];
//   if (!allowedRoles.includes(role)) {
//     return res.status(403).json({
//       status: false,
//       message: "You are not authorized to access this information.",
//     });
//   }

//   try {
//     // Find the project by its ID
//     const project = await ProjectModel.findById(projectId);

//     if (!project) {
//       return res.status(404).json({
//         status: false,
//         message: "Project not found",
//       });
//     }

//     // Get all tasks related to this project
//     const tasks = await TaskModel.find({ project: projectId });

//     // Calculate total hours spent from all tasks
//     const totalHoursSpent = tasks.reduce((total, task) => {
//       return (
//         total +
//         task.daily_updates.reduce(
//           (taskTotal, update) => taskTotal + (update.hours_spent || 0),
//           0
//         )
//       );
//     }, 0);

//     // Calculate the progress percentage
//     const estimatedHours = project.estimated_hours; // Make sure your project schema has this field
//     if (!estimatedHours || estimatedHours <= 0) {
//       return res.status(400).json({
//         status: false,
//         message: "Invalid estimated hours for the project",
//       });
//     }

//     const percentageSpent = Math.min((totalHoursSpent / estimatedHours) * 100, 100).toFixed(2);
//     const remainingPercentage = (100 - percentageSpent).toFixed(2);

//     // Return the calculated progress
//     return res.status(200).json({
//       status: true,
//       message: "Project progress calculated successfully",
//       data: {
//         projectId: project._id,
//         totalHoursSpent,
//         estimatedHours,
//         percentageSpent,
//         remainingPercentage,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: false,
//       message: "Error calculating project progress",
//     });
//   }
// };


export const calculateProjectProgress = async (req, res) => {
  const { projectId } = req.body; // Get projectId from the request body
  const { role } = req.user; // Assume user's role is extracted from JWT or session

  // Access Control
  const allowedRoles = ["member","team lead","manager","hr","director","tester"];
  if (!allowedRoles.includes(role)) {
    return res.status(403).json({
      status: false,
      message: "You are not authorized to access this information",
    });
  }

  try {
    // Fetch the project
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({
        status: false,
        message: "Project not found",
      });
    }

    // Fetch all tasks associated with the project
    const tasks = await TaskModel.find({ project: projectId });

    // Calculate the total hours spent using `daily_updates` from all tasks
    const totalHoursSpent = tasks.reduce((total, task) => {
      const taskHours = task.daily_updates.reduce(
        (sum, update) => sum + (update.hours_spent || 0),
        0
      );
      return total + taskHours;
    }, 0);

    // Calculate the percentage of estimated hours
    const estimatedHours = project.estimated_hours || 1; // Prevent division by zero
    const percentageSpent = (totalHoursSpent / estimatedHours) * 100;

    // Remaining percentage
    const remainingPercentage = 100 - percentageSpent;

    // Return success response with calculated values
    return res.status(200).json({
      status: true,
      message: "Project progress calculated successfully",
      data: {
        projectId,
        projectName: project.project_name,
        estimatedHours,
        totalHoursSpent,
        percentageSpent: percentageSpent.toFixed(2), // Rounded to 2 decimals
        remainingPercentage: remainingPercentage.toFixed(2), // Rounded to 2 decimals
      },
    });
  } catch (error) {
    console.error("Error calculating project progress:", error);
    return res.status(500).json({
      status: false,
      message: "Error calculating project progress",
    });
  }
};









export const getAllProject = async (req, res) => {
  try {
    if (req.user.role == "admin") {
      const projects = await ProjectModel.find({ is_deleted: false })
        .select("_id project_name project_ownership") // Fetch only non-deleted projects
        .populate("project_ownership", "name mail")
        .populate("milestones", "name status"); // Populate ownership details with specific fields

      if (!projects.length) {
        return res.status(404).json({ message: "No projects found" });
      }
      return res.status(200).json({ success: true, projects });
    } else {
      if (req.user.role == "manager") {
        const projects = await ProjectModel.find({
          is_deleted: false,
          project_ownership: req.user._id,
        })
          .select("_id project_name project_ownership") // Fetch only non-deleted projects
          .populate("project_ownership", "name mail")
          .populate("milestones", "name status"); // Populate ownership details with specific fields
      }
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

export const getAllProjectsPagination = async (req, res) => {
  try {
    const { page, limit, status, search = "" } = req.query;

    const { role, id: userId } = req.user;

    const filter = { is_deleted: false };

    // Role-based filtering
    if (role === "manager" || role === "team lead") {
      filter.project_ownership = userId;
    }

    // Status filtering
    if (status) {
      const validStatuses = [
        "Completed",
        "In Progress",
        "Not Started",
        "Pending",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: false,
          message: `Invalid status provided. Valid statuses are: ${validStatuses.join(
            ", "
          )}`,
        });
      }
      filter.project_status = status;
    }

    // Search filtering
    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i"); // Case-insensitive search
      filter.$or = [
        { project_name: { $regex: searchRegex } }, // Search by project name
        { project_description: { $regex: searchRegex } }, // Search by project description
      ];
    }

    console.log("Filter used:", JSON.stringify(filter, null, 2));

    let projects;
    let totalProjects;

    // Pagination logic
    if (page && limit) {
      const pageNumber = Math.max(1, parseInt(page, 10));
      const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10)));

      projects = await ProjectModel.find(filter)
        .populate("project_ownership", "name mail")
        .populate("milestones", "name status")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean();

      totalProjects = await ProjectModel.countDocuments(filter);
    } else {
      // Non-paginated results
      projects = await ProjectModel.find(filter)
        .populate("project_ownership", "name mail")
        .populate("milestones", "name status")
        .sort({ createdAt: -1 })
        .lean();

      totalProjects = projects.length;
    }

    console.log("Projects found:", projects);

    return res.status(200).json({
      status: true,
      data: {
        total: totalProjects,
        projects,
      },
      message: "Projects fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching projects",
    });
  }
};

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
  const { _id, milestones, ...updateData } = req.body;
const { role } = req.user;
  try {
    if (!["manager", "admin"].includes(role)) {
      return res.status(403).json({ error: "Access permissions Denied." });
    }
    // Update project fields (excluding milestones)
    const updatedProject = await ProjectModel.findByIdAndUpdate(
      _id,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Handle milestones if they are provided
    if (milestones) {
      for (let milestone of milestones) {
        if (milestone._id) {
          // Update existing milestone
          await MilestoneModel.findByIdAndUpdate(milestone._id, {
            $set: { status: milestone.status, name: milestone.name },
          });
        } else {
          // Create new milestone
          const newMilestone = new MilestoneModel({
            name: milestone.name,
            status: milestone.status || "Not Started",
            project: _id,
          });
          const savedMilestone = await newMilestone.save();

          // Add new milestone to the project's milestones array
          updatedProject.milestones.push(savedMilestone._id);
        }
      }

      // Save the project with updated milestones array
      await updatedProject.save();
    }

    // Populate milestones for the response
    const populatedProject = await ProjectModel.findById(_id).populate(
      "milestones"
    );

    res.status(200).json(populatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating project and milestones" });
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
    const groupedTasks = tasks.reduce(
      (acc, task) => {
        if (task.status === "Completed") acc.completed.push(task);
        else if (task.status === "In Progress") acc.inProgress.push(task);
        else if (task.status === "Not Started") acc.notStarted.push(task);
        return acc;
      },
      { completed: [], inProgress: [], notStarted: [] }
    );

    return res.status(200).json({
      status: true,
      tasks,
      groupedTasks,
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
