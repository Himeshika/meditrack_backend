import mongoose, { Document, Schema } from "mongoose";

export interface IVisit extends Document {
    patient: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    symptoms: string;
    diagnosis: string;
    prescription: string;
    notes?: string;
    visitDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const visitSchema = new Schema<IVisit>(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        doctor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        symptoms: {
            type: String,
            required: true,
            trim: true,
        },
        diagnosis: {
            type: String,
            required: true,
            trim: true,
        },
        prescription: {
            type: String,
            required: true,
            trim: true,
        },
        notes: {
            type: String,
            trim: true,
        },
        visitDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Visit = mongoose.model<IVisit>("Visit", visitSchema);

export default Visit;
