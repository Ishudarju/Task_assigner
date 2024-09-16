"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Table } from "./ui/table";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Task 1",
      description: "Description 1",
      status: "Pending",
      priority: "High",
    },
    {
      id: 2,
      title: "Task 2",
      description: "Description 2",
      status: "In Progress",
      priority: "Medium",
    },
  ]);

  const handleCreateTask = () => {
    // Logic to create a new task
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Task Management</h2>
      <Button onClick={handleCreateTask} variant="outline" className="mb-4">
        Create New Task
      </Button>
      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.status}</td>
              <td>{task.priority}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TaskManagement;
