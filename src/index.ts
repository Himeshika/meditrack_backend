import dotenv from "dotenv";
dotenv.config();

import dns from "node:dns"
dns.setServers(["8.8.8.8", "8.8.4.4"])

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Request, Response } from "express";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import patientRoutes from "./routes/patientRoutes";
import visitRoutes from "./routes/visitRoutes";
import medicalFileRoutes from "./routes/medicalFileRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

console.log(MONGO_URI)

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("MediTrack API running");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);                  // ADMIN only
app.use("/api/v1/patients", patientRoutes);             // DOCTOR + RECEPTIONIST
app.use("/api/v1/visits", visitRoutes);                 // DOCTOR only
app.use("/api/v1/medical-files", medicalFileRoutes);    // DOCTOR only
app.use("/api/v1/appointments", appointmentRoutes);     // RECEPTIONIST + DOCTOR

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("MongoDB connection failed");
        console.log(err.message);
    });

app.listen(PORT, () => {
    console.log("App listening on port: " + PORT);
});
