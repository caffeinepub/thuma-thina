import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";

actor {
  type Product = {
    id : Nat;
    name : Text;
    category : Text;
    price : Nat;
    description : Text;
    imageRef : Text;
  };

  type Retailer = {
    id : Nat;
    name : Text;
    townSuburb : Text;
    products : [Product];
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

  module Retailer {
    public func compareByTownSuburb(r1 : Retailer, r2 : Retailer) : Order.Order {
      Text.compare(r1.townSuburb, r2.townSuburb);
    };
  };

  let provinces = List.empty<Province>();
  let retailers = Map.empty<Nat, Retailer>();
  let productRequests = Map.empty<Nat, ProductRequest>();

  var nextRetailerId = 0;
  var nextProductId = 0;
  var nextRequestId = 0;

  public shared ({ caller }) func addProvince(name : Text, towns : [Text]) : async () {
    let province : Province = { name; towns };
    provinces.add(province);
  };

  public shared ({ caller }) func addRetailer(name : Text, townSuburb : Text) : async Nat {
    let retailer : Retailer = {
      id = nextRetailerId;
      name;
      townSuburb;
      products = [];
    };
    retailers.add(nextRetailerId, retailer);
    nextRetailerId += 1;
    nextRetailerId - 1;
  };

  public shared ({ caller }) func addProduct(
    retailerId : Nat,
    name : Text,
    category : Text,
    price : Nat,
    description : Text,
    imageRef : Text,
  ) : async Nat {
    let product : Product = {
      id = nextProductId;
      name;
      category;
      price;
      description;
      imageRef;
    };

    switch (retailers.get(retailerId)) {
      case (null) { Runtime.trap("Retailer not found") };
      case (?retailer) {
        let updatedProducts = List.fromArray<Product>(retailer.products);
        updatedProducts.add(product);
        let updatedRetailer = {
          id = retailer.id;
          name = retailer.name;
          townSuburb = retailer.townSuburb;
          products = updatedProducts.toArray();
        };
        retailers.add(retailerId, updatedRetailer);
      };
    };
    nextProductId += 1;
    nextProductId - 1;
  };

  public query ({ caller }) func getRetailersByTownSuburb(townSuburb : Text) : async [Retailer] {
    let allRetailers = retailers.values().toArray();
    allRetailers.filter(func(retailer) { retailer.townSuburb == townSuburb }).sort(Retailer.compareByTownSuburb);
  };

  public query ({ caller }) func getProductCatalog(retailerId : Nat) : async [Product] {
    switch (retailers.get(retailerId)) {
      case (null) { Runtime.trap("Retailer not found") };
      case (?retailer) { retailer.products };
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
    productRequests.values().toArray();
  };
};
