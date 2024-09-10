import { TaskModel } from "../Model/Task_scheme.js";

export const createTask = async (req, res) => {
  const {
    project_title,
    project_description,
    project_ownership,
    assigned_to,
    assigned_by,
    report_to,
    status,
    priority,
    start_date,
    end_date,
    task_description,
  } = req.body;
  // const status = "pending";
  const exact_date = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  // const due_date = formattedDate.format(exact_date);
  // const starting_date =  formattedDate.format(start_date)

  const { id, role } = req.user;
  if (
    !project_title ||
    !project_description ||
    !project_ownership ||
    !assigned_by ||
    !assigned_to ||
    !report_to ||
    !start_date ||
    !end_date
  ) {
    res.status(200).json({
      status: false,
      message: "Please Enter requried Field for Task Creation",
    });
  } else if (role == "admin" || "team lead" || "manager") {
    await TaskModel.create({
      project_title,
      project_description,
      project_ownership,
      assigned_to,
      assigned_by: id,
      report_to,
      status,
      priority,
      start_date,
      end_date,
      task_description,
    })
      .then((task) => {
        res.status(200).json({
          status: "Success",
          message: "task created successfully",
          data: task,
        });
      })
      .catch((err) => {
        res.status(200).json({
          status: "failure",
          message: "Failure in Task Creation",
        });
      });
  } else {
    return res.status(200).json({ status: false, message: "No Authorization" });
  }
};

export const editTaskStatus = async (req, res) => {
  const id = req?.body?.id;
  const Task_status = req?.body?.status;
  const task_dec = req?.body?.task_description;
  console.log(Task_status);
  if (!id) {
    return res.status(200).json({ status: false, message: "Invaild Updation" });
  }
  await TaskModel.updateOne(
    { _id: id },
    { $set: { status: Task_status, task_description: task_dec } }
  ).then((tasks) => {
    console.log(tasks);
    return res
      .status(200)
      .json({ status: "success", message: "Task Updated Successfully" });
  });
};

export const getAllTask = async (req, res) => {
  await TaskModel.find({})
    .then((tasks) => {
      console.log("tasks");
      return res.status(200).json({
        status: "success",
        message: "Get All Tasks",
        data: tasks,
      });
    })
    .catch((err) => {
      return res.status(200).json({
        status: "failure",
        message: "Error in Fetching All Tasks",
      });
    });
};

export const getTask = async (req, res) => {
  const { id } = req?.body;
  await TaskModel.find({ _id: id })
    .then((task) => {
      if (!task) {
        return res
          .status(200)
          .json({ status: false, message: "Task Not Found" });
      } else {
        return res.status(200).json({
          status: true,
          message: "Successfully Data Fetched",
          data: task,
        });
      }
    })
    .catch((error) => {
      return res
        .status(200)
        .json({ status: false, message: "Error while Finding User" });
    });
};

export const updateTask = async (res, req) => {
  const {
    id,
    project_title,
    project_description,
    project_ownership,
    assigned_to,
    assigned_by,
    report_to,
    status,
    priority,
    start_date,
    end_date,
    task_description,
  } = req?.body;

  if (req.user.role == "admin") {
    await TaskModel.findByIdAndUpdate({ _id: id });
  }
};
