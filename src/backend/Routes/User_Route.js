import express from "express";
import *as User from "../Controller/User_Controller.js";
import*as Ticket from "../Controller/Ticket_controller.js"
import * as Task from "../Controller/Task_Controller.js"
import multer from "multer";
 
const userRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


userRoute.post("/login", User.user_login);

userRoute.post("/create",User.createUser);

// hr,manager,team lead,employee - dashbroad 
userRoute.post("/dashboard",User.authMiddleware,User.user_dashboard);

// userRoute.post("/update",createUser);
userRoute.post("/getAllEmployee",User.authMiddleware,User.getAllEmployee)

userRoute.post("/editStatus", Task.editTaskStatus);

userRoute.get("/exportXLSX",User.exportXLSX);
// userRoute.post("/profie", View_profile);

userRoute.post("/importXLSX",upload.single('file'),User.importXLSX);

userRoute.post("/createTicket",User.authMiddleware,Ticket.createTicket)
userRoute.post("/deleteTicket",Ticket.deleteTicket)

 export default userRoute;