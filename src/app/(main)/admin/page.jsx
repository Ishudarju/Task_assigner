import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { Calendar } from "@/components/ui/calendar";
import UserCard from "@/components/dashboard/UserCard";

const page = () => {
  return (
    <div className="flex justify-between gap-2 ">
      {/* left */}
      <div className="flex flex-wrap justify-center gap-6 ">
        <div className="flex justify-center md:justify-between gap-6 w-full">
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
        </div>
        <div className="w-full">
          <AnalyticsChart />
        </div>
      </div>
      {/* right */}
      <div className="hidden 2xl:block">
        <Calendar />
      </div>
    </div>
  );
};

export default page;
