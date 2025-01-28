import express from "express";
import multer from "multer";
import path from "path";
import * as Admin from "../Controller/Admin_controller.js";
import * as Task from "../Controller/Task_Controller.js";
import * as User from "../Controller/User_Controller.js";
// import * as Ticket from "../Controller/Ticket_controller_old.js";
import * as Project from "../Controller/Project_controller.js";
import * as Milestone from "../Controller/Milestone_controller.js";
import * as Ticket from "../Controller/Ticket_controller.js";


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
adminRoute.get("/getEmpMails", Admin.authMiddleware, User.getAllUserEmpMail);
adminRoute.get(
  "/getAllUserEmpMailForProject",
  Admin.authMiddleware,
  User.getAllUserEmpMailForProject
);
adminRoute.post("/getAllEmployee", Admin.authMiddleware, User.getAllEmployee);
adminRoute.post("/create", Admin.authMiddleware, User.createUser);

adminRoute.put("/update", Admin.authMiddleware, User.updateUser);



adminRoute.post("/verify/:userId", Admin.authMiddleware,Admin.verifyUserByAdmin);
adminRoute.post("/approve/:userId", User.authMiddleware,User.approveUserByHR);




adminRoute.post("/delete", Admin.authMiddleware, User.deleteUser);
adminRoute.post("/findById", Admin.authMiddleware, User.findById);
adminRoute.post("/empid-generate", Admin.authMiddleware, User.empid_generate);

adminRoute.post("/updateTicket", Admin.authMiddleware, Ticket.updateTicket);
// adminRoute.post("/getAllTicket", Admin.authMiddleware, Ticket.getAllTicket);
adminRoute.post("/getTicketById", Ticket.getTicketById);

// adminRoute.post(
//   "/getTicketByCategory",
//   Admin.authMiddleware,
//   Ticket.getTicketByCategory
// );

adminRoute.post("/createProject", Admin.authMiddleware, Project.createProject);
adminRoute.post(  "/getAllProjects",  Admin.authMiddleware, Project.getAllProjectsPagination);
adminRoute.put("/updateProject", Admin.authMiddleware, Project.updateProject);
adminRoute.delete(
  "/deleteProject/:id",
  Admin.authMiddleware,
  Project.deleteProject
);
adminRoute.post("/getProjectById/:id", Admin.authMiddleware, Project.getProjectById);
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


adminRoute.delete("/del_daliyTask", Admin.authMiddleware, Task.DeleteDailyTaskUpdate);

// Route to calculate project progress by projectId
adminRoute.get("/hours_spent_progress", Admin.authMiddleware, Project.calculateProjectProgress);





//Tickets routes

// Set up multer for handling file uploads
const upload = multer({
  dest: path.resolve('./uploads/'),  // Directory for storing uploaded files
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
});


// Define the route for creating tickets
adminRoute.post('/createTicket', Admin.authMiddleware, upload.array('attachments'), Ticket.createTicket);

// Get all tickets with project and assigned employee details
adminRoute.get('/getall_ticket', Admin.authMiddleware, Ticket.getTicketsWithDetails);

// Get a ticket by ID
adminRoute.get('/tickets/:id', Admin.authMiddleware, Ticket.getTicketById);

// // Update a ticket
// router.post('/updatetick/:id', User.authMiddleware, updateTicket);

adminRoute.post('/updatetick/:id', Admin.authMiddleware, Ticket.updateTicket);

adminRoute.post('/updatetickstatus', Admin.authMiddleware, Ticket.updateTicketStatus);


// Delete a ticket
adminRoute.delete('/tickets/:id', Admin.authMiddleware, Ticket.deleteTicket);


//Tasks routes

// Update UAT Status route (to be called when a user marks the task for UAT)
adminRoute.patch('/updateUATStatus', Admin.authMiddleware, Task.updateUATStatus);
// Route to get UAT tasks for testers
adminRoute.get("/tasks_uat", User.authMiddleware, Task.listUATTasksForTesters);

// Update Tester Approval route (tester can approve or reject the task)
adminRoute.patch('/updateTesterApproval', Admin.authMiddleware, Task.updateTesterApproval);


export default adminRoute;
