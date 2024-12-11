import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Rental extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    rentalId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'rental_id'
    },
    rentalDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'rental_date'
    },
    inventoryId: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'inventory',
        key: 'inventory_id'
      },
      field: 'inventory_id'
    },
    customerId: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'customer',
        key: 'customer_id'
      },
      field: 'customer_id'
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'return_date'
    },
    staffId: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'staff',
        key: 'staff_id'
      },
      field: 'staff_id'
    },
    lastUpdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'last_update'
    }
  }, {
    sequelize,
    tableName: 'rental',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "rental_id" },
        ]
      },
      {
        name: "rental_date",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "rental_date" },
          { name: "inventory_id" },
          { name: "customer_id" },
        ]
      },
      {
        name: "idx_fk_inventory_id",
        using: "BTREE",
        fields: [
          { name: "inventory_id" },
        ]
      },
      {
        name: "idx_fk_customer_id",
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
      {
        name: "idx_fk_staff_id",
        using: "BTREE",
        fields: [
          { name: "staff_id" },
        ]
      },
    ]
  });
  }
}
