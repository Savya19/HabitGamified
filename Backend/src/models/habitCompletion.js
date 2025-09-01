module.exports = (sequelize, DataTypes) => {
    const HabitCompletion = sequelize.define(
        'HabitCompletion',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            habit_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'habits', // table name, not model name
                    key: 'id'
                }
            },
            completed_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false
            },
            notes: {
                type: DataTypes.TEXT('medium'),
                allowNull: true
            },
            streak_day: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 1
            },
            bonus_xp_earned: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            }
        },
        {
            tableName: 'habit_completions',
            timestamps: false
        }
    );

    return HabitCompletion;
};
