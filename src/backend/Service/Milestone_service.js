import cron from "node-cron";
import MilestoneModel from "../Model/Milestone_schema";
import TaskModel from "../Model/Task_scheme.js";

// 🔄 Run every 5 seconds
cron.schedule("*/5 * * * * *", async () => {
  console.log("🔄 Checking milestone statuses...");

  try {
    const milestones = await MilestoneModel.find().populate("tasks");

    for (const milestone of milestones) {
      const allTasksCompleted = milestone.tasks.every((task) => task.status === "Completed");
      if (milestone.developer_status !== "Completed" && allTasksCompleted) {
        milestone.developer_status = "Completed";
        await milestone.save();
        console.log(`✅ Milestone "${milestone.name}" marked as Completed.`);
      }
    }
  } catch (error) {
    console.error("❌ Error updating milestone statuses:", error);
  }
});
