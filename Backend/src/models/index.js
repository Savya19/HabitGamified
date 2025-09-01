console.log('Loading index.js');
require('dotenv').config({path: require('path').resolve(__dirname, '../../../.env')});
console.log('Dialect from env:', process.env.DB_DIALECT);

const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT
    }
);

// Test the connection


// Initialize models using sequelize instance and DataTypes
const User = require('./user')(sequelize, DataTypes);
const Achievement = require('./achievement')(sequelize, DataTypes);
const Habit = require('./habit')(sequelize, DataTypes);
const HabitCompletion = require('./habitCompletion')(sequelize, DataTypes);
const UserAchievement = require('./userAchievement')(sequelize, DataTypes);
const UserProgress = require('./userProgress')(sequelize, DataTypes);
const Milestone = require('./milestone')(sequelize, DataTypes);
const NotificationPreference = require('./notificationPreference')(sequelize, DataTypes);

// Define associations
User.hasMany(Habit, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Habit.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(UserAchievement, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
UserAchievement.belongsTo(User, { foreignKey: 'user_id' });

Achievement.hasMany(UserAchievement, { foreignKey: 'achievement_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
UserAchievement.belongsTo(Achievement, { foreignKey: 'achievement_id' });

Habit.hasMany(HabitCompletion, { foreignKey: 'habit_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
HabitCompletion.belongsTo(Habit, { foreignKey: 'habit_id' });

User.hasOne(UserProgress, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
UserProgress.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(NotificationPreference, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
NotificationPreference.belongsTo(User, { foreignKey: 'user_id' });

// Export everything
module.exports = {
    sequelize,
    Sequelize,
    User,
    Achievement,
    Habit,
    HabitCompletion,
    UserAchievement,
    UserProgress,
    Milestone,
    NotificationPreference
};

console.log('Models initialized');
