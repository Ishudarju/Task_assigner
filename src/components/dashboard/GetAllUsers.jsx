"use client";
import Instance from "@/api/BackendApi";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-200">
      <div className="w-16 h-16 rounded-full bg-white">
        <Skeleton width={32} height={32} />
      </div>
      <div className="ml-4">
        <Skeleton width={150} height={16} />
        <Skeleton width={150} height={16} />
      </div>
    </div>
  );
}

const GetAllUsers = () => {
  const [userdetail, setUserdetail] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Instance.post("/admin/getEmpMails");
        if (response.data.status === true) {
          setUserdetail(response.data.data);
          console.log(response.data.data);
          
        } else {
          console.error("error fetch dat", response.data.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  return (
    <div>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {userdetail.map((user) => (
            <div key={user.id}>
              <h1 className="text-primary">{user.name}</h1>
              <h1 className="text-primary">{user.mail}</h1>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetAllUsers;
