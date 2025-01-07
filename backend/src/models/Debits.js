import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class Debits extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        amount: {
          type: DataTypes.DECIMAL(15, 2),
          allowNull: true,
        },
        content: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        cancelReason: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        paymentTransactionsId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "paymenttransaction",
            key: "id",
          },
        },
        creditor: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "customer",
            key: "id",
          },
        },
        debtor: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "customer",
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "debits",
        timestamps: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "paymentTransactionsId",
            using: "BTREE",
            fields: [{ name: "paymentTransactionsId" }],
          },
          {
            name: "creditor",
            using: "BTREE",
            fields: [{ name: "creditor" }],
          },
          {
            name: "debtor",
            using: "BTREE",
            fields: [{ name: "debtor" }],
          },
        ],
      }
    );
  }
}
