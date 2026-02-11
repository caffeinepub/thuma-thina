import Map "mo:core/Map";

module {
  type OldListing = {
    id : Nat;
    retailerId : Nat;
    productId : Nat;
    price : Nat;
    stock : Nat;
    status : { #active; #outOfStock; #discontinued };
    createdAt : Int;
  };

  type PromoDetails = {
    price : Nat;
    startDate : Int;
    endDate : ?Int;
  };

  type NewListing = {
    id : Nat;
    retailerId : Nat;
    productId : Nat;
    price : Nat;
    promo : ?PromoDetails;
    stock : Nat;
    status : { #active; #outOfStock; #discontinued };
    createdAt : Int;
    updatedAt : Int;
  };

  type OldActor = {
    listings : Map.Map<Nat, OldListing>;
  };

  type NewActor = {
    listings : Map.Map<Nat, NewListing>;
  };

  public func run(old : OldActor) : NewActor {
    let newListings = old.listings.map<Nat, OldListing, NewListing>(
      func(_id, oldListing) {
        {
          oldListing with
          promo = null;
          updatedAt = oldListing.createdAt;
        };
      }
    );
    {
      old with
      listings = newListings;
    };
  };
};
