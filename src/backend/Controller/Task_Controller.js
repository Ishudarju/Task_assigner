import { TaskModel } from "../Model/Task_scheme.js";
import { UserModel } from "../Model/User_scheme.js";

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
  } = req.body;

  const { id, role } = req.user;

  if (
    !project ||
    !assigned_to ||
    !report_to ||
    !start_date ||
    !end_date ||
    !task_description
  ) {
    return res.status(400).json({
      status: false,
      message: "Please provide all required fields for task creation",
    });
  }

  if (role !== "admin" && role !== "team lead" && role !== "manager") {
    return res.status(403).json({ status: false, message: "No Authorization" });
  }

  try {
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
    });

    const task = await newTask.save();
    return res.status(201).json({
      status: "Success",
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error(error);
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
      const tasks = await TaskModel.find({ is_deleted: false })
        .populate({
          path: "assigned_to",
          select: "name email", // Populate with specific fields from User schema
        })
        .populate({
          path: "assigned_by",
          select: "name email",
        })
        .populate({
          path: "report_to",
          select: "name email",
        })
        .populate({
          path: "project",
          select: "project_name", // Assuming this points to a Project schema
        });
  
      return res.status(200).json({
        status: true,
        message: "All tasks fetched successfully",
        data: tasks,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return res
        .status(500)
        .json({ status: false, message: "Error fetching tasks" });
    }
  };
// export const getAllTask = async (req, res) => {
//   const { limit = 10, page } = req.params; // Default limit is 10 tasks per page

//   // Convert limit and page to numbers
//   const taskLimit = parseInt(limit, 10);
//   const taskPage = parseInt(page, 10);

//   try {
//     const tasks = await TaskModel.find({ is_deleted: false })
//       .skip((taskPage - 1) * taskLimit) // Skip tasks for previous pages
//       .limit(taskLimit) // Limit the number of tasks
//       .populate({
//         path: "assigned_to",
//         select: "name email",
//       })
//       .populate({
//         path: "assigned_by",
//         select: "name email",
//       })
//       .populate({
//         path: "report_to",
//         select: "name email",
//       })
//       .populate({
//         path: "project",
//         select: "project_name",
//       });

//     // Total count of tasks
//     const totalTasks = await TaskModel.countDocuments({ is_deleted: false });

//     return res.status(200).json({
//       status: true,
//       message: "All tasks fetched successfully",
//       data: tasks,
//       pagination: {
//         totalTasks,
//         currentPage: taskPage,
//         totalPages: Math.ceil(totalTasks / taskLimit),
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     return res
//       .status(500)
//       .json({ status: false, message: "Error fetching tasks" });
//   }
// };

export const getTask = async (req, res) => {
  const { id } = req.body;

  try {
    const task = await TaskModel.findOne({ _id: id, is_deleted: false });

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

export const updateTask = async (req, res) => {
  const {
    id,
    project,
    assigned_to,
    assigned_by,
    report_to,
    status,
    priority,
    start_date,
    end_date,
    task_description,
  } = req.body;
  const { role } = req.user;

  if (role !== "admin") {
    return res.status(403).json({ status: false, message: "No Authorization" });
  }

  const updatedTask = {
    project,
    assigned_to,
    assigned_by,
    report_to,
    status,
    priority,
    start_date,
    end_date,
    task_description,
  };

  try {
    const task = await TaskModel.findByIdAndUpdate(id, updatedTask, {
      new: true,
    });

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: false, message: "Error updating task" });
  }
};

export const create_skill_Improvement = async (req, res) => {
  const { id, message } = req.body;

  if (req.user.role !== "employee") {
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

  if (req.user.role !== "employee") {
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
