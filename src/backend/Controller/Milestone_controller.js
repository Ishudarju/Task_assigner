import MilestoneModel from "../Model/Milestone_schema.js"; // Ensure you import the Milestone model
import ProjectModel from "../Model/Project_schema.js"; // Ensure you import the Project model


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
