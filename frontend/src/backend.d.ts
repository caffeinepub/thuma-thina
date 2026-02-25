import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface OrderRecord {
    id: OrderId;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    customer: Principal;
    createdAt: Time;
    deliveryMethod: DeliveryMethod;
    updatedAt: Time;
    totalAmount: bigint;
    items: Array<CartItem>;
}
export type DeliveryMethod = {
    __kind__: "home";
    home: {
        address: string;
    };
} | {
    __kind__: "pickupPoint";
    pickupPoint: {
        pointId: bigint;
    };
};
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export type OrderStatus = {
    __kind__: "inDelivery";
    inDelivery: {
        driverId: Principal;
    };
} | {
    __kind__: "assigned";
    assigned: {
        shopperId: Principal;
    };
} | {
    __kind__: "cancelled";
    cancelled: string;
} | {
    __kind__: "pending";
    pending: null;
} | {
    __kind__: "purchased";
    purchased: null;
} | {
    __kind__: "delivered";
    delivered: null;
} | {
    __kind__: "ready";
    ready: null;
};
export type ListingId = bigint;
export interface CartItem {
    listingId: ListingId;
    quantity: bigint;
}
export type OrderId = bigint;
export interface UserProfile {
    defaultTown?: bigint;
    name: string;
    email: string;
    phone: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum PaymentMethod {
    icp = "icp",
    zar = "zar",
    nomayini = "nomayini"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPendingOrders(): Promise<Array<OrderRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
}
