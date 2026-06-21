import mongoose, { Document, Schema } from "mongoose";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface IPatient extends Document {
    nic: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: Gender;
    phone: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
    {
        nic: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            enum: ["MALE", "FEMALE", "OTHER"],
            required: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Patient = mongoose.model<IPatient>("Patient", patientSchema);

export default Patient;
