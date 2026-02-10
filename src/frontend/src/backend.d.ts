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

export enum ApprovalStatus {
  pending = "pending",
  approved = "approved",
  rejected = "rejected"
}

export enum UserRole {
  admin = "admin",
  user = "user",
  guest = "guest"
}

export enum ListingStatus {
  active = "active",
  outOfStock = "outOfStock",
  discontinued = "discontinued"
}

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  preferredImage: Option<ExternalBlob>;
  imageRefs: ExternalBlob[];
}

export interface Retailer {
  id: number;
  name: string;
  townSuburb: string;
  province: string;
  address: string;
  phone: string;
  email: string;
  openingHours: OpeningHours;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface Listing {
  id: number;
  retailerId: number;
  productId: number;
  price: number;
  stock: number;
  status: ListingStatus;
  createdAt: bigint;
}

export interface WeekdayTimeRange {
  day: number;
  openTime: number;
  closeTime: number;
}

export interface HolidayOverride {
  date: bigint;
  isOpen: boolean;
  openTime: Option<number>;
  closeTime: Option<number>;
  name: string;
}

export interface OpeningHours {
  weeklySchedule: WeekdayTimeRange[];
  holidayOverrides: HolidayOverride[];
}

export interface RetailerInput {
  name: string;
  townSuburb: string;
  province: string;
  address: string;
  phone: string;
  email: string;
  openingHours: OpeningHours;
}

export interface Province {
  name: string;
  towns: string[];
}

export interface ProductRequest {
  id: number;
  productName: string;
  retailerName: string;
  townSuburb: string;
  province: string;
}

export interface RetailerWithListings {
  retailer: Retailer;
  listings: Listing[];
}

export interface ProductWithRetailers {
  product: Product;
  listings: [Retailer, Listing][];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  townSuburb: Option<string>;
  role: Option<UserRole>;
}

export interface CartItem {
  listingId: number;
  quantity: number;
}

export interface DeliveryMethod {
  __kind__: "home" | "pickupPoint";
  address?: string;
  pointId?: number;
}

export interface PaymentMethod {
  __kind__: "zar" | "icp" | "nomayini";
}

export interface OrderStatus {
  __kind__: "pending" | "assigned" | "purchased" | "ready" | "inDelivery" | "delivered" | "cancelled";
  shopperId?: Principal;
  driverId?: Principal;
  reason?: string;
}

export interface OrderRecord {
  id: number;
  customer: Principal;
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  status: OrderStatus;
  beneficiaryName: Option<string>;
  beneficiaryContact: Option<string>;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface DriverApplication {
  applicant: Principal;
  name: string;
  email: string;
  phone: string;
  vehicleDetails: string;
  kycDocs: ExternalBlob[];
  status: { __kind__: "pending" | "approved" | "rejected"; reason?: string };
  submittedAt: bigint;
  reviewedBy: Option<Principal>;
}

export interface ShopperApplication {
  applicant: Principal;
  name: string;
  email: string;
  address: string;
  kycDocs: ExternalBlob[];
  status: { __kind__: "pending" | "approved" | "rejected"; reason?: string };
  submittedAt: bigint;
  reviewedBy: Option<Principal>;
}

export interface PickupPointApplication {
  applicant: Principal;
  name: string;
  email: string;
  phone: string;
  address: string;
  townSuburb: string;
  province: string;
  kycDocs: ExternalBlob[];
  status: { __kind__: "pending" | "approved" | "rejected"; reason?: string };
  submittedAt: bigint;
  reviewedBy: Option<Principal>;
}

export interface UserActivityMetrics {
  userId: Principal;
  role: UserRole;
  ordersAccepted: number;
  ordersCompleted: number;
  currentAssignments: number[];
}

// Placeholder for ExternalBlob - will be properly typed when blob-storage interface is generated
export type ExternalBlob = any;

export interface backendInterface {
  // Authorization
  assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
  getCallerUserRole(): Promise<UserRole>;
  isCallerAdmin(): Promise<boolean>;
  isCallerApproved(): Promise<boolean>;
  listApprovals(): Promise<Array<UserApprovalInfo>>;
  requestApproval(): Promise<void>;
  setApproval(user: Principal, status: ApprovalStatus): Promise<void>;

  // Products
  createProduct(name: string, category: string, description: string): Promise<number>;
  updateProduct(id: number, name: string, category: string, description: string): Promise<void>;
  deleteProduct(id: number): Promise<void>;
  getProduct(id: number): Promise<Option<Product>>;
  listProducts(): Promise<Product[]>;

  // Retailers
  createRetailer(input: RetailerInput): Promise<number>;
  updateRetailer(id: number, input: RetailerInput): Promise<void>;
  deleteRetailer(id: number): Promise<void>;
  getRetailer(id: number): Promise<Option<Retailer>>;
  listRetailers(): Promise<Retailer[]>;
  listRetailersByLocation(townSuburb: string, province: string): Promise<Retailer[]>;

  // Listings
  createListing(retailerId: number, productId: number, price: number, stock: number): Promise<number>;
  updateListing(id: number, price: number, stock: number, status: ListingStatus): Promise<void>;
  deleteListing(id: number): Promise<void>;
  getListing(id: number): Promise<Option<Listing>>;
  listListings(): Promise<Listing[]>;
  listListingsByRetailer(retailerId: number): Promise<Listing[]>;
  listListingsByProduct(productId: number): Promise<Listing[]>;
  listActiveListings(): Promise<Listing[]>;

  // Catalogue
  getGlobalCatalogue(): Promise<ProductWithRetailers[]>;

  // Towns
  createTown(name: string, province: string): Promise<void>;
  listTowns(): Promise<Province[]>;
  deleteTown(name: string, province: string): Promise<void>;

  // User Profiles
  saveUserProfile(profile: UserProfile): Promise<void>;
  getUserProfile(user: Principal): Promise<Option<UserProfile>>;
  getCallerUserProfile(): Promise<Option<UserProfile>>;
  listUsersByRole(role: UserRole): Promise<Principal[]>;

  // Orders
  createOrder(
    items: CartItem[],
    deliveryMethod: DeliveryMethod,
    paymentMethod: PaymentMethod,
    beneficiaryName: Option<string>,
    beneficiaryContact: Option<string>
  ): Promise<number>;
  getOrder(id: number): Promise<Option<OrderRecord>>;
  listOrdersByCustomer(): Promise<OrderRecord[]>;
  listOrdersByStatus(status: string): Promise<OrderRecord[]>;
  listOrdersByTown(townSuburb: string): Promise<OrderRecord[]>;
  listAllOrders(): Promise<OrderRecord[]>;
  acceptOrderAsShopper(orderId: number): Promise<void>;
  markOrderPurchased(orderId: number): Promise<void>;
  markOrderReady(orderId: number): Promise<void>;
  acceptOrderAsDriver(orderId: number): Promise<void>;
  markOrderDelivered(orderId: number): Promise<void>;
  markOrderReceivedAtPickupPoint(orderId: number): Promise<void>;
  addOutOfStockNote(orderId: number, listingId: number): Promise<void>;

  // Role Applications
  submitDriverApplication(
    name: string,
    email: string,
    phone: string,
    vehicleDetails: string,
    kycDocs: ExternalBlob[]
  ): Promise<void>;
  submitShopperApplication(
    name: string,
    email: string,
    address: string,
    kycDocs: ExternalBlob[]
  ): Promise<void>;
  submitPickupPointApplication(
    name: string,
    email: string,
    phone: string,
    address: string,
    townSuburb: string,
    province: string,
    kycDocs: ExternalBlob[]
  ): Promise<void>;
  getMyApplications(): Promise<{
    driver: Option<DriverApplication>;
    shopper: Option<ShopperApplication>;
    pickupPoint: Option<PickupPointApplication>;
  }>;
  listPendingApplications(): Promise<{
    drivers: DriverApplication[];
    shoppers: ShopperApplication[];
    pickupPoints: PickupPointApplication[];
  }>;
  approveApplication(applicant: Principal, role: string): Promise<void>;
  rejectApplication(applicant: Principal, role: string, reason: string): Promise<void>;

  // Analytics
  getUserActivityMetrics(user: Principal): Promise<UserActivityMetrics>;
}
