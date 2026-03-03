import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Lead {
    id: bigint;
    service: string;
    status: LeadStatus;
    name: string;
    createdAt: bigint;
    message: string;
    phone: string;
}
export interface UserProfile {
    username: string;
    userId: bigint;
    name: string;
    role: Role;
}
export interface User {
    id: bigint;
    username: string;
    role: Role;
    isActive: boolean;
    passwordHash: string;
}
export enum LeadStatus {
    new_ = "new",
    resolved = "resolved",
    inProgress = "inProgress"
}
export enum Role {
    client = "client",
    admin = "admin",
    staff = "staff"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createUser(username: string, passwordHash: string, role: Role): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLeads(): Promise<Array<Lead>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listUsers(): Promise<Array<User>>;
    login(username: string, passwordHash: string): Promise<{
        __kind__: "ok";
        ok: {
            userId: bigint;
            role: Role;
        };
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitLead(name: string, phone: string, service: string, message: string): Promise<bigint>;
    toggleUserActive(userId: bigint): Promise<boolean>;
    updateLeadStatus(id: bigint, status: LeadStatus): Promise<boolean>;
}
