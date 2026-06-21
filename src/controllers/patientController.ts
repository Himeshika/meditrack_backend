import { Response } from "express";
import Patient from "../models/patientModel";
import { AuthRequest } from "../middleware/authMiddleware";

/**
 * REGISTER PATIENT
 */
export const registerPatient = async (req: AuthRequest, res: Response) => {
    try {
        const {
            nic,
            firstName,
            lastName,
            dateOfBirth,
            gender,
            phone,
            address,
        } = req.body;

        // normalize NIC (important for consistency)
        const normalizedNIC = nic?.toString().toUpperCase();

        if (
            !normalizedNIC ||
            !firstName ||
            !lastName ||
            !dateOfBirth ||
            !gender ||
            !phone ||
            !address
        ) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const exPatient = await Patient.findOne({ nic: normalizedNIC });

        if (exPatient) {
            return res.status(400).json({
                message: "Patient with this NIC already exists",
            });
        }

        const patient = await Patient.create({
            nic: normalizedNIC,
            firstName,
            lastName,
            dateOfBirth,
            gender,
            phone,
            address,
        });

        return res.status(201).json({
            message: "Patient registered successfully",
            data: patient,
        });
    } catch (error: any) {
        console.log("REGISTER PATIENT ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to register patient",
            error: error.message,
        });
    }
};

/**
 * SEARCH PATIENT BY NIC
 */
export const searchPatientByNIC = async (req: AuthRequest, res: Response) => {
    try {
        const nic = req.params.nic?.toUpperCase();

        const patient = await Patient.findOne({ nic });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found",
            });
        }

        return res.status(200).json({
            message: "Patient fetched successfully",
            data: patient,
        });
    } catch (error: any) {
        console.log("SEARCH PATIENT ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to search patient",
            error: error.message,
        });
    }
};

/**
 * GET PATIENT BY ID
 */
export const getPatientById = async (req: AuthRequest, res: Response) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found",
            });
        }

        return res.status(200).json({
            message: "Patient fetched successfully",
            data: patient,
        });
    } catch (error: any) {
        console.log("GET PATIENT ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to fetch patient",
            error: error.message,
        });
    }
};

/**
 * UPDATE PATIENT
 */
export const updatePatient = async (req: AuthRequest, res: Response) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found",
            });
        }

        const { firstName, lastName, phone, address } = req.body;

        if (firstName) patient.firstName = firstName;
        if (lastName) patient.lastName = lastName;
        if (phone) patient.phone = phone;
        if (address) patient.address = address;

        await patient.save();

        return res.status(200).json({
            message: "Patient updated successfully",
            data: patient,
        });
    } catch (error: any) {
        console.log("UPDATE PATIENT ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to update patient",
            error: error.message,
        });
    }
};

/**
 * GET ALL PATIENTS
 */
export const getAllPatients = async (_req: AuthRequest, res: Response) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Patients fetched successfully",
            data: patients,
        });
    } catch (error: any) {
        console.log("GET ALL PATIENTS ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to fetch patients",
            error: error.message,
        });
    }
};