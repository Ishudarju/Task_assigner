
import {Ticket} from '../Model/Ticket_schema.js';
import mongoose from 'mongoose';  // Add this import statement at the top of your file

// import { Ticket } from './models/Ticket';  // Adjust path to your Ticket model


import fs from 'fs';
import path from 'path';
import  ProjectModel  from '../Model/Project_schema.js'; // Use named import
// import { TaskModel } from '../Model/Task_scheme.js'



// Adjust the path based on your project structure




export const createTicket = async (req, res) => {
  const { title, description, project, document_name, assigned_to, tasks , priority, status, severity, main_category, sub_category } = req.body;

console.log("value",req.body);
  try {
    console.log(req.user);

    // Authorization Check
    if (req.user.department !== 'testing' && req.user.role !== 'admin') {
      return res.status(403).json({
        status: false,
        message: 'Access denied. Only users from the testing department or admins are authorized.',
      });
    }

    // // Validation for required fields
    if (!main_category || !sub_category) {
      return res.status(400).json({ status: false, message: 'Main category and Sub category are required.' });
    }

    if (!title || !description || !project) {
      return res.status(400).json({ status: false, message: 'Title, Description, and Project are required.' });
    }

    // Check if project exists
    const projectExists = await ProjectModel.findById(project);
    if (!projectExists) {
      return res.status(404).json({ status: false, message: 'Project not found.' });
    }

        // // Validate task existence (if provided)
        // if (tasks) {
        //   const taskExists = await TaskModel.findById(tasks);
        //   if (!taskExists) {
        //     return res.status(404).json({ status: false, message: 'Task not found.' });
        //   }
        // }// Check if tasks is provided and convert to ObjectId if necessary
       // Check if tasks is provided and convert to ObjectId if necessary
       let taskId = null;
       if (tasks) {
         // Ensure the tasks ID is valid as ObjectId
         if (!mongoose.Types.ObjectId.isValid(tasks)) {
           return res.status(400).json({ status: false, message: 'Invalid task ID.' });
         }
         taskId = new mongoose.Types.ObjectId(tasks); // Use `new` keyword here
       }



    

    // Validate status for testers
    if (req.user.department === 'testing') {
      const testerAllowedStatuses = ['Open', 'Closed', 'Reopen'];
      if (!status || !testerAllowedStatuses.includes(status)) {
        return res.status(400).json({
          status: false,
          message: `Testers can only set the status to: ${testerAllowedStatuses.join(', ')}`,
        });
      }
    }

    // Handle file attachments
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        file_url: `/uploads/${file.filename}`, // Use a consistent URL path
        uploaded_at: new Date(),
      }));
    }

    // Create a new ticket
    const ticket = new Ticket({
      title,
      description,
      project,
      document_name,
      assigned_to,
      priority,
      tasks,
      status,
      severity,
      main_category,
      sub_category,
      raised_by: req.user.id,
      attachments,
    });

    // Save ticket to database
    await ticket.save();

    res.status(201).json({
      status: true,
      message: 'Ticket created successfully',
      ticket, // Return the created ticket
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({
      status: false,
      message: 'An error occurred while creating the ticket.',
      error: error.message,
    });
  }
};




//return ticket to tester

// Assuming you already have the required imports for Ticket, User, etc.

export const updateTicketStatus = async (req, res) => {
  const { ticketId, status, description } = req.body;

  try {
    // Fetch the ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ status: false, message: 'Ticket not found' });
    }

    const user = req.user; // Logged-in user info
    const testerAllowedStatuses = ['Open', 'Closed', 'Reopen'];
    const userAllowedStatuses = ['In Progress', 'Resolved'];

    // **Tester Role**
    if (req.user.department == "testing") {
      if (status && testerAllowedStatuses.includes(status)) {
        ticket.status = status;
      } else {
        return res.status(400).json({
          status: false,
          message: `Testers can only update the status to: ${testerAllowedStatuses.join(', ')}`,
        });
      }
    }

    // **Other Users Role**
    else if (['member', 'team lead', 'manager', 'hr', 'director','admin'].includes(user.role)) {
      if (status && userAllowedStatuses.includes(status)) {
        if (status === 'Resolved') {
          if (!description) {
            return res.status(400).json({
              status: false,
              message: 'Description is required when resolving a ticket.',
            });
          }
          ticket.description = description; // Set description when resolving
          ticket.assigned_to = ticket.raised_by; // Reassign to tester for verification
        }
        ticket.status = status;
      } else {
        return res.status(400).json({
          status: false,
          message: `You are only allowed to update the status to: ${userAllowedStatuses.join(', ')}`,
        });
      }
    }

    // **Unauthorized Roles**
    else {
      return res.status(403).json({
        status: false,
        message: 'You are not authorized to update the status of this ticket.',
      });
    }

    // Save the updated ticket
    ticket.updated_at = new Date();
    await ticket.save();

    // Success Response
    return res.status(200).json({
      status: true,
      message: `Ticket status updated to ${status}`,
      ticket,
    });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({
      status: false,
      message: 'Error updating ticket status',
      error: error.message,
    });
  }
};

export const getResolvedTickets = async (req, res) => {
  try {
    const user = req.user;

    console.log(user);

    // Check if the user is a project manager
    if (user.role !== "manager") {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to view resolved tickets",
      });
    }

    // Fetch only resolved tickets related to the manager's project(s)
    const resolvedTickets = await Ticket.find({
      status: "Resolved",
      project: user.projectId, // Assuming projectId is stored in req.user
    }).populate("project tasks raised_by assigned_to"); // Populate references for better response

    return res.status(200).json({
      status: true,
      message: "Resolved tickets retrieved successfully",
      data: resolvedTickets,
    });
  } catch (error) {
    console.error("Error fetching resolved tickets:", error);
    res.status(500).json({
      status: false,
      message: "Error fetching resolved tickets",
      error: error.message,
    });
  }
};




export const getTicketsWithDetails = async (req, res) => {
  try {
    console.log(req.user);

    // Extract pagination parameters from the query
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Initialize status summary with default values (0 for all statuses)
    const initialStatusSummary = {
      Open: 0,
      "In Progress": 0,
      Resolved: 0,
      Closed: 0,
      Reopen: 0,
    };

    // Count tickets by status using aggregation
    const statusCounts = await Ticket.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Merge the aggregation results into the initialStatusSummary
    const statusSummary = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, initialStatusSummary);

    // Calculate total tickets
    const totalTickets = await Ticket.countDocuments();

    // Check if the user has 'admin' or 'tester' role
    if (req.user.department !== "testing" && req.user.role !== 'admin') {
      // If not admin or tester, show only tickets assigned to this user
      const tickets = await Ticket.find({ assigned_to: req.user.id })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .populate('project', 'name description') // Populate project details
        .populate('tasks', 'task_name') // Populate task details
        .populate('raised_by', 'name') // Populate raised_by user details
        .populate('assigned_to', 'name mail'); // Populate assigned employee details

      // Count total tickets for this user
      const userTotalTickets = await Ticket.countDocuments({ assigned_to: req.user.id });

      // If no tickets are found for this user, send a message
      if (!tickets || tickets.length === 0) {
        return res.status(404).json({ status: false, message: 'No tickets found for this user' });
      }

      return res.status(200).json({
        message: 'Tickets fetched successfully for this user',
        data: {
          tickets,
          total: userTotalTickets,
          pagination: {
            currentPage: pageNumber,
            totalPages: Math.ceil(userTotalTickets / limitNumber),
          },
          statusSummary,
          totalTickets,
        },
      });
    }

    // If admin or tester, show all tickets
    const tickets = await Ticket.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .populate('project', 'name description') // Populate project details
      .populate('tasks', 'task_name') // Populate task details
      .populate('raised_by', 'name') // Populate raised_by user details
      .populate('assigned_to', 'name mail'); // Populate assigned employee details

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ status: false, message: 'No tickets found' });
    }

    res.status(200).json({
      message: 'Tickets fetched successfully',
      data: {
        tickets,
        total: totalTickets,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalTickets / limitNumber),
        },
        statusSummary,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};




export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the ticket, populate project and assigned_to
    const ticket = await Ticket.findById(id)
      .populate('project', 'project_name project_description')  // Assuming 'project_name' and 'project_description' are the fields in your Project model
      .populate('assigned_to', 'name email');  // Assuming 'name' and 'email' are in your User model

    // If no ticket is found
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Return the ticket details
    res.status(200).json({
      status: true,
      message: 'Ticket found successfully',
      data: ticket,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error fetching ticket', error: error.message });
  }
};



// Update a ticket
// export const updateTicket = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     // Check if the ticket exists
//     const ticket = await Ticket.findById(id);
//     if (!ticket) {
//       return res.status(404).json({ message: 'Ticket not found' });
//     }

//     // Authorization: Both admin and tester can update any ticket
//     if (req.user.role === 'admin' || req.user.role === 'tester') {
//       // Admin and Tester can update all tickets
//       const updatedTicket = await Ticket.findByIdAndUpdate(id, updates, { new: true });
//       return res.status(200).json({
//         status: true,
//         message: 'Ticket updated successfully',
//         ticket: updatedTicket,
//       });
   
//     }
//     console.log("Ticket updated successfully", ticket);

//     // If not admin or tester, deny access
//     return res.status(403).json({ message: 'No Authorization' });

//   } catch (error) {
//     res.status(500).json({ message: 'Error updating ticket', error: error.message });
//   }
// };



// Update a ticket


export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("body",req.body);
    console.log("query",req.query);
    console.log("params",req.params);

    // Check if the ticket exists
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Authorization: Both admin and tester can update any ticket
    if (req.user.role === 'admin' || req.user.department!== "testing") {

      // console.log(req.user);
      // Build update object
      const updates = {};
      if (req.body.title) updates.title = req.body.title;
      if (req.body.description) updates.description = req.body.description;
      if (req.body.project) updates.project = req.body.project;

      if (req.body.assigned_to) updates.assigned_to = req.body.assigned_to;
      if (req.body.priority) updates.priority = req.body.priority;
      if (req.body.status) updates.status = req.body.status;
       console.log(req.body.status);
      if (req.body.severity) updates.severity = req.body.severity;

      // Handle file upload for attachments
      if (req.files && req.files.attachments) {
        const uploadedFiles = req.files.attachments.map((file) => ({
          file_url: file.path, // Save file path
          uploaded_at: new Date(),
        }));
        updates.attachments = uploadedFiles;
      }
      console.log('Status from request body:', req.body);


      // Update the updated_at timestamp
      updates.updated_at = new Date();

      // Update the ticket
      const updatedTicket = await Ticket.findByIdAndUpdate(id, updates, { new: true });

      return res.status(200).json({
        status: true,
        message: 'Ticket updated successfully',
        ticket: updatedTicket,
      });
    }

    // If not admin or tester, deny access
    return res.status(403).json({ message: 'No Authorization' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating ticket', error: error.message });
  }
};




// Delete a ticket
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTicket = await Ticket.findByIdAndDelete(id);

    if (!deletedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ticket', error: error.message });
  }
};
