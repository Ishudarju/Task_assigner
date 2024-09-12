import React from "react";
import Header from "@/components/Header";
import AdminLogin from '@/components/AdminLogin'

const page = () => {
  return (
    <div className="bg-white dark:bg-primary min-h-screen">
      <Header />
      <AdminLogin/>
    </div>
  );
};

export default page;
