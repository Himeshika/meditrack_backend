import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = Router();

router.get("/", authMiddleware, roleMiddleware("ADMIN" ,"RECEPTIONIST","DOCTOR"), getAllUsers);
router.get("/:id", authMiddleware, roleMiddleware("ADMIN"), getUserById);
router.patch("/:id/role", authMiddleware, roleMiddleware("ADMIN"), updateUserRole);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteUser);

export default router;
