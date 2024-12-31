import mongoose from "mongoose";

const UserScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  admin_verify: {
    type: String,
    default: false,  
  },
  employee_id: {
    type: String,
  },
  department: {
    type: String,
  },
  starting_date: {
    type: String,
    required: true,
  },
  lastWorking_date: {
    type: String,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

export const UserModel = mongoose.model("user", UserScheme);
