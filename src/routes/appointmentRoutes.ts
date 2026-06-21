import { Router } from "express";
import {
    createAppointment,
    getAppointmentsByPatient,
    updateAppointmentStatus,
    getAllAppointments,
} from "../controllers/appointmentController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("RECEPTIONIST", "ADMIN"),
    createAppointment
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("RECEPTIONIST", "DOCTOR", "ADMIN"),
    getAllAppointments
);

router.get(
    "/patient/:patientId",
    authMiddleware,
    roleMiddleware("RECEPTIONIST", "DOCTOR", "ADMIN"),
    getAppointmentsByPatient
);

router.patch(
    "/:id/status",
    authMiddleware,
    roleMiddleware("RECEPTIONIST", "DOCTOR", "ADMIN"),
    updateAppointmentStatus
);

export default router;
