
import cron from "node-cron";
import { checkAndUpdateMilestoneStatus } from "../Controller/Milestone_controller.js";

// Schedule the cron job to run every minute
cron.schedule("* * * * *", async () => {
  console.log("⏳ Cron job started: Checking milestone statuses...");
  
  try {
    await checkAndUpdateMilestoneStatus();
    console.log("✅ Cron job completed successfully.");
  } catch (error) {
    console.error("❌ Error in cron job:", error);
  }
});



