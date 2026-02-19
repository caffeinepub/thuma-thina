import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    defaultTown?: bigint;
    name: string;
    email: string;
    phone: string;
}
export interface ShopListing {
    activePrice: bigint;
    isPromoActive: boolean;
    listingId: ListingId;
    normalPrice: bigint;
    retailerName: string;
    stock: bigint;
    savings?: bigint;
    retailerId: RetailerId;
}
export type Time = bigint;
export type OrderId = bigint;
export interface DriverApplication {
    status: {
        __kind__: "pending";
        pending: null;
    } | {
        __kind__: "approved";
        approved: null;
    } | {
        __kind__: "rejected";
        rejected: string;
    };
    applicant: Principal;
    vehicleDetails: string;
    name: string;
    submittedAt: Time;
    reviewedBy?: Principal;
    email: string;
    phone: string;
    kycDocs: Array<ExternalBlob>;
}
export interface ExpandedOrderItem {
    listing?: NewListing;
    retailer?: Retailer;
    cartItem: CartItem;
    product?: Product;
}
export interface WeekdayTimeRange {
    day: bigint;
    closeTime: bigint;
    openTime: bigint;
}
export interface PickupOrder {
    customerName: string;
    deliveryAddress?: string;
    customerPhone: string;
    orderRecord: OrderRecord;
    createdByPickupPoint: Principal;
}
export interface OpeningHours {
    holidayOverrides: Array<HolidayOverride>;
    weeklySchedule: Array<WeekdayTimeRange>;
}
export type PersonalShopperStatus = {
    __kind__: "pending";
    pending: null;
} | {
    __kind__: "approved";
    approved: null;
} | {
    __kind__: "rejected";
    rejected: string;
};
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
export interface PickupOrderInput {
    customerName: string;
    deliveryAddress?: string;
    paymentMethod: PaymentMethod;
    customerPhone: string;
    items: Array<CartItem>;
}
export interface PromoDetails {
    endDate?: Time;
    price: bigint;
    startDate: Time;
}
export interface HolidayOverride {
    closeTime?: bigint;
    date: Time;
    name: string;
    isOpen: boolean;
    openTime?: bigint;
}
export type RetailerId = bigint;
export interface NewListing {
    id: ListingId;
    status: ListingStatus;
    createdAt: Time;
    productId: ProductId;
    updatedAt: Time;
    stock: bigint;
    price: bigint;
    promo?: PromoDetails;
    retailerId: RetailerId;
}
export interface Town {
    id: TownId;
    status: TownStatus;
    province: string;
    name: string;
    createdAt: Time;
    updatedAt: Time;
}
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
export type TownId = bigint;
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
export interface PersonalShopperApplication {
    status: PersonalShopperStatus;
    applicant: Principal;
    name: string;
    selfieImage: ExternalBlob;
    rejectionReason?: string;
    submittedAt: Time;
    reviewedAt?: Time;
    reviewedBy?: Principal;
    email: string;
    phone: string;
}
export interface RetailerInput {
    province: string;
    name: string;
    email: string;
    address: string;
    openingHours: OpeningHours;
    phone: string;
    townSuburb: string;
}
export interface PickupPointApplication {
    status: {
        __kind__: "pending";
        pending: null;
    } | {
        __kind__: "approved";
        approved: null;
    } | {
        __kind__: "rejected";
        rejected: string;
    };
    applicant: Principal;
    name: string;
    submittedAt: Time;
    reviewedBy?: Principal;
    townId?: TownId;
    address: string;
    businessImage: ExternalBlob;
    contactNumber: string;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface ShopProduct {
    id: ProductId;
    listings: Array<ShopListing>;
    name: string;
    description: string;
    image?: ExternalBlob;
}
export interface ShopperOrderView {
    order: OrderRecord;
    expandedItems: Array<ExpandedOrderItem>;
}
export type ProductId = bigint;
export interface CartItem {
    listingId: ListingId;
    quantity: bigint;
}
export interface Product {
    id: ProductId;
    imageRefs: Array<ExternalBlob>;
    name: string;
    description: string;
    preferredImage?: ExternalBlob;
    category: string;
}
export interface Retailer {
    id: RetailerId;
    province: string;
    name: string;
    createdAt: Time;
    email: string;
    updatedAt: Time;
    address: string;
    openingHours: OpeningHours;
    phone: string;
    townSuburb: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum ListingStatus {
    active = "active",
    discontinued = "discontinued",
    outOfStock = "outOfStock"
}
export enum PaymentMethod {
    icp = "icp",
    zar = "zar",
    nomayini = "nomayini"
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
    acceptShopperOrder(orderId: OrderId): Promise<void>;
    approveDriver(principal: Principal): Promise<void>;
    approvePersonalShopper(user: Principal): Promise<void>;
    approvePickupPoint(user: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    associateRetailerPrincipal(principal: Principal, retailerId: RetailerId): Promise<void>;
    completeShopperOrder(orderId: OrderId): Promise<OrderRecord>;
    createCategory(category: string): Promise<void>;
    createDriverApplication(name: string, email: string, phone: string, vehicleDetails: string, kycDocs: Array<ExternalBlob>): Promise<DriverApplication>;
    createListing(retailerId: RetailerId, productId: ProductId, price: bigint, stock: bigint): Promise<NewListing>;
    createOrder(items: Array<CartItem>, deliveryMethod: DeliveryMethod, paymentMethod: PaymentMethod): Promise<OrderRecord>;
    createPersonalShopperApplication(name: string, email: string, phone: string, selfieImage: ExternalBlob): Promise<PersonalShopperApplication>;
    createPickupOrder(input: PickupOrderInput): Promise<PickupOrder>;
    createPickupPointApplication(name: string, address: string, contactNumber: string, businessImage: ExternalBlob, townId: TownId): Promise<PickupPointApplication>;
    createProduct(name: string, description: string, image: ExternalBlob, category: string): Promise<Product>;
    createRetailer(input: RetailerInput): Promise<Retailer>;
    createTown(name: string, province: string): Promise<Town>;
    deleteListing(id: ListingId): Promise<void>;
    deleteRetailer(id: RetailerId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCatalogue(): Promise<Array<ShopProduct>>;
    getDefaultTown(): Promise<Town | null>;
    getDriverApplication(): Promise<DriverApplication | null>;
    getListing(id: ListingId): Promise<NewListing | null>;
    getMyOrders(): Promise<Array<OrderRecord>>;
    getMyRetailer(): Promise<Retailer | null>;
    getMyRetailerInventory(): Promise<Array<NewListing>>;
    getMyRetailerOrders(): Promise<Array<OrderRecord>>;
    getOrder(orderId: OrderId): Promise<OrderRecord | null>;
    getPersonalShopperApplication(): Promise<PersonalShopperApplication | null>;
    getPersonalShopperStatus(): Promise<PersonalShopperStatus | null>;
    getPickupOrder(pickupOrderId: bigint): Promise<PickupOrder | null>;
    getPickupPointApplication(): Promise<PickupPointApplication | null>;
    getPickupPointStatus(): Promise<{
        __kind__: "pending";
        pending: null;
    } | {
        __kind__: "approved";
        approved: null;
    } | {
        __kind__: "rejected";
        rejected: string;
    } | null>;
    getRetailer(id: RetailerId): Promise<Retailer | null>;
    getRetailerListings(retailerId: RetailerId): Promise<Array<NewListing>>;
    getRetailerPrincipalMapping(principal: Principal): Promise<RetailerId | null>;
    getShopperOrderDetails(orderId: OrderId): Promise<ShopperOrderView | null>;
    getShopperOrderExpanded(orderId: OrderId): Promise<ShopperOrderView | null>;
    getTown(id: TownId): Promise<Town | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listActiveTowns(): Promise<Array<Town>>;
    listAllListings(): Promise<Array<NewListing>>;
    listAllOrders(): Promise<Array<OrderRecord>>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    listCategories(): Promise<Array<string>>;
    listEligibleDriverOrders(): Promise<Array<OrderRecord>>;
    listMyAssignedShopperOrders(): Promise<Array<OrderRecord>>;
    listMyPickupCreatedOrders(): Promise<Array<OrderRecord>>;
    listMyPickupOrders(): Promise<Array<PickupOrder>>;
    listPendingDriverApplications(): Promise<Array<DriverApplication>>;
    listPendingPersonalShopperApplications(): Promise<Array<PersonalShopperApplication>>;
    listPendingPickupPointApplications(): Promise<Array<PickupPointApplication>>;
    listProducts(): Promise<Array<Product>>;
    listRemovedTowns(): Promise<Array<Town>>;
    listRetailers(): Promise<Array<Retailer>>;
    listShopperEligiblePickupOrders(): Promise<Array<OrderRecord>>;
    listTowns(): Promise<Array<Town>>;
    registerUser(profile: UserProfile): Promise<void>;
    rejectDriver(principal: Principal, reason: string): Promise<void>;
    rejectPersonalShopper(user: Principal, reason: string): Promise<void>;
    rejectPickupPoint(user: Principal, reason: string): Promise<void>;
    removePromo(id: ListingId): Promise<NewListing>;
    removeRetailerPrincipal(principal: Principal): Promise<void>;
    removeTown(id: TownId): Promise<Town>;
    requestApproval(): Promise<void>;
    restoreTown(id: TownId): Promise<Town>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    selectDefaultTown(townId: TownId): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setPromo(id: ListingId, price: bigint, startDate: Time, endDate: Time | null): Promise<NewListing>;
    updateListing(id: ListingId, price: bigint, stock: bigint, status: ListingStatus): Promise<NewListing>;
    updateOrderStatus(orderId: OrderId, status: OrderStatus): Promise<OrderRecord>;
    updateProduct(id: ProductId, name: string, description: string, category: string): Promise<Product>;
    updateRetailer(id: RetailerId, input: RetailerInput): Promise<Retailer>;
    updateTown(id: TownId, name: string, province: string): Promise<Town>;
}
