const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'My Resume'
    },
    personalInfo: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        summary: String
    },
    education: [{
        degree: String,
        institution: String,
        year: String,
        percentage: String
    }],
    experience: [{
        jobTitle: String,
        company: String,
        duration: String,
        responsibilities: String
    }],
    projects: [{
        name: String,
        technologies: String,
        description: String,
        link: String
    }],
    skills: [String],
    achievements: [String],
    template: {
        type: String,
        enum: ['modern', 'minimal', 'creative'],
        default: 'modern'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Resume', resumeSchema);