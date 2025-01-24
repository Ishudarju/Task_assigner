import { TaskModel } from "../Model/Task_scheme.js";
import { UserModel } from "../Model/User_scheme.js";
import ProjectModel from "../Model/Project_schema.js";

// export const createTask = async (req, res) => {
//   const {
//     project,
//     assigned_to,
//     assigned_by,
//     report_to,
//     status = "Not started",
//     priority = "Low",
//     start_date,
//     end_date,
//     task_description,
//     task_title,
//   } = req.body;

//   const { id, role } = req.user;
//   console.log(req.body);
//   if (
//     !project ||
//     !assigned_to ||
//     !report_to ||
//     !start_date ||
//     !end_date ||
//     !task_description
//   ) {
//     return res.status(400).json({
//       status: false,
//       message: "Please provide all required fields for task creation",
//     });
//   }

//   if (role !== "admin" && role !== "team lead" && role !== "manager") {
//     return res.status(403).json({ status: false, message: "No Authorization" });
//   }

//   try {
//     const newTask = new TaskModel({
//       project,
//       assigned_to,
//       assigned_by: id,
//       report_to,
//       status,
//       priority,
//       start_date,
//       end_date,
//       task_description,
//       task_title,
//     });

//     const task = await newTask.save();
//     return res.status(201).json({
//       status: true,
//       message: "Task created successfully",
//       data: task,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: false,
//       message: "Failure in task creation",
//     });
//   }
// };

// export const createTask = async (req, res) => {
//   const {
//     project,
//     assigned_to,
//     assigned_by,
//     report_to,
//     status = "Not started",
//     priority = "Low",
//     start_date,
//     end_date,
//     task_description,
//     task_title,
//     milestone, // Milestone field
//   } = req.body;

//   const { id, role } = req.user;
//   console.log(req.body);

//   // Check for required fields
//   if (
//     !project ||
//     !assigned_to ||
//     !report_to ||
//     !start_date ||
//     !end_date ||
//     !task_description ||
//     !task_title
//   ) {
//     return res.status(400).json({
//       status: false,
//       message: "Please provide all required fields for task creation",
//     });
//   }

//   // Check for user role authorization
//   if (role !== "admin" && role !== "team lead" && role !== "manager") {
//     return res.status(403).json({ status: false, message: "No Authorization" });
//   }

//   try {
//     // Create new task object with the provided details
//     const newTask = new TaskModel({
//       project,
//       assigned_to,
//       assigned_by: id,
//       report_to,
//       status,
//       priority,
//       start_date,
//       end_date,
//       task_description,
//       task_title,
//       milestone, // Including the milestone reference
//     });

//     // Save the task in the database
//     const task = await newTask.save();

//     // Return success response
//     return res.status(201).json({
//       status: true,
//       message: "Task created successfully",
//       data: task,
//     });
//   } catch (error) {
//     console.error(error);

//     // Handle errors during task creation
//     return res.status(500).json({
//       status: false,
//       message: "Failure in task creation",
//     });
//   }
// };

export const createTask = async (req, res) => {
  const {
    project,
    assigned_to,
    assigned_by,
    report_to,
    status = "Not started",
    priority = "Low",
    start_date,
    end_date,
    task_description,
    task_title,
    milestone,
    move_to_uav = false, // New field with default value
    tester_approval = null, // New field with default value
  } = req.body;

  const { id, role } = req.user;
  console.log(req.body);

  // Check for required fields
  if (
    !project ||
    !assigned_to ||
    !report_to ||
    !start_date ||
    !end_date ||
    !task_description ||
    !task_title
  ) {
    return res.status(400).json({
      status: false,
      message: "Please provide all required fields for task creation",
    });
  }

  // Check for user role authorization
  if (role !== "admin" && role !== "team lead" && role !== "manager") {
    return res.status(403).json({ status: false, message: "No Authorization" });
  }

  try {
    // Create new task object with the provided details
    const newTask = new TaskModel({
      project,
      assigned_to,
      assigned_by: id,
      report_to,
      status,
      priority,
      start_date,
      end_date,
      task_description,
      task_title,
      milestone, // Including the milestone reference
      move_to_uav, // Include the new field
      testerApproval: tester_approval, // Include the new field with standardized naming
    });

    // Save the task in the database
    const task = await newTask.save();

    // Return success response
    return res.status(201).json({
      status: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error(error);

    // Handle errors during task creation
    return res.status(500).json({
      status: false,
      message: "Failure in task creation",
    });
  }
};


// Update UAT Status Function (User changes UAT status)
// export const updateUATStatus = async (req, res) => {
//   const { taskId } = req.body; // Get task ID from URL params
//   const { move_to_uav } = req.body; // Get new UAT status from request body

//   try {
//     // Find the task by ID
//     const task = await TaskModel.findById(taskId);

//     if (!task) {
//       return res.status(404).json({ status: false, message: "Task not found" });
//     }

//     // Update the move_to_uav status (UAT status)
//     task.move_to_uav = move_to_uav;
//     await task.save();

//     return res.status(200).json({
//       status: true,
//       message: "UAT status updated successfully",
//       data: task,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: false,
//       message: "Error in updating UAT status",
//     });
//   }
// };

// export const updateUATStatus = async (req, res) => {
//   const { taskId, move_to_uav } = req.body;

//   try {
//     // Find the task by ID and update the move_to_uav field
//     const task = await TaskModel.findByIdAndUpdate(
//       taskId,
//       { move_to_uav: move_to_uav }, // Update only the move_to_uav field
//       { new: true, runValidators: true } // Return updated task and validate
//     );

//     if (!task) {
//       return res.status(404).json({ status: false, message: "Task not found" });
//     }

//     // Return the updated task details
//     return res.status(200).json({
//       status: true,
//       message: "Task UAT status updated successfully",
//       data: task,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ status: false, message: "Error updating task" });
//   }
// };

export const updateUATStatus = async (req, res) => {
  const { taskId, move_to_uat } = req.body; // Use taskId and move_to_uav from the body

  try {
    // Find the task by ID
    const task = await TaskModel.findById(taskId);

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    // Update the UAT status
    task.move_to_uat = move_to_uat;
    await task.save();

    return res.status(200).json({
      status: true,
      message: "UAT status updated successfully",
      data: task,
    });
  } catch (error) {
    console.error(error);
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Error in updating UAT status",
    });
  }
};


// List UAT Tasks for Testers Function (List tasks for UAT testing)

// export const listUATTasksForTesters = async (req, res) => {
//   try {
//     // Verify if the user is a tester or admin (assuming user details are in req.user)
//     const { userId } = req; // Extract user ID from auth middleware

//     const user = await UserModel.findById(userId);

//     console.log(user);

//     // Check if the user is a tester or admin
//     if (!user || (user.role !== "tester" && user.role !== "admin")) {
//       return res.status(403).json({
//         status: false,
//         message: "Access denied. Only testers or admins can view or edit this data.",
//       });
//     }

//     // Fetch tasks with `move_to_uat` = true
//     const tasks = await TaskModel.find({ move_to_uat: true })
//       .populate("project", "project_name") // Populate project details if needed
//       .populate("assigned_to", "name email") // Populate assigned_to details
//       .populate("assigned_by", "name email") // Populate assigned_by details
//       .sort({ updatedAt: -1 }); // Sort by the most recently updated tasks

//     return res.status(200).json({
//       status: true,
//       message: "Tasks for UAT retrieved successfully",
//       data: tasks,
//     });
//   } catch (error) {
//     console.error(error);
//     console.log(error);
//     return res.status(500).json({
//       status: false,
//       message: "Error in retrieving UAT tasks",
//     });
//   }
// };



export const listUATTasksForTesters = async (req, res) => {
  try {
    // Extract user information from the request (assuming user info is in req.user)
    const { userId } = req.user; // Extract user ID from the auth middleware (or from headers)
    const user = await UserModel.findById(userId); // Fetch the user from the database

    // Check if the user is an admin or a tester
    if (req.user.role !== "admin" && req.user.role !== "tester") {
      return res.status(403).json({
        status: false,
        message: "Access denied. Only admins and testers can view this data.",
      });
    }

    // Fetch tasks with `move_to_uat: true` and `is_deleted: false`
    const tasks = await TaskModel.find({ move_to_uat: true, is_deleted: false })
      .populate("project", "project_name") // Populate project details
      .populate("assigned_to", "name email") // Populate assigned_to details
      .populate("assigned_by", "name email") // Populate assigned_by details
      .populate("report_to", "name email") // Populate report_to details
      .sort({ updatedAt: -1 }); // Sort by the most recently updated tasks

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No UAT tasks found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "All UAT tasks retrieved successfully.",
      data: tasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Error in retrieving UAT tasks.",
    });
  }
};




// Update Tester Approval Function (Tester approves or rejects task)
export const updateTesterApproval = async (req, res) => {
  const { taskId } = req.params; // Get task ID from URL params
  const { tester_approval } = req.body; // Get tester approval status ('Approved' or 'Rejected')

  try {
    // Find the task by ID
    const task = await TaskModel.findById(taskId);

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    // Update the tester approval status
    task.tester_approval = tester_approval;
    await task.save();

    return res.status(200).json({
      status: true,
      message: "Tester approval updated successfully",
      data: task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Error in updating tester approval",
    });
  }
};

export const deleteTask = async (req, res) => {
  const { id, role } = req.body;
  console.log(req.body);
  if (role !== "admin") {
    return res.status(403).json({ status: false, message: "No Authorization" });
  }

  try {
    // const task = await TaskModel.findByIdAndUpdate(
    //   id,
    //   { is_deleted: true },
    //   { new: true }
    // );
    const task = await TaskModel.findOneAndDelete({ _id: id });

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Error deleting task" });
  }
};

export const editTaskStatus = async (req, res) => {
  const { _id, status } = req.body;

  if (!_id) {
    return res.status(400).json({ status: false, message: "Invalid Task ID" });
  }

  try {
    const result = await TaskModel.updateOne({ _id }, { $set: { status } });

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Task not found or not updated" });
    }

    return res.status(200).json({
      status: "Success",
      message: "Task status updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

//fazil code
// export const getAllTask = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;

//     const pageNumber = parseInt(page, 10);
//     const limitNumber = parseInt(limit, 10);

//     const userId = req.user.id; // ID of the logged-in user
//     const userRole = req.user.role; // Role of the logged-in user (e.g., Manager, Team Lead, Member)

//     // Define the filter based on the role
//     let filter = { is_deleted: false };

//     if (userRole === "manager") {
//       // Manager: Tasks they assigned or in projects they own
//       const managerProjects = await ProjectModel.find({
//         project_ownership: userId,
//       }).select("_id");
//       filter.$or = [
//         { report_to: userId },
//         { project: { $in: managerProjects } },
//       ];
//     } else if (userRole === "team lead") {
//       // Team Lead: Tasks assigned to them or assigned by them
//       filter.$or = [{ assigned_to: userId }, { assigned_by: userId }];
//     } else if (userRole === "member") {
//       // Team Member: Tasks directly assigned to them
//       filter.assigned_to = userId;
//     } else if (userRole === "admin") {

//       // Default: No additional filtering (fetch all tasks, e.g., for admin or other cases)
//     }

//     // Fetch tasks with pagination and populate references
//     const tasks = await TaskModel.find(filter)
//       .sort({ _id: -1 })
//       .skip((pageNumber - 1) * limitNumber)
//       .limit(limitNumber)
//       .populate({
//         path: "assigned_to",
//         select: "name mail",
//       })
//       .populate({
//         path: "assigned_by",
//         select: "name mail",
//       })
//       .populate({
//         path: "report_to",
//         select: "name mail",
//       })
//       .populate({
//         path: "milestone",
//         select: "name status",
//       })
//       .populate({
//         path: "project",
//         select: "project_name",
//       });

//     // Count total tasks for pagination
//     const totalTasks = await TaskModel.countDocuments(filter);

//     return res.status(200).json({
//       status: true,
//       message: "Tasks fetched successfully",
//       data: {
//         total: totalTasks,
//         tasks,
//         pagination: {
//           currentPage: pageNumber,
//           totalPages: Math.ceil(totalTasks / limitNumber),
//         },
//       },
//     });
//   } catch (error) {
//     console.error(`[getAllTask]: Error fetching tasks - ${error.message}`);
//     return res.status(500).json({
//       status: false,
//       message: "An error occurred while fetching tasks",
//     });
//   }
// };

export const getAllTask = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search = "" } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const userId = req.user.id; // ID of the logged-in user
    const userRole = req.user.role; // Role of the logged-in user (e.g., Manager, Team Lead, Member)

    // Define the filter based on the role
    let filter = { is_deleted: false };

    if (userRole === "manager") {
      // Manager: Tasks they assigned or in projects they own
      const managerProjects = await ProjectModel.find({
        project_ownership: userId,
      }).select("_id");
      filter.$or = [
        { report_to: userId },
        { project: { $in: managerProjects } },
      ];
    } else if (userRole === "team lead") {
      // Team Lead: Tasks assigned to them or assigned by them
      filter.$or = [{ assigned_to: userId }, { assigned_by: userId }];
    } else if (userRole === "member") {
      // Team Member: Tasks directly assigned to them
      filter.assigned_to = userId;
    }
    // Default: No additional filtering for admin
    const validStatuses = [
      "Completed",
      "In progress",
      "Not started",
      "Pending",
      "Cancelled",
    ];

    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: false,
          message: `Invalid status provided. Valid statuses are: ${validStatuses.join(
            ", "
          )}`,
        });
      }
      filter.status = status;
    }

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { task_title: { $regex: searchRegex } },
        { task_description: { $regex: searchRegex } },
      ];
    }
    // Fetch tasks with pagination and populate references
    const tasks = await TaskModel.find(filter)
      .sort({ _id: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .populate({
        path: "assigned_to",
        select: "name mail",
      })
      .populate({
        path: "assigned_by",
        select: "name mail",
      })
      .populate({
        path: "report_to",
        select: "name mail",
      })
      .populate({
        path: "milestone",
        select: "name status",
      })
      .populate({
        path: "project",
        select: "project_name",
      });

    // Count total tasks grouped by status
    const taskStatusCounts = await TaskModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$status", // Group by status
          count: { $sum: 1 }, // Count the tasks in each group
        },
      },
    ]);

    // Transform the status counts into a key-value object
    const statusSummary = {};
    taskStatusCounts.forEach((status) => {
      statusSummary[status._id] = status.count;
    });

    // Count total tasks for pagination
    const totalTasks = await TaskModel.countDocuments(filter);

    return res.status(200).json({
      status: true,
      message: "Tasks fetched successfully",
      data: {
        total: totalTasks,
        statusSummary, // Include the total count of tasks grouped by status
        tasks,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalTasks / limitNumber),
        },
      },
    });
  } catch (error) {
    console.error(`[getAllTask]: Error fetching tasks - ${error.message}`);
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching tasks",
    });
  }
};

export const getTask = async (req, res) => {
  const { id } = req.body;

  try {
    const task = await TaskModel.findOne({ _id: id, is_deleted: false })
      .populate("project", "project_name") // Populate project details
      .populate("milestone", "name status") // Populate milestone details
      .populate("assigned_to", "name mail") // Populate assigned_to details
      .populate("assigned_by", "name mail") // Populate assigned_by details
      .populate("report_to", "name mail");
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Error fetching task" });
  }
};

// export const updateTask = async (req, res) => {
//   const {
//     _id,
//     project,
//     assigned_to,
//     assigned_by,
//     report_to,
//     status,
//     priority,
//     start_date,
//     end_date,
//     task_description,
//     task_title,
//   } = req.body;
//   const { role } = req.user;
//   console.log(req.body);
//   if (role !== "admin") {
//     return res.status(403).json({ status: false, message: "No Authorization" });
//   }

//   const updatedTask = {
//     project: project._id,
//     assigned_to: assigned_to._id,
//     assigned_by: assigned_by._id,
//     report_to: report_to._id,
//     status,
//     priority,
//     start_date,
//     end_date,
//     task_description,
//     task_title,
//   };

//   try {
//     const task = await TaskModel.findByIdAndUpdate(_id, updatedTask, {
//       new: true,
//     });

//     if (!task) {
//       return res.status(404).json({ status: false, message: "Task not found" });
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Task updated successfully",
//       data: task,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ status: false, message: "Error updating task" });
//   }
// };
// export const updateTasknew = async (req, res) => {
//   const {
//     _id,
//     project,
//     assigned_to,
//     assigned_by,
//     report_to,
//     status,
//     priority,
//     start_date,
//     end_date,
//     task_description,
//     task_title,
//     milestone, // Include milestone in the update
//   } = req.body;

//   const { role } = req.user;
//   console.log(req.body);

//   // Check for admin role
//   if (role !== "admin") {
//     return res.status(403).json({ status: false, message: "No Authorization" });
//   }

//   // Prepare the updated task object, including milestone
//   const updatedTask = {
//     project: project._id,
//     assigned_to: assigned_to._id,
//     assigned_by: assigned_by._id,
//     report_to: report_to._id,
//     status,
//     priority,
//     start_date,
//     end_date,
//     task_description,
//     task_title,
//     milestone, // Include milestone in the update object
//   };

//   try {
//     // Find and update the task by its ID
//     const task = await TaskModel.findByIdAndUpdate(_id, updatedTask, {
//       new: true, // Return the updated task
//     });

//     // If task not found
//     if (!task) {
//       return res.status(404).json({ status: false, message: "Task not found" });
//     }

//     // Return success response with updated task data
//     return res.status(200).json({
//       status: true,
//       message: "Task updated successfully",
//       data: task,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ status: false, message: "Error updating task" });
//   }
// };

export const updateTask = async (req, res) => {
  const {
    _id,
    project,
    assigned_to,
    assigned_by,
    report_to,
    status,
    priority,
    start_date,
    end_date,
    task_description,
    task_title,
    milestone, // Include milestone in the update
    daily_update, // New update for the daily updates
  } = req.body;

  const { role } = req.user;
  console.log(req.body);

  // Check for admin role
  const allowedRoles = ["admin", "manager", "team lead"];
  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ status: false, message: "No Authorization" });
  }

  try {
    // Find the task by its ID
    const task = await TaskModel.findById(_id);

    // If task not found
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    // Update the task fields
    task.project = project._id;
    task.assigned_to = assigned_to._id;
    task.assigned_by = assigned_by._id;
    task.report_to = report_to._id;
    task.status = status;
    task.priority = priority;
    task.start_date = start_date;
    task.end_date = end_date;
    task.task_description = task_description;
    task.task_title = task_title;
    task.milestone = milestone;

    // Add the new daily update to the array
    if (daily_update) {
      task.daily_updates = task.daily_updates || [];
      task.daily_updates.push({
        date: new Date(),
        description: daily_update,
      });
    }

    // Save the updated task
    const updatedTask = await task.save();

    // Return success response with updated task data
    return res.status(200).json({
      status: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Error updating task" });
  }
};

//fazil code
// export const DailyTaskUpdate = async (req, res) => {
//   const {
//     _id,
//     daily_update, // Only this field is allowed for members
//   } = req.body;

//   const { role } = req.user; // Assume `req.user` contains the authenticated user's details

//   console.log(req.body);

//   // Restrict updates to `daily_update` for the member role only
//   // if (role !== "member"||role !== "team lead") {
//   //   return res
//   //     .status(403)
//   //     .json({ status: false, message: "Only members can update daily updates" });
//   // }

//   // Check if daily_update is provided
//   if (!daily_update) {
//     return res
//       .status(400)
//       .json({ status: false, message: "Daily update description is required" });
//   }

//   try {
//     // Find the task by its ID
//     const task = await TaskModel.findById(_id);

//     // If task not found
//     if (!task) {
//       return res.status(404).json({ status: false, message: "Task not found" });
//     }

//     // Add the new daily update to the `daily_updates` array
//     task.daily_updates = task.daily_updates || [];
//     task.daily_updates.push({
//       date: new Date(),
//       description: daily_update,
//     });

//     // Save the updated task
//     const updatedTask = await task.save();

//     // Return success response with updated task data
//     return res.status(200).json({
//       status: true,
//       message: "Daily update added successfully",
//       data: updatedTask,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ status: false, message: "Error updating daily update" });
//   }
// };

//ishu correction
// export const DailyTaskUpdate = async (req, res) => {
//   const {
//     _id, // Task ID
//     daily_update, // Optional description of the daily update
//     hours_spent, // Optional hours spent on the task
//   } = req.body;

//   const { role } = req.user; // Assume `req.user` contains the authenticated user's details

//   console.log(req.body);

//   // Check if required fields are provided
//   if (hours_spent === undefined || hours_spent === null) {
//     return res.status(400).json({
//       status: false,
//       message: "Hours spent are required",
//     });
//   }

//   // Restrict updates to roles that are allowed
//   if (!["member", "team lead", "manager"].includes(role)) {
//     return res.status(403).json({
//       status: false,
//       message: "You are not authorized to update daily tasks",
//     });
//   }

//   try {
//     // Find the task by its ID
//     const task = await TaskModel.findById(_id);

//     // If task not found
//     if (!task) {
//       return res.status(404).json({ status: false, message: "Task not found" });
//     }

//     // Add the new daily update (optional description and required hours_spent)
//     task.daily_updates = task.daily_updates || [];
//     task.daily_updates.push({
//       date: new Date(),
//       description: daily_update || "",  // Optional: default to empty string if not provided
//       hours_spent, // Optional hours_spent (if provided)
//     });

//     // Save the updated task
//     const updatedTask = await task.save();

//     // Calculate the total hours spent (for summary purposes, if needed)
//     const totalHoursSpent = task.daily_updates.reduce(
//       (total, update) => total + (update.hours_spent || 0),
//       0
//     );

//     // Return success response with updated task data and total hours spent
//     return res.status(200).json({
//       status: true,
//       message: "Daily update added successfully",
//       data: updatedTask,
//       totalHoursSpent, // Optional: Send total hours spent
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ status: false, message: "Error updating daily task" });
//   }
// };

import { fetchProjectDetails } from "../Helper function/projectHelper.js";

export const DailyTaskUpdate = async (req, res) => {
  const { _id, daily_update, hours_spent } = req.body;
  const { role } = req.user;

  if (!["member", "team lead", "manager"].includes(role)) {
    return res.status(403).json({
      status: false,
      message: "You are not authorized to update daily tasks",
    });
  }

  try {
    const task = await TaskModel.findById(_id);

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    task.daily_updates.push({
      date: new Date(),
      description: daily_update || "",
      hours_spent,
    });

    await task.save();

    // Recalculate project details
    const { project, totalHoursSpent } = await fetchProjectDetails(
      task.project
    );

    return res.status(200).json({
      status: true,
      message: "Daily update added successfully",
      data: { task, totalHoursSpent },
      projectSummary: {
        projectId: project._id,
        projectName: project.project_name,
        estimatedHours: project.estimated_hours,
        percentageSpent: (
          (totalHoursSpent / project.estimated_hours) *
          100
        ).toFixed(2),
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Error updating daily task" });
  }
};

// export const DailyTaskUpdate = async (req, res) => {
//   const {
//     _id, // Task ID
//     daily_update, // Description of the daily update
//     hours_spent, // Hours spent on the task
//   } = req.body;

//   const { role } = req.user; // Assume `req.user` contains the authenticated user's details

//   // Validate required fields
//   if (!daily_update || hours_spent === undefined || hours_spent === null) {
//     return res.status(400).json({
//       status: false,
//       message: "Both daily update description and hours spent are required",
//     });
//   }

//   // // Validate that hours_spent is a positive number (additional validation)
//   // if (hours_spent < 0) {
//   //   return res.status(400).json({
//   //     status: false,
//   //     message: "Hours spent must be a non-negative value",
//   //   });
//   // }

//   // Restrict updates to authorized roles
//   if (!["member", "team lead", "manager"].includes(role)) {
//     return res.status(403).json({
//       status: false,
//       message: "You are not authorized to update daily tasks",
//     });
//   }

//   try {
//     // Find the task by its ID
//     const task = await TaskModel.findById(_id);

//     // If task not found
//     if (!task) {
//       return res.status(404).json({ status: false, message: "Task not found" });
//     }

//     // Add the new daily update to the `daily_updates` array
//     task.daily_updates.push({
//       date: new Date(),
//       description: daily_update,
//       hours_spent, // Add hours spent here
//     });

//     // Save the updated task
//     const updatedTask = await task.save();

//     // Calculate the total hours spent (if required for summary purposes)
//     const totalHoursSpent = task.daily_updates.reduce(
//       (total, update) => total + (update.hours_spent || 0),
//       0
//     );

//     // Return success response
//     return res.status(200).json({
//       status: true,
//       message: "Daily update added successfully",
//       data: updatedTask,
//       totalHoursSpent,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       status: false,
//       message: "Error updating daily task",
//     });
//   }
// };

export const DeleteDailyTaskUpdate = async (req, res) => {
  const { _id, updateId } = req.body; // Task ID and specific daily update ID to delete
  const { role } = req.user; // Assume `req.user` contains the authenticated user's details

  console.log(req.body);

  // Restrict deletion to admin role
  if (role !== "admin") {
    return res.status(403).json({
      status: false,
      message: "You are not authorized to delete daily task updates",
    });
  }

  try {
    // Find the task by its ID
    const task = await TaskModel.findById(_id);

    // If task not found
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    // Check if the update exists
    const updateIndex = task.daily_updates.findIndex(
      (update) => update._id.toString() === updateId
    );

    if (updateIndex === -1) {
      return res.status(404).json({
        status: false,
        message: "Daily update not found",
      });
    }

    // Remove the specific daily update
    task.daily_updates.splice(updateIndex, 1);

    // Save the updated task
    const updatedTask = await task.save();

    return res.status(200).json({
      status: true,
      message: "Daily update deleted successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Error deleting daily task update" });
  }
};

//fazil code
// export const create_skill_Improvement = async (req, res) => {
//   const { id, message } = req.body;

//   if (req.user.role !== "member") {
//     return res.status(403).json({ status: false, message: "No Authorization" });
//   }

//   try {
//     const task = await TaskModel.findByIdAndUpdate(
//       id,
//       {
//         $push: {
//           skill_improvement: {
//             sentFromId: req.user.id,
//             message,
//             date: new Date(),
//           },
//         },
//       },
//       { new: true }
//     );

//     return res.status(200).json({
//       status: true,
//       message: "Skill improvement added successfully",
//       data: task,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ status: false, message: "Error adding skill improvement" });
//   }
// };

export const create_skill_Improvement = async (req, res) => {
  const { id, message } = req.body;

  // Ensure message is provided
  if (!message || message.trim() === "") {
    return res
      .status(400)
      .json({ status: false, message: "Message is required" });
  }

  // Only members can create skill improvements
  if (req.user.role !== "member") {
    return res.status(403).json({ status: false, message: "No Authorization" });
  }

  try {
    // Find and update the task by ID
    const task = await TaskModel.findByIdAndUpdate(
      id,
      {
        $push: {
          skill_improvement: {
            sentFromId: req.user.id,
            message,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    // Return success response
    return res.status(200).json({
      status: true,
      message: "Skill improvement added successfully",
      data: task,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Error adding skill improvement" });
  }
};

//fazil code
// export const update_skill_Improvement = async (req, res) => {
//   const { id, message, skills_approval_status } = req.body;

//   if (req.user.role !== "team lead" && req.user.role !== "manager") {
//     return res.status(403).json({ status: false, message: "No Authorization" });
//   }

//   try {
//     const updateQuery = {
//       $push: {
//         skill_improvement: {
//           sentFromId: req.user.id,
//           message,
//           date: new Date(),
//         },
//       },
//     };

//     if (req.user.role === "manager" || req.user.role === "admin") {
//       updateQuery.$set = {
//         skills_approval_status,
//         skill_imp_reviewed_by: req.user.id,
//       };
//     }

//     const task = await TaskModel.findByIdAndUpdate(id, updateQuery, {
//       new: true,
//     });

//     return res.status(200).json({
//       status: true,
//       message: "Skill improvement updated successfully",
//       data: task,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ status: false, message: "Error updating skill improvement" });
//   }
// };

export const update_skill_Improvement = async (req, res) => {
  const { id, message, skills_approval_status } = req.body;

  // Ensure message is provided
  if (!message || message.trim() === "") {
    return res
      .status(400)
      .json({ status: false, message: "Message is required" });
  }

  // Only Team Leads or Managers can update skill improvement
  if (req.user.role !== "team lead" && req.user.role !== "manager") {
    return res.status(403).json({ status: false, message: "No Authorization" });
  }

  try {
    const updateQuery = {
      $push: {
        skill_improvement: {
          sentFromId: req.user.id,
          message,
          date: new Date(),
        },
      },
    };

    // If the user is Manager or Admin, update the approval status as well
    if (req.user.role === "manager" || req.user.role === "admin") {
      updateQuery.$set = {
        skills_approval_status,
        skill_imp_reviewed_by: req.user.id,
      };
    }

    // Find and update the task by ID
    const task = await TaskModel.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

    // Return success response
    return res.status(200).json({
      status: true,
      message: "Skill improvement updated successfully",
      data: task,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Error updating skill improvement" });
  }
};

export const create_growth_assessment = async (req, res) => {
  const { id, message } = req.body;

  if (req.user.role !== "member") {
    return res.status(403).json({ status: false, message: "No Authorization" });
  }

  try {
    const task = await TaskModel.findByIdAndUpdate(
      id,
      {
        $push: {
          growth_assessment: {
            sentFromId: req.user.id,
            message,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Growth assessment created successfully",
      data: task,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Error creating growth assessment" });
  }
};

export const update_growth_assessment = async (req, res) => {
  const { id, message } = req.body;

  if (
    req.user.role !== "team lead" &&
    req.user.role !== "manager" &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ status: false, message: "No Authorization" });
  }

  try {
    const task = await TaskModel.findByIdAndUpdate(
      id,
      {
        $push: {
          growth_assessment: {
            sentFromId: req.user.id,
            message,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: "Growth assessment updated successfully",
      data: task,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Error updating growth assessment" });
  }
};

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
