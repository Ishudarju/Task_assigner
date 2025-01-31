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
import * as document from "../Controller/document_controller.js";
// import upload_project from "../middleware/upload.js";


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
adminRoute.post("/approve", User.authMiddleware,User.approveUserByHR);




adminRoute.post("/delete", Admin.authMiddleware, User.deleteUser);
adminRoute.post("/findById", Admin.authMiddleware, User.findById);
adminRoute.post("/empid-generate", Admin.authMiddleware, User.empid_generate);

// adminRoute.post("/updateTicket", Admin.authMiddleware, Ticket.updateTicket);
// Multer Storage Setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });



// adminRoute.post("/getAllTicket", Admin.authMiddleware, Ticket.getAllTicket);
adminRoute.post("/getTicketById", Ticket.getTicketById);

// adminRoute.post(
//   "/getTicketByCategory",
//   Admin.authMiddleware,
//   Ticket.getTicketByCategory
// );

// Set up multer storage configuration
const projectstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be uploaded
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Naming the file with timestamp to avoid name conflicts
  },
});

// File size limit of 10MB
const project_upload = multer({
  storage: projectstorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
}).single('attachment'); // 'attachment' is the name of the field in the form


// Route for creating a project
adminRoute.post('/createproject', Admin.authMiddleware,project_upload, Project.createProject);



adminRoute.post(  "/getAllProjects",  Admin.authMiddleware, Project.getAllProjectsPagination);

adminRoute.put("/updateProject", Admin.authMiddleware, project_upload,Project.updateProject);

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

// Set up multer storage to control the destination and filename
const Ticket_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Ensure the uploads folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Timestamped file name
  }
});

// Initialize multer with the storage configuration
const upload = multer({
  storage: Ticket_storage, // Use the custom storage config
  limits: { fileSize: 10 * 1024 * 1024 }, // File size limit (10 MB)
});

// Define the route for creating tickets
adminRoute.post('/createTicket', Admin.authMiddleware, upload.array('attachments'), Ticket.createTicket);

adminRoute.post("/updateTicket", Admin.authMiddleware,upload.array("attachments"), Ticket.updateTicket); // Ensure file uploads work

// Get all tickets with project and assigned employee details
adminRoute.get('/getall_ticket', Admin.authMiddleware, Ticket.getTicketsWithDetails);

// Get a ticket by ID
adminRoute.get('/tickets/:id', Admin.authMiddleware, Ticket.getTicketById);

// // Update a ticket

// adminRoute.put('/updateticket/:id', Admin.authMiddleware, Ticket.updateTicket);
// adminRoute.post("/updateTicket", Admin.authMiddleware, Ticket.updateTicket);

adminRoute.post('/updatetickstatus', Admin.authMiddleware, Ticket.updateTicketStatus);


// Delete a ticket
adminRoute.delete('/deleteTickets/:id', Admin.authMiddleware, Ticket.deleteTicket);


//Tasks routes

// Update UAT Status route (to be called when a user marks the task for UAT)
adminRoute.patch('/updateUATStatus', Admin.authMiddleware, Task.updateUATStatus);
// Route to get UAT tasks for testers
adminRoute.get("/tasks_uat", User.authMiddleware, Task.listUATTasksForTesters);

// Update Tester Approval route (tester can approve or reject the task)
adminRoute.patch('/updateTesterApproval', Admin.authMiddleware, Task.updateTesterApproval);

//document routes

// Route to upload a file
adminRoute.post("/upload", Admin.authMiddleware,upload.single("file"), document.uploadFile);

// Route to get all files
adminRoute.get("/getAllfiles", Admin.authMiddleware,document.getAllFiles);

// Route to get a single file by ID
adminRoute.get("/file/:id", Admin.authMiddleware,document.getFileById);

adminRoute.delete('/deletefiles', Admin.authMiddleware,document.deleteFiles);



export default adminRoute;
