import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Beneficiaries from  "./Beneficiaries.js";
import _Customer from  "./Customer.js";
import _Debits from  "./Debits.js";
import _Notification from  "./Notification.js";
import _Partners from  "./Partners.js";
import _Paymentaccount from  "./Paymentaccount.js";
import _Paymenttransaction from  "./Paymenttransaction.js";
import _Refreshtoken from  "./Refreshtoken.js";
import _User from  "./User.js";

export default function initModels(sequelize) {
  const Beneficiaries = _Beneficiaries.init(sequelize, DataTypes);
  const Customer = _Customer.init(sequelize, DataTypes);
  const Debits = _Debits.init(sequelize, DataTypes);
  const Notification = _Notification.init(sequelize, DataTypes);
  const Partners = _Partners.init(sequelize, DataTypes);
  const Paymentaccount = _Paymentaccount.init(sequelize, DataTypes);
  const Paymenttransaction = _Paymenttransaction.init(sequelize, DataTypes);
  const Refreshtoken = _Refreshtoken.init(sequelize, DataTypes);
  const User = _User.init(sequelize, DataTypes);

  Beneficiaries.belongsTo(Customer, { as: "customer", foreignKey: "customerId"});
  Customer.hasMany(Beneficiaries, { as: "beneficiaries", foreignKey: "customerId"});
  Debits.belongsTo(Customer, { as: "creditorCustomer", foreignKey: "creditor"});
  Customer.hasMany(Debits, { as: "debits", foreignKey: "creditor"});
  Debits.belongsTo(Customer, { as: "debtorCustomer", foreignKey: "debtor"});
  Customer.hasMany(Debits, { as: "debtorDebits", foreignKey: "debtor"});
  Notification.belongsTo(Customer, { as: "customer", foreignKey: "customerId"});
  Customer.hasMany(Notification, { as: "notifications", foreignKey: "customerId"});
  Paymentaccount.belongsTo(Customer, { as: "customer", foreignKey: "customerId"});
  Customer.hasMany(Paymentaccount, { as: "paymentaccounts", foreignKey: "customerId"});
  Debits.belongsTo(Paymenttransaction, { as: "paymentTransaction", foreignKey: "paymentTransactionsId"});
  Paymenttransaction.hasMany(Debits, { as: "debits", foreignKey: "paymentTransactionsId"});
  Customer.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Customer, { as: "customers", foreignKey: "userId"});
  Refreshtoken.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Refreshtoken, { as: "refreshtokens", foreignKey: "userId"});

  return {
    Beneficiaries,
    Customer,
    Debits,
    Notification,
    Partners,
    Paymentaccount,
    Paymenttransaction,
    Refreshtoken,
    User,
  };
}
