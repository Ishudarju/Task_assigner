"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import Instance from "@/api/BackendApi"; // Axios instance
import { toast, ToastContainer } from "react-toastify";

const CreateTask = () => {
  const [formData, setFormData] = useState({
    project_title: "",
    project_description: "",
    project_ownership: "",
    assigned_to: "",
    assigned_by: "", 
    report_to: "",
    status: "Not started",
    priority: "Normal",
    start_date: "",
    end_date: "",
    task_description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Instance.post("/admin/createTask", formData);
      console.log(response);
      
      if (response.data.status === "success") {
        toast.success(response.data.message);
      } else if (response.data.status === "failure"){
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Task</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[425px] overflow-y-scroll bg-primary-foreground text-primary">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new task.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Task Information Section */}
            <Label htmlFor="project_title">Project Title</Label>
            <Input
              id="project_title"
              name="project_title"
              value={formData.project_title}
              onChange={(e) => handleSelectChange("project_title", e.target.value)}
              required
            />

            <Label htmlFor="project_description">Project Description</Label>
            <Textarea
              id="project_description"
              name="project_description"
              value={formData.project_description}
              onChange={(e) => handleSelectChange("project_description", e.target.value)}
              required
            />

            <Label htmlFor="task_description">Task Description</Label>
            <Textarea
              id="task_description"
              name="task_description"
              value={formData.task_description}
              onChange={(e) => handleSelectChange("task_description", e.target.value)}
              required
            />

            {/* Priority and Status */}
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleSelectChange("priority", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Very High">Very High</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not started">Not started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Task Assignment Section */}
            <Label htmlFor="project_ownership">Project Ownership</Label>
            <Input
              id="project_ownership"
              name="project_ownership"
              value={formData.project_ownership}
              onChange={(e) => handleSelectChange("project_ownership", e.target.value)}
              required
            />

            <Label htmlFor="assigned_to">Assigned To</Label>
            <Input
              id="assigned_to"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={(e) => handleSelectChange("assigned_to", e.target.value)}
              required
            />

            <Label htmlFor="report_to">Report To</Label>
            <Input
              id="report_to"
              name="report_to"
              value={formData.report_to}
              onChange={(e) => handleSelectChange("report_to", e.target.value)}
              required
            />

            {/* Date Pickers */}
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => handleSelectChange("start_date", e.target.value)}
              required
            />

            <Label htmlFor="end_date">End Date</Label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => handleSelectChange("end_date", e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit">Create Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;
