
import {Ticket} from '../Model/Ticket_schema.js';
import fs from 'fs';
import path from 'path';
import  ProjectModel  from '../Model/Project_schema.js'; // Use named import

// Adjust the path based on your project structure


export const createTicket = async (req, res) => {
  const { title, description, project, assigned_to, priority, status } = req.body;

  console.log(req.user);

  // Check if the user has the correct role (Tester)
  if (req.user.role !== 'tester'|'admin') {
    return res.status(403).json({ status: false, message: 'No Authorization' });
  }

  // Validation: Ensure title, description, and project are provided
  if (!title || !description || !project) {
    return res.status(400).json({
      status: false,
      message: 'Title, Description, and Project are required',
    });
  }

  try {
    // Check if the project exists
    const projectExists = await ProjectModel.findById(project);
    if (!projectExists) {
      return res.status(404).json({ status: false, message: 'Project not found' });
    }

    // Ensure the 'uploads' directory exists (for storing files)
    const uploadDir = path.resolve('./uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Map uploaded files to attachments with file paths and uploaded_at timestamp
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map(file => ({
        file_url: path.join('uploads', file.filename), // Store the relative path
        uploaded_at: new Date(),
      }));
    }

    // Create a new ticket with the provided data
    const ticket = new Ticket({
      title,
      description,
      project,
      assigned_to,
      priority,
      status,
      raised_by: req.user.id,
      attachments, // Attach the files as an array of objects
    });

    // Save the ticket to the database
    await ticket.save();

    res.status(201).json({
      status: true,
      message: 'Ticket created successfully',
      ticket, // Return the created ticket object
    });
  } catch (error) {
    console.error('Error creating ticket:', error);

    // Clean up uploaded files in case of error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = path.join('uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Remove the uploaded files
        }
      });
    }

    res.status(500).json({
      status: false,
      message: 'Error creating ticket',
      error: error.message,
    });
  }
};


//return ticket to tester

// Assuming you already have the required imports for Ticket, User, etc.

export const updateTicketStatus = async (req, res) => {
  const { ticketId, status ,description} = req.body; // ticketId and status will be passed in the body

  try {
    // Fetch the ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ status: false, message: 'Ticket not found' });
    }

    // Check the user's role
    const user = req.user;

    // If the user is admin or tester, they can update the status of the ticket.
    if (user.role === 'admin' || user.role === 'tester') {
      // Only admins or testers can change status to 'Open', 'Closed', or 'Reopen'
      if (status && ['Open', 'In Progress', 'Resolved', 'Closed', 'Reopen'].includes(status)) {
        ticket.status = status;
      } else {
        return res.status(400).json({ status: false, message: 'Invalid status for your role' });
      }

      // If the user is a member, they can only set the status to 'In Progress' or 'Resolved'
      if (user.role === 'member') {
        if (status === 'In Progress' || status === 'Resolved') {
          ticket.status = status;
        } else {
          return res.status(400).json({ status: false, message: 'Members can only change status to "In Progress" or "Resolved"' });
        }
      }

      // If the member resolves the issue, return ticket to tester for confirmation
      if (ticket.status === 'Resolved') {

        if (description) {
          ticket.description = description;  // Update the description provided by the member
        } else {
          return res.status(400).json({ status: false, message: 'Description is required when resolving the ticket' });
        }

        ticket.assigned_to = ticket.raised_by; // Assign it back to the tester
      }

      // Save the updated ticket
      ticket.updated_at = new Date();
      await ticket.save();

        // Return the ticket to the tester after member resolves it
        if (ticket.status === 'Resolved' && user.role === 'member') {
          return res.status(200).json({
            status: true,
            message: 'Ticket resolved and returned to tester for confirmation',
            ticket: {
              ticketId: ticket._id,
              status: ticket.status,
              description: ticket.description,
              assigned_to: ticket.assigned_to,  // Assigned to tester after resolution
            },
          });
        }

      return res.status(200).json({
        status: true,
        message: `Ticket status updated to ${status}`,
        ticket, // Return the updated ticket
      });
    }

    // If the user is neither admin nor tester, they cannot update the status
    return res.status(403).json({ status: false, message: 'You are not authorized to update the status of this ticket' });

  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ status: false, message: 'Error updating ticket status', error: error.message });
  }
};






export const getTicketsWithDetails = async (req, res) => {
  try {

    if (req.user.role !== 'tester'||'admin') {
      return res.status(403).json({ status: false, message: 'No Authorization' });
    }

    const tickets = await Ticket.find()
      .populate('project', 'name description') // Populates project details
      .populate('assigned_to', 'name mail'); // Populates assigned employee details

      console.log(tickets);

    res.status(200).json({ message: 'Tickets fetched successfully', tickets });// Check if there are any projects    
    
    // Check if tickets are fetched
     if (!tickets) {
      return res.status(404).json({ status: false, message: 'No tickets found' });
    }


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};

// Get a ticket by ID with details

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
