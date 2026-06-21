import { Response } from "express";
import Appointment from "../models/appointmentModel";
import Patient from "../models/patientModel";
import { AuthRequest } from "../middleware/authMiddleware";

export const createAppointment = async (req: AuthRequest, res: Response) => {
    try {
        const { patientId, doctorId, appointmentDate, notes } = req.body;

        if (!patientId || !doctorId || !appointmentDate) {
            return res.status(400).json({
                message: "Patient ID, doctor ID and appointment date are required",
            });
        }

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found",
            });
        }

        const appointment = await Appointment.create({
            patient: patientId,
            doctor: doctorId,
            appointmentDate,
            notes,
        });

        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate("patient", "nic firstName lastName phone")
            .populate("doctor", "name email role");

        return res.status(201).json({
            message: "Appointment scheduled successfully",
            data: populatedAppointment,
        });
    } catch (error: any) {
        console.log("CREATE APPOINTMENT ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to create appointment",
            error: error.message,
        });
    }
};

export const getAppointmentsByPatient = async (req: AuthRequest, res: Response) => {
    try {
        const { patientId } = req.params;

        const appointments = await Appointment.find({ patient: patientId })
            .populate("doctor", "name email role")
            .sort({ appointmentDate: -1 });

        return res.status(200).json({
            message: "Appointments fetched successfully",
            data: appointments,
        });
    } catch (error: any) {
        console.log("GET APPOINTMENTS ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to fetch appointments",
            error: error.message,
        });
    }
};

export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                message: "Status is required",
            });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
            .populate("patient", "nic firstName lastName")
            .populate("doctor", "name email role");

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found",
            });
        }

        return res.status(200).json({
            message: "Appointment status updated successfully",
            data: appointment,
        });
    } catch (error: any) {
        console.log("UPDATE APPOINTMENT STATUS ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to update appointment status",
            error: error.message,
        });
    }
};

export const getAllAppointments = async (req: AuthRequest, res: Response) => {
    try {
        const appointments = await Appointment.find()
            .populate("patient", "nic firstName lastName phone")
            .populate("doctor", "name email role")
            .sort({ appointmentDate: -1 });

        return res.status(200).json({
            message: "All appointments fetched successfully",
            data: appointments,
        });
    } catch (error: any) {
        console.log("GET ALL APPOINTMENTS ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to fetch appointments",
            error: error.message,
        });
    }
};
