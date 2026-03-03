import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
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

  // Helper function to check if caller is admin or staff
  func isAdminOrStaff(caller : Principal) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };

    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        profile.role == #staff and AccessControl.hasPermission(accessControlState, caller, #user);
      };
    };
  };

  // Helper function to check if caller is client
  func isClient(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        profile.role == #client and AccessControl.hasPermission(accessControlState, caller, #user);
      };
    };
  };

  // User Profile Functions (Required by frontend)
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

  // Lead Functions
  public shared func submitLead(name : Text, phone : Text, service : Text, message : Text) : async Nat {
    // Public function - no authorization check needed
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

  public query ({ caller }) func getLeads() : async [Lead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view leads");
    };
    leads.values().toArray();
  };

  public shared ({ caller }) func updateLeadStatus(id : Nat, status : LeadStatus) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update lead status");
    };
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
  public shared ({ caller }) func createUser(username : Text, passwordHash : Text, role : Role) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create users");
    };

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

  public shared ({ caller }) func toggleUserActive(userId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle user status");
    };

    switch (users.get(userId)) {
      case (null) { false };
      case (?user) {
        let updatedUser = { user with isActive = not user.isActive };
        users.add(userId, updatedUser);
        true;
      };
    };
  };

  public query ({ caller }) func listUsers() : async [User] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list users");
    };
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
    // Public function - no authorization check needed
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
  public shared ({ caller }) func createBlogPost(title : Text, content : Text, excerpt : Text, authorName : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };

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

  public shared ({ caller }) func updateBlogPost(id : Nat, title : Text, content : Text, excerpt : Text, isPublished : Bool) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update blog posts");
    };

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

  public shared ({ caller }) func deleteBlogPost(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };

    switch (blogPosts.get(id)) {
      case (null) { false };
      case (?_blogPost) {
        blogPosts.remove(id);
        true;
      };
    };
  };

  public query func listBlogPosts() : async [BlogPost] {
    // Public query - no authorization needed, returns only published posts
    let publishedPosts = blogPosts.values().toArray().filter(func(post) { post.isPublished });
    publishedPosts;
  };

  public query ({ caller }) func listAllBlogPosts() : async [BlogPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all blog posts");
    };
    blogPosts.values().toArray();
  };

  public query func getBlogPost(id : Nat) : async ?BlogPost {
    // Public query - no authorization needed
    blogPosts.get(id);
  };

  // Service Requests
  public shared ({ caller }) func createServiceRequest(clientUserId : Nat, clientName : Text, serviceType : Text, description : Text) : async Nat {
    // Must be authenticated user
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create service requests");
    };

    // Check if caller is admin or client
    let isAuthorized = AccessControl.isAdmin(accessControlState, caller) or isClient(caller);

    if (not isAuthorized) {
      Runtime.trap("Unauthorized: Only clients or admins can create service requests");
    };

    let serviceRequest : ServiceRequest = {
      id = nextServiceRequestId;
      clientUserId;
      clientName;
      serviceType;
      description;
      status = #pending;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    serviceRequests.add(nextServiceRequestId, serviceRequest);
    nextServiceRequestId += 1;
    serviceRequest.id;
  };

  public query ({ caller }) func getClientServiceRequests(clientUserId : Nat) : async [ServiceRequest] {
    // Must be authenticated user
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view service requests");
    };

    // Check if caller is admin or the client themselves (by userId in profile)
    let callerProfile = userProfiles.get(caller);

    let isAuthorized = switch (callerProfile) {
      case (null) { false };
      case (?profile) {
        AccessControl.isAdmin(accessControlState, caller) or profile.userId == clientUserId;
      };
    };

    if (not isAuthorized) {
      Runtime.trap("Unauthorized: Can only access your own service requests");
    };

    let clientRequests = serviceRequests.values().toArray().filter(
      func(request) { request.clientUserId == clientUserId }
    );
    clientRequests;
  };

  public shared ({ caller }) func updateServiceRequestStatus(id : Nat, status : ServiceRequestStatus) : async Bool {
    // Must be authenticated user
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update service request status");
    };

    // Check if caller is admin or staff
    if (not isAdminOrStaff(caller)) {
      Runtime.trap("Unauthorized: Only admins or staff can update service request status");
    };

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

  public query ({ caller }) func listAllServiceRequests() : async [ServiceRequest] {
    // Must be authenticated user
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can list service requests");
    };

    // Check if caller is admin or staff
    if (not isAdminOrStaff(caller)) {
      Runtime.trap("Unauthorized: Only admins or staff can list all service requests");
    };

    serviceRequests.values().toArray();
  };

  public shared ({ caller }) func deleteServiceRequest(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete service requests");
    };

    switch (serviceRequests.get(id)) {
      case (null) { false };
      case (?_serviceRequest) {
        serviceRequests.remove(id);
        true;
      };
    };
  };

  // Seed Admin User
  let adminUser : User = {
    id = nextUserId;
    username = "admin";
    passwordHash = "admin123";
    role = #admin;
    isActive = true;
  };

  users.add(nextUserId, adminUser);
  nextUserId += 1;
};
