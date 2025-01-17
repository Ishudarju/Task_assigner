import express from "express";
import * as Admin from "../Controller/Admin_controller.js";
import * as Task from "../Controller/Task_controller.js";
import * as User from "../Controller/User_Controller.js";
import * as Ticket from "../Controller/Ticket_controller_old.js";
import * as Project from "../Controller/Project_controller.js";
import * as Milestone from "../Controller/Milestone_controller.js";

const adminRoute = express.Router();

adminRoute.post("/login", Admin.admin_check);
adminRoute.post("/createUser", Admin.authMiddleware, User.createUser);
adminRoute.get("/dashboard", Admin.authMiddleware, Admin.admin_dashboard);
adminRoute.post("/createTask", Admin.authMiddleware, Task.createTask);
adminRoute.put("/updateTask", Admin.authMiddleware, Task.updateTask);
adminRoute.put("/editStatus", Admin.authMiddleware, Task.editTaskStatus);
adminRoute.post("/getAllTask", Admin.authMiddleware, Task.getAllTask);
adminRoute.post("/getTask", Admin.authMiddleware, Task.getTask);
adminRoute.delete("/deleteTask/:id", Task.deleteTask);
adminRoute.get("/getEmpMails", Admin.authMiddleware,User.getAllUserEmpMail);
adminRoute.get(
  "/getAllUserEmpMailForProject",
  Admin.authMiddleware,
  User.getAllUserEmpMailForProject
);
adminRoute.post("/getAllEmployee", Admin.authMiddleware, User.getAllEmployee);
adminRoute.post("/create", Admin.authMiddleware, User.createUser);
adminRoute.put("/update", Admin.authMiddleware, User.updateUser);
adminRoute.post("/delete", Admin.authMiddleware, User.deleteUser);
adminRoute.post("/findById", Admin.authMiddleware, User.findById);
adminRoute.post("/empid-generate", Admin.authMiddleware, User.empid_generate);

adminRoute.post("/updateTicket", Admin.authMiddleware, Ticket.updateTicket);
adminRoute.post("/getAllTicket", Admin.authMiddleware, Ticket.getAllTicket);
adminRoute.post("/getTicketById", Ticket.getTicketById);

adminRoute.post(
  "/getTicketByCategory",
  Admin.authMiddleware,
  Ticket.getTicketByCategory
);

adminRoute.post("/createProject", Admin.authMiddleware, Project.createProject);
adminRoute.post(
  "/getAllProjects",
  Admin.authMiddleware,
  Project.getAllProjectsPagination
);
adminRoute.put("/updateProject", Admin.authMiddleware, Project.updateProject);
adminRoute.delete(
  "/deleteProject/:id",
  Admin.authMiddleware,
  Project.deleteProject
);
adminRoute.post("/getProjectById", Admin.authMiddleware, Project.getProjectById);
// adminRoute.post("/getProjectByStatus", Project.getProjectByStatus);
adminRoute.get("/getAllProjectList", Admin.authMiddleware, Project.getAllProject);
adminRoute.post(
  "/getTaskRelatedToProject",
  Admin.authMiddleware,
  Task.getTaskRelatedToProject
);
adminRoute.post(
  "/getMilestonesForProject",
  Admin.authMiddleware,
  Milestone.getMilestonesForConsentProjects
);
export default adminRoute;
