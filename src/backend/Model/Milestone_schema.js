import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project", // Reference to the Project model
      required: true,
    },
    // due_date: {
    //   type: Date,
    //   required: true,
    // },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const MilestoneModel = mongoose.model("Milestone", milestoneSchema);
