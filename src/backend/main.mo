import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Runtime "mo:core/Runtime";

import Order "mo:core/Order";


actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  type LeadStatus = {
    #new : ();
    #inProgress : ();
    #resolved : ();
  };

  module LeadStatus {
    public func toText(status : LeadStatus) : Text {
      switch (status) {
        case (#new) { "new" };
        case (#inProgress) { "inProgress" };
        case (#resolved) { "resolved" };
      };
    };

    public func compare(a : LeadStatus, b : LeadStatus) : Order.Order {
      func toNat(status : LeadStatus) : Nat {
        switch (status) {
          case (#new) { 0 };
          case (#inProgress) { 1 };
          case (#resolved) { 2 };
        };
      };
      Nat.compare(toNat(a), toNat(b));
    };
  };

  type Lead = {
    id : Nat;
    name : Text;
    phone : Text;
    service : Text;
    message : Text;
    createdAt : Int;
    status : LeadStatus;
  };

  type Role = {
    #admin;
    #staff;
    #client;
  };

  module Role {
    public func compare(a : Role, b : Role) : Order.Order {
      func toNat(role : Role) : Nat {
        switch (role) {
          case (#admin) { 0 };
          case (#staff) { 1 };
          case (#client) { 2 };
        };
      };
      Nat.compare(toNat(a), toNat(b));
    };
  };

  type User = {
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

  type BlogPost = {
    id : Nat;
    title : Text;
    content : Text;
    excerpt : Text;
    authorName : Text;
    createdAt : Int;
    updatedAt : Int;
    isPublished : Bool;
  };

  type ServiceRequestStatus = {
    #pending;
    #inProgress;
    #completed;
  };

  type ServiceRequest = {
    id : Nat;
    clientUserId : Nat;
    clientName : Text;
    serviceType : Text;
    description : Text;
    status : ServiceRequestStatus;
    createdAt : Int;
    updatedAt : Int;
    assignedStaffId : ?Nat;
    staffNote : Text;
  };

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

  // Storage
  let leads = Map.empty<Nat, Lead>();
  var nextLeadId = 1;

  let users = Map.empty<Nat, User>();
  var nextUserId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();

  let blogPosts = Map.empty<Nat, BlogPost>();
  var nextBlogPostId = 1;

  let serviceRequests = Map.empty<Nat, ServiceRequest>();
  var nextServiceRequestId = 1;

  let bookings = Map.empty<Nat, Booking>();
  var nextBookingId = 1;

  let invoices = Map.empty<Nat, Invoice>();
  var nextInvoiceId = 1;

  // Lead Functions
  public shared func submitLead(name : Text, phone : Text, service : Text, message : Text) : async Nat {
    let lead : Lead = {
      id = nextLeadId;
      name;
      phone;
      service;
      message;
      createdAt = Time.now();
      status = #new;
    };

    leads.add(nextLeadId, lead);
    nextLeadId += 1;
    lead.id;
  };

  public query func getLeads() : async [Lead] {
    leads.values().toArray();
  };

  public shared func updateLeadStatus(id : Nat, status : LeadStatus) : async Bool {
    switch (leads.get(id)) {
      case (null) { false };
      case (?lead) {
        let updatedLead = { lead with status };
        leads.add(id, updatedLead);
        true;
      };
    };
  };

  // User Functions
  public shared func createUser(username : Text, passwordHash : Text, role : Role) : async Nat {
    let user : User = {
      id = nextUserId;
      username;
      passwordHash;
      role;
      isActive = true;
    };

    users.add(nextUserId, user);
    nextUserId += 1;
    user.id;
  };

  public shared func toggleUserActive(userId : Nat) : async Bool {
    switch (users.get(userId)) {
      case (null) { false };
      case (?user) {
        let updatedUser = { user with isActive = not user.isActive };
        users.add(userId, updatedUser);
        true;
      };
    };
  };

  public query func listUsers() : async [User] {
    users.values().toArray();
  };

  // Login Function
  public shared func login(username : Text, passwordHash : Text) : async {
    #ok : {
      userId : Nat;
      role : Role;
    };
    #err : Text;
  } {
    let allUsers = users.values().toArray();
    let foundUser = allUsers.find(func(u) { u.username == username });

    switch (foundUser) {
      case (null) { #err("User not found") };
      case (?user) {
        if (not user.isActive) { return #err("User is inactive") };

        if (user.passwordHash == passwordHash) {
          #ok({
            userId = user.id;
            role = user.role;
          });
        } else {
          #err("Incorrect password");
        };
      };
    };
  };

  // Blog System
  public shared func createBlogPost(title : Text, content : Text, excerpt : Text, authorName : Text) : async Nat {
    let blogPost : BlogPost = {
      id = nextBlogPostId;
      title;
      content;
      excerpt;
      authorName;
      createdAt = Time.now();
      updatedAt = Time.now();
      isPublished = false;
    };

    blogPosts.add(nextBlogPostId, blogPost);
    nextBlogPostId += 1;
    blogPost.id;
  };

  public shared func updateBlogPost(id : Nat, title : Text, content : Text, excerpt : Text, isPublished : Bool) : async Bool {
    switch (blogPosts.get(id)) {
      case (null) { false };
      case (?blogPost) {
        let updatedBlogPost = {
          blogPost with
          title;
          content;
          excerpt;
          isPublished;
          updatedAt = Time.now();
        };
        blogPosts.add(id, updatedBlogPost);
        true;
      };
    };
  };

  public shared func deleteBlogPost(id : Nat) : async Bool {
    switch (blogPosts.get(id)) {
      case (null) { false };
      case (?_blogPost) {
        blogPosts.remove(id);
        true;
      };
    };
  };

  public query func listBlogPosts() : async [BlogPost] {
    let publishedPosts = blogPosts.values().toArray().filter(func(post) { post.isPublished });
    publishedPosts;
  };

  public query func listAllBlogPosts() : async [BlogPost] {
    blogPosts.values().toArray();
  };

  public query func getBlogPost(id : Nat) : async ?BlogPost {
    blogPosts.get(id);
  };

  // Service Requests
  public shared func createServiceRequest(clientUserId : Nat, clientName : Text, serviceType : Text, description : Text) : async Nat {
    let serviceRequest : ServiceRequest = {
      id = nextServiceRequestId;
      clientUserId;
      clientName;
      serviceType;
      description;
      status = #pending;
      createdAt = Time.now();
      updatedAt = Time.now();
      assignedStaffId = null;
      staffNote = "";
    };

    serviceRequests.add(nextServiceRequestId, serviceRequest);
    nextServiceRequestId += 1;
    serviceRequest.id;
  };

  public query func getClientServiceRequests(clientUserId : Nat) : async [ServiceRequest] {
    let clientRequests = serviceRequests.values().toArray().filter(
      func(request) { request.clientUserId == clientUserId }
    );
    clientRequests;
  };

  public shared func updateServiceRequestStatus(id : Nat, status : ServiceRequestStatus) : async Bool {
    switch (serviceRequests.get(id)) {
      case (null) { false };
      case (?serviceRequest) {
        let updatedServiceRequest = {
          serviceRequest with
          status;
          updatedAt = Time.now();
        };
        serviceRequests.add(id, updatedServiceRequest);
        true;
      };
    };
  };

  public query func listAllServiceRequests() : async [ServiceRequest] {
    serviceRequests.values().toArray();
  };

  public shared func deleteServiceRequest(id : Nat) : async Bool {
    switch (serviceRequests.get(id)) {
      case (null) { false };
      case (?_serviceRequest) {
        serviceRequests.remove(id);
        true;
      };
    };
  };

  public shared func initAdmin() : async Bool {
    let adminPasswordHash = "e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7";

    let allUsers = users.values().toArray();
    let admin = allUsers.find(func(u) { u.role == #admin });

    switch (admin) {
      case (?existingAdmin) {
        let updatedAdmin = { existingAdmin with passwordHash = adminPasswordHash; isActive = true };
        users.add(existingAdmin.id, updatedAdmin);
        true;
      };
      case (null) {
        let newAdmin : User = {
          id = nextUserId;
          username = "admin";
          passwordHash = adminPasswordHash;
          role = #admin;
          isActive = true;
        };
        users.add(nextUserId, newAdmin);
        nextUserId += 1;
        true;
      };
    };
  };

  // Change Password
  public shared func changePassword(userId : Nat, oldPasswordHash : Text, newPasswordHash : Text) : async {
    #ok;
    #err : Text;
  } {
    switch (users.get(userId)) {
      case (null) { #err("User not found") };
      case (?user) {
        if (user.passwordHash == oldPasswordHash) {
          let updatedUser = { user with passwordHash = newPasswordHash };
          users.add(userId, updatedUser);
          #ok;
        } else {
          #err("Incorrect old password");
        };
      };
    };
  };

  // Admin Reset Password
  public shared func adminResetPassword(userId : Nat, newPasswordHash : Text) : async Bool {
    switch (users.get(userId)) {
      case (null) { false };
      case (?user) {
        let updatedUser = { user with passwordHash = newPasswordHash };
        users.add(userId, updatedUser);
        true;
      };
    };
  };

  // Assign Staff to Request
  public shared func assignStaffToRequest(requestId : Nat, staffUserId : Nat) : async Bool {
    switch (serviceRequests.get(requestId)) {
      case (null) { false };
      case (?serviceRequest) {
        switch (users.get(staffUserId)) {
          case (null) { false };
          case (?staffUser) {
            if (staffUser.role != #staff) { return false };

            let updatedRequest = {
              serviceRequest with
              assignedStaffId = ?staffUserId;
              updatedAt = Time.now();
            };
            serviceRequests.add(requestId, updatedRequest);
            true;
          };
        };
      };
    };
  };

  // Add Staff Note
  public shared func addStaffNote(requestId : Nat, note : Text) : async Bool {
    switch (serviceRequests.get(requestId)) {
      case (null) { false };
      case (?serviceRequest) {
        let updatedRequest = {
          serviceRequest with
          staffNote = note;
          updatedAt = Time.now();
        };
        serviceRequests.add(requestId, updatedRequest);
        true;
      };
    };
  };

  // Get Revenue Stats
  public query func getRevenueStats() : async {
    totalLeads : Nat;
    totalRequests : Nat;
    pendingRequests : Nat;
    inProgressRequests : Nat;
    completedRequests : Nat;
    newLeads : Nat;
    resolvedLeads : Nat;
  } {
    let allLeads = leads.values().toArray();
    let allRequests = serviceRequests.values().toArray();

    let newLeads = allLeads.filter(func(lead) { lead.status == #new }).size();
    let resolvedLeads = allLeads.filter(func(lead) { lead.status == #resolved }).size();

    let pendingRequests = allRequests.filter(func(request) { request.status == #pending }).size();
    let inProgressRequests = allRequests.filter(func(request) { request.status == #inProgress }).size();
    let completedRequests = allRequests.filter(func(request) { request.status == #completed }).size();

    {
      totalLeads = allLeads.size();
      totalRequests = allRequests.size();
      pendingRequests;
      inProgressRequests;
      completedRequests;
      newLeads;
      resolvedLeads;
    };
  };

  // Get Staff Assigned Requests
  public query func getStaffAssignedRequests(staffUserId : Nat) : async [ServiceRequest] {
    let assignedRequests = serviceRequests.values().toArray().filter(
      func(request) { switch (request.assignedStaffId) { case (null) { false }; case (?staffId) { staffId == staffUserId } } }
    );
    assignedRequests;
  };

  // BOOKINGS
  public shared func createBooking(
    name : Text,
    phone : Text,
    email : Text,
    service : Text,
    preferredDate : Text,
    preferredTime : Text,
    message : Text,
  ) : async Nat {
    let booking : Booking = {
      id = nextBookingId;
      name;
      phone;
      email;
      service;
      preferredDate;
      preferredTime;
      message;
      status = #pending;
      createdAt = Time.now();
    };

    bookings.add(nextBookingId, booking);
    nextBookingId += 1;
    booking.id;
  };

  public query func listBookings() : async [Booking] {
    bookings.values().toArray();
  };

  public shared func updateBookingStatus(id : Nat, status : BookingStatus) : async Bool {
    switch (bookings.get(id)) {
      case (null) { false };
      case (?booking) {
        let updatedBooking = { booking with status };
        bookings.add(id, updatedBooking);
        true;
      };
    };
  };

  public shared func deleteBooking(id : Nat) : async Bool {
    switch (bookings.get(id)) {
      case (null) { false };
      case (?_booking) {
        bookings.remove(id);
        true;
      };
    };
  };

  // INVOICE SYSTEM
  public shared func createInvoice(clientUserId : Nat, serviceType : Text, amount : Nat, currency : Text, dueDate : Text, notes : Text) : async Nat {
    let invoice : Invoice = {
      id = nextInvoiceId;
      clientUserId;
      serviceType;
      amount;
      currency;
      status = #unpaid;
      dueDate;
      notes;
      createdAt = Time.now();
    };

    invoices.add(nextInvoiceId, invoice);
    nextInvoiceId += 1;
    invoice.id;
  };

  public query func listClientInvoices(clientUserId : Nat) : async [Invoice] {
    let clientInvoices = invoices.values().toArray().filter(
      func(invoice) { invoice.clientUserId == clientUserId }
    );
    clientInvoices;
  };

  public shared func updateInvoiceStatus(id : Nat, status : InvoiceStatus) : async Bool {
    switch (invoices.get(id)) {
      case (null) { false };
      case (?invoice) {
        let updatedInvoice = { invoice with status };
        invoices.add(id, updatedInvoice);
        true;
      };
    };
  };

  public query func listAllInvoices() : async [Invoice] {
    invoices.values().toArray();
  };

  // CANCEL SERVICE REQUEST
  public shared func cancelServiceRequest(id : Nat) : async Bool {
    switch (serviceRequests.get(id)) {
      case (null) { false };
      case (?serviceRequest) {
        if (serviceRequest.status != #pending) {
          return false;
        };
        serviceRequests.remove(id);
        true;
      };
    };
  };

  // Delete User
  public shared func deleteUser(userId : Nat) : async Bool {
    switch (users.get(userId)) {
      case (null) { false };
      case (?_user) {
        users.remove(userId);
        true;
      };
    };
  };
};
