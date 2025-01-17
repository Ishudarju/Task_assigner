import express from "express";
import * as User from "../Controller/User_Controller.js";
import * as Admin from "../Controller/Admin_controller.js";
import * as Ticket from "../Controller/Ticket_controller.js";
import * as Task from "../Controller/Task_controller.js";
import * as Project from "../Controller/Project_controller.js";
import multer from "multer";

const userRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

userRoute.post("/login", User.user_login);

userRoute.post("/create", User.createUser);

// hr,manager,team lead,employee - dashbroad
userRoute.post("/dashboard", User.authMiddleware, User.user_dashboard);

// userRoute.post("/update",createUser);
userRoute.post("/getAllEmployee", User.authMiddleware, User.getAllEmployee);
userRoute.post("/createTask", User.authMiddleware, Task.createTask);
userRoute.get("/getAllTask", User.authMiddleware, Task.getAllTask);
userRoute.post("/editStatus", Task.editTaskStatus);
userRoute.post("/daliyTaskUpdate", User.authMiddleware, Task.DailyTaskUpdate);
userRoute.put("/updateProject", User.authMiddleware, Project.updateProject);
userRoute.get("/exportXLSX", User.exportXLSX);
// userRoute.post("/profie", View_profile);
userRoute.get("/getEmpMails", User.authMiddleware,User.getAllUserEmpMail);
userRoute.post("/importXLSX", upload.single("file"), User.importXLSX);

userRoute.post("/createTicket", User.authMiddleware, Ticket.createTicket);
userRoute.post("/deleteTicket", Ticket.deleteTicket);
userRoute.post("/createProject", User.authMiddleware, Project.createProject);
userRoute.get(
  "/getAllProjects",
  User.authMiddleware,
  Project.getAllProjectsPagination
);
userRoute.get("/getAllProjectList", User.authMiddleware, Project.getAllProject);

export default userRoute;
