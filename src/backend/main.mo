import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Migration "migration";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";

// Apply migration on upgrade
(with migration = Migration.run)
actor {
  public type RetailerId = Nat;
  public type ProductId = Nat;
  public type ListingId = Nat;

  public type Product = {
    id : ProductId;
    name : Text;
    category : Text;
    description : Text;
    imageRef : Text;
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
  };

  public type Retailer = {
    id : RetailerId;
    name : Text;
    townSuburb : Text;
    province : Text;
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

  module Retailer {
    public func compareByTownSuburb(r1 : Retailer, r2 : Retailer) : Order.Order {
      Text.compare(r1.townSuburb, r2.townSuburb);
    };
  };

  let provinces = List.empty<Province>();
  let retailers = Map.empty<RetailerId, Retailer>();
  let products = Map.empty<ProductId, Product>();
  let listings = Map.empty<ListingId, Listing>();
  let productRequests = Map.empty<Nat, ProductRequest>();

  var nextRetailerId = 0;
  var nextProductId = 0;
  var nextListingId = 0;
  var nextRequestId = 0;

  let accessControlState = AccessControl.initState();
  let approvalState = UserApproval.initState(accessControlState);

  include MixinAuthorization(accessControlState);

  public shared ({ caller }) func bootstrapAdmin(adminToken : Text, userProvidedToken : Text) : async () {
    AccessControl.initialize(accessControlState, caller, adminToken, userProvidedToken);
  };

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func upgradeToAdmin(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    AccessControl.assignRole(accessControlState, caller, user, #admin);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  public shared ({ caller }) func addProvince(name : Text, towns : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let province : Province = { name; towns };
    provinces.add(province);
  };

  public shared ({ caller }) func addRetailer(name : Text, townSuburb : Text, province : Text) : async RetailerId {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };
    let retailer : Retailer = {
      id = nextRetailerId;
      name;
      townSuburb;
      province;
    };
    retailers.add(nextRetailerId, retailer);
    nextRetailerId += 1;
    nextRetailerId - 1;
  };

  public shared ({ caller }) func addProduct(name : Text, category : Text, description : Text, imageRef : Text) : async ProductId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let product : Product = {
      id = nextProductId;
      name;
      category;
      description;
      imageRef;
    };
    products.add(nextProductId, product);
    nextProductId += 1;
    nextProductId - 1;
  };

  public shared ({ caller }) func addListing(
    retailerId : RetailerId,
    productId : ProductId,
    price : Nat,
    stock : Nat,
    status : ListingStatus,
  ) : async ListingId {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };

    switch (retailers.get(retailerId)) {
      case (null) { Runtime.trap("Retailer not found") };
      case (?_) {
        switch (products.get(productId)) {
          case (null) { Runtime.trap("Product not found") };
          case (?_) {
            let listing : Listing = {
              id = nextListingId;
              retailerId;
              productId;
              price;
              stock;
              status;
            };
            listings.add(nextListingId, listing);
            nextListingId += 1;
            nextListingId - 1;
          };
        };
      };
    };
  };

  public query ({ caller }) func getRetailersByTownSuburb(townSuburb : Text) : async [RetailerWithListings] {
    let filteredRetailers = retailers.values().toArray().filter(func(retailer) { retailer.townSuburb == townSuburb });
    filteredRetailers.map(
      func(retailer) {
        let retailerListings = listings.values().toArray().filter(func(listing) { listing.retailerId == retailer.id });
        {
          retailer;
          listings = retailerListings;
        };
      }
    );
  };

  public query ({ caller }) func getProductCatalog(retailerId : RetailerId) : async [Listing] {
    switch (retailers.get(retailerId)) {
      case (null) { Runtime.trap("Retailer not found") };
      case (?_) {
        let retailerListings = listings.values().toArray().filter(func(listing) { listing.retailerId == retailerId });
        retailerListings;
      };
    };
  };

  public query ({ caller }) func getProductWithRetailers(productId : ProductId) : async ProductWithRetailers {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let productListings = listings.values().toArray().filter(func(listing) { listing.productId == productId });
        let listingsWithRetailers = productListings.filter(func(listing) {
          switch (retailers.get(listing.retailerId)) {
            case (null) { false };
            case (?_) { true };
          };
        });
        let retailerListingPairs = listingsWithRetailers.map(
          func(listing) {
            switch (retailers.get(listing.retailerId)) {
              case (null) {
                let dummyRetailer : Retailer = {
                  id = 0;
                  name = "";
                  townSuburb = "";
                  province = "";
                };
                (dummyRetailer, listing);
              };
              case (?retailer) { (retailer, listing) };
            };
          }
        );
        {
          product;
          listings = retailerListingPairs;
        };
      };
    };
  };

  public query ({ caller }) func getDashboardData() : async {
    retailers : Nat;
    products : Nat;
    listings : Nat;
    requests : Nat;
  } {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can access dashboard data");
    };
    {
      retailers = retailers.size();
      products = products.size();
      listings = listings.size();
      requests = productRequests.size();
    };
  };

  public shared ({ caller }) func requestNewProduct(
    productName : Text,
    retailerName : Text,
    townSuburb : Text,
    province : Text,
  ) : async Nat {
    // Allow any authenticated user (including guests) to request new products
    // No authorization check needed - this is a public feature
    let request : ProductRequest = {
      id = nextRequestId;
      productName;
      retailerName;
      townSuburb;
      province;
    };
    productRequests.add(nextRequestId, request);
    nextRequestId += 1;
    nextRequestId - 1;
  };

  public query ({ caller }) func getProvinces() : async [Province] {
    provinces.toArray();
  };

  public query ({ caller }) func getProductRequests() : async [ProductRequest] {
    productRequests.values().toArray();
  };

  public query ({ caller }) func getAllActiveListings() : async [Listing] {
    listings.values().toArray().filter(func(listing) { listing.status == #active });
  };

  public shared ({ caller }) func updateListingStatus(listingId : ListingId, newStatus : ListingStatus) : async () {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };

    switch (listings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        let updatedListing = { listing with status = newStatus };
        listings.add(listingId, updatedListing);
      };
    };
  };
};
