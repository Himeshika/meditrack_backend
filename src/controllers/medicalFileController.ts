import { Response } from "express";
import MedicalFile from "../models/medicalFileModel";
import Visit from "../models/visitModel";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/cloudinaryService";

export const uploadMedicalFile = async (req: AuthRequest, res: Response) => {
  try {
    const { visitId, fileType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    if (!visitId || !fileType) {
      return res.status(400).json({
        message: "Visit ID and file type are required",
      });
    }

    const visit = await Visit.findById(visitId);

    if (!visit) {
      return res.status(404).json({
        message: "Visit not found",
      });
    }

    console.log("FILE:", req.file);
    console.log("BUFFER:", req.file?.buffer);
    console.log("BUFFER LENGTH:", req.file?.buffer?.length);
    // @ts-ignore
    const { url, publicId } = await uploadToCloudinary(
      req.file.buffer,
      "meditrack/medical-files",
    );

    

    const medicalFile = await MedicalFile.create({
      patient: visit.patient,
      visit: visitId,
      fileName: req.file.originalname,
      fileType,
      cloudinaryUrl: url,
      cloudinaryPublicId: publicId,
      uploadedBy: req.user?.id,
    });

    return res.status(201).json({
      message: "Medical file uploaded successfully",
      data: medicalFile,
    });
  } catch (error: any) {
    console.log("UPLOAD MEDICAL FILE ERROR:", error.message);

    return res.status(500).json({
      message: "Failed to upload medical file",
      error: error.message,
    });
  }
};

export const getFilesByVisit = async (req: AuthRequest, res: Response) => {
  try {
    const { visitId } = req.params;

    const files = await MedicalFile.find({ visit: visitId })
      .populate("uploadedBy", "name email role")
      .sort({ uploadedAt: -1 });

    return res.status(200).json({
      message: "Files fetched successfully",
      data: files,
    });
  } catch (error: any) {
    console.log("GET FILES BY VISIT ERROR:", error.message);

    return res.status(500).json({
      message: "Failed to fetch files",
      error: error.message,
    });
  }
};

export const getFilesByPatient = async (req: AuthRequest, res: Response) => {
  try {
    const { patientId } = req.params;

    const files = await MedicalFile.find({ patient: patientId })
      .populate("visit", "visitDate diagnosis")
      .populate("uploadedBy", "name email role")
      .sort({ uploadedAt: -1 });

    return res.status(200).json({
      message: "Patient files fetched successfully",
      data: files,
    });
  } catch (error: any) {
    console.log("GET FILES BY PATIENT ERROR:", error.message);

    return res.status(500).json({
      message: "Failed to fetch patient files",
      error: error.message,
    });
  }
};

export const deleteMedicalFile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const file = await MedicalFile.findById(id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    await deleteFromCloudinary(file.cloudinaryPublicId);

    await MedicalFile.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Medical file deleted successfully",
    });
  } catch (error: any) {
    console.log("DELETE MEDICAL FILE ERROR:", error.message);

    return res.status(500).json({
      message: "Failed to delete medical file",
      error: error.message,
    });
  }
};
