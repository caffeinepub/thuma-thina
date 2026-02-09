import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import UserApproval "user-approval/approval";
import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";

actor {
  type RetailerId = Nat;
  type ProductId = Nat;
  type ListingId = Nat;

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
    price : Nat; // Now always ZAR, not cents
    stock : Nat;
    status : ListingStatus;
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
    day : Nat; // 0 = Monday, 6 = Sunday
    openTime : Nat; // Format: 900 for 09:00, 1800 for 18:00
    closeTime : Nat;
  };

  public type HolidayOverride = {
    date : Time.Time; // Timestamp representing the holiday date
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

  var provinces = List.empty<Province>();
  var retailers = Map.empty<RetailerId, Retailer>();
  var products = Map.empty<ProductId, Product>();
  var listings = Map.empty<ListingId, Listing>();
  var productRequests = Map.empty<Nat, ProductRequest>();
  var userProfiles = Map.empty<Principal, UserProfile>();

  var nextRetailerId = 0;
  var nextProductId = 0;
  var nextListingId = 0;
  var nextRequestId = 0;

  var accessControlState = AccessControl.initState();
  var approvalState = UserApproval.initState(accessControlState);

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  module Retailer {
    public func compareByTownSuburb(r1 : Retailer, r2 : Retailer) : Order.Order {
      Text.compare(r1.townSuburb, r2.townSuburb);
    };
  };

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

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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

  public shared ({ caller }) func addProvince(name : Text, towns : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let province : Province = { name; towns };
    provinces.add(province);
  };

  public shared ({ caller }) func addRetailer(input : RetailerInput) : async RetailerId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let retailer : Retailer = {
      id = nextRetailerId;
      name = input.name;
      townSuburb = input.townSuburb;
      province = input.province;
      address = input.address;
      phone = input.phone;
      email = input.email;
      openingHours = input.openingHours;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    retailers.add(nextRetailerId, retailer);
    nextRetailerId += 1;
    nextRetailerId - 1;
  };

  public shared ({ caller }) func updateRetailer(id : RetailerId, input : RetailerInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (retailers.get(id)) {
      case (null) { Runtime.trap("Retailer not found") };
      case (?existing) {
        let updatedRetailer : Retailer = {
          id;
          name = input.name;
          townSuburb = input.townSuburb;
          province = input.province;
          address = input.address;
          phone = input.phone;
          email = input.email;
          openingHours = input.openingHours;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        retailers.add(id, updatedRetailer);
      };
    };
  };

  public shared ({ caller }) func addProduct(name : Text, category : Text, description : Text, preferredImage : ?Storage.ExternalBlob) : async ProductId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let product : Product = {
      id = nextProductId;
      name;
      category;
      description;
      preferredImage;
      imageRefs = [];
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
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
                  address = "";
                  phone = "";
                  email = "";
                  openingHours = {
                    weeklySchedule = [];
                    holidayOverrides = [];
                  };
                  createdAt = 0;
                  updatedAt = 0;
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
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view product requests");
    };
    productRequests.values().toArray();
  };

  public query ({ caller }) func getAllActiveListings() : async [Listing] {
    listings.values().toArray().filter(func(listing) { listing.status == #active });
  };

  public shared ({ caller }) func updateListingStatus(listingId : ListingId, newStatus : ListingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (listings.get(listingId)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?listing) {
        let updatedListing = { listing with status = newStatus };
        listings.add(listingId, updatedListing);
      };
    };
  };

  public shared ({ caller }) func addImageRef(productId : ProductId, imageRef : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        if (product.imageRefs.size() >= 3) {
          Runtime.trap("Maximum of 3 images allowed per product");
        };
        let updatedProduct : Product = {
          product with imageRefs = product.imageRefs.concat([imageRef]);
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func setPreferredImage(productId : ProductId, preferredImage : ?Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updatedProduct : Product = {
          product with preferredImage
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func removeImage(productId : ProductId, imageIndex : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        if (imageIndex >= product.imageRefs.size()) {
          Runtime.trap("Invalid image index");
        };
        let filteredImageRefs = product.imageRefs.filter(
          func(index) { index != imageIndex }
        );
        let updatedProduct : Product = {
          product with imageRefs = filteredImageRefs
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func wipeSystem() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can wipe the system");
    };
    retailers.clear();
    products.clear();
    listings.clear();
    productRequests.clear();
    provinces.clear();
    userProfiles.clear();

    nextRetailerId := 0;
    nextProductId := 0;
    nextListingId := 0;
    nextRequestId := 0;

    accessControlState := AccessControl.initState();
    approvalState := UserApproval.initState(accessControlState);
  };

  public query ({ caller }) func getRetailerById(retailerId : RetailerId) : async ?Retailer {
    retailers.get(retailerId);
  };

  public query ({ caller }) func isRetailerOpen(retailerId : RetailerId, timestamp : ?Time.Time) : async Bool {
    switch (retailers.get(retailerId)) {
      case (null) { false };
      case (?retailer) {
        let now = switch (timestamp) {
          case (null) { Time.now() };
          case (?t) { t };
        };
        isOpenAtTime(retailer.openingHours, now);
      };
    };
  };

  func isOpenAtTime(openingHours : OpeningHours, timestamp : Time.Time) : Bool {
    let dayOfWeek = getDayOfWeek(timestamp);
    let timeOfDay = getTimeOfDayMinutes(timestamp);

    for (holidayOverride in openingHours.holidayOverrides.values()) {
      if (isSameDay(holidayOverride.date, timestamp)) {
        return holidayOverride.isOpen;
      };
    };

    for (weekly in openingHours.weeklySchedule.values()) {
      if (weekly.day == dayOfWeek and timeOfDay >= weekly.openTime and timeOfDay <= weekly.closeTime) {
        return true;
      };
    };

    false;
  };

  func getDayOfWeek(_timestamp : Time.Time) : Nat {
    0;
  };

  func getTimeOfDayMinutes(_timestamp : Time.Time) : Nat {
    1200;
  };

  func isSameDay(_date1 : Time.Time, _date2 : Time.Time) : Bool {
    false;
  };

  public query ({ caller }) func listRetailers() : async [Retailer] {
    retailers.values().toArray();
  };

  public query ({ caller }) func listProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func listListings() : async [Listing] {
    listings.values().toArray();
  };
};
