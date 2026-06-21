import { Response } from "express";
import Visit from "../models/visitModel";
import Patient from "../models/patientModel";
import MedicalFile from "../models/medicalFileModel";
import { AuthRequest } from "../middleware/authMiddleware";
import { generatePatientSummary } from "../services/aiSummaryService";

export const createVisit = async (req: AuthRequest, res: Response) => {
    try {
        const { patientId, symptoms, diagnosis, prescription, notes, visitDate } = req.body;

        if (!patientId || !symptoms || !diagnosis || !prescription) {
            return res.status(400).json({
                message: "Patient ID, symptoms, diagnosis and prescription are required",
            });
        }

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found",
            });
        }

        const visit = await Visit.create({
            patient: patientId,
            doctor: req.user?.id,
            symptoms,
            diagnosis,
            prescription,
            notes,
            visitDate: visitDate || Date.now(),
        });

        const populatedVisit = await Visit.findById(visit._id)
            .populate("patient", "nic firstName lastName")
            .populate("doctor", "name email role");

        return res.status(201).json({
            message: "Visit record created successfully",
            data: populatedVisit,
        });
    } catch (error: any) {
        console.log("CREATE VISIT ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to create visit",
            error: error.message,
        });
    }
};

export const getPatientVisitHistory = async (req: AuthRequest, res: Response) => {
    try {
        const { patientId } = req.params;

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found",
            });
        }

        const visits = await Visit.find({ patient: patientId })
            .populate("doctor", "name email role")
            .sort({ visitDate: -1 });

        const medicalFiles = await MedicalFile.find({ patient: patientId })
            .populate("uploadedBy", "name email role")
            .sort({ uploadedAt: -1 });

        return res.status(200).json({
            message: "Patient history fetched successfully",
            data: {
                patient,
                visits,
                medicalFiles,
            },
        });
    } catch (error: any) {
        console.log("GET PATIENT HISTORY ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to fetch patient history",
            error: error.message,
        });
    }
};

export const getVisitById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const visit = await Visit.findById(id)
            .populate("patient", "nic firstName lastName dateOfBirth gender phone")
            .populate("doctor", "name email role");

        if (!visit) {
            return res.status(404).json({
                message: "Visit not found",
            });
        }

        return res.status(200).json({
            message: "Visit fetched successfully",
            data: visit,
        });
    } catch (error: any) {
        console.log("GET VISIT ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to fetch visit",
            error: error.message,
        });
    }
};

export const updateVisit = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { symptoms, diagnosis, prescription, notes } = req.body;

        const visit = await Visit.findById(id);

        if (!visit) {
            return res.status(404).json({
                message: "Visit not found",
            });
        }

        if (visit.doctor.toString() !== req.user?.id) {
            return res.status(403).json({
                message: "You can only update your own visit records",
            });
        }

        if (symptoms) visit.symptoms = symptoms;
        if (diagnosis) visit.diagnosis = diagnosis;
        if (prescription) visit.prescription = prescription;
        if (notes) visit.notes = notes;

        await visit.save();

        return res.status(200).json({
            message: "Visit updated successfully",
            data: visit,
        });
    } catch (error: any) {
        console.log("UPDATE VISIT ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to update visit",
            error: error.message,
        });
    }
};

export const getAIPatientSummary = async (req: AuthRequest, res: Response) => {
    try {
        const { patientId } = req.params;

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found",
            });
        }

        const visits = await Visit.find({ patient: patientId })
            .populate("doctor", "name")
            .sort({ visitDate: -1 });

        if (visits.length === 0) {
            return res.status(400).json({
                message: "No visit records found for this patient",
            });
        }

        const visitsText = visits
            .map(
                (v, i) =>
                    `Visit ${i + 1} (${new Date(v.visitDate).toDateString()}):\n` +
                    `Symptoms: ${v.symptoms}\n` +
                    `Diagnosis: ${v.diagnosis}\n` +
                    `Prescription: ${v.prescription}\n` +
                    `Notes: ${v.notes || "None"}`
            )
            .join("\n\n");

        const prompt =
            `You are a medical assistant. Based on the following patient visit history, provide:\n` +
            `1. A short medical history summary\n` +
            `2. Any recurring illnesses or patterns\n` +
            `3. Recent diagnoses\n` +
            `4. A brief treatment history summary\n\n` +
            `Patient: ${patient.firstName} ${patient.lastName}, ${patient.gender}, DOB: ${new Date(patient.dateOfBirth).toDateString()}\n\n` +
            `Visit History:\n${visitsText}\n\n` +
            `Note: This summary is advisory only and does not make medical decisions.`;

        const summary = await generatePatientSummary(prompt);

        return res.status(200).json({
            message: "AI summary generated successfully",
            data: {
                patient: {
                    id: patient._id,
                    name: `${patient.firstName} ${patient.lastName}`,
                    nic: patient.nic,
                },
                summary,
                disclaimer: "This AI summary is advisory only and does not make medical decisions.",
            },
        });
    } catch (error: any) {
        console.log("AI SUMMARY ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to generate AI summary",
            error: error.message,
        });
    }
};
