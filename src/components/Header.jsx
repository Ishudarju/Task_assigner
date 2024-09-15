"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Instance from "@/api/BackendApi"; // Axios instance
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/Dark_nature.jpeg";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggler from "@/components/ThemeToggler";

const Header = () => {
  const router = useRouter();
  // const { id } = router.query; // Fetch dynamic admin ID from the URL
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data } = await Instance.get(`/admin/dashboard/`);
        setAdminData(data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setError("Failed to fetch data.");
        router.push('/auth')
      }
    };

    fetchAdminData();
  }, [router]);

  if (error) {
    return <div>{error}</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    router.push("/auth");
  };

  return (
    <div className="bg-primary-foreground dark:bg-primary-foreground text-white py-2 px-5 flex justify-between">
      <Link href="/">
        <Image
          src={logo}
          alt="TraversyPress"
          width={30}
          height={30}
          className="rounded-full"
        />
      </Link>

      <div className="flex items-center gap-2 pr-5">
        {adminData ? (
          <p className="text-slate-800 dark:text-secondary-foreground font-semibold">
            Welcome, {adminData.data.mail} !
          </p>
        ) : (
          <div>Loading...</div>
        )}
        <ThemeToggler />
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback className="text-black">BT</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-0">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button onClick={handleLogout} className="text-red-500">
                Logout
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
