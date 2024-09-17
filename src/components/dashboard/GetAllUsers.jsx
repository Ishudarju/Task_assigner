"use client";
import Instance from "@/api/BackendApi";
import UserCard from "./UserCard";
import SkeletonLoader from "../SkeletoLoader";
import { useEffect, useState } from "react";

const GetAllUsers = () => {
  const [userdetail, setUserdetail] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Instance.post("/admin/getEmpMails");
        if (response.data.status === true) {
          setUserdetail(response.data.data);
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
  return <div>
    {loading? (
      <SkeletonLoader />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {userdetail.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    )}
  </div>;
};

export default GetAllUsers;
