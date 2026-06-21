import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log("AUTH HEADER:", req.headers.authorization);

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("NO TOKEN PROVIDED");
            return res.status(401).json({
                message: "No token provided",
            });
        }

        const token = authHeader.split(" ")[1];

        console.log("TOKEN:", token);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as any;

        console.log("DECODED:", decoded);

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role.toUpperCase(),
        };

        next();
    } catch (err: any) {
        console.log("JWT ERROR:", err.message);

        return res.status(401).json({
            message: "Invalid or expired token",
            error: err.message,
        });
    }
};
