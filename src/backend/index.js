import express from "express";
import cors from 'cors'
import connectDatabase from "./Model/db.js";
import userRoute from "./Routes/User_Route.js";
import adminRoute from "./Routes/Admin_Route.js";

import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000' // Replace with your frontend domain
}));

app.use(express.json());

app.use("/user", userRoute);

app.use("/admin", adminRoute);


app.get('/api/chart-data', (req, res) => {
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  res.json(chartData);
});

connectDatabase();

app.listen({port}, () => {
  console.log(`server running successfully ${port}`);
});
