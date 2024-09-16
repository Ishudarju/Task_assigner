import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { Calendar } from "@/components/ui/calendar";
import UserCard from "@/components/UserCard";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-between gap-2 ">
      {/* left */}
      <div className="flex justify-center sm:justify-between gap-6 flex-wrap">
        <UserCard
          type="Projects"
          total="10"
          description="Total number of active projects"
        />
        <UserCard
          type="Not Started"
          total="120"
          description="Tasks that are yet to begin"
        />
        <UserCard
          type="In-Progress"
          total="120"
          description="Tasks currently being worked on"
        />
        <UserCard
          type="Completed"
          total="120"
          description="Tasks successfully completed"
        />
        <div className="w-full">
          <AnalyticsChart />
        </div>
      </div>
      {/* right */}
      <div className="hidden sm:block">
        <Calendar />
      </div>
    </div>
  );
};

export default page;
