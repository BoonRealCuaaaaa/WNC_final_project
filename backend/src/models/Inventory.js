import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Inventory extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    inventoryId: {
      autoIncrement: true,
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'inventory_id'
    },
    filmId: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'film',
        key: 'film_id'
      },
      field: 'film_id'
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
    lastUpdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'last_update'
    }
  }, {
    sequelize,
    tableName: 'inventory',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "inventory_id" },
        ]
      },
      {
        name: "idx_fk_film_id",
        using: "BTREE",
        fields: [
          { name: "film_id" },
        ]
      },
      {
        name: "idx_store_id_film_id",
        using: "BTREE",
        fields: [
          { name: "store_id" },
          { name: "film_id" },
        ]
      },
    ]
  });
  }
}
