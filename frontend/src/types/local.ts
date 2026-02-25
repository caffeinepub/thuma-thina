// Local type definitions for domain types no longer exported by the backend interface
// These mirror the Motoko backend types but are defined locally for frontend use

import type { Principal } from '@icp-sdk/core/principal';
import type { Time, OrderRecord, CartItem, OrderId, OrderStatus, DeliveryMethod, PaymentMethod, ListingId } from '@/backend';

export type { OrderRecord, CartItem, OrderId, OrderStatus, DeliveryMethod, PaymentMethod, ListingId };

export type TownId = bigint;
export type RetailerId = bigint;
export type ProductId = bigint;

export type TownStatus = { __kind__: 'active'; active: null } | { __kind__: 'removed'; removed: null };

export const TownStatus = {
  active: { __kind__: 'active' as const, active: null },
  removed: { __kind__: 'removed' as const, removed: null },
};

export type ListingStatus =
  | { __kind__: 'active'; active: null }
  | { __kind__: 'outOfStock'; outOfStock: null }
  | { __kind__: 'discontinued'; discontinued: null };

export const ListingStatus = {
  active: { __kind__: 'active' as const, active: null },
  outOfStock: { __kind__: 'outOfStock' as const, outOfStock: null },
  discontinued: { __kind__: 'discontinued' as const, discontinued: null },
};

export interface WeekdayTimeRange {
  day: bigint;
  openTime: bigint;
  closeTime: bigint;
}

export interface HolidayOverride {
  date: Time;
  isOpen: boolean;
  openTime: [] | [bigint];
  closeTime: [] | [bigint];
  name: string;
}

export interface OpeningHours {
  weeklySchedule: WeekdayTimeRange[];
  holidayOverrides: HolidayOverride[];
}

export interface Retailer {
  id: RetailerId;
  name: string;
  townSuburb: string;
  province: string;
  address: string;
  phone: string;
  email: string;
  openingHours: OpeningHours;
  createdAt: Time;
  updatedAt: Time;
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

export interface PromoDetails {
  price: bigint;
  startDate: Time;
  endDate: [] | [Time];
}

export interface NewListing {
  id: ListingId;
  retailerId: RetailerId;
  productId: ProductId;
  price: bigint;
  promo: [] | [PromoDetails];
  stock: bigint;
  status: ListingStatus;
  createdAt: Time;
  updatedAt: Time;
}

export interface Product {
  id: ProductId;
  name: string;
  category: string;
  description: string;
  preferredImage: [] | [any];
  imageRefs: any[];
}

export interface ShopListing {
  listingId: ListingId;
  retailerId: RetailerId;
  retailerName: string;
  normalPrice: bigint;
  activePrice: bigint;
  savings: [] | [bigint];
  stock: bigint;
  isPromoActive: boolean;
}

export interface ShopProduct {
  id: ProductId;
  name: string;
  description: string;
  image: [] | [any];
  listings: ShopListing[];
}

export interface Town {
  id: TownId;
  name: string;
  province: string;
  status: TownStatus;
  createdAt: Time;
  updatedAt: Time;
}

export interface TownAssociation {
  id: TownId;
  name: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  defaultTown: [] | [TownId];
}

export type PersonalShopperStatus =
  | { __kind__: 'pending'; pending: null }
  | { __kind__: 'approved'; approved: null }
  | { __kind__: 'rejected'; rejected: string };

export interface PersonalShopperApplication {
  applicant: Principal;
  name: string;
  email: string;
  phone: string;
  selfieImage: any;
  status: PersonalShopperStatus;
  submittedAt: Time;
  reviewedBy: [] | [Principal];
  reviewedAt: [] | [Time];
  rejectionReason: [] | [string];
}

export interface PickupPointApplication {
  applicant: Principal;
  name: string;
  address: string;
  contactNumber: string;
  businessImage: any;
  townId: [] | [TownId];
  status:
    | { __kind__: 'pending'; pending: null }
    | { __kind__: 'approved'; approved: null }
    | { __kind__: 'rejected'; rejected: string };
  submittedAt: Time;
  reviewedBy: [] | [Principal];
}

export interface DriverApplication {
  applicant: Principal;
  name: string;
  email: string;
  phone: string;
  vehicleDetails: string;
  kycDocs: any[];
  status:
    | { __kind__: 'pending'; pending: null }
    | { __kind__: 'approved'; approved: null }
    | { __kind__: 'rejected'; rejected: string };
  submittedAt: Time;
  reviewedBy: [] | [Principal];
}

export interface PickupOrderInput {
  items: CartItem[];
  paymentMethod: PaymentMethod;
  customerName: string;
  customerPhone: string;
  deliveryAddress: [] | [string];
}

export interface PickupOrder {
  orderRecord: OrderRecord;
  customerName: string;
  customerPhone: string;
  deliveryAddress: [] | [string];
  createdByPickupPoint: Principal;
}

export interface ExpandedOrderItem {
  cartItem: CartItem;
  listing: [] | [NewListing];
  product: [] | [Product];
  retailer: [] | [Retailer];
}

export interface ShopperOrderView {
  order: OrderRecord;
  expandedItems: ExpandedOrderItem[];
}

export interface RetailerWithListings {
  retailer: Retailer;
  listings: NewListing[];
}
