import mongoose, { Document, Schema } from "mongoose";

export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface IAppointment extends Document {
    patient: mongoose.Types.ObjectId;
    doctor: mongoose.Types.ObjectId;
    appointmentDate: Date;
    status: AppointmentStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
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
        appointmentDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["SCHEDULED", "COMPLETED", "CANCELLED"],
            default: "SCHEDULED",
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Appointment = mongoose.model<IAppointment>("Appointment", appointmentSchema);

export default Appointment;
