module.exports = (sequelize, DataTypes) => {
    const Milestone = sequelize.define(
        'Milestone',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            metaphor_type: {
                type: DataTypes.ENUM('plant', 'creature'),
                allowNull: false
            },
            stage: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            required_completions: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            emoji: {
                type: DataTypes.STRING(10),
                allowNull: false
            },
            xp_reward: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 50
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: 'milestones',
            timestamps: false
        }
    );

    return Milestone;
};