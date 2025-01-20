// import mongoose from "mongoose";
// // import { projectSchema } from './Project_schema';

// const taskSchema = new mongoose.Schema(
//   {
//     project: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Project",
//       required: true,
//     },
//     task_description: {
//       type: String,
//       required: true,
//     },
//     task_title: {
//       type: String,
//       required: true,
//     },
//     assigned_to: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//     },
//     assigned_by: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//     },
//     report_to: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//     },
//     status: {
//       type: String,
//       enum: ["Not started", "In progress", "Pending", "Completed", "Cancelled"],
//       default: "Not started",
//     },
//     priority: {
//       type: String,
//       enum: ["Low", "Regular", "High", "Critical"],
//       default: "Low",
//     },
//     start_date: {
//       type: Date,
//     },
//     end_date: {
//       type: Date,
//     },
//     milestone: {
//       // Add this reference
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Milestone", // Reference to the Milestone model
//     },
//     daily_updates: [
//       {
//         date: { type: Date, default: Date.now },
//         description: { type: String, required: true },
//       },
//     ],

//     skill_improvement: [
//       {
//         sentFromId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "user",
//         },
//         message: { type: String },
//         date: { type: Date, default: Date.now },
//       },
//     ],
//     growth_assessment: [
//       {
//         sentFromId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "user",
//         },
//         message: { type: String },
//         date: { type: Date, default: Date.now },
//       },
//     ],
//     skills_approval_status: {
//       type: String,
//       enum: ["Pending", "Approved", "Rejected"],
//     },
//     skill_imp_reviewed_by: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//     },
//     is_deleted: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const TaskModel = mongoose.model("Task", taskSchema);










import mongoose from "mongoose";

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
      minlength: 5,
      maxlength: 500,
    },
    task_title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
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
      validate: {
        validator: function (value) {
          return !this.start_date || value > this.start_date;
        },
        message: "End date must be later than start date",
      },
    },
    milestone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone",
    },

    daily_updates: [
      {
        date: { type: Date, default: Date.now },
        description: { type: String, required: false },  // Optional field
        hours_spent: {
          type: Number,
          required: false, // Optional hours_spent field
          min: [0, "Hours spent must be a non-negative value"],
        },
      },
    ],
    skill_improvement: [
      {
        sentFromId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        message: { type: String, maxlength: 500 },
        date: { type: Date, default: Date.now },
      },
    ],
    growth_assessment: [
      {
        sentFromId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        message: { type: String, maxlength: 500 },
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

taskSchema.index({ project: 1 });
taskSchema.index({ assigned_to: 1 });
taskSchema.query.notDeleted = function () {
  return this.where({ is_deleted: false });
};

export const TaskModel = mongoose.model("Task", taskSchema);
