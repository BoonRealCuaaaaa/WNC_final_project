import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Actor from  "./Actor.js";
import _Address from  "./Address.js";
import _Category from  "./Category.js";
import _City from  "./City.js";
import _Country from  "./Country.js";
import _Customer from  "./Customer.js";
import _Film from  "./Film.js";
import _FilmActor from  "./FilmActor.js";
import _FilmCategory from  "./FilmCategory.js";
import _FilmText from  "./FilmText.js";
import _Inventory from  "./Inventory.js";
import _Language from  "./Language.js";
import _Payment from  "./Payment.js";
import _RefreshToken from  "./RefreshToken.js";
import _Rental from  "./Rental.js";
import _Staff from  "./Staff.js";
import _Store from  "./Store.js";
import _SysLog from  "./SysLog.js";
import _User from  "./User.js";

export default function initModels(sequelize) {
  const Actor = _Actor.init(sequelize, DataTypes);
  const Address = _Address.init(sequelize, DataTypes);
  const Category = _Category.init(sequelize, DataTypes);
  const City = _City.init(sequelize, DataTypes);
  const Country = _Country.init(sequelize, DataTypes);
  const Customer = _Customer.init(sequelize, DataTypes);
  const Film = _Film.init(sequelize, DataTypes);
  const FilmActor = _FilmActor.init(sequelize, DataTypes);
  const FilmCategory = _FilmCategory.init(sequelize, DataTypes);
  const FilmText = _FilmText.init(sequelize, DataTypes);
  const Inventory = _Inventory.init(sequelize, DataTypes);
  const Language = _Language.init(sequelize, DataTypes);
  const Payment = _Payment.init(sequelize, DataTypes);
  const RefreshToken = _RefreshToken.init(sequelize, DataTypes);
  const Rental = _Rental.init(sequelize, DataTypes);
  const Staff = _Staff.init(sequelize, DataTypes);
  const Store = _Store.init(sequelize, DataTypes);
  const SysLog = _SysLog.init(sequelize, DataTypes);
  const User = _User.init(sequelize, DataTypes);

  Actor.belongsToMany(Film, { as: 'filmIdFilms', through: FilmActor, foreignKey: "actorId", otherKey: "filmId" });
  Category.belongsToMany(Film, { as: 'filmIdFilmFilmCategories', through: FilmCategory, foreignKey: "categoryId", otherKey: "filmId" });
  Film.belongsToMany(Actor, { as: 'actorIdActors', through: FilmActor, foreignKey: "filmId", otherKey: "actorId" });
  Film.belongsToMany(Category, { as: 'categoryIdCategories', through: FilmCategory, foreignKey: "filmId", otherKey: "categoryId" });
  FilmActor.belongsTo(Actor, { as: "actor", foreignKey: "actorId"});
  Actor.hasMany(FilmActor, { as: "filmActors", foreignKey: "actorId"});
  Customer.belongsTo(Address, { as: "address", foreignKey: "addressId"});
  Address.hasMany(Customer, { as: "customers", foreignKey: "addressId"});
  Staff.belongsTo(Address, { as: "address", foreignKey: "addressId"});
  Address.hasMany(Staff, { as: "staffs", foreignKey: "addressId"});
  Store.belongsTo(Address, { as: "address", foreignKey: "addressId"});
  Address.hasMany(Store, { as: "stores", foreignKey: "addressId"});
  FilmCategory.belongsTo(Category, { as: "category", foreignKey: "categoryId"});
  Category.hasMany(FilmCategory, { as: "filmCategories", foreignKey: "categoryId"});
  Address.belongsTo(City, { as: "city", foreignKey: "cityId"});
  City.hasMany(Address, { as: "addresses", foreignKey: "cityId"});
  City.belongsTo(Country, { as: "country", foreignKey: "countryId"});
  Country.hasMany(City, { as: "cities", foreignKey: "countryId"});
  Payment.belongsTo(Customer, { as: "customer", foreignKey: "customerId"});
  Customer.hasMany(Payment, { as: "payments", foreignKey: "customerId"});
  Rental.belongsTo(Customer, { as: "customer", foreignKey: "customerId"});
  Customer.hasMany(Rental, { as: "rentals", foreignKey: "customerId"});
  FilmActor.belongsTo(Film, { as: "film", foreignKey: "filmId"});
  Film.hasMany(FilmActor, { as: "filmActors", foreignKey: "filmId"});
  FilmCategory.belongsTo(Film, { as: "film", foreignKey: "filmId"});
  Film.hasMany(FilmCategory, { as: "filmCategories", foreignKey: "filmId"});
  Inventory.belongsTo(Film, { as: "film", foreignKey: "filmId"});
  Film.hasMany(Inventory, { as: "inventories", foreignKey: "filmId"});
  Rental.belongsTo(Inventory, { as: "inventory", foreignKey: "inventoryId"});
  Inventory.hasMany(Rental, { as: "rentals", foreignKey: "inventoryId"});
  Film.belongsTo(Language, { as: "language", foreignKey: "languageId"});
  Language.hasMany(Film, { as: "films", foreignKey: "languageId"});
  Film.belongsTo(Language, { as: "originalLanguage", foreignKey: "originalLanguageId"});
  Language.hasMany(Film, { as: "originalLanguageFilms", foreignKey: "originalLanguageId"});
  Payment.belongsTo(Rental, { as: "rental", foreignKey: "rentalId"});
  Rental.hasMany(Payment, { as: "payments", foreignKey: "rentalId"});
  Payment.belongsTo(Staff, { as: "staff", foreignKey: "staffId"});
  Staff.hasMany(Payment, { as: "payments", foreignKey: "staffId"});
  Rental.belongsTo(Staff, { as: "staff", foreignKey: "staffId"});
  Staff.hasMany(Rental, { as: "rentals", foreignKey: "staffId"});
  Store.belongsTo(Staff, { as: "managerStaff", foreignKey: "managerStaffId"});
  Staff.hasOne(Store, { as: "managerStaffStore", foreignKey: "managerStaffId"});
  Customer.belongsTo(Store, { as: "store", foreignKey: "storeId"});
  Store.hasMany(Customer, { as: "customers", foreignKey: "storeId"});
  Inventory.belongsTo(Store, { as: "store", foreignKey: "storeId"});
  Store.hasMany(Inventory, { as: "inventories", foreignKey: "storeId"});
  Staff.belongsTo(Store, { as: "store", foreignKey: "storeId"});
  Store.hasMany(Staff, { as: "staffs", foreignKey: "storeId"});
  RefreshToken.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(RefreshToken, { as: "refreshTokens", foreignKey: "userId"});

  return {
    Actor,
    Address,
    Category,
    City,
    Country,
    Customer,
    Film,
    FilmActor,
    FilmCategory,
    FilmText,
    Inventory,
    Language,
    Payment,
    RefreshToken,
    Rental,
    Staff,
    Store,
    SysLog,
    User,
  };
}
