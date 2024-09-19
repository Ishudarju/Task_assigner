"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import Instance from "@/api/BackendApi";
import { toast } from "react-toastify";

const EditStatus = ({
  taskId,
  initialStatus,
  initialDescription,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    id: taskId || "",
    status: initialStatus || "Not started",
    task_description: initialDescription || "",
  });

  useEffect(() => {
    setFormData({
      id: taskId,
      status: initialStatus,
      task_description: initialDescription,
    });
  }, [initialStatus, initialDescription, taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Instance.post("/admin/editStatus", {
        id: formData.id,
        status: formData.status,
        task_description: formData.task_description,
      });

      if (response.data.status === "success") {
        toast.success(response.data.message);
        onUpdate(formData);
        onClose(); // Close the dialog after successful update
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update the task.");
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      {" "}
      <DialogContent className="max-h-[425px] overflow-y-scroll bg-primary-foreground text-primary">
        <DialogHeader>
          <DialogTitle>Edit Status</DialogTitle>
          <DialogDescription>
            Modify the details of the selected task.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Label htmlFor="task_description">Task Description</Label>
            <Textarea
              id="task_description"
              name="task_description"
              value={formData.task_description}
              onChange={(e) =>
                handleSelectChange("task_description", e.target.value)
              }
            />

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
                <SelectItem value="In progress">In Progress</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" className="mt-4">
              Update Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStatus;
