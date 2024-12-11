import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Actor extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    actorId: {
      autoIncrement: true,
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      field: 'actor_id'
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
    lastUpdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'last_update'
    }
  }, {
    sequelize,
    tableName: 'actor',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "actor_id" },
        ]
      },
      {
        name: "idx_actor_last_name",
        using: "BTREE",
        fields: [
          { name: "last_name" },
        ]
      },
    ]
  });
  }
}
