import MilestoneModel from "../Model/Milestone_schema.js"; // Ensure you import the Milestone model
import ProjectModel from "../Model/Project_schema.js"; // Ensure you import the Project model
import { TaskModel } from "../Model/Task_scheme.js";
import cron from "node-cron";



export const deleteMilestone = async (req, res) => {   
    try {
        const milestone = await MilestoneModel.findByIdAndDelete(req.params.id);
        if (!milestone) {
            return res.status(404).json({ message: "Milestone not found" });
        }
        res.status(200).json({ message: "Milestone deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
 }


 export const getMilestonesForConsentProjects = async (req, res) => {
    try {
        const { projectId } = req.body;
        console.log("projectId",projectId);
        // Validate project ID
        if (!projectId || !projectId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid project ID" });
        }

        // Fetch milestones for consent projects
        const milestones = await MilestoneModel.find({project: projectId});


        if (!milestones || milestones.length === 0) {
            return res.status(404).json({ status:false,message: "No milestones found for consent projects" });
        }

        // Success response
        return res.status(200).json(milestones);
    } catch (error) {
        // Log error for debugging
        console.error("Error fetching milestones for consent projects:", error);

        // Internal server error response
        return res.status(500).json({ message: "An error occurred while retrieving milestones" });
    }
    
};


//changes








// Function to check and update milestone developer_status
// const updateMilestoneStatus = async () => {
//   try {
//     const milestones = await MilestoneModel.find({ is_deleted: false });

//     for (const milestone of milestones) {
//       const tasks = await TaskModel.find({ milestone: milestone._id, is_deleted: false });
//       const allTasksCompleted = tasks.every(task => task.status === "Completed");

//       if (allTasksCompleted) {
//         await MilestoneModel.findByIdAndUpdate(milestone._id, { developer_status: "Completed" });
//       } else {
//         await MilestoneModel.findByIdAndUpdate(milestone._id, { developer_status: "In Progress" });
//       }
//     }
//   } catch (error) {
//     console.error("Error updating milestone developer status:", error);
//   }
// };


// // Schedule the cron job to run every minute
// cron.schedule("* * * * *", updateMilestoneStatus);

// export { updateMilestoneStatus };

// updateMilestoneStatus().then(() => console.log("Milestone status updated!"));

//developer side



export const getMilestones_project_WithTasks_status = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Fetch all milestones related to the project
    const milestones = await MilestoneModel.find({ project: projectId, is_deleted: false });

    // Fetch tasks related to each milestone
    const milestonesWithTasks = await Promise.all(
      milestones.map(async (milestone) => {
        // Get tasks linked to this milestone
        const tasks = await TaskModel.find({ milestone: milestone._id });

        // Check if all tasks are completed
        const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.status === "Completed");

        // Add task details to the milestone response
        return {
          ...milestone.toObject(),
          tasks: tasks.map(task => ({
            _id: task._id,
            name: task.name,
            status: task.status,
            role: task.role,
          })),
          allTasksCompleted: allTasksCompleted ? "Yes" : "No"
        };
      })
    );

    // Determine the overall developer status for the project
    const overallDeveloperStatus = milestonesWithTasks.every(milestone => milestone.developer_status === "Completed") 
      ? "Completed" 
      : "In Progress";

    res.status(200).json({
      success: true,
      developer_status: overallDeveloperStatus,
      milestones: milestonesWithTasks,
    });
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// export const checkAndUpdateMilestoneStatus = async () => {
//   try {
//     console.log("⏳ Checking milestone statuses...");

//     const milestones = await MilestoneModel.find({}).lean(); // ✅ Read optimization

//     for (const milestone of milestones) {
//       const tasks = await TaskModel.find({
//         milestone: milestone._id,
//         role: { $in: ["Member", "Admin"] },
//       }).lean();

//       const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.status === "Completed");
//       const newStatus = allTasksCompleted ? "Completed" : "In Progress";

//       // ✅ Only update if there's a change
//       if (milestone.developer_status !== newStatus) {
//         await MilestoneModel.findByIdAndUpdate(
//           milestone._id,
//           { developer_status: newStatus, updatedAt: new Date() }, // ✅ Ensure timestamps update
//           { new: true }
//         );
//         console.log(`✅ Milestone "${milestone.name}" updated to "${newStatus}"`);
//       }
//     }
//     console.log("✅ All milestone statuses updated successfully.");
//   } catch (error) {
//     console.error("❌ Error updating milestone status:", error);
//   }
// };



export const checkAndUpdateMilestoneStatus = async () => {
  try {
    console.log("⏳ Checking milestone statuses...");

    const milestones = await MilestoneModel.find({ is_deleted: false }).lean();

    for (const milestone of milestones) {
      const tasks = await TaskModel.find({
        milestone: milestone._id,
        role: { $in: ["Member", "Admin"] },
      }).lean();

      const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.status === "Completed");
      const newStatus = allTasksCompleted ? "Completed" : "In Progress";

      if (milestone.developer_status !== newStatus) {
        await MilestoneModel.findByIdAndUpdate(
          milestone._id,
          { developer_status: newStatus, updatedAt: new Date() },
          { new: true }
        );
        console.log(`✅ Milestone "${milestone.name}" updated to "${newStatus}"`);
      }
    }
    console.log("✅ Milestone status check complete.");
  } catch (error) {
    console.error("❌ Error updating milestone status:", error);
  }
};
