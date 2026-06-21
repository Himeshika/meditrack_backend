import { Router } from "express";
import {
    createVisit,
    getPatientVisitHistory,
    getVisitById,
    updateVisit,
    getAIPatientSummary,
} from "../controllers/visitController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("DOCTOR"),
    createVisit
);

router.get(
    "/patient/:patientId/history",
    authMiddleware,
    roleMiddleware("DOCTOR", "ADMIN"),
    getPatientVisitHistory
);

router.get(
    "/patient/:patientId/ai-summary",
    authMiddleware,
    roleMiddleware("DOCTOR"),
    getAIPatientSummary
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("DOCTOR", "ADMIN"),
    getVisitById
);

router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware("DOCTOR"),
    updateVisit
);

export default router;
