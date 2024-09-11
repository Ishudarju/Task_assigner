import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Instance from '@/api/BackendApi'; // Axios instance

const AdminDashboard = () => {
  const router = useRouter();
  const { id } = router.query; // Fetch dynamic admin ID from the URL
  const [adminData, setAdminData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await Instance.get(`/admin/dashboard/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAdminData(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setError("Failed to fetch data.");
      }
    };

    if (id) {
      fetchAdminData();
    }
  }, [id, router]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard for ID: {id}</h1>
      {adminData ? (
        <div>
          <p>Welcome, {adminData.data.name}!</p>
          {/* Render other admin-specific data */}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default AdminDashboard;
