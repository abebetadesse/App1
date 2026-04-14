module.exports = (sequelize, DataTypes) => {
  const ProfileField = sequelize.define('ProfileField', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fieldName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fieldType: {
      type: DataTypes.ENUM('text', 'number', 'select', 'textarea', 'date', 'boolean', 'file'),
      allowNull: false,
    },
    fieldLabel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    placeholder: {
      type: DataTypes.STRING,
    },
    options: {
      type: DataTypes.JSON,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'general'
    },
    hierarchy: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isSearchable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    validationRules: {
      type: DataTypes.JSON,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    timestamps: true,
    indexes: [
      { fields: ['section'] },
      { fields: ['isActive'] },
      { fields: ['isSearchable'] },
      { fields: ['hierarchy'] }
    ]
  });

  return ProfileField;
};
