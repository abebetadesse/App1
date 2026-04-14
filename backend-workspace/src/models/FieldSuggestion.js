import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const FieldSuggestion = sequelize.define('FieldSuggestion', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    profileOwnerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    fieldName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fieldType: {
      type: DataTypes.ENUM('text', 'number', 'select', 'textarea', 'date', 'boolean', 'file'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    suggestedOptions: {
      type: DataTypes.JSON,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    adminNotes: {
      type: DataTypes.TEXT,
    },
  }, {
    timestamps: true,
    indexes: [
      { fields: ['profileOwnerId'] },
      { fields: ['status'] }
    ]
  });

  return FieldSuggestion;
};
