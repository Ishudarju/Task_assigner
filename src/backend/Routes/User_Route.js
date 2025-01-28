import express from "express";
import * as User from "../Controller/User_Controller.js";
import * as Admin from "../Controller/Admin_controller.js";
import * as Ticket from "../Controller/Ticket_controller.js";
import * as Task from "../Controller/Task_Controller.js";
import * as Project from "../Controller/Project_controller.js";
import * as Milestone from "../Controller/Milestone_controller.js";
import multer from "multer";

const userRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

userRoute.post("/login", User.user_login);

userRoute.post("/create", User.createUser);


// userRoute.post("/verify/:userId", User.authMiddleware,verifyUserByAdmin);
userRoute.post("/approveHr", User.authMiddleware,User.approveUserByHR);



// hr,manager,team lead,employee - dashbroad
userRoute.post("/dashboard", User.authMiddleware, User.user_dashboard);

// userRoute.post("/update",createUser);
userRoute.post("/getAllEmployee", User.authMiddleware, User.getAllEmployee);
userRoute.post("/createTask", User.authMiddleware, Task.createTask);
userRoute.get("/getAllTask", User.authMiddleware, Task.getAllTask);
userRoute.post("/editStatus", Task.editTaskStatus);

userRoute.post("/daliyTaskUpdate", User.authMiddleware, Task.DailyTaskUpdate);

// userRoute.post("/",User.authMiddleware,Task.create_skill_Improvement);

userRoute.put("/updateProject", User.authMiddleware, Project.updateProject);
userRoute.get("/exportXLSX", User.exportXLSX);
// userRoute.post("/profie", View_profile);
userRoute.get("/getEmpMails", User.authMiddleware, User.getAllUserEmpMail);
userRoute.post("/importXLSX", upload.single("file"), User.importXLSX);


//Tickets routes



// userRoute.post("/createTicket", User.authMiddleware, Ticket.createTicket);
userRoute.post('/createTicket', Admin.authMiddleware, upload.array('attachments'), Ticket.createTicket);
userRoute.post("/deleteTicket", Ticket.deleteTicket);
userRoute.post("/createProject", User.authMiddleware, Project.createProject);
userRoute.post(  "/getAllProjects",  User.authMiddleware, Project.getAllProjectsPagination);
userRoute.get("/getAllProjectList", User.authMiddleware, Project.getAllProject);
userRoute.post(
  "/getMilestonesForProject",
  User.authMiddleware,
  Milestone.getMilestonesForConsentProjects
);

// Route to calculate project progress by projectId
userRoute.get(
  "/hours_spent_progress",
  User.authMiddleware,
  Project.calculateProjectProgress
);


//Ticket Routes

// Get all tickets with project and assigned employee details
userRoute.get('/getall_ticket', User.authMiddleware, Ticket.getTicketsWithDetails);

// Get a ticket by ID
userRoute.get('/tickets/:id', User.authMiddleware, Ticket.getTicketById);

// // Update a ticket
// router.post('/updatetick/:id', User.authMiddleware, updateTicket);

userRoute.post('/updatetick/:id', User.authMiddleware, Ticket.updateTicket);

userRoute.post('/updatetickstatus', User.authMiddleware, Ticket.updateTicketStatus);


// Delete a ticket
userRoute.delete('/tickets/:id', User.authMiddleware, Ticket.deleteTicket);



// Update UAT Status route (to be called when a user marks the task for UAT)
userRoute.post('/updateUATStatus', User.authMiddleware, Task.updateUATStatus);


// Route to get UAT tasks for testers
userRoute.get("/tasks_uat", User.authMiddleware, Task.listUATTasksForTesters);

// Update Tester Approval route (tester can approve or reject the task)
userRoute.post('/updateTesterApproval', User.authMiddleware, Task.updateTesterApproval);

export default userRoute;

