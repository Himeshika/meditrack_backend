import { Response } from "express";
import User from "../models/userModel";
import { AuthRequest } from "../middleware/authMiddleware";

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Users fetched successfully",
            data: users,
        });
    } catch (error: any) {
        console.log("GET ALL USERS ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            data: user,
        });
    } catch (error: any) {
        console.log("GET USER ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to fetch user",
            error: error.message,
        });
    }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({
                message: "Role is required",
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "User role updated successfully",
            data: user,
        });
    } catch (error: any) {
        console.log("UPDATE USER ROLE ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to update user role",
            error: error.message,
        });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error: any) {
        console.log("DELETE USER ERROR:", error.message);

        return res.status(500).json({
            message: "Failed to delete user",
            error: error.message,
        });
    }
};
