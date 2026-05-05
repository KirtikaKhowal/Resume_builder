const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory database
const users = [];
const resumes = [];
let userIdCounter = 1;
let resumeIdCounter = 1;

// ============ JOB ROLES DATABASE ============
const jobRoles = [
    {
        title: "Frontend Developer",
        icon: "🎨",
        requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Angular", "Vue", "TypeScript", "Tailwind", "Bootstrap"],
        description: "Build responsive and interactive user interfaces for web applications.",
        salary: "₹4-12 LPA",
        demand: "High",
        experience: "0-3 years"
    },
    {
        title: "Backend Developer",
        icon: "⚙️",
        requiredSkills: ["Node.js", "Python", "Java", "Express", "Django", "Spring Boot", "SQL", "MongoDB", "API"],
        description: "Develop server-side logic, databases, and APIs for web applications.",
        salary: "₹5-15 LPA",
        demand: "High",
        experience: "0-3 years"
    },
    {
        title: "Full Stack Developer",
        icon: "🚀",
        requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "SQL", "Express", "Git"],
        description: "Work on both frontend and backend, building complete web applications.",
        salary: "₹6-18 LPA",
        demand: "Very High",
        experience: "1-4 years"
    },
    {
        title: "Data Analyst",
        icon: "📊",
        requiredSkills: ["Python", "SQL", "Excel", "Tableau", "Power BI", "Pandas", "NumPy", "Statistics"],
        description: "Analyze data and provide insights to help business decisions.",
        salary: "₹4-12 LPA",
        demand: "High",
        experience: "0-3 years"
    },
    {
        title: "Data Scientist",
        icon: "🧠",
        requiredSkills: ["Python", "Machine Learning", "SQL", "TensorFlow", "PyTorch", "Statistics", "Deep Learning", "NLP"],
        description: "Build predictive models and extract insights from complex data.",
        salary: "₹8-25 LPA",
        demand: "Very High",
        experience: "2-5 years"
    },
    {
        title: "DevOps Engineer",
        icon: "🔧",
        requiredSkills: ["Docker", "Kubernetes", "AWS", "Azure", "Jenkins", "Linux", "CI/CD", "Terraform"],
        description: "Automate deployment, scaling, and management of applications.",
        salary: "₹6-20 LPA",
        demand: "High",
        experience: "1-4 years"
    },
    {
        title: "Mobile Developer",
        icon: "📱",
        requiredSkills: ["React Native", "Flutter", "Swift", "Kotlin", "Android", "iOS", "Firebase"],
        description: "Build native or cross-platform mobile applications.",
        salary: "₹5-15 LPA",
        demand: "High",
        experience: "0-3 years"
    },
    {
        title: "UI/UX Designer",
        icon: "🎯",
        requiredSkills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "Wireframing", "User Research", "Photoshop"],
        description: "Design user interfaces and improve user experience of applications.",
        salary: "₹4-12 LPA",
        demand: "Medium",
        experience: "0-3 years"
    },
    {
        title: "Cloud Engineer",
        icon: "☁️",
        requiredSkills: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform", "Linux"],
        description: "Manage cloud infrastructure and deploy scalable applications.",
        salary: "₹7-22 LPA",
        demand: "High",
        experience: "1-4 years"
    },
    {
        title: "AI/ML Engineer",
        icon: "🤖",
        requiredSkills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
        description: "Develop artificial intelligence and machine learning models.",
        salary: "₹10-30 LPA",
        demand: "Very High",
        experience: "2-5 years"
    },
    {
        title: "Cybersecurity Analyst",
        icon: "🔒",
        requiredSkills: ["Network Security", "Ethical Hacking", "Linux", "Firewall", "SIEM", "Penetration Testing"],
        description: "Protect systems and networks from cyber threats.",
        salary: "₹6-18 LPA",
        demand: "High",
        experience: "1-4 years"
    },
    {
        title: "Project Manager",
        icon: "📋",
        requiredSkills: ["Agile", "Scrum", "JIRA", "Leadership", "Communication", "Risk Management", "Planning"],
        description: "Lead development teams and manage project deliverables.",
        salary: "₹10-25 LPA",
        demand: "Medium",
        experience: "3-7 years"
    },
    {
        title: "Blockchain Developer",
        icon: "⛓️",
        requiredSkills: ["Blockchain", "Solidity", "Ethereum", "Smart Contracts", "Web3", "Cryptography"],
        description: "Build decentralized applications and smart contracts.",
        salary: "₹8-25 LPA",
        demand: "High",
        experience: "1-4 years"
    },
    {
        title: "Game Developer",
        icon: "🎮",
        requiredSkills: ["Unity", "Unreal Engine", "C#", "C++", "3D Modeling", "Game Design"],
        description: "Create video games for various platforms.",
        salary: "₹4-15 LPA",
        demand: "Medium",
        experience: "0-3 years"
    },
    {
        title: "Technical Writer",
        icon: "✍️",
        requiredSkills: ["Technical Writing", "Documentation", "Communication", "Markdown", "GitHub"],
        description: "Create technical documentation and user guides.",
        salary: "₹3-8 LPA",
        demand: "Low",
        experience: "0-2 years"
    },
    {
        title: "QA Tester",
        icon: "🧪",
        requiredSkills: ["Manual Testing", "Automation Testing", "Selenium", "JIRA", "API Testing", "Cypress"],
        description: "Test applications to ensure quality and find bugs.",
        salary: "₹3-9 LPA",
        demand: "Medium",
        experience: "0-3 years"
    }
];

// ============ ANALYZE RESUME API (Ye IMPORTANT HAI) ============
app.post('/api/analyze', (req, res) => {
    console.log('📊 Analyze request received');
    console.log('Skills:', req.body.skills);
    
    const { skills = [], experience = [], projects = [], education = [] } = req.body;
    
    // Calculate match for each job role
    const analyzedRoles = jobRoles.map(role => {
        const matchedSkills = role.requiredSkills.filter(reqSkill => 
            skills.some(userSkill => 
                userSkill.toLowerCase().includes(reqSkill.toLowerCase()) ||
                reqSkill.toLowerCase().includes(userSkill.toLowerCase())
            )
        );
        
        const matchPercentage = Math.min(100, Math.floor((matchedSkills.length / role.requiredSkills.length) * 100));
        
        return {
            ...role,
            matchedSkills: matchedSkills,
            matchedCount: matchedSkills.length,
            totalRequired: role.requiredSkills.length,
            matchPercentage: matchPercentage,
            missingSkills: role.requiredSkills.filter(reqSkill => 
                !skills.some(userSkill => 
                    userSkill.toLowerCase().includes(reqSkill.toLowerCase())
                )
            ).slice(0, 5)
        };
    });
    
    // Sort by match percentage
    const sortedRoles = analyzedRoles.sort((a, b) => b.matchPercentage - a.matchPercentage);
    const topRecommendations = sortedRoles.slice(0, 3);
    
    // Calculate resume score
    let totalScore = 0;
    const suggestions = [];
    
    // Skills score (max 40)
    if (skills.length >= 10) totalScore += 40;
    else if (skills.length >= 7) totalScore += 35;
    else if (skills.length >= 5) totalScore += 30;
    else if (skills.length >= 3) totalScore += 20;
    else if (skills.length >= 1) totalScore += 10;
    
    if (skills.length < 5) suggestions.push("Add more technical skills (aim for 7-10 skills)");
    
    // Experience score (max 30)
    if (experience && experience.length >= 2) totalScore += 30;
    else if (experience && experience.length === 1) totalScore += 20;
    else if (experience && experience.length > 0) totalScore += 10;
    
    if (!experience || experience.length === 0) suggestions.push("Add work experience or internships");
    
    // Projects score (max 20)
    if (projects && projects.length >= 2) totalScore += 20;
    else if (projects && projects.length === 1) totalScore += 12;
    else if (projects && projects.length > 0) totalScore += 8;
    
    if (!projects || projects.length === 0) suggestions.push("Add projects to showcase your work");
    
    // Education score (max 10)
    if (education && education.length > 0) totalScore += 10;
    else suggestions.push("Add your educational qualifications");
    
    const response = {
        success: true,
        resumeScore: totalScore,
        suggestions: suggestions,
        topRecommendations: topRecommendations,
        allRoles: sortedRoles,
        skillGaps: topRecommendations[0]?.missingSkills || [],
        summary: {
            totalSkills: skills.length,
            uniqueSkills: skills.length,
            jobMarketFit: totalScore >= 70 ? "Excellent" : totalScore >= 50 ? "Good" : "Needs Improvement"
        }
    };
    
    console.log('✅ Analysis complete. Score:', totalScore);
    res.json(response);
});

// Test route for analyze API
app.get('/api/analyze/test', (req, res) => {
    res.json({ message: 'Analyze API is working! Send POST request to /api/analyze with skills array' });
});

// ============ AUTH APIs ============
app.post('/api/signup', async (req, res) => {
    console.log('Signup:', req.body.email);
    const { name, email, password } = req.body;
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: userIdCounter++, name, email, password: hashedPassword };
    users.push(newUser);
    
    const token = jwt.sign({ userId: newUser.id }, 'secretkey');
    res.json({ token, user: { id: newUser.id, name, email } });
});

app.post('/api/login', async (req, res) => {
    console.log('Login:', req.body.email);
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(400).json({ error: 'Invalid password' });
    }
    
    const token = jwt.sign({ userId: user.id }, 'secretkey');
    res.json({ token, user: { id: user.id, name: user.name, email } });
});

// ============ RESUME APIs ============
app.get('/api/resumes', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const decoded = jwt.verify(token, 'secretkey');
        const userResumes = resumes.filter(r => r.userId === decoded.userId);
        res.json(userResumes);
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.post('/api/resumes', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const decoded = jwt.verify(token, 'secretkey');
        const { title, personalInfo, skills, experience, education, template, theme } = req.body;
        
        const newResume = {
            id: resumeIdCounter++,
            userId: decoded.userId,
            title: title || 'Untitled Resume',
            personalInfo: personalInfo || {},
            skills: skills || [],
            experience: experience || [],
            education: education || [],
            template: template || 'modern',
            theme: theme || { primary: '#2563EB', secondary: '#7C3AED' },
            createdAt: new Date(),
            updatedAt: new Date()
        };
        resumes.push(newResume);
        res.json({ message: 'Resume saved successfully', resume: newResume });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.delete('/api/resumes/:id', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const decoded = jwt.verify(token, 'secretkey');
        const resumeIndex = resumes.findIndex(r => r.id === parseInt(req.params.id) && r.userId === decoded.userId);
        
        if (resumeIndex === -1) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        
        resumes.splice(resumeIndex, 1);
        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.get('/api/resumes/:id', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const decoded = jwt.verify(token, 'secretkey');
        const resume = resumes.find(r => r.id === parseInt(req.params.id) && r.userId === decoded.userId);
        
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        
        res.json(resume);
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Resume Builder API is running!', endpoints: ['/api/signup', '/api/login', '/api/analyze', '/api/resumes'] });
});

app.listen(5000, () => {
    console.log('✅ Server running on https://resume-builder-1-hf4l.onrender.com');
    console.log('📊 Job roles loaded:', jobRoles.length);
    console.log('🔗 Available endpoints:');
    console.log('   POST /api/signup - Create account');
    console.log('   POST /api/login - Login');
    console.log('   POST /api/analyze - Analyze resume (AI)');
    console.log('   GET /api/resumes - Get all resumes');
    console.log('   POST /api/resumes - Save resume');
});

const cors = require("cors");

app.use(cors({
  origin: "*",
  credentials: true
}));