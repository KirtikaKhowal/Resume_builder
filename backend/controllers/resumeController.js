const Resume = require('../models/resume');

// Save/Update Resume
const saveResume = async (req, res) => {
    try {
        const { resumeId, ...resumeData } = req.body;
        
        if (resumeId) {
            // Update existing resume
            const resume = await Resume.findOneAndUpdate(
                { _id: resumeId, userId: req.userId },
                { ...resumeData, updatedAt: Date.now() },
                { new: true }
            );
            res.json({ message: 'Resume updated successfully', resume });
        } else {
            // Create new resume
            const resume = new Resume({
                ...resumeData,
                userId: req.userId
            });
            await resume.save();
            res.status(201).json({ message: 'Resume saved successfully', resume });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error saving resume', error: error.message });
    }
};

// Get all resumes for a user
const getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.userId }).sort({ updatedAt: -1 });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resumes', error: error.message });
    }
};

// Get single resume
const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resume', error: error.message });
    }
};

// Delete resume
const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting resume', error: error.message });
    }
};

// Analyze Resume
const analyzeResume = async (req, res) => {
    try {
        const { skills, projects, experience, achievements } = req.body;
        
        // Skill to Job Role Mapping
        const roleMapping = {
            'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Angular'],
            'Backend Developer': ['Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'Express'],
            'Full Stack Developer': ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
            'Data Analyst': ['Python', 'SQL', 'Excel', 'Tableau', 'Pandas'],
            'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Linux'],
            'UI/UX Designer': ['Figma', 'Adobe XD', 'Sketch', 'Prototyping']
        };
        
        // Find matching job roles
        const suggestedRoles = [];
        for (const [role, requiredSkills] of Object.entries(roleMapping)) {
            const matchCount = skills.filter(skill => 
                requiredSkills.some(reqSkill => 
                    reqSkill.toLowerCase() === skill.toLowerCase()
                )
            ).length;
            if (matchCount >= 2) {
                suggestedRoles.push(role);
            }
        }
        
        // Calculate Resume Score
        let score = 0;
        const improvements = [];
        
        // Skills score (max 30)
        if (skills.length >= 5) score += 30;
        else if (skills.length >= 3) score += 20;
        else if (skills.length >= 1) score += 10;
        else improvements.push("Add at least 3-5 relevant skills");
        
        // Projects score (max 25)
        if (projects.length >= 3) score += 25;
        else if (projects.length >= 2) score += 15;
        else if (projects.length >= 1) score += 10;
        else improvements.push("Add projects to showcase your work");
        
        // Experience score (max 25)
        if (experience.length >= 2) score += 25;
        else if (experience.length >= 1) score += 15;
        else improvements.push("Add work experience or internships");
        
        // Achievements score (max 20)
        if (achievements.length >= 3) score += 20;
        else if (achievements.length >= 1) score += 10;
        else improvements.push("Include measurable achievements and certifications");
        
        res.json({
            score,
            suggestedRoles: suggestedRoles.length ? suggestedRoles : ['Explore more skills to get role suggestions'],
            improvements,
            skillGaps: suggestedRoles.length ? "Focus on building projects related to suggested roles" : "Add more in-demand skills"
        });
    } catch (error) {
        res.status(500).json({ message: 'Error analyzing resume', error: error.message });
    }
};

module.exports = { saveResume, getResumes, getResumeById, deleteResume, analyzeResume };