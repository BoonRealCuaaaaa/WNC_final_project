import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Language extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    languageId: {
      autoIncrement: true,
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'language_id'
    },
    name: {
      type: DataTypes.CHAR(20),
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
    tableName: 'language',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "language_id" },
        ]
      },
    ]
  });
  }
}
