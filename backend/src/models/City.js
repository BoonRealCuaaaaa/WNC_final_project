import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class City extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    cityId: {
      autoIncrement: true,
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'city_id'
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    countryId: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'country',
        key: 'country_id'
      },
      field: 'country_id'
    },
    lastUpdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'last_update'
    }
  }, {
    sequelize,
    tableName: 'city',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "city_id" },
        ]
      },
      {
        name: "idx_fk_country_id",
        using: "BTREE",
        fields: [
          { name: "country_id" },
        ]
      },
    ]
  });
  }
}
