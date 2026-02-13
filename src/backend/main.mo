import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import UserApproval "user-approval/approval";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

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
    address : Text;
    contactNumber : Text;
    businessImage : Storage.ExternalBlob;
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

  public type TownStatus = {
    #active;
    #removed;
  };

  public type Town = {
    id : TownId;
    name : Text;
    province : Text;
    status : TownStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
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

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public query ({ caller }) func getPersonalShopperStatus() : async ?PersonalShopperStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check status");
    };
    personalShopperStatus.get(caller);
  };

  public query ({ caller }) func getPersonalShopperApplication() : async ?PersonalShopperApplication {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view applications");
    };
    personalShopperApplications.get(caller);
  };

  public query ({ caller }) func listPendingPersonalShopperApplications() : async [PersonalShopperApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list applications");
    };
    let all = personalShopperApplications.values().toArray();
    all.filter<PersonalShopperApplication>(func(a) { a.status == #pending });
  };

  public shared ({ caller }) func createPersonalShopperApplication(
    name : Text,
    email : Text,
    phone : Text,
    selfieImage : Storage.ExternalBlob,
  ) : async PersonalShopperApplication {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create applications");
    };

    if (personalShopperApplications.containsKey(caller)) {
      Runtime.trap("Application already exists for this user");
    };

    let app : PersonalShopperApplication = {
      applicant = caller;
      name;
      email;
      phone;
      selfieImage;
      status = #pending;
      submittedAt = Time.now();
      reviewedBy = null;
      reviewedAt = null;
      rejectionReason = null;
    };

    personalShopperApplications.add(caller, app);
    personalShopperStatus.add(caller, #pending);

    app;
  };

  public shared ({ caller }) func approvePersonalShopper(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve applications");
    };

    switch (personalShopperApplications.get(user)) {
      case (null) { Runtime.trap("Application not found") };
      case (?app) {
        switch (app.status) {
          case (#approved) { Runtime.trap("Application already approved") };
          case (#rejected(_)) { Runtime.trap("Rejected applications cannot be re-approved") };
          case (#pending) {};
        };

        let updatedApp = {
          app with
          status = #approved;
          reviewedBy = ?caller;
          reviewedAt = ?Time.now();
        };
        personalShopperApplications.add(user, updatedApp);

        let approval = {
          principal = user;
          approvedBy = caller;
          approvedAt = Time.now();
        };
        personalShopperApprovals.add(user, approval);

        personalShopperStatus.add(user, #approved);
        approvedShoppers.add(user, true);
      };
    };
  };

  public shared ({ caller }) func rejectPersonalShopper(user : Principal, reason : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject applications");
    };

    switch (personalShopperApplications.get(user)) {
      case (null) { Runtime.trap("Application not found") };
      case (?app) {
        switch (app.status) {
          case (#approved) { Runtime.trap("Approved applications cannot be rejected") };
          case (#pending) {};
          case (#rejected(_)) { Runtime.trap("Application already rejected") };
        };

        let updatedApp = {
          app with
          status = #rejected(reason);
          reviewedBy = ?caller;
          reviewedAt = ?Time.now();
          rejectionReason = ?reason;
        };
        personalShopperApplications.add(user, updatedApp);

        personalShopperStatus.add(user, #rejected(reason));
      };
    };
  };

  public query ({ caller }) func getPickupPointStatus() : async ?{ #pending; #approved; #rejected : Text } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check status");
    };
    switch (pickupPointApplications.get(caller)) {
      case (null) { null };
      case (?app) { ?app.status };
    };
  };

  public query ({ caller }) func getPickupPointApplication() : async ?PickupPointApplication {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view applications");
    };
    pickupPointApplications.get(caller);
  };

  public query ({ caller }) func listPendingPickupPointApplications() : async [PickupPointApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list applications");
    };
    pickupPointApplications.values().toArray().filter<PickupPointApplication>(func(a) { a.status == #pending });
  };

  public shared ({ caller }) func createPickupPointApplication(
    name : Text,
    address : Text,
    contactNumber : Text,
    businessImage : Storage.ExternalBlob,
  ) : async PickupPointApplication {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create applications");
    };

    if (pickupPointApplications.containsKey(caller)) {
      Runtime.trap("Application already exists for this user");
    };

    if (name == "") {
      Runtime.trap("Business name is required");
    };
    if (address == "") {
      Runtime.trap("Address is required");
    };
    if (contactNumber == "") {
      Runtime.trap("Contact number is required");
    };

    let app : PickupPointApplication = {
      applicant = caller;
      name;
      address;
      contactNumber;
      businessImage;
      status = #pending;
      submittedAt = Time.now();
      reviewedBy = null;
    };

    pickupPointApplications.add(caller, app);
    app;
  };

  public shared ({ caller }) func approvePickupPoint(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve applications");
    };

    switch (pickupPointApplications.get(user)) {
      case (null) { Runtime.trap("Application not found") };
      case (?existing) {
        switch (existing.status) {
          case (#approved) { Runtime.trap("Application already approved") };
          case (#rejected(_)) { Runtime.trap("Rejected applications cannot be re-approved") };
          case (#pending) {};
        };

        let updated = { existing with
          status = #approved;
          reviewedBy = ?caller;
        };
        pickupPointApplications.add(user, updated);

        let pickupPointId = nextPickupPointId;
        approvedPickupPoints.add(pickupPointId, user);
        nextPickupPointId += 1;
      };
    };
  };

  public shared ({ caller }) func rejectPickupPoint(user : Principal, reason : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject applications");
    };

    switch (pickupPointApplications.get(user)) {
      case (null) { Runtime.trap("Application not found") };
      case (?existing) {
        switch (existing.status) {
          case (#approved) { Runtime.trap("Approved applications cannot be rejected") };
          case (#pending) {};
          case (#rejected(_)) { Runtime.trap("Application already rejected") };
        };

        let updated = {
          existing with
          status = #rejected(reason);
          reviewedBy = ?caller;
        };
        pickupPointApplications.add(user, updated);
      };
    };
  };

  private func isPromoActive(promo : ?PromoDetails) : Bool {
    switch (promo) {
      case (null) { false };
      case (?p) {
        let now = Time.now();
        let afterStart = now >= p.startDate;
        let beforeEnd = switch (p.endDate) {
          case (null) { true };
          case (?endDate) { now <= endDate };
        };
        afterStart and beforeEnd;
      };
    };
  };

  private func getActivePrice(listing : NewListing) : Nat {
    if (isPromoActive(listing.promo)) {
      switch (listing.promo) {
        case (null) { listing.price };
        case (?p) { p.price };
      };
    } else {
      listing.price;
    };
  };

  private func isListingOrderable(listing : NewListing) : Bool {
    listing.status == #active and listing.stock > 0;
  };

  private func isRetailer(caller : Principal) : Bool {
    retailerPrincipals.get(caller).isSome();
  };

  private func getRetailerId(caller : Principal) : ?RetailerId {
    retailerPrincipals.get(caller);
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

  public shared ({ caller }) func createProduct(name : Text, description : Text, image : Storage.ExternalBlob, category : Text) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    if (not productCategories.toArray().find(func(cat) { cat == category }).isSome()) {
      productCategories.add(category);
    };

    let product : Product = {
      id = nextProductId;
      name;
      description;
      category;
      preferredImage = ?image;
      imageRefs = [image];
    };

    products.add(product.id, product);
    nextProductId += 1;
    product;
  };

  public query ({ caller }) func listProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access product listings");
    };
    products.values().toArray();
  };

  public shared ({ caller }) func updateProduct(id : ProductId, name : Text, description : Text, category : Text) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?existingProduct) {
        let updatedProduct : Product = {
          existingProduct with
          name;
          description;
          category;
        };
        products.add(id, updatedProduct);
        updatedProduct;
      };
    };
  };

  public query func listCategories() : async [Text] {
    productCategories.toArray();
  };

  public shared ({ caller }) func createCategory(category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create categories");
    };

    if (productCategories.toArray().find(func(cat) { cat == category }).isSome()) {
      Runtime.trap("Category already exists");
    };

    productCategories.add(category);
  };

  public shared ({ caller }) func createRetailer(input : RetailerInput) : async Retailer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create retailers");
    };

    let now = Time.now();
    let retailer : Retailer = {
      id = nextRetailerId;
      name = input.name;
      townSuburb = input.townSuburb;
      province = input.province;
      address = input.address;
      phone = input.phone;
      email = input.email;
      openingHours = input.openingHours;
      createdAt = now;
      updatedAt = now;
    };

    retailers.add(retailer.id, retailer);
    nextRetailerId += 1;
    retailer;
  };

  public shared ({ caller }) func updateRetailer(id : RetailerId, input : RetailerInput) : async Retailer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update retailers");
    };

    switch (retailers.get(id)) {
      case (null) {
        Runtime.trap("Retailer not found");
      };
      case (?existingRetailer) {
        let updatedRetailer : Retailer = {
          id = existingRetailer.id;
          name = input.name;
          townSuburb = input.townSuburb;
          province = input.province;
          address = input.address;
          phone = input.phone;
          email = input.email;
          openingHours = input.openingHours;
          createdAt = existingRetailer.createdAt;
          updatedAt = Time.now();
        };
        retailers.add(id, updatedRetailer);
        updatedRetailer;
      };
    };
  };

  public shared ({ caller }) func deleteRetailer(id : RetailerId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete retailers");
    };

    switch (retailers.get(id)) {
      case (null) {
        Runtime.trap("Retailer not found");
      };
      case (?_) {
        retailers.remove(id);
      };
    };
  };

  public query ({ caller }) func listRetailers() : async [Retailer] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all retailers");
    };
    retailers.values().toArray();
  };

  public query ({ caller }) func getRetailer(id : RetailerId) : async ?Retailer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access retailer details");
    };
    retailers.get(id);
  };

  public shared ({ caller }) func associateRetailerPrincipal(principal : Principal, retailerId : RetailerId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can associate retailer principals");
    };

    switch (retailers.get(retailerId)) {
      case (null) {
        Runtime.trap("Retailer not found");
      };
      case (?_) {
        retailerPrincipals.add(principal, retailerId);
      };
    };
  };

  public shared ({ caller }) func removeRetailerPrincipal(principal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove retailer principals");
    };

    retailerPrincipals.remove(principal);
  };

  public query ({ caller }) func getRetailerPrincipalMapping(principal : Principal) : async ?RetailerId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view retailer principal mappings");
    };
    retailerPrincipals.get(principal);
  };

  public query ({ caller }) func getMyRetailerInventory() : async [NewListing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access retailer inventory");
    };

    switch (getRetailerId(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Caller is not associated with any retailer");
      };
      case (?retailerId) {
        let allListings = listings.values().toArray();
        allListings.filter<NewListing>(func(listing) { listing.retailerId == retailerId });
      };
    };
  };

  public query ({ caller }) func getMyRetailerOrders() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access retailer orders");
    };

    switch (getRetailerId(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Caller is not associated with any retailer");
      };
      case (?retailerId) {
        let allOrders = orders.values().toArray();
        allOrders.filter<OrderRecord>(
          func(order) {
            order.items.any<CartItem>(
              func(item) {
                switch (listings.get(item.listingId)) {
                  case (null) { false };
                  case (?listing) { listing.retailerId == retailerId };
                };
              }
            );
          }
        );
      };
    };
  };

  public query ({ caller }) func getMyRetailer() : async ?Retailer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access retailer information");
    };

    switch (getRetailerId(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Caller is not associated with any retailer");
      };
      case (?retailerId) {
        retailers.get(retailerId);
      };
    };
  };

  public shared ({ caller }) func createListing(retailerId : RetailerId, productId : ProductId, price : Nat, stock : Nat) : async NewListing {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create listings");
    };

    switch (retailers.get(retailerId), products.get(productId)) {
      case (null, _) { Runtime.trap("Retailer not found") };
      case (_, null) { Runtime.trap("Product not found") };
      case (?_, ?_) {
        let existingListing = listings.values().toArray().find(
          func(l) { l.retailerId == retailerId and l.productId == productId }
        );
        switch (existingListing) {
          case (?_) {
            Runtime.trap("Listing already exists for this retailer and product");
          };
          case (null) {
            let listing : NewListing = {
              id = nextListingId;
              retailerId;
              productId;
              price;
              promo = null;
              stock;
              status = #active;
              createdAt = Time.now();
              updatedAt = Time.now();
            };
            listings.add(listing.id, listing);
            nextListingId += 1;
            listing;
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateListing(id : ListingId, price : Nat, stock : Nat, status : ListingStatus) : async NewListing {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update listings");
    };

    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existing) {
        let updated : NewListing = {
          existing with
          price;
          stock;
          status;
          updatedAt = Time.now();
        };
        listings.add(id, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func deleteListing(id : ListingId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete listings");
    };

    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?_) { listings.remove(id) };
    };
  };

  public query ({ caller }) func getListing(id : ListingId) : async ?NewListing {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access listing details");
    };
    listings.get(id);
  };

  public query ({ caller }) func getRetailerListings(retailerId : RetailerId) : async [NewListing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access retailer listings");
    };
    let allListings = listings.values().toArray();
    allListings.filter<NewListing>(func(l) { l.retailerId == retailerId });
  };

  public query ({ caller }) func listAllListings() : async [NewListing] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all listings");
    };
    listings.values().toArray();
  };

  public shared ({ caller }) func setPromo(id : ListingId, price : Nat, startDate : Time.Time, endDate : ?Time.Time) : async NewListing {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set promo pricing");
    };

    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existing) {
        let promo : ?PromoDetails = ?{
          price;
          startDate;
          endDate;
        };
        let updated : NewListing = {
          existing with
          promo;
          updatedAt = Time.now();
        };
        listings.add(id, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func removePromo(id : ListingId) : async NewListing {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove promotions");
    };

    switch (listings.get(id)) {
      case (null) { Runtime.trap("Listing not found") };
      case (?existing) {
        let updated : NewListing = {
          existing with
          promo = null;
          updatedAt = Time.now();
        };
        listings.add(id, updated);
        updated;
      };
    };
  };

  public query func getCatalogue() : async [ShopProduct] {
    let allProducts = products.values().toArray();
    let allListings = listings.values().toArray();

    allProducts.map<Product, ShopProduct>(
      func(product) {
        let productListings = allListings.filter(
          func(l) { l.productId == product.id and isListingOrderable(l) }
        );

        let shopListings = productListings.map(
          func(listing) {
            let retailerOpt = retailers.get(listing.retailerId);
            let retailerName = switch (retailerOpt) {
              case (null) { "Unknown" };
              case (?r) { r.name };
            };

            let activePrice = getActivePrice(listing);
            let promoActive = isPromoActive(listing.promo);
            let savings = if (promoActive) {
              ?(listing.price - activePrice);
            } else {
              null;
            };

            {
              listingId = listing.id;
              retailerId = listing.retailerId;
              retailerName;
              normalPrice = listing.price;
              activePrice;
              savings;
              stock = listing.stock;
              isPromoActive = promoActive;
            };
          }
        );

        let image = switch (product.preferredImage) {
          case (null) {
            if (product.imageRefs.size() > 0) {
              ?product.imageRefs[0];
            } else { null };
          };
          case (?img) { ?img };
        };

        {
          id = product.id;
          name = product.name;
          description = product.description;
          image;
          listings = shopListings;
        };
      }
    );
  };

  public shared ({ caller }) func createOrder(
    items : [CartItem],
    deliveryMethod : DeliveryMethod,
    paymentMethod : PaymentMethod
  ) : async OrderRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create orders");
    };

    if (items.size() == 0) {
      Runtime.trap("Order must contain at least one item");
    };

    var totalAmount : Nat = 0;

    for (item in items.vals()) {
      if (item.quantity == 0) {
        Runtime.trap("Item quantity must be greater than zero");
      };

      switch (listings.get(item.listingId)) {
        case (null) {
          Runtime.trap("Listing not found: " # item.listingId.toText());
        };
        case (?listing) {
          if (not isListingOrderable(listing)) {
            Runtime.trap("Listing is not orderable: " # item.listingId.toText());
          };

          if (listing.stock < item.quantity) {
            Runtime.trap("Insufficient stock for listing: " # item.listingId.toText());
          };

          let activePrice = getActivePrice(listing);
          totalAmount += activePrice * item.quantity;

          let updatedListing : NewListing = {
            listing with
            stock = listing.stock - item.quantity;
            updatedAt = Time.now();
          };
          listings.add(listing.id, updatedListing);
        };
      };
    };

    switch (deliveryMethod) {
      case (#pickupPoint { pointId }) {
        switch (approvedPickupPoints.get(pointId)) {
          case (null) {
            Runtime.trap("Invalid pickup point: " # pointId.toText());
          };
          case (?_) {};
        };
      };
      case (#home { address }) {
        if (address.size() == 0) {
          Runtime.trap("Delivery address cannot be empty");
        };
      };
    };

    let now = Time.now();
    let order : OrderRecord = {
      id = nextOrderId;
      customer = caller;
      items;
      deliveryMethod;
      paymentMethod;
      totalAmount;
      status = #pending;
      createdAt = now;
      updatedAt = now;
    };

    orders.add(order.id, order);
    nextOrderId += 1;
    order;
  };

  public query ({ caller }) func getMyOrders() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view orders");
    };

    let allOrders = orders.values().toArray();
    allOrders.filter<OrderRecord>(func(order) { order.customer == caller });
  };

  public query ({ caller }) func getOrder(orderId : OrderId) : async ?OrderRecord {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        if (order.customer == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?order;
        } else {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
      };
    };
  };

  public query ({ caller }) func listAllOrders() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all orders");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : OrderId, status : OrderStatus) : async OrderRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?existing) {
        let updated : OrderRecord = {
          existing with
          status;
          updatedAt = Time.now();
        };
        orders.add(orderId, updated);
        updated;
      };
    };
  };

  public shared ({ caller }) func createDriverApplication(
    name : Text,
    email : Text,
    phone : Text,
    vehicleDetails : Text,
    kycDocs : [Storage.ExternalBlob],
  ) : async DriverApplication {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can apply as drivers");
    };

    if (driverApplications.containsKey(caller)) {
      Runtime.trap("Application already exists for this user");
    };

    let app : DriverApplication = {
      applicant = caller;
      name;
      email;
      phone;
      vehicleDetails;
      kycDocs;
      status = #pending;
      submittedAt = Time.now();
      reviewedBy = null;
    };

    driverApplications.add(caller, app);
    app;
  };

  public query ({ caller }) func getDriverApplication() : async ?DriverApplication {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can fetch their own driver application");
    };
    driverApplications.get(caller);
  };

  public query ({ caller }) func listPendingDriverApplications() : async [DriverApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list pending driver applications");
    };
    driverApplications.values().toArray().filter<DriverApplication>(func(app) { app.status == #pending });
  };

  public shared ({ caller }) func approveDriver(principal : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve applications");
    };

    switch (driverApplications.get(principal)) {
      case (null) { Runtime.trap("Application not found") };
      case (?existing) {
        if (existing.status == #approved) {
          Runtime.trap("Application already approved");
        };
        let updated = { existing with
          status = #approved;
          reviewedBy = ?caller;
        };
        driverApplications.add(principal, updated);
        approvedDrivers.add(principal, true);
      };
    };
  };

  public shared ({ caller }) func rejectDriver(principal : Principal, reason : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject applications");
    };

    switch (driverApplications.get(principal)) {
      case (null) { };
      case (?existing) {
        switch (existing.status) {
          case (#approved) { Runtime.trap("Approved applications cannot be rejected") };
          case (#pending) {};
          case (#rejected(_)) { Runtime.trap("Application already rejected") };
        };

        let updated = {
          existing with
          status = #rejected(reason);
          reviewedBy = ?caller;
        };
        driverApplications.add(principal, updated);
      };
    };
  };

  private func isShopper(caller : Principal) : Bool {
    approvedShoppers.containsKey(caller) or personalShopperApprovals.containsKey(caller);
  };

  private func isDriver(caller : Principal) : Bool {
    approvedDrivers.containsKey(caller);
  };

  private func getOrderTown(customer : Principal) : TownId {
    switch (townMemberships.get(customer)) {
      case (null) { 0 };
      case (?membership) { membership.default };
    };
  };

  private func isOrderForShopper(order : OrderRecord, principal : Principal) : Bool {
    switch (order.status) {
      case (#assigned { shopperId }) { shopperId == principal };
      case (_) { false };
    };
  };

  private func toShopperOrderView(order : OrderRecord) : ShopperOrderView {
    {
      order;
      expandedItems = order.items.map(
        func(cartItem) {
          let listing = listings.get(cartItem.listingId);
          let product = switch (listing) {
            case (null) { null };
            case (?l) { products.get(l.productId) };
          };
          let retailer = switch (listing) {
            case (null) { null };
            case (?l) { retailers.get(l.retailerId) };
          };
          {
            cartItem;
            listing;
            product;
            retailer;
          };
        }
      );
    };
  };

  public query ({ caller }) func listShopperEligiblePickupOrders() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view shopper orders");
    };

    if (not (isShopper(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved shoppers can view eligible orders");
    };

    let shopperTown = switch (townMemberships.get(caller)) {
      case (null) { return [] };
      case (?membership) { membership.default };
    };

    let allOrders = orders.values().toArray();
    allOrders.filter<OrderRecord>(
      func(order) {
        switch (order.deliveryMethod) {
          case (#pickupPoint(_)) {
            order.status == #pending and getOrderTown(order.customer) == shopperTown;
          };
          case (_) { false };
        };
      }
    );
  };

  public shared ({ caller }) func acceptShopperOrder(orderId : OrderId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can accept orders");
    };

    if (not (isShopper(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved shoppers can accept orders");
    };

    let shopperTown = switch (townMemberships.get(caller)) {
      case (null) { Runtime.trap("Shopper must have a town membership") };
      case (?membership) { membership.default };
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        switch (order.status) {
          case (#pending) {
            let orderTown = getOrderTown(order.customer);
            if (orderTown != shopperTown) {
              Runtime.trap("Order is not in your town");
            };

            switch (order.deliveryMethod) {
              case (#pickupPoint(_)) {};
              case (_) { Runtime.trap("Order is not a pickup point order") };
            };

            let updated = { order with
              status = #assigned({ shopperId = caller });
              updatedAt = Time.now();
            };
            orders.add(orderId, updated);
          };
          case (_) { Runtime.trap("Order already claimed or not available") };
        };
      };
    };
  };

  public query ({ caller }) func listMyAssignedShopperOrders() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view assigned orders");
    };

    if (not (isShopper(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved shoppers can view assigned orders");
    };

    let allOrders = orders.values().toArray();
    allOrders.filter<OrderRecord>(func(order) { isOrderForShopper(order, caller) });
  };

  public shared ({ caller }) func completeShopperOrder(orderId : OrderId) : async OrderRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can complete orders");
    };

    if (not (isShopper(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved shoppers can complete orders");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (not isOrderForShopper(order, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Forbidden: You are not the assigned shopper for this order");
        };

        let completed = { order with
          status = #purchased;
          updatedAt = Time.now();
        };
        orders.add(orderId, completed);
        completed;
      };
    };
  };

  public query ({ caller }) func getShopperOrderDetails(orderId : OrderId) : async ?ShopperOrderView {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view order details");
    };

    if (not (isShopper(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved shoppers can view order details");
    };

    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) { ?toShopperOrderView(order) };
    };
  };

  public query ({ caller }) func getShopperOrderExpanded(orderId : OrderId) : async ?ShopperOrderView {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view order details");
    };

    if (not (isShopper(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved shoppers can view order details");
    };

    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) { ?toShopperOrderView(order) };
    };
  };

  public query ({ caller }) func listEligibleDriverOrders() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view driver orders");
    };

    if (not (isDriver(caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved drivers can view eligible orders");
    };

    let driverTown = switch (townMemberships.get(caller)) {
      case (null) { return [] };
      case (?membership) { membership.default };
    };

    let allOrders = orders.values().toArray();
    allOrders.filter<OrderRecord>(
      func(order) {
        order.status == #purchased and getOrderTown(order.customer) == driverTown;
      }
    );
  };
};
