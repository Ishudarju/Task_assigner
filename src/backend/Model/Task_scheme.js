import mongoose from "mongoose";
// import { projectSchema } from './Project_schema';

const taskSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    task_description: {
      type: String,
      required: true,
    },
    task_title: {
      type: String,
      required: true,
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
      default: "Low",
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    milestone: {
      // Add this reference
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone", // Reference to the Milestone model
    },

    skill_improvement: [
      {
        sentFromId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        message: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    growth_assessment: [
      {
        sentFromId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        message: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    skills_approval_status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
    },
    skill_imp_reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const TaskModel = mongoose.model("Task", taskSchema);
