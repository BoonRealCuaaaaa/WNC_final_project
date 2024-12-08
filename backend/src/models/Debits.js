import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Debits extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    paymentTransactionsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'paymenttransaction',
        key: 'id'
      }
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'customer',
        key: 'id'
      }
    },
    desAccount: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    desBank: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'debits',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "paymentTransactionsId",
        using: "BTREE",
        fields: [
          { name: "paymentTransactionsId" },
        ]
      },
      {
        name: "customerId",
        using: "BTREE",
        fields: [
          { name: "customerId" },
        ]
      },
    ]
  });
  }
}
