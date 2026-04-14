import { sequelize, DataTypes } from '../config/database.js';
import User from './User.js';

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPhoneVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  contactPreference: {
    type: DataTypes.ENUM('phone', 'email', 'both'),
    defaultValue: 'phone',
  },
}, {
  timestamps: true,
  tableName: 'clients'
});

// Define association
Client.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Client, { foreignKey: 'userId' });

export default Client;