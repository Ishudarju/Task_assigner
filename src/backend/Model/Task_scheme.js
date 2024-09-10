import mongoose from "mongoose";

const taskScheme = new mongoose.Schema({
  project_title: {
    type: String,
    required: true,
  },
  project_description: {
    type: String,
    required: true,
  },
  project_ownership: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    // required: true,
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  assigned_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  report_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  status: {
    type: String,
    enum: ["Not started", "In progress", "Pending", "Completed", "Cancelled"],
    default: "Not started",
  },
  priority: {
    type: String,
    enum: ["Low", "Regular", "High", "Critical"],
    default: "low",
  },
  start_date: {
    type: String,
  },
  end_date: {
    type: String,
  },
  task_description: {
    type: String,
  },
  skill_improvement: [
    {
      type: Object,
      comments: {
        sentFromId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        message: { type: String },
        date: { type: Date, default: Date.now },
      },
    },
  ],
  skills_approval_status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
  },
  skill_imp_reviewed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  }
});

export const TaskModel = mongoose.model("task", taskScheme);
