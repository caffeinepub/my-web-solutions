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
      assignedStaffId = null;
      staffNote = "";
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

  // New Functionality

  // Change Password
  public shared ({ caller }) func changePassword(oldPasswordHash : Text, newPasswordHash : Text) : async {
    #ok;
    #err : Text;
  } {
    // Authenticated user check
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return #err("Unauthorized: Only authenticated users can change password");
    };

    // Get the caller's profile to find their userId
    let callerProfile = userProfiles.get(caller);

    switch (callerProfile) {
      case (null) { return #err("User profile not found") };
      case (?profile) {
        switch (users.get(profile.userId)) {
          case (null) { #err("User not found") };
          case (?user) {
            if (user.passwordHash == oldPasswordHash) {
              let updatedUser = { user with passwordHash = newPasswordHash };
              users.add(profile.userId, updatedUser);
              #ok;
            } else {
              #err("Incorrect old password");
            };
          };
        };
      };
    };
  };

  // Admin Reset Password
  public shared ({ caller }) func adminResetPassword(userId : Nat, newPasswordHash : Text) : async Bool {
    // Admin only check
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reset passwords");
    };

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
  public shared ({ caller }) func assignStaffToRequest(requestId : Nat, staffUserId : Nat) : async Bool {
    // Admin only check
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can assign staff");
    };

    switch (serviceRequests.get(requestId)) {
      case (null) { false };
      case (?serviceRequest) {
        // Check if staffUserId is actually a staff member
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
  public shared ({ caller }) func addStaffNote(requestId : Nat, note : Text) : async Bool {
    // Must be authenticated user
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add staff notes");
    };

    // Admin or Staff only check
    if (not isAdminOrStaff(caller)) {
      Runtime.trap("Unauthorized: Only admins or staff can add staff notes");
    };

    switch (serviceRequests.get(requestId)) {
      case (null) { false };
      case (?serviceRequest) {
        // If caller is staff (not admin), verify they are assigned to this request
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          let callerProfile = userProfiles.get(caller);
          switch (callerProfile) {
            case (null) { return false };
            case (?profile) {
              switch (serviceRequest.assignedStaffId) {
                case (null) {
                  Runtime.trap("Unauthorized: This request is not assigned to any staff");
                };
                case (?assignedStaffId) {
                  if (profile.userId != assignedStaffId) {
                    Runtime.trap("Unauthorized: You can only add notes to requests assigned to you");
                  };
                };
              };
            };
          };
        };

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
  public query ({ caller }) func getRevenueStats() : async {
    totalLeads : Nat;
    totalRequests : Nat;
    pendingRequests : Nat;
    inProgressRequests : Nat;
    completedRequests : Nat;
    newLeads : Nat;
    resolvedLeads : Nat;
  } {
    // Admin only check
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access revenue stats");
    };

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
  public query ({ caller }) func getStaffAssignedRequests(staffUserId : Nat) : async [ServiceRequest] {
    // Must be authenticated user
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access assigned requests");
    };

    // Admin or Staff only check
    if (not isAdminOrStaff(caller)) {
      Runtime.trap("Unauthorized: Only admins or staff can access assigned requests");
    };

    // If caller is staff (not admin), verify they can only see their own assigned requests
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      let callerProfile = userProfiles.get(caller);
      switch (callerProfile) {
        case (null) {
          Runtime.trap("Unauthorized: User profile not found");
        };
        case (?profile) {
          if (profile.userId != staffUserId) {
            Runtime.trap("Unauthorized: You can only view your own assigned requests");
          };
        };
      };
    };

    let assignedRequests = serviceRequests.values().toArray().filter(
      func(request) { switch (request.assignedStaffId) { case (null) { false }; case (?staffId) { staffId == staffUserId } } }
    );
    assignedRequests;
  };
};
