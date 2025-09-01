const { Milestone } = require('../models');

const plantMilestones = [
    {
        name: 'Seed',
        description: 'Your journey begins with a tiny seed',
        metaphor_type: 'plant',
        stage: 1,
        required_completions: 5,
        emoji: '🌱',
        xp_reward: 50
    },
    {
        name: 'Sprout',
        description: 'First signs of growth appear',
        metaphor_type: 'plant',
        stage: 2,
        required_completions: 15,
        emoji: '🌿',
        xp_reward: 100
    },
    {
        name: 'Young Plant',
        description: 'Your habits are taking root',
        metaphor_type: 'plant',
        stage: 3,
        required_completions: 30,
        emoji: '🪴',
        xp_reward: 150
    },
    {
        name: 'Flowering Plant',
        description: 'Beautiful blooms show your progress',
        metaphor_type: 'plant',
        stage: 4,
        required_completions: 50,
        emoji: '🌸',
        xp_reward: 200
    },
    {
        name: 'Mature Tree',
        description: 'Strong and established habits',
        metaphor_type: 'plant',
        stage: 5,
        required_completions: 100,
        emoji: '🌳',
        xp_reward: 300
    }
];

const creatureMilestones = [
    {
        name: 'Egg',
        description: 'Something magical is about to hatch',
        metaphor_type: 'creature',
        stage: 1,
        required_completions: 5,
        emoji: '🥚',
        xp_reward: 50
    },
    {
        name: 'Hatchling',
        description: 'Your creature has emerged!',
        metaphor_type: 'creature',
        stage: 2,
        required_completions: 15,
        emoji: '🐣',
        xp_reward: 100
    },
    {
        name: 'Young Creature',
        description: 'Growing stronger each day',
        metaphor_type: 'creature',
        stage: 3,
        required_completions: 30,
        emoji: '🐦',
        xp_reward: 150
    },
    {
        name: 'Evolved Form',
        description: 'Your dedication has paid off',
        metaphor_type: 'creature',
        stage: 4,
        required_completions: 50,
        emoji: '🦅',
        xp_reward: 200
    },
    {
        name: 'Legendary Dragon',
        description: 'The ultimate form of habit mastery',
        metaphor_type: 'creature',
        stage: 5,
        required_completions: 100,
        emoji: '🐉',
        xp_reward: 300
    }
];

async function seedMilestones() {
    try {
        // Check if milestones already exist
        const existingMilestones = await Milestone.count();
        
        if (existingMilestones === 0) {
            await Milestone.bulkCreate([...plantMilestones, ...creatureMilestones]);
            console.log('Milestones seeded successfully');
        } else {
            console.log('Milestones already exist, skipping seed');
        }
    } catch (error) {
        console.error('Error seeding milestones:', error);
    }
}

module.exports = { seedMilestones };