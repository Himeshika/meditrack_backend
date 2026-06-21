import { Router } from "express";
import {
    registerPatient,
    searchPatientByNIC,
    getPatientById,
    updatePatient,
    getAllPatients,
} from "../controllers/patientController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.post(
    "/register",
    authMiddleware,
    roleMiddleware("RECEPTIONIST", "ADMIN"),
    registerPatient
);

router.get(
    "/search/:nic",
    authMiddleware,
    roleMiddleware("DOCTOR", "RECEPTIONIST", "ADMIN"),
    searchPatientByNIC
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("DOCTOR", "RECEPTIONIST", "ADMIN"),
    getAllPatients
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("DOCTOR", "RECEPTIONIST", "ADMIN"),
    getPatientById
);

router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware("RECEPTIONIST", "ADMIN"),
    updatePatient
);

export default router;
