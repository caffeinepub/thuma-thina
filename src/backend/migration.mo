import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";

module {
  type RetailerId = Nat;
  type ProductId = Nat;
  type ListingId = Nat;

  type OldProduct = {
    id : ProductId;
    name : Text;
    category : Text;
    description : Text;
    preferredImage : ?Blob; // Assuming ?Blob for image data
    imageRefs : [Blob]; // Assuming [Blob] for multiple images
  };

  type ListingStatus = {
    #active;
    #outOfStock;
    #discontinued;
  };

  type OldListing = {
    id : ListingId;
    retailerId : RetailerId;
    productId : ProductId;
    price : Nat; // Now always ZAR, not cents
    stock : Nat;
    status : ListingStatus;
  };

  type OpeningHours = {
    weeklySchedule : [WeekdayTimeRange];
    holidayOverrides : [HolidayOverride];
  };

  type WeekdayTimeRange = {
    day : Nat; // 0 = Monday, 6 = Sunday
    openTime : Nat; // Format: 900 for 09:00, 1800 for 18:00
    closeTime : Nat;
  };

  type HolidayOverride = {
    date : Int; // Timestamp representing the holiday date
    isOpen : Bool;
    openTime : ?Nat;
    closeTime : ?Nat;
    name : Text;
  };

  type OldRetailer = {
    id : RetailerId;
    name : Text;
    townSuburb : Text;
    province : Text;
    address : Text;
    phone : Text;
    email : Text;
    openingHours : OpeningHours;
    createdAt : Int; // Timestamps (assuming Int)
    updatedAt : Int; // Timestamps (assuming Int)
  };

  type OldActor = {
    provinces : List.List<OldProvince>;
    retailers : Map.Map<RetailerId, OldRetailer>;
    products : Map.Map<ProductId, OldProduct>;
    listings : Map.Map<ListingId, OldListing>;
    productRequests : Map.Map<Nat, OldProductRequest>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextRetailerId : RetailerId;
    nextProductId : ProductId;
    nextListingId : ListingId;
    nextRequestId : Nat;
    accessControlState : AccessControl.AccessControlState;
    approvalState : UserApproval.UserApprovalState;
  };

  type OldProvince = {
    name : Text;
    towns : [Text];
  };

  type OldProductRequest = {
    id : Nat;
    productName : Text;
    retailerName : Text;
    townSuburb : Text;
    province : Text;
  };

  type OldUserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  // --- New Types ---
  type NewProduct = {
    id : ProductId;
    name : Text;
    category : Text;
    description : Text;
    preferredImage : ?Blob;
    imageRefs : [Blob];
  };

  type NewListing = {
    id : ListingId;
    retailerId : RetailerId;
    productId : ProductId;
    price : Nat; // Now always ZAR, not cents
    stock : Nat;
    status : ListingStatus;
    createdAt : Int;
  };

  type NewRetailer = {
    id : RetailerId;
    name : Text;
    townSuburb : Text;
    province : Text;
    address : Text;
    phone : Text;
    email : Text;
    openingHours : OpeningHours;
    createdAt : Int;
    updatedAt : Int;
  };

  type NewProvince = {
    name : Text;
    towns : [Text];
  };

  type NewActor = {
    provinces : List.List<NewProvince>;
    retailers : Map.Map<RetailerId, NewRetailer>;
    products : Map.Map<ProductId, NewProduct>;
    listings : Map.Map<ListingId, NewListing>;
    productRequests : Map.Map<Nat, OldProductRequest>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextRetailerId : RetailerId;
    nextProductId : ProductId;
    nextListingId : ListingId;
    nextRequestId : Nat;
    accessControlState : AccessControl.AccessControlState;
    approvalState : UserApproval.UserApprovalState;
  };

  public func run(old : OldActor) : NewActor {
    let newListings = old.listings.map<ListingId, OldListing, NewListing>(
      func(_id, oldListing) {
        {
          oldListing with
          createdAt = 0
        };
      }
    );

    {
      old with
      listings = newListings;
    };
  };
};
