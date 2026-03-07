import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  // Booking types used for migration because Booking was newly introduced.
  type BookingStatus = {
    #pending;
    #confirmed;
    #rejected;
    #completed;
  };

  type Booking = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    service : Text;
    preferredDate : Text;
    preferredTime : Text;
    message : Text;
    status : BookingStatus;
    createdAt : Int;
  };

  type OldActor = {
    // Just the previously existing fields of the actor
    leads : Map.Map<Nat, {
      id : Nat;
      name : Text;
      phone : Text;
      service : Text;
      message : Text;
      createdAt : Int;
      status : {
        #new : ();
        #inProgress : ();
        #resolved : ();
      };
    }>;
    nextLeadId : Nat;
    users : Map.Map<Nat, {
      id : Nat;
      username : Text;
      passwordHash : Text;
      role : {
        #admin;
        #staff;
        #client;
      };
      isActive : Bool;
    }>;
    nextUserId : Nat;
    blogPosts : Map.Map<Nat, {
      id : Nat;
      title : Text;
      content : Text;
      excerpt : Text;
      authorName : Text;
      createdAt : Int;
      updatedAt : Int;
      isPublished : Bool;
    }>;
    nextBlogPostId : Nat;
    serviceRequests : Map.Map<Nat, {
      id : Nat;
      clientUserId : Nat;
      clientName : Text;
      serviceType : Text;
      description : Text;
      status : {
        #pending;
        #inProgress;
        #completed;
      };
      createdAt : Int;
      updatedAt : Int;
      assignedStaffId : ?Nat;
      staffNote : Text;
    }>;
    nextServiceRequestId : Nat;
  };

  type NewActor = {
    // All old fields plus new field for bookings
    leads : Map.Map<Nat, {
      id : Nat;
      name : Text;
      phone : Text;
      service : Text;
      message : Text;
      createdAt : Int;
      status : {
        #new : ();
        #inProgress : ();
        #resolved : ();
      };
    }>;
    nextLeadId : Nat;
    users : Map.Map<Nat, {
      id : Nat;
      username : Text;
      passwordHash : Text;
      role : {
        #admin;
        #staff;
        #client;
      };
      isActive : Bool;
    }>;
    nextUserId : Nat;
    blogPosts : Map.Map<Nat, {
      id : Nat;
      title : Text;
      content : Text;
      excerpt : Text;
      authorName : Text;
      createdAt : Int;
      updatedAt : Int;
      isPublished : Bool;
    }>;
    nextBlogPostId : Nat;
    serviceRequests : Map.Map<Nat, {
      id : Nat;
      clientUserId : Nat;
      clientName : Text;
      serviceType : Text;
      description : Text;
      status : {
        #pending;
        #inProgress;
        #completed;
      };
      createdAt : Int;
      updatedAt : Int;
      assignedStaffId : ?Nat;
      staffNote : Text;
    }>;
    nextServiceRequestId : Nat;
    bookings : Map.Map<Nat, Booking>;
    nextBookingId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      // bookingId was previously not used, so let's default to 1
      nextBookingId = 1;
      // bookings were previously not used, so let's default to empty bookings
      bookings = Map.empty<Nat, Booking>();
    };
  };
};
