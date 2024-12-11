import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Payment extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    paymentId: {
      autoIncrement: true,
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'payment_id'
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
    staffId: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'staff',
        key: 'staff_id'
      },
      field: 'staff_id'
    },
    rentalId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'rental',
        key: 'rental_id'
      },
      field: 'rental_id'
    },
    amount: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'payment_date'
    },
    lastUpdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'last_update'
    }
  }, {
    sequelize,
    tableName: 'payment',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "payment_id" },
        ]
      },
      {
        name: "idx_fk_staff_id",
        using: "BTREE",
        fields: [
          { name: "staff_id" },
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
        name: "fk_payment_rental",
        using: "BTREE",
        fields: [
          { name: "rental_id" },
        ]
      },
    ]
  });
  }
}
