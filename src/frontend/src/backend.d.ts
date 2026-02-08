import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type RetailerId = bigint;
export interface Listing {
    id: ListingId;
    status: ListingStatus;
    productId: ProductId;
    stock: bigint;
    price: bigint;
    retailerId: RetailerId;
}
export interface Province {
    towns: Array<string>;
    name: string;
}
export interface RetailerWithListings {
    listings: Array<Listing>;
    retailer: Retailer;
}
export interface ProductWithRetailers {
    listings: Array<[Retailer, Listing]>;
    product: Product;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
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
export interface Product {
    id: ProductId;
    name: string;
    description: string;
    imageRef: string;
    category: string;
}
export interface Retailer {
    id: RetailerId;
    province: string;
    name: string;
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
    addListing(retailerId: RetailerId, productId: ProductId, price: bigint, stock: bigint, status: ListingStatus): Promise<ListingId>;
    addProduct(name: string, category: string, description: string, imageRef: string): Promise<ProductId>;
    addProvince(name: string, towns: Array<string>): Promise<void>;
    addRetailer(name: string, townSuburb: string, province: string): Promise<RetailerId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bootstrapAdmin(adminToken: string, userProvidedToken: string): Promise<void>;
    getAllActiveListings(): Promise<Array<Listing>>;
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
    getRetailersByTownSuburb(townSuburb: string): Promise<Array<RetailerWithListings>>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    requestApproval(): Promise<void>;
    requestNewProduct(productName: string, retailerName: string, townSuburb: string, province: string): Promise<bigint>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    updateListingStatus(listingId: ListingId, newStatus: ListingStatus): Promise<void>;
    upgradeToAdmin(user: Principal): Promise<void>;
}
