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
    staffNote: string;
    clientName: string;
    assignedStaffId?: bigint;
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
export interface Booking {
    id: bigint;
    service: string;
    status: BookingStatus;
    name: string;
    createdAt: bigint;
    email: string;
    message: string;
    preferredDate: string;
    preferredTime: string;
    phone: string;
}
export interface UserProfile {
    username: string;
    userId: bigint;
    name: string;
    role: Role;
}
export enum BookingStatus {
    pending = "pending",
    completed = "completed",
    rejected = "rejected",
    confirmed = "confirmed"
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
    addStaffNote(requestId: bigint, note: string): Promise<boolean>;
    adminResetPassword(userId: bigint, newPasswordHash: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignStaffToRequest(requestId: bigint, staffUserId: bigint): Promise<boolean>;
    changePassword(oldPasswordHash: string, newPasswordHash: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createBlogPost(title: string, content: string, excerpt: string, authorName: string): Promise<bigint>;
    createBooking(name: string, phone: string, email: string, service: string, preferredDate: string, preferredTime: string, message: string): Promise<bigint>;
    createServiceRequest(clientUserId: bigint, clientName: string, serviceType: string, description: string): Promise<bigint>;
    createUser(username: string, passwordHash: string, role: Role): Promise<bigint>;
    deleteBlogPost(id: bigint): Promise<boolean>;
    deleteBooking(id: bigint): Promise<boolean>;
    deleteServiceRequest(id: bigint): Promise<boolean>;
    getBlogPost(id: bigint): Promise<BlogPost | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClientServiceRequests(clientUserId: bigint): Promise<Array<ServiceRequest>>;
    getLeads(): Promise<Array<Lead>>;
    getRevenueStats(): Promise<{
        resolvedLeads: bigint;
        completedRequests: bigint;
        totalLeads: bigint;
        pendingRequests: bigint;
        newLeads: bigint;
        inProgressRequests: bigint;
        totalRequests: bigint;
    }>;
    getStaffAssignedRequests(staffUserId: bigint): Promise<Array<ServiceRequest>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    listAllBlogPosts(): Promise<Array<BlogPost>>;
    listAllServiceRequests(): Promise<Array<ServiceRequest>>;
    listBlogPosts(): Promise<Array<BlogPost>>;
    listBookings(): Promise<Array<Booking>>;
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
    updateBookingStatus(id: bigint, status: BookingStatus): Promise<boolean>;
    updateLeadStatus(id: bigint, status: LeadStatus): Promise<boolean>;
    updateServiceRequestStatus(id: bigint, status: ServiceRequestStatus): Promise<boolean>;
}
