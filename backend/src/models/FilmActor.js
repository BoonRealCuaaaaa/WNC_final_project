import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class FilmActor extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    actorId: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'actor',
        key: 'actor_id'
      },
      field: 'actor_id'
    },
    filmId: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'film',
        key: 'film_id'
      },
      field: 'film_id'
    },
    lastUpdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'last_update'
    }
  }, {
    sequelize,
    tableName: 'film_actor',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "actor_id" },
          { name: "film_id" },
        ]
      },
      {
        name: "idx_fk_film_id",
        using: "BTREE",
        fields: [
          { name: "film_id" },
        ]
      },
    ]
  });
  }
}
