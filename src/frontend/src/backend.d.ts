import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ServiceRequest {
    id: bigint;
    status: ServiceRequestStatus;
    serviceType: string;
    clientName: string;
    createdAt: bigint;
    description: string;
    updatedAt: bigint;
    clientUserId: bigint;
}
export interface Lead {
    id: bigint;
    service: string;
    status: LeadStatus;
    name: string;
    createdAt: bigint;
    message: string;
    phone: string;
}
export interface BlogPost {
    id: bigint;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: bigint;
    authorName: string;
    updatedAt: bigint;
    excerpt: string;
}
export interface User {
    id: bigint;
    username: string;
    role: Role;
    isActive: boolean;
    passwordHash: string;
}
export interface UserProfile {
    username: string;
    userId: bigint;
    name: string;
    role: Role;
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
export enum ServiceRequestStatus {
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBlogPost(title: string, content: string, excerpt: string, authorName: string): Promise<bigint>;
    createServiceRequest(clientUserId: bigint, clientName: string, serviceType: string, description: string): Promise<bigint>;
    createUser(username: string, passwordHash: string, role: Role): Promise<bigint>;
    deleteBlogPost(id: bigint): Promise<boolean>;
    deleteServiceRequest(id: bigint): Promise<boolean>;
    getBlogPost(id: bigint): Promise<BlogPost | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClientServiceRequests(clientUserId: bigint): Promise<Array<ServiceRequest>>;
    getLeads(): Promise<Array<Lead>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    listAllBlogPosts(): Promise<Array<BlogPost>>;
    listAllServiceRequests(): Promise<Array<ServiceRequest>>;
    listBlogPosts(): Promise<Array<BlogPost>>;
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
    updateBlogPost(id: bigint, title: string, content: string, excerpt: string, isPublished: boolean): Promise<boolean>;
    updateLeadStatus(id: bigint, status: LeadStatus): Promise<boolean>;
    updateServiceRequestStatus(id: bigint, status: ServiceRequestStatus): Promise<boolean>;
}
