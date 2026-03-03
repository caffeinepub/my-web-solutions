import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  public type LeadStatus = {
    #new : ();
    #inProgress : ();
    #resolved : ();
  };

  public type Lead = {
    id : Nat;
    name : Text;
    phone : Text;
    service : Text;
    message : Text;
    createdAt : Int;
    status : LeadStatus;
  };

  public type Role = {
    #admin;
    #staff;
    #client;
  };

  public type User = {
    id : Nat;
    username : Text;
    passwordHash : Text;
    role : Role;
    isActive : Bool;
  };

  public type UserProfile = {
    name : Text;
    userId : Nat;
    username : Text;
    role : Role;
  };

  public type BlogPost = {
    id : Nat;
    title : Text;
    content : Text;
    excerpt : Text;
    authorName : Text;
    createdAt : Int;
    updatedAt : Int;
    isPublished : Bool;
  };

  // Service Request Types
  public type ServiceRequestStatus = {
    #pending;
    #inProgress;
    #completed;
  };

  public type ServiceRequest = {
    id : Nat;
    clientUserId : Nat;
    clientName : Text;
    serviceType : Text;
    description : Text;
    status : ServiceRequestStatus;
    createdAt : Int;
    updatedAt : Int;
  };

  // Old actor type (without new fields)
  public type OldActor = {
    leads : Map.Map<Nat, Lead>;
    nextLeadId : Nat;
    users : Map.Map<Nat, User>;
    nextUserId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  // New actor type
  public type NewActor = {
    leads : Map.Map<Nat, Lead>;
    nextLeadId : Nat;
    users : Map.Map<Nat, User>;
    nextUserId : Nat;
    userProfiles : Map.Map<Principal, UserProfile>;
    blogPosts : Map.Map<Nat, BlogPost>;
    nextBlogPostId : Nat;
    serviceRequests : Map.Map<Nat, ServiceRequest>;
    nextServiceRequestId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newBlogPosts = Map.empty<Nat, BlogPost>();
    let newServiceRequests = Map.empty<Nat, ServiceRequest>();

    {
      old with
      blogPosts = newBlogPosts;
      nextBlogPostId = 1;
      serviceRequests = newServiceRequests;
      nextServiceRequestId = 1;
    };
  };
};
