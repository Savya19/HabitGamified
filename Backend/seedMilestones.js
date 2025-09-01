const { seedDefaultMilestones } = require('./src/utils/seedMilestones');

// Run the seeding
seedDefaultMilestones()
    .then(() => {
        console.log('Milestone seeding completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error seeding milestones:', error);
        process.exit(1);
    });