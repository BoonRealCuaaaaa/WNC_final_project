import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Address extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    addressId: {
      autoIncrement: true,
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'address_id'
    },
    address: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    address2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    district: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    cityId: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'city',
        key: 'city_id'
      },
      field: 'city_id'
    },
    postalCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'postal_code'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    lastUpdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'last_update'
    }
  }, {
    sequelize,
    tableName: 'address',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "address_id" },
        ]
      },
      {
        name: "idx_fk_city_id",
        using: "BTREE",
        fields: [
          { name: "city_id" },
        ]
      },
    ]
  });
  }
}
