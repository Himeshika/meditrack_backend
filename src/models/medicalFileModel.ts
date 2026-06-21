import mongoose, { Document, Schema } from "mongoose";

export type FileType =
    | "MEDICAL_REPORT"
    | "BLOOD_REPORT"
    | "XRAY"
    | "SCAN_REPORT"
    | "PRESCRIPTION_IMAGE"
    | "OTHER";

export interface IMedicalFile extends Document {
    patient: mongoose.Types.ObjectId;
    visit: mongoose.Types.ObjectId;
    fileName: string;
    fileType: FileType;
    cloudinaryUrl: string;
    cloudinaryPublicId: string;
    uploadedBy: mongoose.Types.ObjectId;
    uploadedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const medicalFileSchema = new Schema<IMedicalFile>(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        visit: {
            type: Schema.Types.ObjectId,
            ref: "Visit",
            required: true,
        },
        fileName: {
            type: String,
            required: true,
            trim: true,
        },
        fileType: {
            type: String,
            enum: [
                "MEDICAL_REPORT",
                "BLOOD_REPORT",
                "XRAY",
                "SCAN_REPORT",
                "PRESCRIPTION_IMAGE",
                "OTHER",
            ],
            required: true,
        },
        cloudinaryUrl: {
            type: String,
            required: true,
        },
        cloudinaryPublicId: {
            type: String,
            required: true,
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const MedicalFile = mongoose.model<IMedicalFile>("MedicalFile", medicalFileSchema);

export default MedicalFile;
