
import express from 'express';
import * as User from '../Controller/User_Controller.js';
import* as Ticket from '../Controller/Ticket_controller.js';
import multer from 'multer';
import path from 'path';

// Set up multer for handling file uploads
const upload = multer({
  dest: path.resolve('./uploads/'),  // Directory for storing uploaded files
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
});

const router = express.Router();

// Define the route for creating tickets
router.post('/insert_ticket', User.authMiddleware,upload.array('attachments'), Ticket.createTicket);

// Get all tickets with project and assigned employee details
router.get('/getall_ticket', User.authMiddleware, Ticket.getTicketsWithDetails);

// Get a ticket by ID
router.get('/tickets/:id', User.authMiddleware, Ticket.getTicketById);

// // Update a ticket
// router.post('/updatetick/:id', User.authMiddleware, updateTicket);

router.post('/updatetick/:id', User.authMiddleware, Ticket.updateTicket);


// Delete a ticket
router.delete('/tickets/:id', User.authMiddleware, Ticket.deleteTicket);

export default router;



