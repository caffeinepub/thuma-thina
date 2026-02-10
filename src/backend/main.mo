import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import UserApproval "user-approval/approval";
import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Migration "migration";

// Apply data migration from old to new state
(with migration = Migration.run)
actor {
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

  public type ListingStatus = {
    #active;
    #outOfStock;
    #discontinued;
  };

  public type Listing = {
    id : ListingId;
    retailerId : RetailerId;
    productId : ProductId;
    price : Nat;
    stock : Nat;
    status : ListingStatus;
    createdAt : Time.Time;
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

  public type RetailerInput = {
    name : Text;
    townSuburb : Text;
    province : Text;
    address : Text;
    phone : Text;
    email : Text;
    openingHours : OpeningHours;
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
    listings : [Listing];
  };

  public type ProductWithRetailers = {
    product : Product;
    listings : [(Retailer, Listing)];
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

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
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
    email : Text;
    phone : Text;
    address : Text;
    townSuburb : Text;
    province : Text;
    kycDocs : [Storage.ExternalBlob];
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

  var provinces = List.empty<Province>();
  var retailers = Map.empty<RetailerId, Retailer>();
  var products = Map.empty<ProductId, Product>();
  var listings = Map.empty<ListingId, Listing>();
  var productRequests = Map.empty<Nat, ProductRequest>();
  var userProfiles = Map.empty<Principal, UserProfile>();
  var driverApplications = Map.empty<Principal, DriverApplication>();
  var shopperApplications = Map.empty<Principal, ShopperApplication>();
  var pickupPointApplications = Map.empty<Principal, PickupPointApplication>();
  var orders = Map.empty<OrderId, OrderRecord>();
  var nomayiniBalances = Map.empty<Principal, NomaYiniBalance>();
  var nomayiniTransactions = List.empty<NomaYiniTransaction>();
  var approvedShoppers = Map.empty<Principal, Bool>();
  var approvedDrivers = Map.empty<Principal, Bool>();
  var approvedPickupPoints = Map.empty<Nat, Principal>();

  var nextRetailerId = 0;
  var nextProductId = 0;
  var nextListingId = 0;
  var nextRequestId = 0;
  var nextOrderId = 0;
  var nextPickupPointId = 0;
  var nextTxId = 0;

  var accessControlState = AccessControl.initState();
  var approvalState = UserApproval.initState(accessControlState);

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Add additional required user approval functions
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
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

  // [Rest of canister unchanged - existing business logic]
};
