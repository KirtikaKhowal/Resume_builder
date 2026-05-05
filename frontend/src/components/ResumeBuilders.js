import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResumeBuilders = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        personalInfo: { fullName: '', email: '', phone: '', address: '', summary: '' },
        skills: [],
        education: [],
        experience: [],
        projects: []
    });

    const [customSkill, setCustomSkill] = useState('');
    const [showEducationForm, setShowEducationForm] = useState(false);
    const [showExperienceForm, setShowExperienceForm] = useState(false);
    const [newEducation, setNewEducation] = useState({ degree: '', institution: '', year: '' });
    const [newExperience, setNewExperience] = useState({ jobTitle: '', company: '', duration: '', responsibilities: '' });

    const predefinedSkills = [
        'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python', 
        'Java', 'MongoDB', 'SQL', 'Git', 'TypeScript', 'Tailwind CSS'
    ];

    const handleSkillToggle = (skill) => {
        if (formData.skills.includes(skill)) {
            setFormData({...formData, skills: formData.skills.filter(s => s !== skill)});
        } else {
            setFormData({...formData, skills: [...formData.skills, skill]});
        }
    };

    const addCustomSkill = () => {
        if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
            setFormData({...formData, skills: [...formData.skills, customSkill.trim()]});
            setCustomSkill('');
        }
    };

    const addEducation = () => {
        if (newEducation.degree && newEducation.institution) {
            setFormData({...formData, education: [...formData.education, { ...newEducation }]});
            setNewEducation({ degree: '', institution: '', year: '' });
            setShowEducationForm(false);
        }
    };

    const addExperience = () => {
        if (newExperience.jobTitle && newExperience.company) {
            setFormData({...formData, experience: [...formData.experience, { ...newExperience }]});
            setNewExperience({ jobTitle: '', company: '', duration: '', responsibilities: '' });
            setShowExperienceForm(false);
        }
    };

    const removeEducation = (index) => {
        setFormData({...formData, education: formData.education.filter((_, i) => i !== index)});
    };

    const removeExperience = (index) => {
        setFormData({...formData, experience: formData.experience.filter((_, i) => i !== index)});
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://resume-builder-1-hf4l.onrender.com/api/resume/save', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('✅ Resume saved successfully!');
            navigate('/dashboard');
        } catch (error) {
            alert('❌ Error saving resume: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate('/dashboard')} className="text-blue-600 mb-4">← Back to Dashboard</button>
                
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Panel - Form */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h1 className="text-2xl font-bold mb-6">Build Your Resume</h1>
                        
                        {/* Personal Info */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-3">Personal Information</h2>
                            <input type="text" placeholder="Full Name" className="w-full p-2 border rounded mb-2"
                                value={formData.personalInfo.fullName}
                                onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, fullName: e.target.value}})} />
                            <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-2"
                                value={formData.personalInfo.email}
                                onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, email: e.target.value}})} />
                            <input type="text" placeholder="Phone" className="w-full p-2 border rounded mb-2"
                                value={formData.personalInfo.phone}
                                onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, phone: e.target.value}})} />
                            <textarea placeholder="Professional Summary" rows="3" className="w-full p-2 border rounded"
                                value={formData.personalInfo.summary}
                                onChange={(e) => setFormData({...formData, personalInfo: {...formData.personalInfo, summary: e.target.value}})} />
                        </div>
                        
                        {/* Skills */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-3">Skills</h2>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {predefinedSkills.map(skill => (
                                    <button key={skill} type="button"
                                        onClick={() => handleSkillToggle(skill)}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            formData.skills.includes(skill) ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                        }`}>
                                        {skill}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Custom skill" className="flex-1 p-2 border rounded"
                                    value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} />
                                <button onClick={addCustomSkill} className="px-4 py-2 bg-green-500 text-white rounded">Add</button>
                            </div>
                            {formData.skills.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {formData.skills.map(skill => (
                                        <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Education */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-3">Education</h2>
                            {formData.education.map((edu, i) => (
                                <div key={i} className="bg-gray-50 p-2 rounded mb-2 flex justify-between">
                                    <div><strong>{edu.degree}</strong> - {edu.institution} ({edu.year})</div>
                                    <button onClick={() => removeEducation(i)} className="text-red-500">Delete</button>
                                </div>
                            ))}
                            {showEducationForm ? (
                                <div className="border p-3 rounded">
                                    <input type="text" placeholder="Degree" className="w-full p-2 border rounded mb-2"
                                        value={newEducation.degree} onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})} />
                                    <input type="text" placeholder="Institution" className="w-full p-2 border rounded mb-2"
                                        value={newEducation.institution} onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})} />
                                    <input type="text" placeholder="Year" className="w-full p-2 border rounded mb-2"
                                        value={newEducation.year} onChange={(e) => setNewEducation({...newEducation, year: e.target.value})} />
                                    <div className="flex gap-2">
                                        <button onClick={addEducation} className="px-3 py-1 bg-blue-500 text-white rounded">Save</button>
                                        <button onClick={() => setShowEducationForm(false)} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setShowEducationForm(true)} className="text-blue-500 text-sm">+ Add Education</button>
                            )}
                        </div>
                        
                        {/* Experience */}
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-3">Work Experience</h2>
                            {formData.experience.map((exp, i) => (
                                <div key={i} className="bg-gray-50 p-2 rounded mb-2">
                                    <div className="flex justify-between">
                                        <strong>{exp.jobTitle} at {exp.company}</strong>
                                        <button onClick={() => removeExperience(i)} className="text-red-500">Delete</button>
                                    </div>
                                    <div className="text-sm text-gray-500">{exp.duration}</div>
                                </div>
                            ))}
                            {showExperienceForm ? (
                                <div className="border p-3 rounded">
                                    <input type="text" placeholder="Job Title" className="w-full p-2 border rounded mb-2"
                                        value={newExperience.jobTitle} onChange={(e) => setNewExperience({...newExperience, jobTitle: e.target.value})} />
                                    <input type="text" placeholder="Company" className="w-full p-2 border rounded mb-2"
                                        value={newExperience.company} onChange={(e) => setNewExperience({...newExperience, company: e.target.value})} />
                                    <input type="text" placeholder="Duration" className="w-full p-2 border rounded mb-2"
                                        value={newExperience.duration} onChange={(e) => setNewExperience({...newExperience, duration: e.target.value})} />
                                    <textarea placeholder="Responsibilities" rows="2" className="w-full p-2 border rounded mb-2"
                                        value={newExperience.responsibilities} onChange={(e) => setNewExperience({...newExperience, responsibilities: e.target.value})} />
                                    <div className="flex gap-2">
                                        <button onClick={addExperience} className="px-3 py-1 bg-blue-500 text-white rounded">Save</button>
                                        <button onClick={() => setShowExperienceForm(false)} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setShowExperienceForm(true)} className="text-blue-500 text-sm">+ Add Experience</button>
                            )}
                        </div>
                        
                        <button onClick={handleSave} className="w-full py-3 bg-green-600 text-white rounded-lg mt-4">
                            💾 Save Resume
                        </button>
                    </div>
                    
                    {/* Right Panel - Live Preview */}
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 h-fit">
                        <h2 className="text-xl font-bold mb-4">📄 Live Preview</h2>
                        <div className="border-t pt-4">
                            <h3 className="text-2xl font-bold">{formData.personalInfo.fullName || 'Your Name'}</h3>
                            <p className="text-gray-600">{formData.personalInfo.email}</p>
                            <p className="text-gray-600">{formData.personalInfo.phone}</p>
                            <hr className="my-3" />
                            <p className="text-gray-700">{formData.personalInfo.summary || 'No summary added'}</p>
                            <hr className="my-3" />
                            <h4 className="font-semibold">Skills</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {formData.skills.map(s => (
                                    <span key={s} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">{s}</span>
                                ))}
                            </div>
                            <hr className="my-3" />
                            <h4 className="font-semibold">Education</h4>
                            {formData.education.map((edu, i) => (
                                <div key={i} className="text-sm"><strong>{edu.degree}</strong> - {edu.institution} ({edu.year})</div>
                            ))}
                            <hr className="my-3" />
                            <h4 className="font-semibold">Experience</h4>
                            {formData.experience.map((exp, i) => (
                                <div key={i} className="text-sm"><strong>{exp.jobTitle}</strong> at {exp.company} ({exp.duration})</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilders;