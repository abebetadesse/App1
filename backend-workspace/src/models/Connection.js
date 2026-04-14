module.exports = (sequelize, DataTypes) => {
  const Connection = sequelize.define('Connection', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    profileOwnerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    searchQueryId: {
      type: DataTypes.UUID,
    },
    connectionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    clientPhoneRevealed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profileOwnerNotified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    notificationMethod: {
      type: DataTypes.ENUM('push', 'sms', 'both', 'in_app'),
    },
    notifiedAt: {
      type: DataTypes.DATE,
    },
    profileOwnerCalled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    calledAt: {
      type: DataTypes.DATE,
    },
    callDuration: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM('initiated', 'contacted', 'successful', 'failed', 'no_response'),
      defaultValue: 'initiated',
    },
    clientFeedback: {
      type: DataTypes.ENUM('positive', 'neutral', 'negative'),
    },
    clientRating: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 5 },
    },
    notes: {
      type: DataTypes.TEXT,
    },
  }, {
    timestamps: true,
    indexes: [
      { fields: ['clientId'] },
      { fields: ['profileOwnerId'] },
      { fields: ['status'] },
      { fields: ['connectionDate'] }
    ]
  });

  return Connection;
};