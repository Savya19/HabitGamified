module.exports = (sequelize, DataTypes) => {
    const UserProgress = sequelize.define(
        'UserProgress',
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
            metaphor_type: {
                type: DataTypes.ENUM('plant', 'creature'),
                allowNull: false,
                defaultValue: 'plant'
            },
            current_stage: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            stage_progress: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0.0,
                validate: {
                    min: 0.0,
                    max: 100.0
                }
            },
            milestones_completed: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            last_milestone_date: {
                type: DataTypes.DATE,
                allowNull: true
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
            tableName: 'user_progress',
            timestamps: false
        }
    );

    return UserProgress;
};