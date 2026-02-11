import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import UserApproval "user-approval/approval";
import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
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
    additional : List.List<TownId>;
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

  var towns = Map.empty<Nat, Town>();
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

  // Helper function to check if caller is a retailer
  private func isRetailer(caller : Principal) : Bool {
    retailerPrincipals.get(caller).isSome();
  };

  // Helper function to get retailer ID for caller
  private func getRetailerId(caller : Principal) : ?RetailerId {
    retailerPrincipals.get(caller);
  };

  // Helper function to check if promo is currently active
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

  // Helper function to get active price for a listing
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

  // Helper function to check if listing is orderable
  private func isListingOrderable(listing : NewListing) : Bool {
    listing.status == #active and listing.stock > 0;
  };

  // User profile management
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

  // User approval methods
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

  // Product management (admin only)
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

  // Category management for products
  public query ({ caller }) func listCategories() : async [Text] {
    // Public access - no authorization check needed
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

  // Retailer management (admin only)
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

  // Retailer-Principal association (admin only)
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

  // Retailer dashboard - inventory view (retailer only)
  public query ({ caller }) func getMyRetailerInventory() : async [NewListing] {
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

  // Retailer dashboard - order tracking (retailer only)
  public query ({ caller }) func getMyRetailerOrders() : async [OrderRecord] {
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

  // Get current retailer info (retailer only)
  public query ({ caller }) func getMyRetailer() : async ?Retailer {
    switch (getRetailerId(caller)) {
      case (null) {
        Runtime.trap("Unauthorized: Caller is not associated with any retailer");
      };
      case (?retailerId) {
        retailers.get(retailerId);
      };
    };
  };

  // Listings CRUD (admin only)
  public shared ({ caller }) func createListing(retailerId : RetailerId, productId : ProductId, price : Nat, stock : Nat) : async NewListing {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create listings");
    };

    switch (retailers.get(retailerId), products.get(productId)) {
      case (null, _) { Runtime.trap("Retailer not found") };
      case (_, null) { Runtime.trap("Product not found") };
      case (?_, ?_) {
        // Check for existing listing with same retailerId and productId
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

  // Promo pricing management (admin only)
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

  // Shopper-facing catalogue query (public access for browsing)
  public query ({ caller }) func getCatalogue() : async [ShopProduct] {
    // Public access - any user including guests can browse the catalogue

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

  // Order creation for customers (authenticated users only)
  public shared ({ caller }) func createOrder(
    items : [CartItem],
    deliveryMethod : DeliveryMethod,
    paymentMethod : PaymentMethod
  ) : async OrderRecord {
    // Require authenticated user (not guest)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create orders");
    };

    // Validate items array is not empty
    if (items.size() == 0) {
      Runtime.trap("Order must contain at least one item");
    };

    // Validate each listing and calculate total
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
          // Validate listing is orderable
          if (not isListingOrderable(listing)) {
            Runtime.trap("Listing is not orderable: " # item.listingId.toText());
          };

          // Validate sufficient stock
          if (listing.stock < item.quantity) {
            Runtime.trap("Insufficient stock for listing: " # item.listingId.toText());
          };

          // Calculate item total using active price
          let activePrice = getActivePrice(listing);
          totalAmount += activePrice * item.quantity;

          // Decrement stock atomically
          let updatedListing : NewListing = {
            listing with
            stock = listing.stock - item.quantity;
            updatedAt = Time.now();
          };
          listings.add(listing.id, updatedListing);
        };
      };
    };

    // Validate delivery method
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

    // Create order record
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

  // Get customer's own orders (authenticated users only)
  public query ({ caller }) func getMyOrders() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view orders");
    };

    let allOrders = orders.values().toArray();
    allOrders.filter<OrderRecord>(func(order) { order.customer == caller });
  };

  // Get specific order (owner or admin only)
  public query ({ caller }) func getOrder(orderId : OrderId) : async ?OrderRecord {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) {
        // Allow access if caller is the customer or an admin
        if (order.customer == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?order;
        } else {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
      };
    };
  };

  // Admin: List all orders
  public query ({ caller }) func listAllOrders() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all orders");
    };
    orders.values().toArray();
  };

  // Admin: Update order status
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
};

