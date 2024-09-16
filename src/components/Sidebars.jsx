"use client";
import { useState } from "react";
import {
  LayoutDashboard,
  Newspaper,
  Folders,
  User,
  CreditCard,
  Settings,
} from "lucide-react"; // Icon imports
import Link from "next/link";
import { role } from "@/data/data";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        title: "Dashboard",
        icon: <User className="h-4 w-4" />,
        href: "/",
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
        href: "/task",
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileOpen((prev) => !prev);
  };

  return (

    <div className="text-sm dark:bg-primary-foreground bg-primary-foreground h-screen">
      {menuItems.map((i) => (
        <div
          key={i.title}
          className="flex flex-col gap-2 text-primary dark:text-primary font-light"
        >
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.title}
                  className="flex items-center justify-center lg:justify-start gap-4 text-primary dark:text-primary"
                >
                  <span>{item.title}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default SidebarMenu;
