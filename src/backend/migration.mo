import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type OldLeadStatus = {
    #new : ();
    #inProgress : ();
    #resolved : ();
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
    assignedStaffId : ?Nat;
    staffNote : Text;
  };

  type OldBookingStatus = {
    #pending;
    #confirmed;
    #rejected;
    #completed;
  };

  type OldBooking = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    service : Text;
    preferredDate : Text;
    preferredTime : Text;
    message : Text;
    status : OldBookingStatus;
    createdAt : Int;
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
    bookings : Map.Map<Nat, OldBooking>;
    nextBookingId : Nat;
  };

  type NewLeadStatus = {
    #new : ();
    #inProgress : ();
    #resolved : ();
  };

  type NewLead = {
    id : Nat;
    name : Text;
    phone : Text;
    service : Text;
    message : Text;
    createdAt : Int;
    status : NewLeadStatus;
  };

  type NewRole = {
    #admin;
    #staff;
    #client;
  };

  type NewUser = {
    id : Nat;
    username : Text;
    passwordHash : Text;
    role : NewRole;
    isActive : Bool;
  };

  type NewUserProfile = {
    name : Text;
    userId : Nat;
    username : Text;
    role : NewRole;
  };

  type NewBlogPost = {
    id : Nat;
    title : Text;
    content : Text;
    excerpt : Text;
    authorName : Text;
    createdAt : Int;
    updatedAt : Int;
    isPublished : Bool;
  };

  type NewServiceRequestStatus = {
    #pending;
    #inProgress;
    #completed;
  };

  type NewServiceRequest = {
    id : Nat;
    clientUserId : Nat;
    clientName : Text;
    serviceType : Text;
    description : Text;
    status : NewServiceRequestStatus;
    createdAt : Int;
    updatedAt : Int;
    assignedStaffId : ?Nat;
    staffNote : Text;
  };

  type NewBookingStatus = {
    #pending;
    #confirmed;
    #rejected;
    #completed;
  };

  type NewBooking = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    service : Text;
    preferredDate : Text;
    preferredTime : Text;
    message : Text;
    status : NewBookingStatus;
    createdAt : Int;
  };

  type InvoiceStatus = {
    #unpaid;
    #paid;
  };

  type Invoice = {
    id : Nat;
    clientUserId : Nat;
    serviceType : Text;
    amount : Nat;
    currency : Text;
    status : InvoiceStatus;
    dueDate : Text;
    notes : Text;
    createdAt : Int;
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
    bookings : Map.Map<Nat, NewBooking>;
    nextBookingId : Nat;
    invoices : Map.Map<Nat, Invoice>;
    nextInvoiceId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newInvoices = Map.empty<Nat, Invoice>();
    { old with invoices = newInvoices; nextInvoiceId = 1 };
  };
};
