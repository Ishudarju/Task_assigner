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
import { motion } from "framer-motion";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        id: 1,
        title: "Dashboard",
        icon: <User className="h-4 w-4" />,
        href: "/admin",
        visible: ["admin", "tl", "hr", "employee"],
      },
      {
        id: 2,
        title: "Manager",
        icon: <User className="h-4 w-4" />,
        href: "/user/manager",
        visible: ["admin"],
      },
      {
        id: 3,
        title: "HR",
        icon: <CreditCard className="h-4 w-4" />,
        href: "/user/hr",
        visible: ["admin"],
      },
      {
        id: 4,
        title: "TeamLeader",
        icon: <User className="h-4 w-4" />,
        href: "/user/tl",
        visible: ["admin"],
      },
      {
        id: 5,
        title: "Employee",
        icon: <User className="h-4 w-4" />,
        href: "/list/employee",
        visible: ["admin"],
      },
      {
        id: 6,
        title: "Task",
        icon: <User className="h-4 w-4" />,
        href: "/list/task",
        visible: ["admin", "tl", "hr", "employee"],
      },
      {
        id: 7,
        title: "Verify",
        icon: <User className="h-4 w-4" />,
        href: "/verify",
        visible: ["admin"],
      },
      {
        id: 8,
        title: "Ticket",
        icon: <User className="h-4 w-4" />,
        href: "/list/ticket",
        visible: ["admin", "tl", "employee", "manager"],
      },
    ],
  },
];

const SidebarMenu = () => {
  const [hover, setHover] = useState(null);

  const handleMouseEnter = (id) => {
    setHover(id);
  };
  const handleMouseLeave = () => {
    setHover(null);
  };

  return (
    <div className="bg-primary-foreground dark:bg-primary-foreground h-screen p-4 ">
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
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                  className="inline-flex items-center ml-5 relative mb-5 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors w-full"
                >
                  {item.icon}

                  {hover === item.id && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="absolute p-6 w-32 bg-primary-foreground text-sm rounded-tr-3xl z-50"
                    >
                      {item.title}
                    </motion.span>
                  )}
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
