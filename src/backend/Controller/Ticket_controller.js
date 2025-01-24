
import {Ticket} from '../Model/Ticket_schema.js';
// import { Ticket } from './models/Ticket';  // Adjust path to your Ticket model


import fs from 'fs';
import path from 'path';
import  ProjectModel  from '../Model/Project_schema.js'; // Use named import

// Adjust the path based on your project structure


// export const createTicket = async (req, res) => {
//   const { title, description, project, assigned_to, priority, status, main_category,
//     sub_category, } = req.body;

//   console.log(req.user);

//   // Check if the user has the correct role (Tester)
//   if (req.user.role !== 'tester'|'admin') {
//     return res.status(403).json({ status: false, message: 'No Authorization' });
//   }
//    // Validate required fields
//   if (!main_category || !sub_category) {
//     return res.status(400).json({
//       status: false,
//       message: 'Main category and Sub category are required',
//     });
//   }

//   // Validation: Ensure title, description, and project are provided
//   if (!title || !description || !project) {
//     return res.status(400).json({
//       status: false,
//       message: 'Title, Description, and Project are required',
//     });
//   }

//   try {
//     // Check if the project exists
//     const projectExists = await ProjectModel.findById(project);
//     if (!projectExists) {
//       return res.status(404).json({ status: false, message: 'Project not found' });
//     }

//     // Ensure the 'uploads' directory exists (for storing files)
//     const uploadDir = path.resolve('./uploads');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     // Map uploaded files to attachments with file paths and uploaded_at timestamp
//     let attachments = [];
//     if (req.files && req.files.length > 0) {
//       attachments = req.files.map(file => ({
//         file_url: path.join('uploads', file.filename), // Store the relative path
//         uploaded_at: new Date(),
//       }));
//     }

//     // Create a new ticket with the provided data
//     const ticket = new Ticket({
//       title,
//       description,
//       project,
//       assigned_to,
//       priority,
//       status,
//       main_category,
//       sub_category,
//       raised_by: req.user.id,
//       attachments, // Attach the files as an array of objects
//     });

//     // Save the ticket to the database
//     await ticket.save();

//     res.status(201).json({
//       status: true,
//       message: 'Ticket created successfully',
//       ticket, // Return the created ticket object
//     });
//   } catch (error) {
//     console.error('Error creating ticket:', error);

//     // Clean up uploaded files in case of error
//     if (req.files && req.files.length > 0) {
//       req.files.forEach(file => {
//         const filePath = path.join('uploads', file.filename);
//         if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath); // Remove the uploaded files
//         }
//       });
//     }

//     res.status(500).json({
//       status: false,
//       message: 'Error creating ticket',
//       error: error.message,
//     });
//   }
// };

export const createTicket = async (req, res) => {
  const { title, description, project, assigned_to, priority, status, main_category, sub_category } = req.body;

  // Ensure the user is authorized
  if (req.user.role !== 'tester' && req.user.role !== 'admin') {
    return res.status(403).json({ status: false, message: 'No Authorization' });
  }

  // Validation
  if (!main_category || !sub_category) {
    return res.status(400).json({ status: false, message: 'Main category and Sub category are required' });
  }

  if (!title || !description || !project) {
    return res.status(400).json({ status: false, message: 'Title, Description, and Project are required' });
  }

  try {
    // Check if project exists
    const projectExists = await ProjectModel.findById(project);
    if (!projectExists) {
      return res.status(404).json({ status: false, message: 'Project not found' });
    }
// Validate status for testers
    const testerAllowedStatuses = ['Open', 'Closed', 'Reopen'];
if (req.user.role === 'tester') {
  if (!status || !testerAllowedStatuses.includes(status)) {
    return res.status(400).json({
      status: false,
      message: `Testers can only set the status to: ${testerAllowedStatuses.join(', ')}`,
    });
  }
}


    // Handle attachments
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        file_url: path.join('uploads', file.filename), // Store file path
        uploaded_at: new Date(),
      }));
    }

    // Create a new ticket
    const ticket = new Ticket({
      title,
      description,
      project,
      assigned_to,
      priority,
      status,
      main_category,
      sub_category,
      raised_by: req.user.id,
      attachments,
    });

    // Save ticket
    await ticket.save();

    res.status(201).json({
      status: true,
      message: 'Ticket created successfully',
      ticket, // Return the created ticket
    });

  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ status: false, message: 'Error creating ticket', error: error.message });
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
    if (user.role === 'tester') {
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
    else if (['member', 'team lead', 'manager', 'hr', 'director'].includes(user.role)) {
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


//ishu corrected code
// getALLdetails
export const getTicketsWithDetails = async (req, res) => {
  try {
    console.log(req.user);

    // Check if the user has 'admin' or 'tester' role
    if (req.user.role !== 'tester' && req.user.role !== 'admin') {
      // If not admin or tester, we only show tickets assigned to this user
      const tickets = await Ticket.find({ assigned_to: req.user.id })
        .populate('project', 'name description') // Populates project details
        .populate('assigned_to', 'name mail'); // Populates assigned employee details

      // If no tickets are found for this user, send a message
      if (!tickets || tickets.length === 0) {
        return res.status(404).json({ status: false, message: 'No tickets found for this user' });
      }

      return res.status(200).json({ message: 'Tickets fetched successfully for this user', tickets });
    }

    // If admin or tester, show all tickets
    const tickets = await Ticket.find()
      .populate('project', 'name description') // Populates project details
      .populate('assigned_to', 'name mail'); // Populates assigned employee details

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ status: false, message: 'No tickets found' });
    }

    res.status(200).json({ message: 'Tickets fetched successfully', tickets });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};


// // getTicketsWithDetails
// export const getTicketsWithDetails = async (req, res) => {
//   try {
//     let tickets;

//     // Check if the user has 'admin' or 'tester' role
//     if (req.user.role !== 'tester' && req.user.role !== 'admin') {
//       // If not admin or tester, show tickets assigned to this user
//       tickets = await Ticket.find({ assigned_to: req.user.id })
//         .populate('project', 'name description')  // Populates project details
//         .populate('assigned_to', 'name mail')    // Populates assigned employee details
//         // .populate('tasks')  // Populates all fields of tasks associated with the ticket
//         .populate('tasks', 'task_title task_description assigned_to') // Only retrieves specific fields from the Task model


//       if (!tickets || tickets.length === 0) {
//         return res.status(404).json({ status: false, message: 'No tickets found for this user' });
//       }
//       return res.status(200).json({ message: 'Tickets fetched successfully for this user', tickets });
//     }

//     // Admin or tester role, fetch all tickets
//     tickets = await Ticket.find()
//       .populate('project', 'name description')  // Populates project details
//       .populate('assigned_to', 'name mail')    // Populates assigned employee details
//       .populate('tasks')  // Populates all fields of tasks associated with the ticket

//     if (!tickets || tickets.length === 0) {
//       return res.status(404).json({ status: false, message: 'No tickets found' });
//     }

//     res.status(200).json({ message: 'Tickets fetched successfully', tickets });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Error fetching tickets', error: error.message });
//   }
// };







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
    if (req.user.role === 'admin' || req.user.role === 'tester') {

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
