import { decodeToken } from "./decodeToken";
import { Auth } from "@/models/Auth.Model";

export const isAllowed = async (token: string, requiredRole: string) => {
    if (!token) {
        throw new Error("Token is required for authorization");
    }
    // Validate the token
    const decoded = decodeToken(token);
    if (!decoded.id) {
        throw new Error("Invalid token, please login again");
    }
    // Check if the user is authorized to delete this experience
    const user = await Auth.findById(decoded.id);
    if (!user) {
        throw new Error("User not found");
    }
    if (!user.role) {
        throw new Error("User role is not defined");
    }
    // role can be 'admin', 'member', 'teams';

    // Check if the user has the required role
    if (user.role !== requiredRole) {
        throw new Error(`${user.role} is not allowed to perform this action`);
    }
    return { userId: decoded.id, userRole: user.role, isAllow: true };
};