const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Detailed Job Roles Database with Required Skills
const jobRoles = [
    { 
        title: "Frontend Developer", 
        icon: "🎨",
        requiredSkills: ["react", "javascript", "html", "css", "vue", "angular", "typescript", "tailwind", "bootstrap", "next.js"],
        optionalSkills: ["redux", "jest", "webpack", "figma"],
        description: "Build responsive and interactive user interfaces",
        salary: "₹4-12 LPA",
        demand: "High",
        growth: "15% YoY",
        learningPath: ["HTML/CSS → JavaScript → React → TypeScript → Next.js"],
        resources: ["freeCodeCamp", "Frontend Masters", "MDN Web Docs"]
    },
    { 
        title: "Backend Developer", 
        icon: "⚙️",
        requiredSkills: ["node.js", "python", "java", "express", "django", "spring boot", "sql", "mongodb", "rest api", "graphql"],
        optionalSkills: ["docker", "redis", "rabbitmq", "microservices"],
        description: "Develop server-side logic, databases, and APIs",
        salary: "₹5-15 LPA",
        demand: "High",
        growth: "12% YoY",
        learningPath: ["Programming Fundamentals → Databases → API Design → System Design"],
        resources: ["The Odin Project", "Udemy", "Coursera"]
    },
    { 
        title: "Full Stack Developer", 
        icon: "🚀",
        requiredSkills: ["react", "node.js", "javascript", "html", "css", "mongodb", "sql", "express", "git", "rest api"],
        optionalSkills: ["docker", "aws", "typescript", "graphql", "next.js"],
        description: "Work on both frontend and backend, building complete applications",
        salary: "₹6-18 LPA",
        demand: "Very High",
        growth: "20% YoY",
        learningPath: ["Frontend → Backend → Database → Deployment → DevOps"],
        resources: ["The Odin Project", "Full Stack Open", "YouTube"]
    },
    { 
        title: "Data Analyst", 
        icon: "📊",
        requiredSkills: ["python", "sql", "excel", "tableau", "power bi", "pandas", "numpy", "statistics", "data visualization"],
        optionalSkills: ["r", "spark", "hadoop", "machine learning"],
        description: "Analyze data and provide insights to help business decisions",
        salary: "₹4-12 LPA",
        demand: "High",
        growth: "25% YoY",
        learningPath: ["Excel → SQL → Python → Pandas → Tableau → Statistics"],
        resources: ["DataCamp", "Kaggle", "Google Data Analytics"]
    },
    { 
        title: "Data Scientist", 
        icon: "🧠",
        requiredSkills: ["python", "machine learning", "sql", "tensorflow", "pytorch", "statistics", "deep learning", "nlp", "pandas", "scikit-learn"],
        optionalSkills: ["spark", "hadoop", "cloud computing", "big data"],
        description: "Build predictive models and extract insights from complex data",
        salary: "₹8-25 LPA",
        demand: "Very High",
        growth: "30% YoY",
        learningPath: ["Python → Statistics → Machine Learning → Deep Learning → NLP/Computer Vision"],
        resources: ["Andrew Ng ML Course", "Kaggle", "DeepLearning.AI"]
    },
    { 
        title: "DevOps Engineer", 
        icon: "🔧",
        requiredSkills: ["docker", "kubernetes", "aws", "azure", "jenkins", "linux", "ci/cd", "terraform", "git", "bash"],
        optionalSkills: ["prometheus", "grafana", "ansible", "helm"],
        description: "Automate deployment, scaling, and management of infrastructure",
        salary: "₹6-20 LPA",
        demand: "High",
        growth: "22% YoY",
        learningPath: ["Linux → Scripting → Docker → Kubernetes → AWS → CI/CD"],
        resources: ["KodeKloud", "AWS Training", "Linux Academy"]
    },
    { 
        title: "AI/ML Engineer", 
        icon: "🤖",
        requiredSkills: ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "computer vision", "statistics", "keras", "data preprocessing"],
        optionalSkills: ["mlops", "kubeflow", "spark", "cloud ai services"],
        description: "Develop and deploy artificial intelligence models",
        salary: "₹10-30 LPA",
        demand: "Very High",
        growth: "35% YoY",
        learningPath: ["Python → Math/Stats → ML Fundamentals → Deep Learning → Specialization"],
        resources: ["Fast.ai", "DeepLearning.AI", "Kaggle Competitions"]
    },
    { 
        title: "Cloud Engineer", 
        icon: "☁️",
        requiredSkills: ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "linux", "networking", "python", "bash"],
        optionalSkills: ["serverless", "cloudformation", "security", "monitoring"],
        description: "Design and manage cloud infrastructure at scale",
        salary: "₹7-22 LPA",
        demand: "Very High",
        growth: "28% YoY",
        learningPath: ["Linux → Networking → Cloud Fundamentals → AWS/Azure → Infrastructure as Code"],
        resources: ["AWS Training", "Cloud Guru", "Microsoft Learn"]
    },
    { 
        title: "Cybersecurity Analyst", 
        icon: "🔒",
        requiredSkills: ["network security", "ethical hacking", "linux", "firewall", "siem", "penetration testing", "vulnerability assessment", "incident response"],
        optionalSkills: ["cloud security", "certifications", "forensics", "compliance"],
        description: "Protect systems and networks from cyber threats",
        salary: "₹6-18 LPA",
        demand: "High",
        growth: "32% YoY",
        learningPath: ["Networking → Security Fundamentals → Ethical Hacking → Incident Response → Specialization"],
        resources: ["TryHackMe", "Hack The Box", "SANS"]
    },
    { 
        title: "Product Manager", 
        icon: "📋",
        requiredSkills: ["agile", "scrum", "jira", "product strategy", "user research", "analytics", "communication", "leadership", "roadmapping"],
        optionalSkills: ["figma", "sql", "marketing", "finance"],
        description: "Lead product development and define product vision",
        salary: "₹12-25 LPA",
        demand: "Medium",
        growth: "10% YoY",
        learningPath: ["Business Fundamentals → Product Strategy → Agile → UX Research → Data Analytics"],
        resources: ["Product School", "Mind the Product", "Coursera"]
    }
];

// Predefined skills list for suggestions
const allSkills = [
    "react", "javascript", "html", "css", "node.js", "python", "java", "mongodb", 
    "sql", "express", "docker", "kubernetes", "aws", "git", "typescript", "next.js",
    "graphql", "tailwind", "redux", "jest", "tensorflow", "pytorch", "machine learning",
    "deep learning", "nlp", "pandas", "numpy", "tableau", "power bi", "docker", "jenkins",
    "linux", "terraform", "figma", "jira", "agile", "scrum", "cybersecurity", "networking"
];

// Analysis API
app.post('/api/analyze', (req, res) => {
    const skills = req.body.skills || [];
    const lowerSkills = skills.map(s => s.toLowerCase());
    
    // Calculate detailed analysis for each role
    const analyzedRoles = jobRoles.map(role => {
        const matchedSkills = role.requiredSkills.filter(req => 
            lowerSkills.some(s => s.includes(req) || req.includes(s))
        );
        
        const matchPercentage = Math.min(100, Math.floor((matchedSkills.length / role.requiredSkills.length) * 100));
        const missingSkills = role.requiredSkills.filter(req => 
            !lowerSkills.some(s => s.includes(req))
        );
        
        return {
            title: role.title,
            icon: role.icon,
            description: role.description,
            salary: role.salary,
            demand: role.demand,
            growth: role.growth,
            matchPercentage: matchPercentage,
            matchedSkills: matchedSkills,
            missingSkills: missingSkills.slice(0, 8),
            learningPath: role.learningPath,
            resources: role.resources
        };
    });
    
    // Sort by match percentage
    analyzedRoles.sort((a, b) => b.matchPercentage - a.matchPercentage);
    const topRecommendations = analyzedRoles.slice(0, 4);
    
    // Calculate resume score
    let score = 0;
    if (skills.length >= 12) score = 92;
    else if (skills.length >= 10) score = 85;
    else if (skills.length >= 8) score = 75;
    else if (skills.length >= 6) score = 65;
    else if (skills.length >= 4) score = 50;
    else if (skills.length >= 2) score = 35;
    else if (skills.length >= 1) score = 20;
    else score = 5;
    
    // Generate improvement suggestions
    const suggestions = [];
    const recommendedSkills = [];
    
    if (skills.length < 6) {
        suggestions.push(`📈 Add ${6 - skills.length} more skills to reach 60% score`);
        recommendedSkills.push(...allSkills.slice(0, 5));
    }
    
    if (topRecommendations[0]?.missingSkills?.length > 0) {
        suggestions.push(`🎯 Learn ${topRecommendations[0].missingSkills.slice(0, 3).join(", ")} to become a ${topRecommendations[0].title}`);
        recommendedSkills.push(...topRecommendations[0].missingSkills.slice(0, 3));
    }
    
    if (skills.filter(s => ["react", "angular", "vue"].includes(s.toLowerCase())).length === 0) {
        suggestions.push(`⚛️ Add a frontend framework (React, Angular, or Vue) to increase opportunities`);
        recommendedSkills.push("React");
    }
    
    if (skills.filter(s => ["node.js", "python", "java", "php"].includes(s.toLowerCase())).length === 0) {
        suggestions.push(`💻 Learn a backend language (Node.js, Python, or Java)`);
        recommendedSkills.push("Node.js");
    }
    
    if (skills.filter(s => ["mongodb", "postgresql", "mysql", "sql"].includes(s.toLowerCase())).length === 0) {
        suggestions.push(`🗄️ Add database skills (MongoDB, PostgreSQL, or MySQL)`);
        recommendedSkills.push("MongoDB");
    }
    
    if (skills.filter(s => ["docker", "kubernetes", "aws", "jenkins"].includes(s.toLowerCase())).length === 0) {
        suggestions.push(`🐳 Learn DevOps basics (Docker, Git, CI/CD) for better job prospects`);
        recommendedSkills.push("Docker");
    }
    
    // Remove duplicates
    const uniqueRecommended = [...new Set(recommendedSkills)];
    
    const response = {
        success: true,
        resumeScore: score,
        topRecommendations: topRecommendations,
        suggestions: suggestions,
        recommendedSkills: uniqueRecommended.slice(0, 8),
        summary: {
            totalSkills: skills.length,
            jobMarketFit: score >= 75 ? "Excellent" : score >= 55 ? "Good" : score >= 35 ? "Average" : "Needs Improvement",
            nextMilestone: score >= 75 ? "Apply for senior roles" : score >= 55 ? "Build portfolio projects" : "Focus on skill development"
        }
    };
    
    console.log('📊 Analysis complete. Score:', score);
    res.json(response);
});

// Get all skills (for frontend suggestions)
app.get('/api/skills', (req, res) => {
    res.json({ skills: allSkills });
});

// Get job roles (for frontend)
app.get('/api/jobs', (req, res) => {
    res.json({ jobs: jobRoles.map(r => ({ title: r.title, icon: r.icon, requiredSkills: r.requiredSkills })) });
});

// Test API
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Resumes CRUD
let resumes = [];
let id = 1;

app.get('/api/resumes', (req, res) => res.json(resumes));
app.post('/api/resumes', (req, res) => {
    const newResume = { id: id++, ...req.body, createdAt: new Date() };
    resumes.push(newResume);
    res.json({ success: true, resume: newResume });
});
app.delete('/api/resumes/:id', (req, res) => {
    resumes = resumes.filter(r => r.id !== parseInt(req.params.id));
    res.json({ success: true });
});

app.listen(5000, () => {
    console.log('\n========================================');
    console.log('🚀 Server: https://resume-builder-1-lb0b.onrender.com');
    console.log('📊 POST /api/analyze - AI Analysis');
    console.log('========================================\n');
});