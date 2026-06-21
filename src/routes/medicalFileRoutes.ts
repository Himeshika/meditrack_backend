import { Router } from "express";
import {
    uploadMedicalFile,
    getFilesByVisit,
    getFilesByPatient,
    deleteMedicalFile,
} from "../controllers/medicalFileController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.post(
    "/upload",
    authMiddleware,
    roleMiddleware("DOCTOR"),
    upload.single("file"),
    uploadMedicalFile
);

router.get(
    "/visit/:visitId",
    authMiddleware,
    roleMiddleware("DOCTOR", "ADMIN"),
    getFilesByVisit
);

router.get(
    "/patient/:patientId",
    authMiddleware,
    roleMiddleware("DOCTOR", "ADMIN"),
    getFilesByPatient
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("DOCTOR", "ADMIN"),
    deleteMedicalFile
);

export default router;
