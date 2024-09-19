"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Instance from "@/api/BackendApi";
import SkeletonLoader from "../SkeletoLoader";
import CreateTask from "../tasks/CreateTask";
import { Button } from "../ui/button";
import EditStatus from "../tasks/EditStatus";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"; // Ensure you are using Radix UI's dropdown components
import { Edit, TrashIcon } from "lucide-react";

const getpriority = (priority) => {
  switch (priority) {
    case "Critical":
      return "text-red-600";
    case "High":
      return "text-orange-600";
    case "Regular":
      return "text-blue-600";
    case "Low":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

const TaskManagement = () => {
  const [taskDetails, setTaskDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentpage] = useState(1);
  const tasksPerPage = 8;
  const [totalTasks, setTotalTasks] = useState(0);
  const totalPages = Math.ceil(totalTasks / tasksPerPage);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await Instance.post("/admin/getAllTask", {
          page: currentPage,
          limit: tasksPerPage,
        });
        if (response.data.status === true) {
          setTaskDetails(response.data.data);
        } else {
          console.error("Error fetching data:", response.data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentpage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentpage(currentPage - 1);
    }
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseDialog = () => {
    setSelectedTask(null);
  };

  const handleUpdateTask = (updatedTask) => {
    setTaskDetails((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id
          ? {
              ...task,
              status: updatedTask.status,
              task_description: updatedTask.task_description,
            }
          : task
      )
    );
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full justify-end gap-2">
        <CreateTask />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Task ID</TableHead>
            <TableHead className="w-[150px]">Title</TableHead>
            <TableHead className="w-[500px]">Description</TableHead>
            <TableHead>Assigned to</TableHead>
            <TableHead>Report to</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="text-center">Priority</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taskDetails.map((taskdetail) => (
            <TableRow key={taskdetail._id}>
              <TableCell className="font-medium text-primary">
                {taskdetail._id}
              </TableCell>
              <TableCell className="text-primary">
                {taskdetail.project_title}
              </TableCell>
              <TableCell className="text-primary overflow-hidden">
                {taskdetail.task_description}
              </TableCell>
              <TableCell className="text-primary">
                {taskdetail.assigned_to}
              </TableCell>
              <TableCell className="text-primary">
                {taskdetail.report_to}
              </TableCell>
              <TableCell className="text-primary">
                {taskdetail.status}
              </TableCell>
              <TableCell
                className={`text-primary w-[100px] rounded-md text-center  ${getpriority(
                  taskdetail.priority
                )}`}
              >
                {taskdetail.priority}
              </TableCell>
              <TableCell className="flex ">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Edit
                      className="text-primary text-sm"
                      onClick={() => handleEditClick(taskdetail)}
                    />
                  </DropdownMenuTrigger>
                  {selectedTask && selectedTask._id === taskdetail._id && (
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <EditStatus
                          taskId={selectedTask._id}
                          initialStatus={selectedTask.status}
                          initialDescription={selectedTask.task_description}
                          onClose={handleCloseDialog}
                          onUpdate={handleUpdateTask} // Update task in list
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
                <TrashIcon
                  className="text-primary text-sm"
                  onClick={() => handleEditClick(taskdetail)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={handlePrevPage}
          className="bg-primary text-primary-foreground"
        >
          Previous
        </Button>
        <span className="text-primary">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
          className="bg-primary text-primary-foreground"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TaskManagement;
