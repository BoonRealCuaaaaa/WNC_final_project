import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Country extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    countryId: {
      autoIncrement: true,
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'country_id'
    },
    country: {
      type: DataTypes.STRING(50),
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
    tableName: 'country',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "country_id" },
        ]
      },
    ]
  });
  }
}
