"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Instance from "../api/BackendApi";
import Image from "next/image";
import { HandIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  // const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setError("");
    // setSuccess("");
    setLoading(true);

    try {
      const response = await Instance.post("/admin/login", {
        mail,
        password,
      });

      if (response.status === 200 && response.data.status) {
        localStorage.setItem("auth-token", response.data.token);

        toast({
          title: "Login successful!",
          description: "Redirecting to the dashboard...",
          variant: "success",
        });
        setTimeout(() => {
          router.push(`/admin/dashboard/page`);
        }, 2000);
        // console.log(response.data.users.employee_id);
      }
    } catch (err) {
      toast({
        title: "Login failed!",
        description: "Please check your credentials and try again.",
        variant: "destructive", 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center m-auto dark:bg-black/80 ">
      <div className="flex items-center justify-center gap-32 px-16 py-5 border border-foreground rounded-xl shadow-lg">
      <motion.div
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -10, opacity: 0 }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h4 className="inline-flex items-center gap-4">
            Welcome Back <HandIcon />
          </h4>
          <p className="text-muted-foreground">
            A Brand new day is here.It&apos;s your day to shape. <br />
            Sing in and get started on your projects.
          </p>
          <div>
            <Label htmlFor="mail">Email</Label>
            <Input
              type="email"
              id="mail"
              placeholder="Email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <p className="text-muted-foreground">@2023 All Rights Reserved</p>
        </form>
      </motion.div>
      <motion.div
        initial={{ x: 10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 10, opacity: 0 }}
        className="max-sm:hidden"
      >
        <Image
          src="/Dark_nature.jpeg"
          width={300}
          height={500}
          alt="Picture of the author"
          className="rounded-xl"
        />
      </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
