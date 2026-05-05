import React, { useState, useEffect } from 'react';
import axios from 'axios';
function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(true);
    const [resumes, setResumes] = useState([]);
    const [activeView, setActiveView] = useState('dashboard');
    const [activeTab, setActiveTab] = useState('edit'); // edit, templates, analyze, export
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    
    // Colors
    const [primaryColor, setPrimaryColor] = useState('#000000');
    const [secondaryColor, setSecondaryColor] = useState('#890a0a');
    
    const [formData, setFormData] = useState({
        personalInfo: { fullName: '', email: '', phone: '', title: '', summary: '' },
        skills: [],
        experience: []
    });
    const [customSkill, setCustomSkill] = useState('');
    const [newExp, setNewExp] = useState({ title: '', company: '', duration: '' });
    const [showExpForm, setShowExpForm] = useState(false);
    
    // Auth
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Analysis
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setIsLoggedIn(true);
            setUser(JSON.parse(savedUser));
            fetchResumes(token);
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const fetchResumes = async (token) => {
        try {
            const res = await axios.get('https://resume-builder-hlkx.onrender.com', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setResumes(res.data);
        } catch (err) { 
            console.log(err); 
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/signup', { 
                name: signupName, email: signupEmail, password: signupPassword 
            });
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setIsLoggedIn(true);
                setUser(res.data.user);
                fetchResumes(res.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/login', { 
                email: loginEmail, password: loginPassword 
            });
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setIsLoggedIn(true);
                setUser(res.data.user);
                fetchResumes(res.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        setActiveView('dashboard');
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
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/resumes', {
                personalInfo: formData.personalInfo,
                skills: formData.skills,
                experience: formData.experience,
                template: selectedTemplate
            }, { headers: { Authorization: `Bearer ${token}` } });
            alert('✅ Resume saved!');
            fetchResumes(token);
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

    // Login Screen
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-3">✨</div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Resume Builder</h1>
                        <p className="text-gray-500 mt-2">Create Professional Resumes with AI</p>
                    </div>
                    
                    <div className="flex gap-3 mb-6">
                        <button onClick={() => setShowLogin(true)} className={`flex-1 py-3 rounded-xl font-semibold transition ${showLogin ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Login</button>
                        <button onClick={() => setShowLogin(false)} className={`flex-1 py-3 rounded-xl font-semibold transition ${!showLogin ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Signup</button>
                    </div>
                    
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-center">{error}</div>}
                    
                    {showLogin ? (
                        <form onSubmit={handleLogin}>
                            <input type="email" placeholder="Email address" className="w-full px-4 py-3 border rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                            <input type="password" placeholder="Password" className="w-full px-4 py-3 border rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                            <button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold" disabled={loading}>
                                {loading ? 'Loading...' : 'Login'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignup}>
                            <input type="text" placeholder="Full name" className="w-full px-4 py-3 border rounded-xl mb-3 focus:ring-2 focus:ring-purple-500 outline-none" 
                                value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
                            <input type="email" placeholder="Email address" className="w-full px-4 py-3 border rounded-xl mb-3 focus:ring-2 focus:ring-purple-500 outline-none" 
                                value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
                            <input type="password" placeholder="Password" className="w-full px-4 py-3 border rounded-xl mb-4 focus:ring-2 focus:ring-purple-500 outline-none" 
                                value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
                            <button type="submit" className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold" disabled={loading}>
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    // Dashboard & Builder
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navbar */}
            <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">✨</span>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Resume Builder</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">{user?.name}</span>
                        </div>
                        <button onClick={handleLogout} className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition">Logout</button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6">
                {/* Main Navigation Tabs - Dashboard vs Builder */}
                <div className="flex gap-3 mb-8 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm w-fit">
                    <button onClick={() => { setActiveView('dashboard'); setActiveTab('edit'); }} 
                        className={`px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 ${activeView === 'dashboard' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <span>📁</span> Dashboard
                    </button>
                    <button onClick={() => { setActiveView('builder'); setActiveTab('edit'); }} 
                        className={`px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 ${activeView === 'builder' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <span>✏️</span> Resume Builder
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
                            <button onClick={() => { setActiveView('builder'); setActiveTab('edit'); setFormData({ personalInfo: { fullName: '', email: '', phone: '', title: '', summary: '' }, skills: [], experience: [] }); }} 
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold flex items-center gap-2">
                                <span>+</span> New Resume
                            </button>
                        </div>
                        
                        {resumes.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl text-center py-16 shadow-lg">
                                <div className="text-6xl mb-4">📄</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No resumes yet</h3>
                                <p className="text-gray-500 mb-6">Create your first professional resume</p>
                                <button onClick={() => { setActiveView('builder'); setActiveTab('edit'); }} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl">Create Resume</button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {resumes.map((resume) => (
                                    <div key={resume.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-1"
                                        onClick={() => { setFormData(resume); setSelectedTemplate(resume.template || 'modern'); setActiveView('builder'); setActiveTab('edit'); }}>
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl mb-3">📄</div>
                                        <h3 className="text-xl font-bold">{resume.personalInfo?.fullName || 'Untitled'}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{resume.skills?.length || 0} skills</p>
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {resume.skills?.slice(0, 3).map(s => (
                                                <span key={s} className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs">{s}</span>
                                            ))}
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
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
                                        className={`flex-1 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                                        <span>{tab.icon}</span> {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Edit Tab - Form */}
                            {activeTab === 'edit' && (
                                <>
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Personal Information</h2>
                                        <input type="text" placeholder="Full Name" className="w-full px-4 py-3 border rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                            value={formData.personalInfo.fullName} onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, fullName: e.target.value } })} />
                                        <input type="text" placeholder="Professional Title" className="w-full px-4 py-3 border rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                            value={formData.personalInfo.title} onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, title: e.target.value } })} />
                                        <input type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                            value={formData.personalInfo.email} onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, email: e.target.value } })} />
                                        <input type="text" placeholder="Phone" className="w-full px-4 py-3 border rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                            value={formData.personalInfo.phone} onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, phone: e.target.value } })} />
                                        <textarea placeholder="Professional Summary" rows="3" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                                            value={formData.personalInfo.summary} onChange={(e) => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, summary: e.target.value } })} />
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Skills</h2>
                                        <div className="flex gap-2 mb-3">
                                            <input type="text" placeholder="Add a skill" className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                                                value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} />
                                            <button onClick={addSkill} className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition">Add</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.skills.map(skill => (
                                                <span key={skill} className="px-3 py-1 rounded-full text-sm flex items-center gap-2" style={{ background: `${primaryColor}20`, color: primaryColor }}>
                                                    {skill} <button onClick={() => removeSkill(skill)} className="hover:text-red-500">×</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Work Experience</h2>
                                        {formData.experience.map((exp, i) => (
                                            <div key={i} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl mb-2 flex justify-between items-center">
                                                <div><strong>{exp.title}</strong> at {exp.company} ({exp.duration})</div>
                                                <button onClick={() => removeExperience(i)} className="text-red-500">Delete</button>
                                            </div>
                                        ))}
                                        {showExpForm ? (
                                            <div className="border p-4 rounded-xl">
                                                <input type="text" placeholder="Job Title" className="w-full px-4 py-2 border rounded-xl mb-2" 
                                                    value={newExp.title} onChange={(e) => setNewExp({ ...newExp, title: e.target.value })} />
                                                <input type="text" placeholder="Company" className="w-full px-4 py-2 border rounded-xl mb-2" 
                                                    value={newExp.company} onChange={(e) => setNewExp({ ...newExp, company: e.target.value })} />
                                                <input type="text" placeholder="Duration" className="w-full px-4 py-2 border rounded-xl mb-2" 
                                                    value={newExp.duration} onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })} />
                                                <div className="flex gap-2">
                                                    <button onClick={addExperience} className="px-4 py-2 bg-indigo-600 text-white rounded-xl">Save</button>
                                                    <button onClick={() => setShowExpForm(false)} className="px-4 py-2 bg-gray-300 rounded-xl">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={() => setShowExpForm(true)} className="text-indigo-600">+ Add Experience</button>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Templates Tab */}
                            {activeTab === 'templates' && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Choose Template</h2>
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        {['modern', 'professional', 'creative'].map(template => (
                                            <button key={template} onClick={() => setSelectedTemplate(template)} 
                                                className={`p-4 border-2 rounded-xl capitalize transition ${selectedTemplate === template ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                                                {template}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <h3 className="font-semibold mb-3">Theme Colors</h3>
                                    <div className="flex gap-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">Primary:</span>
                                            <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">Secondary:</span>
                                            <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'].map(color => (
                                            <button key={color} onClick={() => setPrimaryColor(color)} className="w-8 h-8 rounded-full border-2 border-white shadow" style={{ backgroundColor: color }} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Analyze Tab */}
                            {activeTab === 'analyze' && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI Resume Analyzer</h2>
                                    <button onClick={analyzeResume} disabled={analyzing} className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold">
                                        {analyzing ? 'Analyzing...' : '🔍 Analyze My Resume'}
                                    </button>
                                    
                                    {analysisResult && (
                                        <div className="mt-6 space-y-4">
                                            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                                                <div className="text-5xl font-bold" style={{ color: primaryColor }}>{analysisResult.resumeScore}</div>
                                                <p className="text-gray-600">Resume Score</p>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                    <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${analysisResult.resumeScore}%`, background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}></div>
                                                </div>
                                            </div>
                                            {analysisResult.topRecommendations && analysisResult.topRecommendations.length > 0 && (
                                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                                                    <h3 className="font-bold mb-2" style={{ color: primaryColor }}>🎯 Top Job Matches</h3>
                                                    {analysisResult.topRecommendations.map((role, i) => (
                                                        <div key={i} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded-xl">
                                                            <div className="flex justify-between">
                                                                <span className="font-semibold">{role.title}</span>
                                                                <span className="text-sm" style={{ color: primaryColor }}>{role.matchPercentage}% match</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                                                <div className="p-4 bg-yellow-50 rounded-2xl">
                                                    <h3 className="font-bold text-orange-600 mb-2">💡 Tips to Improve</h3>
                                                    <ul className="space-y-1 text-sm">
                                                        {analysisResult.suggestions.map((s, i) => <li key={i}>• {s}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Export Tab */}
                            {activeTab === 'export' && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Export Resume</h2>
                                    <button onClick={saveResume} className="w-full py-3 bg-indigo-600 text-white rounded-xl mb-3 font-semibold">💾 Save Resume</button>
                                    <button onClick={exportAsPDF} className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold">📄 Download PDF</button>
                                </div>
                            )}
                        </div>

                        {/* Right Panel - Live Preview */}
                        <div className="sticky top-24">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b">
                                    <span className="font-semibold">Live Preview</span>
                                </div>
                                <div id="resume-preview">
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