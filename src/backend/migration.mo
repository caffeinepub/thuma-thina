import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import Storage "blob-storage/Storage";

module {
  type RetailerId = Nat;
  type ProductId = Nat;
  type ListingId = Nat;
  type OrderId = Nat;

  type Product = {
    id : ProductId;
    name : Text;
    category : Text;
    description : Text;
    preferredImage : ?Storage.ExternalBlob;
    imageRefs : [Storage.ExternalBlob];
  };

  type ListingStatus = {
    #active;
    #outOfStock;
    #discontinued;
  };

  type Listing = {
    id : ListingId;
    retailerId : RetailerId;
    productId : ProductId;
    price : Nat;
    stock : Nat;
    status : ListingStatus;
    createdAt : Time.Time;
  };

  type Retailer = {
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

  type WeekdayTimeRange = {
    day : Nat;
    openTime : Nat;
    closeTime : Nat;
  };

  type HolidayOverride = {
    date : Time.Time;
    isOpen : Bool;
    openTime : ?Nat;
    closeTime : ?Nat;
    name : Text;
  };

  type OpeningHours = {
    weeklySchedule : [WeekdayTimeRange];
    holidayOverrides : [HolidayOverride];
  };

  type Province = {
    name : Text;
    towns : [Text];
  };

  type ProductRequest = {
    id : Nat;
    productName : Text;
    retailerName : Text;
    townSuburb : Text;
    province : Text;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type DriverApplication = {
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

  type ShopperApplication = {
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

  type PickupPointApplication = {
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

  type DeliveryMethod = {
    #home : { address : Text };
    #pickupPoint : { pointId : Nat };
  };

  type PaymentMethod = {
    #zar;
    #icp;
    #nomayini;
  };

  type CartItem = {
    listingId : ListingId;
    quantity : Nat;
  };

  type OrderStatus = {
    #pending;
    #assigned : { shopperId : Principal };
    #purchased;
    #ready;
    #inDelivery : { driverId : Principal };
    #delivered;
    #cancelled : Text;
  };

  type OrderRecord = {
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

  type NomaYiniVesting = {
    amount : Nat;
    unlockDate : Time.Time;
  };

  type NomaYiniBalance = {
    unlocked : Nat;
    locked : [NomaYiniVesting];
  };

  type NomaYiniTransaction = {
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

  type OldActor = {
    provinces : List.List<Province>;
    retailers : Map.Map<RetailerId, Retailer>;
    products : Map.Map<ProductId, Product>;
    listings : Map.Map<ListingId, Listing>;
    productRequests : Map.Map<Nat, ProductRequest>;
    userProfiles : Map.Map<Principal, UserProfile>;
    driverApplications : Map.Map<Principal, DriverApplication>;
    shopperApplications : Map.Map<Principal, ShopperApplication>;
    pickupPointApplications : Map.Map<Principal, PickupPointApplication>;
    orders : Map.Map<OrderId, OrderRecord>;
    nomayiniBalances : Map.Map<Principal, NomaYiniBalance>;
    nomayiniTransactions : List.List<NomaYiniTransaction>;
    approvedShoppers : Map.Map<Principal, Bool>;
    approvedDrivers : Map.Map<Principal, Bool>;
    approvedPickupPoints : Map.Map<Nat, Principal>;
    nextRetailerId : Nat;
    nextProductId : Nat;
    nextListingId : Nat;
    nextRequestId : Nat;
    nextOrderId : Nat;
    nextPickupPointId : Nat;
    nextTxId : Nat;
    accessControlState : AccessControl.AccessControlState;
    approvalState : UserApproval.UserApprovalState;
  };

  type NewActor = {
    provinces : List.List<Province>;
    retailers : Map.Map<RetailerId, Retailer>;
    products : Map.Map<ProductId, Product>;
    listings : Map.Map<ListingId, Listing>;
    productRequests : Map.Map<Nat, ProductRequest>;
    userProfiles : Map.Map<Principal, UserProfile>;
    driverApplications : Map.Map<Principal, DriverApplication>;
    shopperApplications : Map.Map<Principal, ShopperApplication>;
    pickupPointApplications : Map.Map<Principal, PickupPointApplication>;
    orders : Map.Map<OrderId, OrderRecord>;
    nomayiniBalances : Map.Map<Principal, NomaYiniBalance>;
    nomayiniTransactions : List.List<NomaYiniTransaction>;
    approvedShoppers : Map.Map<Principal, Bool>;
    approvedDrivers : Map.Map<Principal, Bool>;
    approvedPickupPoints : Map.Map<Nat, Principal>;
    nextRetailerId : Nat;
    nextProductId : Nat;
    nextListingId : Nat;
    nextRequestId : Nat;
    nextOrderId : Nat;
    nextPickupPointId : Nat;
    nextTxId : Nat;
    accessControlState : AccessControl.AccessControlState;
    approvalState : UserApproval.UserApprovalState;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
