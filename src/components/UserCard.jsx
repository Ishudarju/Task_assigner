import Image from "next/image";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from "./ui/card";

const UserCard = ({ type, total, description }) => {
  return (
    <Card className="w-[250px] max-h-36 ">
      <CardHeader>
        <CardTitle className="text-lg">{type}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>{total}</CardContent>
    </Card>
  );
};

export default UserCard;
