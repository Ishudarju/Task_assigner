"use client";
import { useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  Folders,
  User,
  CreditCard,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { role } from "@/data/data"; // Import role statically


const menuItems = [
  {
    title: "MENU",
    items: [
      {
        title: "Dashboard",
        icon: <User className="h-4 w-4" />,
        href: "/admin",
        visible: ["admin", "tl", "hr", "employee"],
      },
      {
        title: "Manager",
        icon: <User className="h-4 w-4" />,
        href: "/user/manager",
        visible: ["admin"],
      },
      {
        title: "HR",
        icon: <CreditCard className="h-4 w-4" />,
        href: "/user/hr",
        visible: ["admin"],
      },
      {
        title: "TeamLeader",
        icon: <User className="h-4 w-4" />,
        href: "/user/tl",
        visible: ["admin"],
      },
      {
        title: "Employee",
        icon: <User className="h-4 w-4" />,
        href: "/user/employee",
        visible: ["admin"],
      },
      {
        title: "Task",
        icon: <User className="h-4 w-4" />,
        href: "/list/task",
        visible: ["admin", "tl", "hr", "employee"],
      },
      {
        title: "Verify",
        icon: <User className="h-4 w-4" />,
        href: "/verify",
        visible: ["admin"],
      },
      {
        title: "Ticket",
        icon: <User className="h-4 w-4" />,
        href: "/ticket",
        visible: ["admin", "tl", "employee", "manager"],
      },
    ],
  },
];

const SidebarMenu = () => {
  
  return (
    <div className="bg-primary-foreground dark:bg-primary-foreground h-screen p-4">
      {menuItems.map((section) => (
        <div
          key={section.title}
          className="flex flex-col gap-2 text-primary dark:text-primary font-light"
        >
          {section.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.title}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors"
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              );
            }
            return null; // Don't render if role is not visible
          })}
        </div>
      ))}

      {/* <div className="mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              Profile
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>

        </DropdownMenu>
      </div> */}
    </div>
  );
};

export default SidebarMenu;
