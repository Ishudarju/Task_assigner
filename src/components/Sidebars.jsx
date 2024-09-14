'use client';
import { useState } from 'react';
import { LayoutDashboard, Newspaper, Folders, User, CreditCard, Settings } from 'lucide-react'; // Icon imports
import Link from 'next/link';

const SidebarMenu = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileOpen((prev) => !prev);
  };

  return (
    <div className="w-64 h-screen dark:bg-primary-foreground bg-primary-foreground p-4 ">
      <ul className="space-y-2">
        {/* Dashboard */}
        <li>
          <Link href="/" className="flex items-center p-2 hover:bg-gray-200 text-black dark:text-popover-foreground dark:hover:bg-muted-foreground rounded-md">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </li>

        {/* Posts */}
        <li>
          <Link href="/post" className="flex items-center p-2 hover:bg-gray-200 text-black dark:text-popover-foreground dark:hover:bg-muted-foreground rounded-md">
            <Newspaper className="mr-2 h-4 w-4" />
            <span>Posts</span>
          </Link>
        </li>

        {/* Categories */}
        <li>
          <Link href="#" className="flex items-center p-2 hover:bg-gray-200 text-black dark:text-popover-foreground dark:hover:bg-muted-foreground rounded-md">
            <Folders className="mr-2 h-4 w-4" />
            <span>Categories</span>
          </Link>
        </li>

        {/* Separator */}
        <hr className="my-2 border-gray-300" />

        {/* Profile with toggler */}
        <li>
          <button
            onClick={toggleProfileMenu}
            className="w-full text-left flex items-center p-2 hover:bg-gray-200 text-black dark:text-popover-foreground dark:hover:bg-muted-foreground rounded-md"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </button>

          {/* Profile Submenu (conditionally rendered) */}
          {isProfileOpen && (
            <ul className="pl-6 space-y-1">
              <li>
                <Link href="/profile/view" className="flex items-center p-2 hover:bg-gray-200 text-black dark:text-popover-foreground dark:hover:bg-muted-foreground rounded-md">
                  <span>View Profile</span>
                </Link>
              </li>
              <li>
                <Link href="/profile/edit" className="flex items-center p-2 hover:bg-gray-200 text-black dark:text-popover-foreground dark:hover:bg-muted-foreground rounded-md">
                  <span>Edit Profile</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Billing */}
        <li>
          <Link href="#" className="flex items-center p-2 hover:bg-gray-200 text-black dark:text-popover-foreground dark:hover:bg-muted-foreground rounded-md">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </Link>
        </li>

        {/* Settings */}
        <li>
          <Link href="#" className="flex items-center p-2 hover:bg-gray-200 text-black dark:text-popover-foreground dark:hover:bg-muted-foreground rounded-md">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarMenu;
