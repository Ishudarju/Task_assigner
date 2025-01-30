import express from "express";
import * as User from "../Controller/User_Controller.js";
import * as Admin from "../Controller/Admin_controller.js";
import * as Ticket from "../Controller/Ticket_controller.js";
import * as Task from "../Controller/Task_Controller.js";
import * as Project from "../Controller/Project_controller.js";
import * as Milestone from "../Controller/Milestone_controller.js";
import path from "path";

import multer from "multer";

import * as document from "../Controller/document_controller.js";


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
//Tickets routes

// Set up multer storage to control the destination and filename
const Ticketstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Ensure the uploads folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Timestamped file name
  }
});

// Initialize multer with the storage configuration
const uploads = multer({
  storage: Ticketstorage, // Use the custom storage config
  limits: { fileSize: 10 * 1024 * 1024 }, // File size limit (10 MB)
});


// userRoute.post("/createTicket", User.authMiddleware, Ticket.createTicket);
userRoute.post('/createTicket', Admin.authMiddleware, uploads.array('attachments'), Ticket.createTicket);

userRoute.post("/deleteTicket", Ticket.deleteTicket);



// Set up multer storage configuration
const storageprojects = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be uploaded
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Naming the file with timestamp to avoid name conflicts
  },
});

// File size limit of 10MB
const project_upload = multer({
  storage: storageprojects,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
}).single('attachment'); // 'attachment' is the name of the field in the form


userRoute.post('/createproject', User.authMiddleware,project_upload, Project.createProject);




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


// Route for getting resolved tickets (Manager only)
userRoute.get('/resolved-tickets', User.authMiddleware, Ticket.getResolvedTickets);

// Delete a ticket
userRoute.delete('/tickets/:id', User.authMiddleware, Ticket.deleteTicket);



// Update UAT Status route (to be called when a user marks the task for UAT)
userRoute.post('/updateUATStatus', User.authMiddleware, Task.updateUATStatus);


// Route to get UAT tasks for testers
userRoute.get("/tasks_uat", User.authMiddleware, Task.listUATTasksForTesters);

// Update Tester Approval route (tester can approve or reject the task)
userRoute.post('/updateTesterApproval', User.authMiddleware, Task.updateTesterApproval);




// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)); // Make filenames unique
  },
});

// const upload = multer({ storage: storage });

// Route to upload a file
userRoute.post("/uploaddocument", User.authMiddleware,upload.single("file"), document.uploadFile);







// Route to get all files
userRoute.get("/getAllfiles", User.authMiddleware,document.getAllFiles);

// Route to get a single file by ID
userRoute.get("/file/:id", User.authMiddleware,document.getFileById);

userRoute.delete('/deletefiles/:id', User.authMiddleware,document.deleteFiles);




export default userRoute;

