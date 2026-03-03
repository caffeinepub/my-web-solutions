import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  public type OldActor = {
    users : Map.Map<Nat, { id : Nat; username : Text; passwordHash : Text; role : { #admin; #staff; #client }; isActive : Bool }>;
    adminUser : { id : Nat; username : Text; passwordHash : Text; role : { #admin; #staff; #client }; isActive : Bool };
  };

  public type NewActor = {
    users : Map.Map<Nat, { id : Nat; username : Text; passwordHash : Text; role : { #admin; #staff; #client }; isActive : Bool }>;
  };

  public func run(old : OldActor) : NewActor {
    { users = old.users };
  };
};
