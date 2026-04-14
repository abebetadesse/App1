import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const ProfileFieldValue = sequelize.define('ProfileFieldValue', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    profileOwnerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    fieldId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    fieldValue: {
      type: DataTypes.TEXT,
    },
    fileUrl: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: true,
    indexes: [
      { fields: ['profileOwnerId'] },
      { fields: ['fieldId'] },
      { fields: ['profileOwnerId', 'fieldId'], unique: true }
    ]
  });

  return ProfileFieldValue;
};
