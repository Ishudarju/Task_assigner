"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const AdminDashboard = () => {
  const router = useRouter();
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
    //   try {
        const token = localStorage.getItem("auth-token");
        const response = await axios.get(
          'http://localhost:3001/admin/dashboard',
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
          
        );
        setAdminData(response.data);
    //   } catch (error) {
    //     console.error("Error fetching admin data:", error);
    //     setError("Failed to fetch data.");
    //     router.push("/login");
    //   }
    };

    fetchAdminData();
  }, [router]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {adminData ?(
        <div>
          <p>Welcome, {adminData.user}!</p>
          {/* Render other admin data here */}
        </div>
      ):(
        <div>something happende</div>
      )}
    </div>
  );
};

export default AdminDashboard;
