import { UserModel } from "../Model/User_scheme.js";
import { TaskModel } from "../Model/Task_scheme.js";

import { exportToExcel } from "../Controller/Export_controller.js";
import { importToExcel } from "../Controller/Import_Controller.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "Evvi_solutions_private_limited";

export const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]
    ? req.headers["authorization"]
    : "";
  if (!token) {
    return res
      .status(200)
      .json({ status: false, message: "Token not provided" });
  }
  // token = token.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(200)
          .json({ status: false, statusCode: 700, message: "Token expired" });
      } else {
        return res
          .status(200)
          .json({ status: false, message: "Invalid token" });
      }
    }

    if (decoded.role == "admin") {
      return res.status(200).json({ status: false, message: "Invalid User" });
    }
    if (!decoded.admin_verify) {
      return res
        .status(200)
        .json({ status: false, message: "Email Verification Pending " });
    }
    req.user = decoded;
    next();
  });
};

export const user_login = (req, res) => {
  const { mail, password } = req.body;

  UserModel.findOne({ mail: mail.toLowerCase() })
    .then((users) => {
      if (users.mail == mail && users.password == password) {
        const token = jwt.sign(
          {
            id: users._id,
            role: users.role,
            mail: users.mail,
            admin_verify: users.admin_verify,
          },
          JWT_SECRET,
          { expiresIn: "5h" }
        ); // Token expiry time
        return res.status(200).header("auth-token", token).json({
          status: true,
          message: "Success",
          data: users,
        });
      }
    })
    .catch((err) => {
      return res
        .status(200)
        .json({ status: false, message: "Email and password are required" });
    });
};

export const user_dashboard = async (req, res) => {
  console.log(req.user);

  const { id, role, mail } = req.user;
  let result = "";
  if (role === 'hr') {
    // For HR, get overall tasks with specific statuses
    result = await TaskModel.find({
      status: { $in: ["Pending", "Completed", "In progress"] }
    });
  } else {
    // For other users, get tasks assigned to the specific user ID
    result = await TaskModel.find({
      assigned_to: id,
      status: { $in: ["Pending", "Completed", "In progress"] }
    });
  }

  console.log("id", id);
  const pendingTasks = result.filter(task => task.status === "Pending");
  const completedTasks = result.filter(task => task.status === "Completed");
  const inProgressTasks = result.filter(task => task.status === "In progress");
  // const result = await TaskModel.find({ assigned_to: id });
  // const result_count = await TaskModel.find({
  //   assigned_to: id,
  // }).countDocuments();
  // .populate( "_id" , "user");

  const data = {
    result,
    pendingTasks,
    completedTasks,
    inProgressTasks

  };

  // console.log("task_count :", result_count); 

  console.log(`user dashbroad ${role}`);
  res.status(200).json({ message: "users", result: data });
};

export const createUser = (req, res) => {
  const {
    name,
    mail,
    password,
    confirmPassword,
    phone,
    role,
    admin_verify,
    employee_id,
    department,
    starting_date,
    lastWorking_date,
  } = req.body;

  // console.log(req.body);
  if (password !== confirmPassword) {
    return res
      .status(200)
      .json({ status: false, message: "Password does not match" });
  }

  if (!mail || !password || !phone || !role) {
    return res
      .status(200)
      .json({ status: false, message: "Please Enter Requried field" });
  }

  UserModel.findOne({ mail: mail }).then((users) => {
    if (users) {
      console.log("user existed");
      return res
        .status(200)
        .json({ status: false, message: "User Already Existed" });
    } else {
      // UserModel.create({ name, mail, password, phone, role, admin_verify })

      const newUser = new UserModel({
        name,
        mail,
        password,
        phone,
        role,
        admin_verify,
        employee_id,
        department,
        starting_date,
        lastWorking_date,
      });
      if (role !== "admin") {
        newUser.save().then((users) => {
          return res.status(200).json({
            status: true,
            message: "User Created Successfully",
          });
        });
      } else {
        return res.status(200).json({
          status: false,
          message: "No Authorization",
        });
      }
    }
  });
};

export const updateUser = async (req, res) => {
  const {
    name,
    mail,
    password,
    phone,
    role,
    admin_verify,
    employee_id,
    department,
    starting_date,
    lastWorking_date,
  } = req?.body;
  const updateData = {
    name,
    mail,
    password,
    phone,
    role,
    admin_verify,
    employee_id,
    department,
    starting_date,
    lastWorking_date,
  };

  UserModel.findOneAndUpdate({ mail: mail }, updateData)
    .then((updatedUser) => {
      if (!updatedUser) {
        return res
          .status(200)
          .json({ status: false, message: "User not found" });
      } else {
        return res.status(200).json({
          status: true,
          message: "Successfully Updated User",
        });
      }
    })
    .catch((err) => {
      return res
        .status(200)
        .json({ status: false, message: "Error in Updating User" });
    });
};

export const deleteUser = async (req, res) => {
  const { id } = req?.body;
  try {
    await UserModel.deleteOne({ _id: id });
    return res
      .status(200)
      .json({ status: true, message: "User Deleted Successfully" });
  } catch (error) {
    return res
      .status(200)
      .json({ status: false, message: "Error in deleting user" });
  }
};

export const findById = async (req, res) => {
  const { id } = req?.body;

  await UserModel.find({ _id: id })
    .select("-password")
    .then((users) => {
      if (users) {
        return res.status(200).json({
          status: "Success",
          message: "Successfully Retrieved",
          data: users,
        });
      } else {
        return res.status(200).json({
          status: "failure",
          message: "No User found",
          data: users,
        });
      }
    })
    .catch((err) => {
      return res
        .status(200)
        .json({ status: "Failure", message: "Error in Fetchind Data" });
    });
};

export const getAllUserEmpMail = async (req, res) => {
  await UserModel.find({}, { mail: 1, name: 1, _id: 0 })
    .then((emails) => {
      if (emails) {
        res
          .status(200)
          .json({ status: true, message: "get all user mail", data: emails });
      }
    })
    .catch((error) => {
      res
        .status(200)
        .json({ status: false, message: "Error in Fetching Users Email" });
    });
};

export const getAllEmployee = async (req, res) => {
  const { id, role } = req?.user;
  let result = "";
  let excluding_roles = "";
  switch (role) {
    case "hr":
      excluding_roles = [role, "admin", "manager"];
      break;
    case "team lead":
      excluding_roles = [role, "admin", "manager"];
      break;
    case "manager":
      excluding_roles = ["hr", role, "admin,"];
      break;
    default:
      res.status(200).json({ message: "No authorization" });
      break;
  }

  try {
    result = await UserModel.find({
      role: { $nin: excluding_roles },
    });
    res.status(200).json({
      data: result,
      status: "success",
      message: `${role} authorizated details`,
    });
  } catch (error) {
    res.status(200).json({
      status: "failure",
      message: " Server Error",
    });
  }
};

export const exportXLSX = async (req, res) => {
  try {
    const exact_date = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const data = await TaskModel.find({}).populate({
      path: "assigned_to assigned_by report_to project_ownership",
      select: "mail",
    });

    // Specify the output file path
    const fileName =
      "tasks_" + formattedDate.format(exact_date).replace(/\//g, "-") + ".xlsx";

    const buffer = await exportToExcel(data);

    // Set the appropriate headers to download the file
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=tasks_${fileName}`
    );

    // Send the buffer as a file download
    res.write(buffer);
    res.end();
  } catch (err) {
    console.error("Error exporting to Excel:", err);
    return res.status(200).json({
      status: "Error",
      message: "Failed to download the file",
    });
  }
};

export const importXLSX = async (req, res) => {
  if (!req.file) {
    return res.status(200).send("No file uploaded.");
  }

  // Call the function to import Excel data
  const result = await importToExcel(req.file.buffer);

  if (result.success) {
    return res.status(200).json({
      message: result.message,
      errors: result.errors || [], // Include errors if there are any
    });
  } else {
    return res.status(200).json({
      message: result.message,
      error: result.error, // Include the error message
    });
  }
};
