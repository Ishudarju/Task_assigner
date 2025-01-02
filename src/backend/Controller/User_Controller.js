import { UserModel } from "../Model/User_scheme.js";
import { TaskModel } from "../Model/Task_scheme.js";

import { exportToExcel } from "../Controller/Export_controller.js";
import { importToExcel } from "../Controller/Import_Controller.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { boolean } from "zod";

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
    // console.log(decoded);

    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(200)
          .json({ status: false, statusCode: 700, message: "Token expired" });
      } else {
        return res
          .status(200)
          .json({ status: false, message: "Invssalid token" });
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

export const user_login = async (req, res) => {
  const { mail, password } = req.body;

  try {
    // Check if email and password are provided
    if (!mail || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Email and password are required" });
    }

    // Find the user by email
    const user = await UserModel.findOne({ mail: mail.toLowerCase() }).select(
      "-__v -createdAt -updatedAt"
    );

    // Check if user exists
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Check password
    if (user.password !== password) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        mail: user.mail,
        admin_verify: user.admin_verify,
      },
      JWT_SECRET,
      { expiresIn: "5h" } // Token expiry
    );

    // Prepare user data without sensitive fields
    const userData = {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      mail: user.mail,
      role: user.role,
      admin_verify: user.admin_verify,
      employee_id: user.employee_id,
      department: user.department,
    };

    // Send response
    return res.status(200).json({
      status: true,
      message: "Success",
      data: userData,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

export const user_dashboard = async (req, res) => {
  // console.log(req.user);

  const { id, role, mail } = req.user;
  let result = "";
  if (role === "hr") {
    // For HR, get overall tasks with specific statuses
    result = await TaskModel.find({
      status: { $in: ["Pending", "Completed", "Not started", "In progress"] },
    });
  } else {
    // For other users, get tasks assigned to the specific user ID
    result = await TaskModel.find({
      assigned_to: id,
      status: { $in: ["Pending", "Completed", "Not started", "In progress"] },
    });
  }

  // console.log("id", id);
  const pendingTasks = result.filter((task) => task.status === "Pending");
  const completedTasks = result.filter((task) => task.status === "Completed");
  const inProgressTasks = result.filter(
    (task) => task.status === "In progress"
  );
  // const result = await TaskModel.find({ assigned_to: id });
  // const result_count = await TaskModel.find({
  //   assigned_to: id,
  // }).countDocuments();
  // .populate( "_id" , "user");

  const data = {
    result,
    pendingTasks,
    completedTasks,
    inProgressTasks,
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
  console.log(req.body);
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

// export const deleteUser = async (req, res) => {
//   const { id } = req?.body;
//   try {
//     await UserModel.deleteOne({ _id: id });
//     return res
//       .status(200)
//       .json({ status: true, message: "User Deleted Successfully" });
//   } catch (error) {
//     return res
//       .status(200)
//       .json({ status: false, message: "Error in deleting user" });
//   }
// };
export const deleteUser = async (req, res) => {
  const { id } = req.body; // Safely access the body object
  if (!id) {
    return res
      .status(400)
      .json({ status: false, message: "User ID is required" });
  }

  try {
    // Update the `is_deleted` field to true
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: { is_deleted: true } },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json({
      status: true,
      message: "User deleted successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error in deleting user",
      error: error.message,
    });
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

export const getAllUserEmpMailForProject = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        status: false,
        message: "Unauthorized access. Admins only.",
      });
    }
    // Fetch all user data with only required fields

    const users = await UserModel.find({}, { mail: 1, name: 1, role: 1,admin_verify:1});


    // Separate users into team leads, managers, and others
    const teamLeads = users.filter((user) => user.role === "team lead");
    const managers = users.filter((user) => user.role === "manager");
    // const others = users.filter(user => user.role !== 'team lead' && user.role !== 'manager');

    res.status(200).json({
      status: true,
      message: "Fetched all users, team leads, and managers",

        teamLeads: teamLeads.map(({ _id, name, mail, admin_verify }) => ({
          id: _id,
          name,
          mail,
          admin_verify,
        })),
        managers: managers.map(({ _id, mail, name, admin_verify }) => ({
          id: _id,
          name,
          mail,
          admin_verify,
        })),

        // others: others.map(({ name, mail }) => ({ name, mail })),
      },
    );
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error in fetching user data",
      error: error.message,
    });
  }
};


export const getAllEmployee = async (req, res) => {
  const { id, role } = req?.user;
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

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
      excluding_roles = ["hr", role, "admin"];
      break;
    case "admin":
      excluding_roles = [role];
      break;
    default:
      return res.status(403).json({ message: "No authorization" });
  }

  try {
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    const totalEmployees = await UserModel.countDocuments({
      role: { $nin: excluding_roles },
      is_deleted: false,
    });

    result = await UserModel.find({
      role: { $nin: excluding_roles },
      is_deleted: false,
    })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      data: result,
      totalPages: Math.ceil(totalEmployees / limit),
      currentPage: Number(page),
      totalEmployees,
      status: "success",
      message:` ${role} authorized details`,
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Server Error",
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
export const empid_generate = async (req, res) => {
  const emp_id = Math.floor(1000 + Math.random() * 9000);
  return res.status(200).json({ status: true, emp_id });
};
