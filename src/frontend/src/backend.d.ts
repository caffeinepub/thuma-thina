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
export type RetailerId = bigint;
export interface Product {
    id: ProductId;
    imageRefs: Array<ExternalBlob>;
    name: string;
    description: string;
    preferredImage?: ExternalBlob;
    category: string;
}
export type Time = bigint;
export interface Listing {
    id: ListingId;
    status: ListingStatus;
    createdAt: Time;
    productId: ProductId;
    stock: bigint;
    price: bigint;
    retailerId: RetailerId;
}
export interface RetailerWithListings {
    listings: Array<Listing>;
    retailer: Retailer;
}
export interface Province {
    towns: Array<string>;
    name: string;
}
export interface HolidayOverride {
    closeTime?: bigint;
    date: Time;
    name: string;
    isOpen: boolean;
    openTime?: bigint;
}
export interface ProductWithRetailers {
    listings: Array<[Retailer, Listing]>;
    product: Product;
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
export interface WeekdayTimeRange {
    day: bigint;
    closeTime: bigint;
    openTime: bigint;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface OpeningHours {
    holidayOverrides: Array<HolidayOverride>;
    weeklySchedule: Array<WeekdayTimeRange>;
}
export type ListingId = bigint;
export interface ProductRequest {
    id: bigint;
    province: string;
    productName: string;
    retailerName: string;
    townSuburb: string;
}
export type ProductId = bigint;
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addImageRef(productId: ProductId, imageRef: ExternalBlob): Promise<void>;
    addListing(retailerId: RetailerId, productId: ProductId, price: bigint, stock: bigint, status: ListingStatus): Promise<ListingId>;
    addProduct(name: string, category: string, description: string, preferredImage: ExternalBlob | null): Promise<ProductId>;
    addProvince(name: string, towns: Array<string>): Promise<void>;
    addRetailer(input: RetailerInput): Promise<RetailerId>;
    adminDeleteListing(listingId: ListingId): Promise<void>;
    adminUpdateListing(listingId: ListingId, price: bigint | null, stock: bigint | null, status: ListingStatus | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bootstrapAdmin(adminToken: string, userProvidedToken: string): Promise<void>;
    getAllActiveListings(): Promise<Array<Listing>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardData(): Promise<{
        listings: bigint;
        requests: bigint;
        products: bigint;
        retailers: bigint;
    }>;
    getProductCatalog(retailerId: RetailerId): Promise<Array<Listing>>;
    getProductRequests(): Promise<Array<ProductRequest>>;
    getProductWithRetailers(productId: ProductId): Promise<ProductWithRetailers>;
    getProvinces(): Promise<Array<Province>>;
    getRetailerById(retailerId: RetailerId): Promise<Retailer | null>;
    getRetailersByTownSuburb(townSuburb: string): Promise<Array<RetailerWithListings>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    isRetailerOpen(retailerId: RetailerId, timestamp: Time | null): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    listListings(): Promise<Array<Listing>>;
    listProducts(): Promise<Array<Product>>;
    listRetailers(): Promise<Array<Retailer>>;
    removeImage(productId: ProductId, imageIndex: bigint): Promise<void>;
    requestApproval(): Promise<void>;
    requestNewProduct(productName: string, retailerName: string, townSuburb: string, province: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setPreferredImage(productId: ProductId, preferredImage: ExternalBlob | null): Promise<void>;
    updateListingStatus(listingId: ListingId, newStatus: ListingStatus): Promise<void>;
    updateRetailer(id: RetailerId, input: RetailerInput): Promise<void>;
    upgradeToAdmin(user: Principal): Promise<void>;
    wipeSystem(): Promise<void>;
}
