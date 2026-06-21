export const Roles = {
    ADMIN: "ADMIN",
    DOCTOR: "DOCTOR",
    RECEPTIONIST: "RECEPTIONIST",
} as const;

export type Role = keyof typeof Roles;