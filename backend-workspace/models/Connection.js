module.exports = (sequelize, DataTypes) => {
  const Connection = sequelize.define('Connection', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    clientId: { type: DataTypes.UUID, allowNull: false },
    profileOwnerId: { type: DataTypes.UUID, allowNull: false },
    status: { type: DataTypes.ENUM('initiated', 'contacted', 'successful', 'failed'), defaultValue: 'initiated' },
    phoneDisclosed: { type: DataTypes.BOOLEAN, defaultValue: false },
    clientRating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
    connectionDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
  Connection.associate = (models) => {
    Connection.belongsTo(models.Client, { foreignKey: 'clientId' });
    Connection.belongsTo(models.ProfileOwner, { foreignKey: 'profileOwnerId' });
  };
  return Connection;
};
