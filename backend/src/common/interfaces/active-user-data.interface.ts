import { Role } from "@prisma/client";

export interface ActiveUserData {
    readonly sub: number;
    readonly email: string;
    readonly role: Role;
    readonly refreshTokenId?: string; 
}