import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [resumes, setResumes] = useState([]);
    const [activeView, setActiveView] = useState('dashboard');
    const [activeTab, setActiveTab] = useState('edit');
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    
    // Colors
    const [primaryColor, setPrimaryColor] = useState('#6366f1');
    const [secondaryColor, setSecondaryColor] = useState('#8b5cf6');
    
    const [formData, setFormData] = useState({
        personalInfo: { fullName: '', email: '', phone: '', title: '', summary: '' },
        skills: [],
        experience: []
    });
    const [customSkill, setCustomSkill] = useState('');
    const [newExp, setNewExp] = useState({ title: '', company: '', duration: '' });
    const [showExpForm, setShowExpForm] = useState(false);
    
    // Analysis
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    useEffect(() => {
        // Direct fetch resumes - No login required
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/resumes');
            setResumes(res.data);
        } catch (err) { 
            console.log(err); 
        }
    };

    const addSkill = () => {
        if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
            setFormData({ ...formData, skills: [...formData.skills, customSkill.trim()] });
            setCustomSkill('');
        }
    };

    const removeSkill = (skill) => {
        setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    };

    const addExperience = () => {
        if (newExp.title && newExp.company) {
            setFormData({ ...formData, experience: [...formData.experience, { ...newExp }] });
            setNewExp({ title: '', company: '', duration: '' });
            setShowExpForm(false);
        }
    };

    const removeExperience = (index) => {
        setFormData({ ...formData, experience: formData.experience.filter((_, i) => i !== index) });
    };

    const saveResume = async () => {
        try {
            await axios.post('http://localhost:5000/api/resumes', {
                personalInfo: formData.personalInfo,
                skills: formData.skills,
                experience: formData.experience,
                template: selectedTemplate
            });
            alert('✅ Resume saved!');
            fetchResumes();
        } catch (err) { 
            alert('❌ Error saving'); 
        }
    };

    const analyzeResume = async () => {
        setAnalyzing(true);
        try {
            const res = await axios.post('http://localhost:5000/api/analyze', {
                skills: formData.skills,
                experience: formData.experience
            });
            setAnalysisResult(res.data);
        } catch (err) { 
            alert('Analysis failed'); 
        } finally {
            setAnalyzing(false);
        }
    };

    const exportAsPDF = () => {
        const printContent = document.getElementById('resume-preview').innerHTML;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    // Templates
    const ModernTemplate = () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                <h1 className="text-3xl font-bold">{formData.personalInfo?.fullName || 'Your Name'}</h1>
                <p className="text-lg opacity-90 mt-1">{formData.personalInfo?.title || 'Professional Title'}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <span>📧 {formData.personalInfo?.email || 'email@example.com'}</span>
                    <span>📱 {formData.personalInfo?.phone || '+91 98765 43210'}</span>
                </div>
            </div>
            <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">{formData.personalInfo?.summary || 'Professional summary goes here...'}</p>
                {formData.skills?.length > 0 && (
                    <div>
                        <h3 className="font-bold text-lg mb-2" style={{ color: primaryColor }}>Technical Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: `${primaryColor}20`, color: primaryColor }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const ProfessionalTemplate = () => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-3">
                <div className="p-6 text-white" style={{ background: primaryColor }}>
                    <h2 className="text-2xl font-bold">{formData.personalInfo?.fullName || 'Your Name'}</h2>
                    <p className="mt-2 opacity-90">{formData.personalInfo?.title}</p>
                    <hr className="my-4 opacity-30" />
                    <p className="text-sm">📧 {formData.personalInfo?.email}</p>
                    <p className="text-sm mt-2">📱 {formData.personalInfo?.phone}</p>
                </div>
                <div className="col-span-2 p-6">
                    <p className="text-gray-600 dark:text-gray-300">{formData.personalInfo?.summary}</p>
                    {formData.skills?.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-bold" style={{ color: primaryColor }}>Core Skills</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.skills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: `${primaryColor}20`, color: primaryColor }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const CreativeTemplate = () => (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-6">
            <div className="text-center border-b-2 pb-4" style={{ borderColor: primaryColor }}>
                <h1 className="text-4xl font-bold" style={{ color: primaryColor }}>{formData.personalInfo?.fullName || 'Your Name'}</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{formData.personalInfo?.title}</p>
            </div>
            <div className="mt-6">
                <h3 className="font-bold" style={{ color: primaryColor }}>About Me</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{formData.personalInfo?.summary}</p>
            </div>
            {formData.skills?.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-bold" style={{ color: primaryColor }}>Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.skills.map((skill, i) => (
                            <span key={i} className="px-3 py-1 rounded-full text-sm border-2 font-medium" style={{ borderColor: primaryColor, color: primaryColor }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const getTemplate = () => {
        switch(selectedTemplate) {
            case 'professional': return <ProfessionalTemplate />;
            case 'creative': return <CreativeTemplate />;
            default: return <ModernTemplate />;
        }
    };

    // Direct Dashboard - No Login Screen
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navbar */}
            <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-3xl">✨</span>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Resume Builder</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setDarkMode(!darkMode)} 
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-xl"
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                G
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Guest User</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6">
                {/* Main Navigation Tabs - Dashboard vs Builder */}
                <div className="flex gap-3 mb-8 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm w-fit">
                    <button 
                        onClick={() => { setActiveView('dashboard'); setActiveTab('edit'); }} 
                        className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${activeView === 'dashboard' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <span>📁</span> Dashboard
                    </button>
                    <button 
                        onClick={() => { setActiveView('builder'); setActiveTab('edit'); setFormData({ personalInfo: { fullName: '', email: '', phone: '', title: '', summary: '' }, skills: [], experience: [] }); }} 
                        className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${activeView === 'builder' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <span>✏️</span> Create Resume
                    </button>
                </div>

                {/* Dashboard View */}
                {activeView === 'dashboard' && (
                    <div className="animate-fade-in-up">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">My Resumes</h2>
                                <p className="text-gray-500 mt-1">Manage and edit your professional resumes</p>
                            </div>
                            <button 
                                onClick={() => { setActiveView('builder'); setActiveTab('edit'); setFormData({ personalInfo: { fullName: '', email: '', phone: '', title: '', summary: '' }, skills: [], experience: [] }); }} 
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition"
                            >
                                <span>+</span> New Resume
                            </button>
                        </div>
                        
                        {resumes.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl text-center py-16 shadow-lg">
                                <div className="text-6xl mb-4">📄</div>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No resumes yet</h3>
                                <p className="text-gray-500 mb-6">Create your first professional resume</p>
                                <button 
                                    onClick={() => { setActiveView('builder'); setActiveTab('edit'); }} 
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
                                >
                                    Create Your First Resume
                                </button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {resumes.map((resume, index) => (
                                    <div 
                                        key={resume.id} 
                                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-1 animate-fade-in-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                        onClick={() => { setFormData(resume); setSelectedTemplate(resume.template || 'modern'); setActiveView('builder'); setActiveTab('edit'); }}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl mb-3">
                                            📄
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{resume.personalInfo?.fullName || 'Untitled'}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{resume.skills?.length || 0} skills added</p>
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {resume.skills?.slice(0, 3).map(s => (
                                                <span key={s} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs">
                                                    {s}
                                                </span>
                                            ))}
                                            {resume.skills?.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-full text-xs">
                                                    +{resume.skills.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Builder View with Tabs */}
                {activeView === 'builder' && (
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left Panel - Tabs Form */}
                        <div className="space-y-6">
                            {/* Sub Tabs for Builder */}
                            <div className="flex gap-2 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm">
                                {[
                                    { id: 'edit', icon: '✏️', label: 'Edit Resume' },
                                    { id: 'templates', icon: '🎨', label: 'Templates' },
                                    { id: 'analyze', icon: '🤖', label: 'AI Analysis' },
                                    { id: 'export', icon: '📥', label: 'Export' }
                                ].map(tab => (
                                    <button 
                                        key={tab.id} 
                                        onClick={() => setActiveTab(tab.id)} 
                                        className={`flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <span>{tab.icon}</span> {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Edit Tab - Form */}
                            {activeTab === 'edit' && (
                                <>
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">📋 Personal Information</h2>
                                        <input 
                                            type="text" 
                                            placeholder="Full Name" 
                                            className="w-full px-4 py-3 border rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                                            value={formData.personalInfo.fullName} 
                                            onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, fullName: e.target.value } })} 
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Professional Title (e.g., Full Stack Developer)" 
                                            className="w-full px-4 py-3 border rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                                            value={formData.personalInfo.title} 
                                            onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, title: e.target.value } })} 
                                        />
                                        <input 
                                            type="email" 
                                            placeholder="Email" 
                                            className="w-full px-4 py-3 border rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                                            value={formData.personalInfo.email} 
                                            onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, email: e.target.value } })} 
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Phone" 
                                            className="w-full px-4 py-3 border rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                                            value={formData.personalInfo.phone} 
                                            onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, phone: e.target.value } })} 
                                        />
                                        <textarea 
                                            placeholder="Professional Summary - Tell about yourself, your experience, and career goals" 
                                            rows="4" 
                                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                                            value={formData.personalInfo.summary} 
                                            onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, summary: e.target.value } })} 
                                        />
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">⚡ Technical Skills</h2>
                                        <p className="text-sm text-gray-500 mb-3">Add your technical and professional skills</p>
                                        <div className="flex gap-2 mb-3">
                                            <input 
                                                type="text" 
                                                placeholder="e.g., React, Python, Project Management" 
                                                className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                                                value={customSkill} 
                                                onChange={(e) => setCustomSkill(e.target.value)} 
                                                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                            />
                                            <button onClick={addSkill} className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-semibold">Add</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 min-h-[60px]">
                                            {formData.skills.length === 0 && (
                                                <p className="text-gray-400 text-sm">No skills added yet. Start adding your skills above!</p>
                                            )}
                                            {formData.skills.map(skill => (
                                                <span key={skill} className="px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium transition hover:scale-105" style={{ background: `${primaryColor}15`, color: primaryColor }}>
                                                    {skill} 
                                                    <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition">×</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">💼 Work Experience</h2>
                                        {formData.experience.length === 0 && (
                                            <p className="text-gray-400 text-sm mb-3">No experience added yet. Add your work history below!</p>
                                        )}
                                        {formData.experience.map((exp, i) => (
                                            <div key={i} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl mb-2 flex justify-between items-center">
                                                <div>
                                                    <span className="font-semibold">{exp.title}</span>
                                                    <span className="text-gray-500"> at {exp.company}</span>
                                                    <p className="text-sm text-gray-400">{exp.duration}</p>
                                                </div>
                                                <button onClick={() => removeExperience(i)} className="text-red-500 hover:text-red-600 transition">Delete</button>
                                            </div>
                                        ))}
                                        {showExpForm ? (
                                            <div className="border-2 border-indigo-200 p-4 rounded-xl mt-3">
                                                <input type="text" placeholder="Job Title" className="w-full px-4 py-2 border rounded-xl mb-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                                    value={newExp.title} onChange={(e) => setNewExp({ ...newExp, title: e.target.value })} />
                                                <input type="text" placeholder="Company Name" className="w-full px-4 py-2 border rounded-xl mb-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                                    value={newExp.company} onChange={(e) => setNewExp({ ...newExp, company: e.target.value })} />
                                                <input type="text" placeholder="Duration (e.g., Jan 2022 - Present)" className="w-full px-4 py-2 border rounded-xl mb-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                                    value={newExp.duration} onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })} />
                                                <div className="flex gap-2">
                                                    <button onClick={addExperience} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">Save</button>
                                                    <button onClick={() => setShowExpForm(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-xl hover:bg-gray-400 transition">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={() => setShowExpForm(true)} className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 mt-2">
                                                <span>+</span> Add Experience
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Templates Tab */}
                            {activeTab === 'templates' && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">🎨 Choose Template</h2>
                                    <p className="text-gray-500 mb-4">Select a design that matches your style</p>
                                    <div className="grid grid-cols-3 gap-3 mb-8">
                                        {[
                                            { id: 'modern', name: 'Modern', icon: '✨', desc: 'Gradient header, clean layout' },
                                            { id: 'professional', name: 'Professional', icon: '💼', desc: 'Sidebar, corporate style' },
                                            { id: 'creative', name: 'Creative', icon: '🎨', desc: 'Unique, artistic design' }
                                        ].map(template => (
                                            <button 
                                                key={template.id} 
                                                onClick={() => setSelectedTemplate(template.id)} 
                                                className={`p-4 border-2 rounded-xl transition text-left ${selectedTemplate === template.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'}`}
                                            >
                                                <div className="text-2xl mb-2">{template.icon}</div>
                                                <div className="font-semibold">{template.name}</div>
                                                <div className="text-xs text-gray-500 mt-1">{template.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <h3 className="font-semibold mb-3 text-lg">🎨 Theme Colors</h3>
                                    <p className="text-sm text-gray-500 mb-3">Customize your resume colors</p>
                                    <div className="flex gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">Primary:</span>
                                            <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">Secondary:</span>
                                            <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200" />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <p className="text-sm text-gray-500 w-full mb-2">Quick presets:</p>
                                        {['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'].map(color => (
                                            <button 
                                                key={color} 
                                                onClick={() => setPrimaryColor(color)} 
                                                className="w-8 h-8 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110" 
                                                style={{ backgroundColor: color }} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Analyze Tab */}
                            {activeTab === 'analyze' && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">🤖 AI Resume Analyzer</h2>
                                    <p className="text-gray-500 mb-4">Get personalized job recommendations based on your skills</p>
                                    <button 
                                        onClick={analyzeResume} 
                                        disabled={analyzing || formData.skills.length === 0} 
                                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {analyzing ? '🔍 Analyzing your profile...' : '🔍 Analyze My Resume'}
                                    </button>
                                    
                                    {formData.skills.length === 0 && (
                                        <p className="text-amber-600 text-sm mt-2 text-center">⚠️ Add some skills first to get accurate analysis!</p>
                                    )}
                                    
                                    {analysisResult && (
                                        <div className="mt-6 space-y-4 animate-fade-in-up">
                                            {/* Score Card */}
                                            <div className="text-center p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl">
                                                <div className="text-6xl font-bold" style={{ color: primaryColor }}>{analysisResult.resumeScore}</div>
                                                <p className="text-gray-600 dark:text-gray-400 mt-1">Resume Score out of 100</p>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-3">
                                                    <div className="h-3 rounded-full transition-all duration-700" style={{ width: `${analysisResult.resumeScore}%`, background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}></div>
                                                </div>
                                                <p className="mt-3 font-semibold" style={{ color: analysisResult.resumeScore >= 70 ? '#10b981' : analysisResult.resumeScore >= 50 ? '#f59e0b' : '#ef4444' }}>
                                                    {analysisResult.resumeScore >= 70 ? '🎉 Excellent! ATS Friendly' : analysisResult.resumeScore >= 50 ? '👍 Good, can be improved' : '📈 Needs significant improvement'}
                                                </p>
                                            </div>
                                            
                                            {/* Job Recommendations */}
                                            {analysisResult.topRecommendations && analysisResult.topRecommendations.length > 0 && (
                                                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                                                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: primaryColor }}>
                                                        <span>🎯</span> Top Job Matches
                                                    </h3>
                                                    {analysisResult.topRecommendations.map((role, i) => (
                                                        <div key={i} className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-xl border-l-4" style={{ borderLeftColor: primaryColor }}>
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-semibold text-lg">{role.title}</span>
                                                                <span className="text-sm font-bold px-2 py-1 rounded-full" style={{ background: `${primaryColor}15`, color: primaryColor }}>
                                                                    {role.matchPercentage}% Match
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-500 mt-1">{role.description?.substring(0, 80)}...</p>
                                                            {role.matchedSkills && role.matchedSkills.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-2">
                                                                    {role.matchedSkills.slice(0, 4).map(skill => (
                                                                        <span key={skill} className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">
                                                                            {skill}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {/* Improvement Tips */}
                                            {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
                                                    <h3 className="font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                                                        <span>💡</span> Tips to Improve Your Resume
                                                    </h3>
                                                    <ul className="space-y-1">
                                                        {analysisResult.suggestions.map((s, i) => (
                                                            <li key={i} className="text-sm flex items-start gap-2">
                                                                <span className="text-amber-500">•</span> {s}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            
                                            {/* Career Tips */}
                                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                                                <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                                                    <span>🚀</span> Quick Career Tips
                                                </h3>
                                                <ul className="space-y-1 text-sm">
                                                    <li>• Add more {analysisResult.topRecommendations?.[0]?.title || 'relevant'} skills to increase match rate</li>
                                                    <li>• Build projects using in-demand technologies</li>
                                                    <li>• Get certified in your target role</li>
                                                    <li>• Update your LinkedIn profile regularly</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Export Tab */}
                            {activeTab === 'export' && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">📥 Export & Save</h2>
                                    <p className="text-gray-500 mb-4">Download your resume or save to your account</p>
                                    <button 
                                        onClick={saveResume} 
                                        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl mb-3 font-semibold hover:from-indigo-700 hover:to-indigo-800 transition shadow-md"
                                    >
                                        💾 Save Resume to Dashboard
                                    </button>
                                    <button 
                                        onClick={exportAsPDF} 
                                        className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition shadow-md"
                                    >
                                        📄 Download as PDF
                                    </button>
                                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                        <p className="text-sm text-green-700 dark:text-green-400 text-center">
                                            ✅ Your resume is professionally formatted and ATS-friendly!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Panel - Live Preview */}
                        <div className="sticky top-24">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b flex justify-between items-center">
                                    <span className="font-semibold flex items-center gap-2">
                                        <span>👁️</span> Live Preview
                                    </span>
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                </div>
                                <div id="resume-preview" className="p-6 bg-white dark:bg-gray-800 transition-all duration-300">
                                    {getTemplate()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;