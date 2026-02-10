import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export type Time = bigint;
export type TownId = bigint;
export interface Town {
    id: TownId;
    status: TownStatus;
    province: string;
    name: string;
    createdAt: Time;
    updatedAt: Time;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum TownStatus {
    active = "active",
    removed = "removed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createTown(name: string, province: string): Promise<Town>;
    getActiveTowns(): Promise<Array<Town>>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    listTowns(): Promise<Array<Town>>;
    removeTown(id: TownId): Promise<Town>;
    requestApproval(): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    updateTown(id: TownId, name: string, province: string): Promise<Town>;
}
