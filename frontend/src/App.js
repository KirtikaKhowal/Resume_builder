import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [darkMode, setDarkMode] = useState(true);
    const [page, setPage] = useState('dashboard');
    const [tab, setTab] = useState('edit');
    const [resumes, setResumes] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const [form, setForm] = useState({
        fullName: '',
        title: '',
        email: '',
        phone: '',
        summary: '',
        skills: [],
        experience: []
    });
    
    const [newSkill, setNewSkill] = useState('');
    const [newExp, setNewExp] = useState({ title: '', company: '', duration: '' });
    const [showExpForm, setShowExpForm] = useState(false);
    
    // Color Palette State
    const [template, setTemplate] = useState('modern');
    const [primaryColor, setPrimaryColor] = useState('#8B5CF6');
    const [secondaryColor, setSecondaryColor] = useState('#EC4899');
    const [accentColor, setAccentColor] = useState('#06B6D4');
    const [bgColor, setBgColor] = useState('#1a1a2e');
    const [textColor] = useState('#FFFFFF');
    
    // Predefined Color Palettes
    const colorPalettes = [
        { name: 'Purple Dream', primary: '#8B5CF6', secondary: '#EC4899', accent: '#06B6D4', bg: '#1a1a2e' },
        { name: 'Ocean Breeze', primary: '#3B82F6', secondary: '#06B6D4', accent: '#10B981', bg: '#0f172a' },
        { name: 'Sunset Glow', primary: '#F59E0B', secondary: '#EF4444', accent: '#EC4899', bg: '#1e1b4b' },
        { name: 'Forest Night', primary: '#10B981', secondary: '#059669', accent: '#F59E0B', bg: '#064e3b' },
        { name: 'Royal Luxury', primary: '#8B5CF6', secondary: '#D946EF', accent: '#F43F5E', bg: '#0c0a2a' },
        { name: 'Midnight Blue', primary: '#1E3A8A', secondary: '#3B82F6', accent: '#06B6D4', bg: '#030712' },
        { name: 'Coral Reef', primary: '#F97316', secondary: '#FB923C', accent: '#EC4899', bg: '#1c1917' },
        { name: 'Teal Magic', primary: '#14B8A6', secondary: '#5EEAD4', accent: '#8B5CF6', bg: '#042f2e' },
        { name: 'Rose Gold', primary: '#F43F5E', secondary: '#FB7185', accent: '#FDE047', bg: '#1c1917' },
        { name: 'Monochrome', primary: '#6B7280', secondary: '#9CA3AF', accent: '#D1D5DB', bg: '#111827' }
    ];

    useEffect(() => {
        fetchResumes();
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const fetchResumes = async () => {
        try {
            const res = await axios.get('https://resume-builder-1-lb0b.onrender.com/api/resumes');
            setResumes(res.data);
        } catch (err) { console.log(err); }
    };

    const addSkill = () => {
        if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
            setForm({ ...form, skills: [...form.skills, newSkill.trim()] });
            setNewSkill('');
        }
    };

    const removeSkill = (skill) => {
        setForm({ ...form, skills: form.skills.filter(s => s !== skill) });
    };

    const addExp = () => {
        if (newExp.title && newExp.company) {
            setForm({ ...form, experience: [...form.experience, { ...newExp }] });
            setNewExp({ title: '', company: '', duration: '' });
            setShowExpForm(false);
        }
    };

    const removeExp = (idx) => {
        setForm({ ...form, experience: form.experience.filter((_, i) => i !== idx) });
    };

    const saveResume = async () => {
        await axios.post('https://resume-builder-1-lb0b.onrender.com/api/resumes', form);
        alert('✅ Resume saved!');
        fetchResumes();
        setPage('dashboard');
    };

    const analyzeResume = async () => {
        if (form.skills.length === 0) {
            alert('Add some skills first!');
            return;
        }
        setAnalyzing(true);
        try {
            const res = await axios.post('https://resume-builder-1-lb0b.onrender.com/api/analyze', { skills: form.skills });
            setAnalysis(res.data);
            setTab('analyze');
        } catch (err) { alert('Analysis failed'); }
        setAnalyzing(false);
    };

    const exportPDF = () => {
        const content = document.getElementById('preview').innerHTML;
        const original = document.body.innerHTML;
        document.body.innerHTML = content;
        window.print();
        document.body.innerHTML = original;
        window.location.reload();
    };

    // ============ TEMPLATES ============
    
    // Template 1: Modern
    const ModernTemplate = () => (
        <div className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-300" style={{ background: bgColor }}>
            <div className="p-8" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                <h1 className="text-4xl font-bold" style={{ color: textColor }}>{form.fullName || 'Sarah Johnson'}</h1>
                <p className="text-xl mt-2" style={{ color: `${textColor}cc` }}>{form.title || 'Senior Full Stack Developer'}</p>
                <div className="flex flex-wrap gap-6 mt-6 text-sm" style={{ color: `${textColor}cc` }}>
                    <span>📧 {form.email || 'sarah@example.com'}</span>
                    <span>📱 {form.phone || '+1 234 567 8900'}</span>
                </div>
            </div>
            <div className="p-8">
                {form.summary && <p className="mb-6 leading-relaxed" style={{ color: `${textColor}99` }}>{form.summary}</p>}
                {form.skills.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: primaryColor }}>⚡ Core Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {form.skills.map((s, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-xl text-sm font-medium" style={{ background: `${primaryColor}20`, color: primaryColor, border: `1px solid ${primaryColor}40` }}>{s}</span>
                            ))}
                        </div>
                    </div>
                )}
                {form.experience.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: primaryColor }}>💼 Experience</h3>
                        {form.experience.map((exp, i) => (
                            <div key={i} className="mb-3 p-3 rounded-xl" style={{ background: `${primaryColor}10` }}>
                                <span className="font-semibold" style={{ color: textColor }}>{exp.title}</span>
                                <span className="ml-2" style={{ color: `${textColor}99` }}>at {exp.company}</span>
                                <span className="ml-2 text-sm" style={{ color: `${textColor}66` }}>({exp.duration})</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // Template 2: Professional (Sidebar Layout)
    const ProfessionalTemplate = () => (
        <div className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-300" style={{ background: bgColor }}>
            <div className="grid md:grid-cols-3">
                <div className="p-8" style={{ background: primaryColor }}>
                    <h2 className="text-2xl font-bold" style={{ color: textColor }}>{form.fullName || 'Sarah Johnson'}</h2>
                    <p className="mt-2 text-sm" style={{ color: `${textColor}cc` }}>{form.title || 'Developer'}</p>
                    <hr className="my-6" style={{ borderColor: `${textColor}30` }} />
                    <div className="space-y-3 text-sm" style={{ color: `${textColor}cc` }}>
                        <p>📧 {form.email || 'sarah@example.com'}</p>
                        <p>📱 {form.phone || '+1 234 567 8900'}</p>
                    </div>
                </div>
                <div className="col-span-2 p-8">
                    <p className="mb-6 leading-relaxed" style={{ color: `${textColor}99` }}>{form.summary || 'Professional summary goes here...'}</p>
                    {form.skills.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: primaryColor }}>Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {form.skills.map((s, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-xl text-sm font-medium" style={{ background: `${primaryColor}15`, color: primaryColor }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Template 3: Creative (Unique Layout)
    const CreativeTemplate = () => (
        <div className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-300" style={{ background: bgColor }}>
            <div className="relative p-8" style={{ background: `linear-gradient(135deg, ${bgColor}, ${primaryColor}20)` }}>
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: secondaryColor }}></div>
                <div className="relative">
                    <h1 className="text-5xl font-bold" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{form.fullName || 'Sarah Johnson'}</h1>
                    <p className="text-xl mt-2" style={{ color: `${textColor}cc` }}>{form.title || 'Creative Professional'}</p>
                </div>
            </div>
            <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: accentColor }}>Contact</h3>
                        <div className="space-y-2 text-sm" style={{ color: `${textColor}99` }}>
                            <p>{form.email || 'sarah@example.com'}</p>
                            <p>{form.phone || '+1 234 567 8900'}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: accentColor }}>About</h3>
                        <p className="leading-relaxed" style={{ color: `${textColor}99` }}>{form.summary || 'Creative professional with a passion for design...'}</p>
                    </div>
                </div>
                {form.skills.length > 0 && (
                    <div className="mt-8 pt-6 border-t" style={{ borderColor: `${primaryColor}30` }}>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: accentColor }}>Skills & Tools</h3>
                        <div className="flex flex-wrap gap-2">
                            {form.skills.map((s, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}>{s}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Template 4: Minimal
    const MinimalTemplate = () => (
        <div className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 border" style={{ background: bgColor, borderColor: `${primaryColor}30` }}>
            <div className="p-8 text-center border-b" style={{ borderColor: `${primaryColor}20` }}>
                <h1 className="text-3xl font-light" style={{ color: textColor }}>{form.fullName || 'Sarah Johnson'}</h1>
                <p className="text-sm mt-1" style={{ color: `${textColor}80` }}>{form.title || 'Professional'}</p>
            </div>
            <div className="p-8">
                {form.summary && <p className="text-center text-sm mb-6" style={{ color: `${textColor}80` }}>{form.summary}</p>}
                {form.skills.length > 0 && (
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {form.skills.map((s, i) => (
                                <span key={i} className="px-2 py-1 text-xs" style={{ color: primaryColor }}>{s}</span>
                            ))}
                        </div>
                    </div>
                )}
                <div className="text-center text-xs" style={{ color: `${textColor}60` }}>
                    <span>{form.email}</span> <span className="mx-2">•</span> <span>{form.phone}</span>
                </div>
            </div>
        </div>
    );

    // Template 5: Dark Elegant
    const DarkTemplate = () => (
        <div className="rounded-2xl shadow-2xl overflow-hidden transition-all duration-300" style={{ background: '#0a0a0a' }}>
            <div className="p-8">
                <h1 className="text-4xl font-bold" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{form.fullName || 'Sarah Johnson'}</h1>
                <p className="text-gray-400 mt-2">{form.title || 'Digital Architect'}</p>
                <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-500">
                    <span>{form.email || 'sarah@example.com'}</span>
                    <span>{form.phone || '+1 234 567 8900'}</span>
                </div>
            </div>
            <div className="p-8 pt-0">
                {form.summary && <p className="text-gray-400 mb-6">{form.summary}</p>}
                {form.skills.length > 0 && (
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            {form.skills.map((s, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-full text-sm" style={{ background: `${primaryColor}20`, color: primaryColor }}>{s}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const getTemplate = () => {
        switch(template) {
            case 'professional': return <ProfessionalTemplate />;
            case 'creative': return <CreativeTemplate />;
            case 'minimal': return <MinimalTemplate />;
            case 'dark': return <DarkTemplate />;
            default: return <ModernTemplate />;
        }
    };

    // Dashboard View
    if (page === 'dashboard') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">✨ AI Resume Builder</h1>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-gray-800 text-yellow-400 hover:bg-gray-700 transition">{darkMode ? '☀️' : '🌙'}</button>
                            <button onClick={() => { setForm({ fullName: '', title: '', email: '', phone: '', summary: '', skills: [], experience: [] }); setAnalysis(null); setPage('builder'); }} className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition">✨ New Resume</button>
                        </div>
                    </div>
                </nav>
                <div className="max-w-6xl mx-auto p-6">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">My Resume Portfolio</h2>
                        <p className="text-gray-400 mt-2">Manage and edit your professional resumes</p>
                    </div>
                    {resumes.length === 0 ? (
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-16 text-center border border-gray-700">
                            <div className="text-6xl mb-4">📄</div>
                            <p className="text-gray-400 mb-4">No resumes yet. Create your first resume!</p>
                            <button onClick={() => setPage('builder')} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold">Create Resume</button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resumes.map(r => (
                                <div key={r.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all cursor-pointer hover:scale-105" onClick={() => { setForm(r); setAnalysis(null); setPage('builder'); }}>
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl mb-3">📄</div>
                                    <h3 className="text-xl font-bold text-white">{r.fullName || 'Untitled Resume'}</h3>
                                    <p className="text-gray-400 text-sm mt-1">{r.skills?.length || 0} skills</p>
                                    <div className="flex flex-wrap gap-1 mt-3">{r.skills?.slice(0, 3).map(s => (<span key={s} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">{s}</span>))}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Builder View
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <button onClick={() => setPage('dashboard')} className="text-purple-400 hover:text-purple-300 flex items-center gap-2">← Dashboard</button>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Resume Studio</h1>
                    <div className="flex gap-3">
                        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-gray-800 text-yellow-400">{darkMode ? '☀️' : '🌙'}</button>
                        <button onClick={saveResume} className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold">💾 Save</button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6">
                <div className="flex flex-wrap gap-3 mb-8 bg-gray-800/50 backdrop-blur-sm p-2 rounded-2xl w-fit border border-gray-700">
                    {[
                        { id: 'edit', label: 'Edit Resume', icon: '✏️' },
                        { id: 'templates', label: ' Templates & Colors', icon: '🎨' },
                        { id: 'analyze', label: 'AI Analysis', icon: '🤖' },
                        { id: 'export', label: 'Export', icon: '📥' }
                    ].map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)} className={`px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${tab === t.id ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>
                            <span>{t.icon}</span> {t.label}
                        </button>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Panel */}
                    <div className="space-y-6">
                        {tab === 'edit' && (
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">📋 Personal Information</h2>
                                <input type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl mb-3 focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-500" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                                <input type="text" placeholder="Professional Title" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl mb-3 focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-500" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl mb-3 focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-500" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                <input type="text" placeholder="Phone" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl mb-3 focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-500" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                <textarea placeholder="Professional Summary" rows="3" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-500" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} />

                                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-6 mb-4">⚡ Technical Skills</h2>
                                <div className="flex gap-2 mb-3">
                                    <input type="text" placeholder="Add a skill (React, Python, etc.)" className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-500" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyPress={e => e.key === 'Enter' && addSkill()} />
                                    <button onClick={addSkill} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition">Add</button>
                                </div>
                                <div className="flex flex-wrap gap-2 min-h-[60px]">
                                    {form.skills.map(s => (
                                        <span key={s} className="px-3 py-1.5 rounded-xl text-sm flex items-center gap-2" style={{ background: `${primaryColor}20`, color: primaryColor, border: `1px solid ${primaryColor}40` }}>
                                            {s} <button onClick={() => removeSkill(s)} className="hover:text-red-400">×</button>
                                        </span>
                                    ))}
                                </div>

                                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mt-6 mb-4">💼 Work Experience</h2>
                                {form.experience.map((exp, i) => (
                                    <div key={i} className="bg-gray-900/50 p-3 rounded-xl mb-2 flex justify-between items-center border border-gray-700">
                                        <div><span className="font-semibold text-white">{exp.title}</span> <span className="text-gray-400">at {exp.company}</span> <span className="text-gray-500 text-sm">({exp.duration})</span></div>
                                        <button onClick={() => removeExp(i)} className="text-red-400 hover:text-red-300">Delete</button>
                                    </div>
                                ))}
                                {showExpForm ? (
                                    <div className="border border-purple-500/30 bg-gray-900 p-4 rounded-xl">
                                        <input type="text" placeholder="Job Title" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl mb-2 text-white" value={newExp.title} onChange={e => setNewExp({ ...newExp, title: e.target.value })} />
                                        <input type="text" placeholder="Company" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl mb-2 text-white" value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} />
                                        <input type="text" placeholder="Duration" className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl mb-2 text-white" value={newExp.duration} onChange={e => setNewExp({ ...newExp, duration: e.target.value })} />
                                        <div className="flex gap-2">
                                            <button onClick={addExp} className="px-4 py-2 bg-purple-600 text-white rounded-xl">Save</button>
                                            <button onClick={() => setShowExpForm(false)} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-xl">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={() => setShowExpForm(true)} className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1">+ Add Experience</button>
                                )}
                            </div>
                        )}

                        {tab === 'templates' && (
                            <div className="space-y-6">
                                {/* Template Selection */}
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">🎨 Choose Template</h2>
                                    <p className="text-gray-400 mb-4">Select a design that matches your style</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                                        {[
                                            { id: 'modern', name: 'Modern', icon: '✨', desc: 'Gradient header, clean layout', preview: '🎨' },
                                            { id: 'professional', name: 'Professional', icon: '💼', desc: 'Sidebar, corporate style', preview: '📊' },
                                            { id: 'creative', name: 'Creative', icon: '🎨', desc: 'Bold, artistic design', preview: '🌟' },
                                            { id: 'minimal', name: 'Minimal', icon: '📄', desc: 'Simple, elegant, clean', preview: '✨' },
                                            { id: 'dark', name: 'Dark Elegant', icon: '🌙', desc: 'Dark theme, modern', preview: '🌙' }
                                        ].map(t => (
                                            <button key={t.id} onClick={() => setTemplate(t.id)} className={`p-4 rounded-xl border-2 transition-all text-left ${template === t.id ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 hover:border-purple-500/50'}`}>
                                                <div className="text-3xl mb-2">{t.icon}</div>
                                                <div className="font-semibold text-white">{t.name}</div>
                                                <div className="text-xs text-gray-500 mt-1">{t.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Full Color Palette */}
                                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">🎨 Complete Color Palette</h2>
                                    
                                    {/* Color Picker Grid */}
                                    <div className="mb-6">
                                        <p className="text-gray-400 mb-3 text-sm">Custom Colors</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-500">Primary Color</label>
                                                <div className="flex gap-2">
                                                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border border-gray-600" />
                                                    <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">{primaryColor}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-500">Secondary Color</label>
                                                <div className="flex gap-2">
                                                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border border-gray-600" />
                                                    <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">{secondaryColor}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-500">Accent Color</label>
                                                <div className="flex gap-2">
                                                    <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border border-gray-600" />
                                                    <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">{accentColor}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-500">Background Color</label>
                                                <div className="flex gap-2">
                                                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 rounded-lg cursor-pointer border border-gray-600" />
                                                    <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">{bgColor}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Predefined Palettes */}
                                    <div>
                                        <p className="text-gray-400 mb-3 text-sm">🎨 Predefined Palettes</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                            {colorPalettes.map((palette, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        setPrimaryColor(palette.primary);
                                                        setSecondaryColor(palette.secondary);
                                                        setAccentColor(palette.accent);
                                                        setBgColor(palette.bg);
                                                    }}
                                                    className="p-3 rounded-xl border border-gray-700 hover:scale-105 transition-all text-left"
                                                >
                                                    <div className="flex gap-1 mb-2">
                                                        <div className="w-6 h-6 rounded-full" style={{ background: palette.primary }}></div>
                                                        <div className="w-6 h-6 rounded-full" style={{ background: palette.secondary }}></div>
                                                        <div className="w-6 h-6 rounded-full" style={{ background: palette.accent }}></div>
                                                        <div className="w-6 h-6 rounded-full" style={{ background: palette.bg }}></div>
                                                    </div>
                                                    <p className="text-xs text-white">{palette.name}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Color Quick Select */}
                                    <div className="mt-6 pt-4 border-t border-gray-700">
                                        <p className="text-gray-400 mb-3 text-sm">🌈 Quick Colors</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['#8B5CF6', '#EC4899', '#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#F97316', '#14B8A6', '#D946EF', '#6B7280', '#000000', '#FFFFFF'].map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => setPrimaryColor(c)}
                                                    className="w-8 h-8 rounded-full border-2 border-gray-600 transition-transform hover:scale-110"
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Reset Button */}
                                    <button
                                        onClick={() => {
                                            setPrimaryColor('#8B5CF6');
                                            setSecondaryColor('#EC4899');
                                            setAccentColor('#06B6D4');
                                            setBgColor('#1a1a2e');
                                        }}
                                        className="mt-4 px-4 py-2 bg-gray-700 text-gray-300 rounded-xl text-sm hover:bg-gray-600 transition"
                                    >
                                        Reset to Default
                                    </button>
                                </div>
                            </div>
                        )}

                        {tab === 'analyze' && (
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">🤖 AI Resume Analyzer</h2>
                                <p className="text-gray-400 mb-4">Get personalized job recommendations and skill improvement tips</p>
                                <button onClick={analyzeResume} disabled={analyzing || form.skills.length === 0} className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50">
                                    {analyzing ? '🔍 Analyzing...' : '🔍 Analyze My Resume'}
                                </button>
                                {form.skills.length === 0 && <p className="text-amber-500 text-sm mt-2 text-center">⚠️ Add some skills first to get accurate analysis!</p>}
                                {analysis && (
                                    <div className="mt-6 space-y-5">
                                        <div className="text-center p-5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
                                            <div className="text-7xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{analysis.resumeScore}</div>
                                            <p className="text-gray-400 mt-1">Resume Score</p>
                                            <div className="w-full bg-gray-700 rounded-full h-2 mt-3"><div className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${analysis.resumeScore}%` }}></div></div>
                                        </div>
                                        {analysis.recommendedSkills?.length > 0 && (
                                            <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/30">
                                                <h3 className="font-bold text-blue-400 mb-2">📚 Skills to Learn</h3>
                                                <div className="flex flex-wrap gap-2">{analysis.recommendedSkills.map(s => <span key={s} className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-xl text-sm">{s}</span>)}</div>
                                            </div>
                                        )}
                                        <div><h3 className="font-bold text-white mb-3">🎯 Top Job Matches</h3>
                                            {analysis.topRecommendations?.map((r, i) => (
                                                <div key={i} className="p-4 bg-gray-900/50 rounded-xl mb-3 border border-gray-700">
                                                    <div className="flex justify-between items-center mb-2"><span className="font-bold text-white text-lg">{r.title}</span><span className="text-purple-400 font-semibold">{r.matchPercentage}%</span></div>
                                                    <p className="text-sm text-gray-400 mb-2">{r.description}</p>
                                                    <div className="flex flex-wrap gap-2 text-xs"><span className="text-green-400">💰 {r.salary}</span><span className="text-blue-400">📈 {r.demand}</span></div>
                                                    {r.matchedSkills?.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{r.matchedSkills.map(s => <span key={s} className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full text-xs">{s}</span>)}</div>}
                                                    {r.missingSkills?.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{r.missingSkills.slice(0, 4).map(s => <span key={s} className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded-full text-xs">{s}</span>)}</div>}
                                                </div>
                                            ))}
                                        </div>
                                        {analysis.suggestions?.length > 0 && (<div className="p-4 bg-amber-500/10 rounded-2xl"><h3 className="font-bold text-amber-400 mb-2">💡 Tips</h3><ul className="space-y-1">{analysis.suggestions.map((s, i) => <li key={i} className="text-sm text-gray-300">• {s}</li>)}</ul></div>)}
                                    </div>
                                )}
                            </div>
                        )}

                        {tab === 'export' && (
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">📥 Export & Save</h2>
                                <button onClick={exportPDF} className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl mb-3 font-semibold hover:shadow-lg transition">📄 Download PDF</button>
                                <button onClick={saveResume} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition">💾 Save to Dashboard</button>
                            </div>
                        )}
                    </div>

                    {/* Right Panel - Live Preview */}
                    <div className="sticky top-24">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700">
                            <div className="bg-gray-900/80 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                                <span className="font-semibold text-white">👁️ Live Preview - {template.charAt(0).toUpperCase() + template.slice(1)} Template</span>
                                <div className="flex gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                            </div>
                            <div id="preview" className="p-6">
                                {getTemplate()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;