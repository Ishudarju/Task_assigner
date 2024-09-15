"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Instance from "@/api/BackendApi";
import Image from "next/image";
import { HandIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

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

        toast.success("Login successful! Redirecting to the dashboard...");
        setTimeout(() => {
          router.push(`/`);
        }, 2000);
      }
    } catch (err) {
      toast.error("Login failed! Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center m-auto">
      <div className="flex items-center justify-center gap-32 px-16 py-5 border border-primary rounded-xl shadow-lg">
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -10, opacity: 0 }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h4 className="inline-flex items-center gap-4 text-primary">
              Welcome Back <HandIcon />
            </h4>
            <p className="text-muted-foreground">
              A Brand new day is here.It&apos;s your day to shape. <br />
              Sing in and get started on your projects.
            </p>
            <div>
              <Label htmlFor="mail" className="text-primary dark:text-primary">
                Email
              </Label>
              <Input
                type="email"
                id="mail"
                placeholder="Email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
                className="text-primary"
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-primary dark:text-primary"
              >
                Password
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-primary"
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
