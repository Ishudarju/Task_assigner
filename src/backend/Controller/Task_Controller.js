import { TaskModel } from "../Model/Task_scheme.js";
import { UserModel } from "../Model/User_scheme.js";

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
    milestone, // Milestone field
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
export const deleteTask = async (req, res) => {
  const { id, role } = req.body;

  if (role !== "admin") {
    return res.status(403).json({ status: false, message: "No Authorization" });
  }

  try {
    const task = await TaskModel.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

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
  const { _id, status, task_description } = req.body;

  if (!_id) {
    return res.status(400).json({ status: false, message: "Invalid Task ID" });
  }

  try {
    const result = await TaskModel.updateOne(
      { _id },
      { $set: { status, task_description } }
    );

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

// export const getAllTask = async (req, res) => {
//   try {
//     const tasks = await TaskModel.find({ is_deleted: false });

//     return res.status(200).json({
//       status: true,
//       message: "All tasks fetched successfully",
//       data: tasks,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ status: false, message: "Error fetching tasks" });
//   }
// };

export const getAllTask = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const tasks = await TaskModel.find({ is_deleted: false })
      .sort({_id:-1})
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
      .populate({ path: "milestone", select: "name status" })
      .populate({
        path: "project",
        select: "project_name",
      });

    const totalTasks = await TaskModel.countDocuments({ is_deleted: false });

    return res.status(200).json({
      status: true,
      message: "Tasks fetched successfully",
      data: {
        total: totalTasks,
        tasks,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalTasks / limitNumber),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
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
export const DailyTaskUpdate = async (req, res) => {
  const {
    _id,
    daily_update, // Only this field is allowed for members
  } = req.body;

  const { role } = req.user; // Assume `req.user` contains the authenticated user's details

  console.log(req.body);

  // Restrict updates to `daily_update` for the member role only
  // if (role !== "member"||role !== "team lead") {
  //   return res
  //     .status(403)
  //     .json({ status: false, message: "Only members can update daily updates" });
  // }

  // Check if daily_update is provided
  if (!daily_update) {
    return res
      .status(400)
      .json({ status: false, message: "Daily update description is required" });
  }

  try {
    // Find the task by its ID
    const task = await TaskModel.findById(_id);

    // If task not found
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    // Add the new daily update to the `daily_updates` array
    task.daily_updates = task.daily_updates || [];
    task.daily_updates.push({
      date: new Date(),
      description: daily_update,
    });

    // Save the updated task
    const updatedTask = await task.save();

    // Return success response with updated task data
    return res.status(200).json({
      status: true,
      message: "Daily update added successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Error updating daily update" });
  }
};

export const create_skill_Improvement = async (req, res) => {
  const { id, message } = req.body;

  if (req.user.role !== "member") {
    return res.status(403).json({ status: false, message: "No Authorization" });
  }

  try {
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

export const update_skill_Improvement = async (req, res) => {
  const { id, message, skills_approval_status } = req.body;

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

    if (req.user.role === "manager" || req.user.role === "admin") {
      updateQuery.$set = {
        skills_approval_status,
        skill_imp_reviewed_by: req.user.id,
      };
    }

    const task = await TaskModel.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

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
