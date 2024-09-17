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
import SortingForm from "../SortingForm";
import CreateTask from "../CreateTask";

const getpriority = (priority) => {
  switch (priority) {
    case "High":
      return "text-red-600";
    case "Very High":
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
  const [taskdetails, setTaskdetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOptions, setSortOptions] = useState({
    sortBy: "title",
    sortOrder: "asc",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await Instance.post("/admin/getAllTask");
        if (response.data.status === "success") {
          let tasks = setTaskdetails(response.data.data.slice(0, 10));

          tasks.sort((a, b) => {
            if (sortOptions.sortBy === "priority") {
              const priorityOrder = {
                "Very High": 1,
                High: 2,
                Normal: 3,
                Low: 4,
              };
              return sortOptions.sortOrder === "asc"
                ? priorityOrder[a.priority] - priorityOrder[b.priority]
                : priorityOrder[b.priority] - priorityOrder[a.priority];
            } else if (a[sortOptions.sortBy] < b[sortOptions.sortBy]) {
              return sortOptions.sortOrder === "asc" ? -1 : 1;
            } else if (a[sortOptions.sortBy] > b[sortOptions.sortBy]) {
              return sortOptions.sortOrder === "asc" ? 1 : -1;
            }
            return 0;
          });
          setTaskdetails(response.data.data.slice(0, 10));
        } else {
          console.error("error fetch data:", response.data.message);
        }
      } catch (error) {
        console.error("error second", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [sortOptions]);

  const handleSortChange = (options) => {
    setSortOptions(options);
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      {/* <SortingForm handleSort={handleSortChange} /> */}
      <CreateTask className='mb-10'/>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {taskdetails.map((taskdetail) => (
            <TableRow key={taskdetail.id}>
              <TableCell className="font-medium text-primary">
                {taskdetail.taskid}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
export default TaskManagement;
