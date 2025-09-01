console.log('testModels.js started');
const{
    sequelize,
    User,
    Achievement,
    Habit,
    HabitCompletion,
    UserAchievement
} = require('./src/models/index');

(async () => {
    try{
        await sequelize.authenticate();
        console.log('Connection successful');

        
        const user = await User.create({
            username:'testuser',
            email:'test@ex.com',
            password_hash:'secured'
        });
        console.log('User created', user.toJSON());

        const habit = await Habit.create({
            user_id: user.id,
            name: 'Meditate',
            description: 'Meditate for 10 min daily',
            category: 'Health',
            target_frequency: 'daily'
        });
        console.log('Created Habit', habit.toJSON());

        const habits = await User.findByPk(user.id, {
            include: Habit
        });
        console.log('User with habits:', JSON.stringify(habits, null, 2));

        const achievement = await Achievement.create({
            name:'First day',
            description:'Completed first day of habit',
            icon:'trophy',
            unlock_condition:'Complete a habit for the first time',
        });
        console.log('Created Achievement', achievement.toJSON());

        const userAchievement = await UserAchievement.create({
            user_id: user.id,
            achievement_id: achievement.id
        });
        console.log('Linked user to achievement', userAchievement.toJSON());


    }catch(error){
        console.error('Error testing models:', error);
    }finally{
        await sequelize.close();
        console.log('Connection closed');
    }
})();
console.log('testModels.js completed');