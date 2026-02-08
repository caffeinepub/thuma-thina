import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";

module {
  type OldActor = {
    provinces : List.List<{ name : Text; towns : [Text] }>;
    retailers : Map.Map<Nat, { id : Nat; name : Text; townSuburb : Text; province : Text }>;
    products : Map.Map<Nat, { id : Nat; name : Text; category : Text; description : Text; imageRef : Text }>;
    listings : Map.Map<Nat, {
      id : Nat;
      retailerId : Nat;
      productId : Nat;
      price : Nat;
      stock : Nat;
      status : { #active; #outOfStock; #discontinued };
    }>;
    productRequests : Map.Map<Nat, {
      id : Nat;
      productName : Text;
      retailerName : Text;
      townSuburb : Text;
      province : Text;
    }>;
    nextRetailerId : Nat;
    nextProductId : Nat;
    nextListingId : Nat;
    nextRequestId : Nat;
    isAdminBootstrapOpen : Bool;
    accessControlState : AccessControl.AccessControlState;
    approvalState : UserApproval.UserApprovalState;
  };

  type NewActor = {
    provinces : List.List<{ name : Text; towns : [Text] }>;
    retailers : Map.Map<Nat, { id : Nat; name : Text; townSuburb : Text; province : Text }>;
    products : Map.Map<Nat, { id : Nat; name : Text; category : Text; description : Text; imageRef : Text }>;
    listings : Map.Map<Nat, {
      id : Nat;
      retailerId : Nat;
      productId : Nat;
      price : Nat;
      stock : Nat;
      status : { #active; #outOfStock; #discontinued };
    }>;
    productRequests : Map.Map<Nat, {
      id : Nat;
      productName : Text;
      retailerName : Text;
      townSuburb : Text;
      province : Text;
    }>;
    nextRetailerId : Nat;
    nextProductId : Nat;
    nextListingId : Nat;
    nextRequestId : Nat;
    accessControlState : AccessControl.AccessControlState;
    approvalState : UserApproval.UserApprovalState;
  };

  public func run(old : OldActor) : NewActor {
    {
      provinces = old.provinces;
      retailers = old.retailers;
      products = old.products;
      listings = old.listings;
      productRequests = old.productRequests;
      nextRetailerId = old.nextRetailerId;
      nextProductId = old.nextProductId;
      nextListingId = old.nextListingId;
      nextRequestId = old.nextRequestId;
      accessControlState = old.accessControlState;
      approvalState = old.approvalState;
    };
  };
};
