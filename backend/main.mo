import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import UserApproval "user-approval/approval";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Array "mo:core/Array";

import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

actor {
  type TownId = Nat;
  type RetailerId = Nat;
  type ProductId = Nat;
  type ListingId = Nat;
  type OrderId = Nat;

  public type Product = {
    id : ProductId;
    name : Text;
    category : Text;
    description : Text;
    preferredImage : ?Storage.ExternalBlob;
    imageRefs : [Storage.ExternalBlob];
  };

  public type SimpleProduct = {
    id : ProductId;
    name : Text;
    description : Text;
    image : Storage.ExternalBlob;
  };

  public type ListingStatus = {
    #active;
    #outOfStock;
    #discontinued;
  };

  public type PromoDetails = {
    price : Nat;
    startDate : Time.Time;
    endDate : ?Time.Time;
  };

  public type NewListing = {
    id : ListingId;
    retailerId : RetailerId;
    productId : ProductId;
    price : Nat;
    promo : ?PromoDetails;
    stock : Nat;
    status : ListingStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type Retailer = {
    id : RetailerId;
    name : Text;
    townSuburb : Text;
    province : Text;
    address : Text;
    phone : Text;
    email : Text;
    openingHours : OpeningHours;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type RetailerInput = {
    name : Text;
    townSuburb : Text;
    province : Text;
    address : Text;
    phone : Text;
    email : Text;
    openingHours : OpeningHours;
  };

  public type WeekdayTimeRange = {
    day : Nat;
    openTime : Nat;
    closeTime : Nat;
  };

  public type HolidayOverride = {
    date : Time.Time;
    isOpen : Bool;
    openTime : ?Nat;
    closeTime : ?Nat;
    name : Text;
  };

  public type OpeningHours = {
    weeklySchedule : [WeekdayTimeRange];
    holidayOverrides : [HolidayOverride];
  };

  public type Province = {
    name : Text;
    towns : [Text];
  };

  public type ProductRequest = {
    id : Nat;
    productName : Text;
    retailerName : Text;
    townSuburb : Text;
    province : Text;
  };

  public type RetailerWithListings = {
    retailer : Retailer;
    listings : [NewListing];
  };

  public type ShopProduct = {
    id : ProductId;
    name : Text;
    description : Text;
    image : ?Storage.ExternalBlob;
    listings : [ShopListing];
  };

  public type ShopListing = {
    listingId : ListingId;
    retailerId : RetailerId;
    retailerName : Text;
    normalPrice : Nat;
    activePrice : Nat;
    savings : ?Nat;
    stock : Nat;
    isPromoActive : Bool;
  };

  public type SalesAnalytics = {
    totalSales : Nat;
    ordersCount : Nat;
    deliveriesCount : Nat;
    activeShoppers : Nat;
    activeDrivers : Nat;
    favouriteProducts : [Product];
    favouriteRetailers : [Retailer];
  };

  var towns = Map.empty<TownId, Town>();
  var provinces = List.empty<Province>();
  var retailers = Map.empty<Nat, Retailer>();
  var products = Map.empty<Nat, Product>();
  var simpleProducts = Map.empty<Nat, SimpleProduct>();
  var listings = Map.empty<Nat, NewListing>();
  var productRequests = Map.empty<Nat, ProductRequest>();
  var userProfiles = Map.empty<Principal, UserProfile>();
  var driverApplications = Map.empty<Principal, DriverApplication>();
  var shopperApplications = Map.empty<Principal, ShopperApplication>();
  var pickupPointApplications = Map.empty<Principal, PickupPointApplication>();
  var orders = Map.empty<Nat, OrderRecord>();
  var nomayiniBalances = Map.empty<Principal, NomaYiniBalance>();
  var nomayiniTransactions = List.empty<NomaYiniTransaction>();
  var approvedShoppers = Map.empty<Principal, Bool>();
  var approvedDrivers = Map.empty<Principal, Bool>();
  var approvedPickupPoints = Map.empty<Nat, Principal>();
  var townMemberships = Map.empty<Principal, TownMembership>();
  var townMembershipApplications = Map.empty<Principal, TownMembershipApplication>();
  var productCategories = List.empty<Text>();
  var retailerPrincipals = Map.empty<Principal, RetailerId>();

  var personalShopperApplications = Map.empty<Principal, PersonalShopperApplication>();
  var personalShopperApprovals = Map.empty<Principal, PersonalShopperApproval>();
  var personalShopperStatus = Map.empty<Principal, PersonalShopperStatus>();

  var pickupOrders = Map.empty<Nat, PickupOrder>();
  var nextPickupOrderId = 0;

  var nextTownId = 0;
  var nextRetailerId = 0;
  var nextProductId = 0;
  var nextListingId = 0;
  var nextRequestId = 0;
  var nextOrderId = 0;
  var nextPickupPointId = 0;
  var nextTxId = 0;
  var defaultTownId : ?TownId = null;

  var accessControlState = AccessControl.initState();
  var approvalState = UserApproval.initState(accessControlState);

  public type TownAssociation = {
    id : TownId;
    name : Text;
  };

  var userTownAssociations = Map.empty<Principal, TownAssociation>();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Required profile functions

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Order functions

  public query ({ caller }) func getPendingOrders() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view pending orders");
    };
    orders.values().toArray().filter(
      func(order) { order.status == #pending }
    );
  };

  // Approval functions

  public query ({ caller }) func isCallerApproved() : async Bool {
    if (AccessControl.hasPermission(accessControlState, caller, #admin)) {
      true;
    } else {
      UserApproval.isApproved(approvalState, caller);
    };
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  public type Town = {
    id : TownId;
    name : Text;
    province : Text;
    status : TownStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type TownStatus = {
    #active;
    #removed;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    defaultTown : ?Nat;
  };

  public type DriverApplication = {
    applicant : Principal;
    name : Text;
    email : Text;
    phone : Text;
    vehicleDetails : Text;
    kycDocs : [Storage.ExternalBlob];
    status : {
      #pending;
      #approved;
      #rejected : Text;
    };
    submittedAt : Time.Time;
    reviewedBy : ?Principal;
  };

  public type ShopperApplication = {
    applicant : Principal;
    name : Text;
    email : Text;
    address : Text;
    kycDocs : [Storage.ExternalBlob];
    status : {
      #pending;
      #approved;
      #rejected : Text;
    };
    submittedAt : Time.Time;
    reviewedBy : ?Principal;
  };

  public type PickupPointApplication = {
    applicant : Principal;
    name : Text;
    address : Text;
    contactNumber : Text;
    businessImage : Storage.ExternalBlob;
    townId : ?TownId;
    status : {
      #pending;
      #approved;
      #rejected : Text;
    };
    submittedAt : Time.Time;
    reviewedBy : ?Principal;
  };

  public type DeliveryMethod = {
    #home : { address : Text };
    #pickupPoint : { pointId : Nat };
  };

  public type PaymentMethod = {
    #zar;
    #icp;
    #nomayini;
  };

  public type CartItem = {
    listingId : ListingId;
    quantity : Nat;
  };

  public type OrderStatus = {
    #pending;
    #assigned : { shopperId : Principal };
    #purchased;
    #ready;
    #inDelivery : { driverId : Principal };
    #delivered;
    #cancelled : Text;
  };

  public type OrderRecord = {
    id : OrderId;
    customer : Principal;
    items : [CartItem];
    deliveryMethod : DeliveryMethod;
    paymentMethod : PaymentMethod;
    totalAmount : Nat;
    status : OrderStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type NomaYiniVesting = {
    amount : Nat;
    unlockDate : Time.Time;
  };

  public type NomaYiniBalance = {
    unlocked : Nat;
    locked : [NomaYiniVesting];
  };

  public type NomaYiniTransaction = {
    id : Nat;
    from : Principal;
    to : Principal;
    amount : Nat;
    timestamp : Time.Time;
    txType : {
      #reward : { orderId : OrderId };
      #transfer;
      #unlock;
    };
  };

  public type TownMembership = {
    default : TownId;
    additional : [TownId];
  };

  public type TownMembershipApplication = {
    user : Principal;
    townId : TownId;
    status : {
      #pending;
      #approved;
      #rejected : Text;
    };
    appliedAt : Time.Time;
    reviewedBy : ?Principal;
    reviewedAt : ?Time.Time;
  };

  public type ShopperOrderView = {
    order : OrderRecord;
    expandedItems : [ExpandedOrderItem];
  };

  public type ExpandedOrderItem = {
    cartItem : CartItem;
    listing : ?NewListing;
    product : ?Product;
    retailer : ?Retailer;
  };

  public type PersonalShopperStatus = {
    #pending;
    #approved;
    #rejected : Text;
  };

  public type PersonalShopperApplication = {
    applicant : Principal;
    name : Text;
    email : Text;
    phone : Text;
    selfieImage : Storage.ExternalBlob;
    status : PersonalShopperStatus;
    submittedAt : Time.Time;
    reviewedBy : ?Principal;
    reviewedAt : ?Time.Time;
    rejectionReason : ?Text;
  };

  public type PersonalShopperApproval = {
    principal : Principal;
    approvedBy : Principal;
    approvedAt : Time.Time;
  };

  public type PickupOrderInput = {
    items : [CartItem];
    paymentMethod : PaymentMethod;
    customerName : Text;
    customerPhone : Text;
    deliveryAddress : ?Text;
  };

  public type PickupOrder = {
    orderRecord : OrderRecord;
    customerName : Text;
    customerPhone : Text;
    deliveryAddress : ?Text;
    createdByPickupPoint : Principal;
  };
};
