import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Paymenttransaction extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: true
    },
    content: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    otp: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    otpExpiredAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    srcAccount: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    srcBankName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    desAccount: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bankName: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'paymenttransaction',
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
    ]
  });
  }
}
