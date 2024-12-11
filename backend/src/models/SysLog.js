import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class SysLog extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    level: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    message: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sys_log',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
