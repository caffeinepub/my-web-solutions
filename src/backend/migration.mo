import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";

module {
  // Old Types
  type OldLeadStatus = {
    #new : ();
    #inProgress : ();
    #resolved : ();
  };

  module OldLeadStatus {
    public func compare(a : OldLeadStatus, b : OldLeadStatus) : Order.Order {
      func toNat(status : OldLeadStatus) : Nat {
        switch (status) {
          case (#new) { 0 };
          case (#inProgress) { 1 };
          case (#resolved) { 2 };
        };
      };
      Nat.compare(toNat(a), toNat(b));
    };
  };

  type OldLead = {
    id : Nat;
    name : Text;
    phone : Text;
    service : Text;
    message : Text;
    createdAt : Int;
    status : OldLeadStatus;
  };

  type OldRole = {
    #admin;
    #staff;
    #client;
  };

  module OldRole {
    public func compare(a : OldRole, b : OldRole) : Order.Order {
      func toNat(role : OldRole) : Nat {
        switch (role) {
          case (#admin) { 0 };
          case (#staff) { 1 };
          case (#client) { 2 };
        };
      };
      Nat.compare(toNat(a), toNat(b));
    };
  };

  type OldUser = {
    id : Nat;
    username : Text;
    passwordHash : Text;
    role : OldRole;
    isActive : Bool;
  };

  type OldUserProfile = {
    name : Text;
    userId : Nat;
    username : Text;
    role : OldRole;
  };

  type OldBlogPost = {
    id : Nat;
    title : Text;
    content : Text;
    excerpt : Text;
    authorName : Text;
    createdAt : Int;
    updatedAt : Int;
    isPublished : Bool;
  };

  type OldServiceRequestStatus = {
    #pending;
    #inProgress;
    #completed;
  };

  type OldServiceRequest = {
    id : Nat;
    clientUserId : Nat;
    clientName : Text;
    serviceType : Text;
    description : Text;
    status : OldServiceRequestStatus;
    createdAt : Int;
    updatedAt : Int;
  };

  type OldActor = {
    leads : Map.Map<Nat, OldLead>;
    nextLeadId : Nat;
    users : Map.Map<Nat, OldUser>;
    nextUserId : Nat;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    blogPosts : Map.Map<Nat, OldBlogPost>;
    nextBlogPostId : Nat;
    serviceRequests : Map.Map<Nat, OldServiceRequest>;
    nextServiceRequestId : Nat;
  };

  // New Types
  type NewLead = {
    id : Nat;
    name : Text;
    phone : Text;
    service : Text;
    message : Text;
    createdAt : Int;
    status : OldLeadStatus;
  };

  type NewUser = OldUser;
  type NewUserProfile = OldUserProfile;
  type NewBlogPost = OldBlogPost;
  type NewServiceRequest = {
    id : Nat;
    clientUserId : Nat;
    clientName : Text;
    serviceType : Text;
    description : Text;
    status : OldServiceRequestStatus;
    createdAt : Int;
    updatedAt : Int;
    assignedStaffId : ?Nat;
    staffNote : Text;
  };

  type NewActor = {
    leads : Map.Map<Nat, NewLead>;
    nextLeadId : Nat;
    users : Map.Map<Nat, NewUser>;
    nextUserId : Nat;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    blogPosts : Map.Map<Nat, NewBlogPost>;
    nextBlogPostId : Nat;
    serviceRequests : Map.Map<Nat, NewServiceRequest>;
    nextServiceRequestId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newServiceRequests = old.serviceRequests.map<Nat, OldServiceRequest, NewServiceRequest>(
      func(_id, oldRequest) {
        { oldRequest with assignedStaffId = null; staffNote = "" };
      }
    );
    { old with serviceRequests = newServiceRequests };
  };
};
