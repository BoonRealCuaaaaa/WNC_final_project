import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Customer extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    customerId: {
      autoIncrement: true,
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'customer_id'
    },
    storeId: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'store',
        key: 'store_id'
      },
      field: 'store_id'
    },
    firstName: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'last_name'
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    addressId: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'address',
        key: 'address_id'
      },
      field: 'address_id'
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'create_date'
    },
    lastUpdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'last_update'
    }
  }, {
    sequelize,
    tableName: 'customer',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
      {
        name: "idx_fk_store_id",
        using: "BTREE",
        fields: [
          { name: "store_id" },
        ]
      },
      {
        name: "idx_fk_address_id",
        using: "BTREE",
        fields: [
          { name: "address_id" },
        ]
      },
      {
        name: "idx_last_name",
        using: "BTREE",
        fields: [
          { name: "last_name" },
        ]
      },
    ]
  });
  }
}
