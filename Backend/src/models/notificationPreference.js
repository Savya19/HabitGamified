module.exports = (sequelize, DataTypes) => {
    const NotificationPreference = sequelize.define(
        'NotificationPreference',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                }
            },
            browser_notifications: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            email_notifications: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            reminder_time: {
                type: DataTypes.TIME,
                allowNull: false,
                defaultValue: '09:00:00'
            },
            timezone: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: 'UTC'
            },
            daily_reminder: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            milestone_notifications: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: 'notification_preferences',
            timestamps: false
        }
    );

    return NotificationPreference;
};