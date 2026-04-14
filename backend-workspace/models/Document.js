module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    profileOwnerId: { type: DataTypes.UUID, allowNull: false },
    type: { type: DataTypes.ENUM('resume', 'certificate', 'portfolio'), allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
  return Document;
};
