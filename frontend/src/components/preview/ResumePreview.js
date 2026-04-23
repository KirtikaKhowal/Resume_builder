import React from 'react';

const ResumePreview = ({ data }) => {
    // Data ko safe access karne ke liye default values
    const personalInfo = data?.personalInfo || {};
    const education = data?.education || [];
    const experience = data?.experience || [];
    const projects = data?.projects || [];
    const skills = data?.skills || [];
    const achievements = data?.achievements || [];
    const template = data?.template || 'modern';
    
    // Modern Template
    const ModernTemplate = () => (
        <div className="p-6 bg-white rounded-lg shadow-lg" id="resume-preview">
            <div className="border-b-4 border-blue-500 pb-4 mb-4">
                <h2 className="text-3xl font-bold text-gray-800">{personalInfo.fullName || 'Your Name'}</h2>
                <p className="text-gray-600">{personalInfo.email || ''} {personalInfo.phone && `| ${personalInfo.phone}`} {personalInfo.address && `| ${personalInfo.address}`}</p>
                {personalInfo.summary && <p className="text-gray-700 mt-2">{personalInfo.summary}</p>}
            </div>
            
            {skills.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{skill}</span>
                        ))}
                    </div>
                </div>
            )}
            
            {experience.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">Work Experience</h3>
                    {experience.map((exp, idx) => (
                        <div key={idx} className="mb-3">
                            <p className="font-bold">{exp.jobTitle || ''} {exp.company && `at ${exp.company}`}</p>
                            <p className="text-sm text-gray-500">{exp.duration || ''}</p>
                            <p className="text-gray-700">{exp.responsibilities || ''}</p>
                        </div>
                    ))}
                </div>
            )}
            
            {education.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">Education</h3>
                    {education.map((edu, idx) => (
                        <div key={idx} className="mb-2">
                            <p className="font-bold">{edu.degree || ''}</p>
                            <p>{edu.institution || ''} {edu.year && `- ${edu.year}`}</p>
                            {edu.percentage && <p className="text-sm">Percentage: {edu.percentage}%</p>}
                        </div>
                    ))}
                </div>
            )}
            
            {projects.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">Projects</h3>
                    {projects.map((proj, idx) => (
                        <div key={idx} className="mb-2">
                            <p className="font-bold">{proj.name || ''}</p>
                            {proj.technologies && <p className="text-sm text-gray-600">{proj.technologies}</p>}
                            <p className="text-gray-700">{proj.description || ''}</p>
                        </div>
                    ))}
                </div>
            )}
            
            {achievements.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">Achievements</h3>
                    <ul className="list-disc list-inside">
                        {achievements.map((ach, idx) => (
                            <li key={idx}>{ach}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
    
    // Minimal Template
    const MinimalTemplate = () => (
        <div className="p-6 bg-gray-50 rounded-lg shadow" id="resume-preview">
            <h2 className="text-2xl font-bold text-gray-800">{personalInfo.fullName || 'Your Name'}</h2>
            <hr className="my-3 border-gray-300" />
            <p className="text-gray-600">{personalInfo.email || ''} • {personalInfo.phone || ''}</p>
            {personalInfo.address && <p className="text-gray-500 text-sm">{personalInfo.address}</p>}
            
            {skills.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-bold text-gray-700">Skills</h3>
                    <p className="text-gray-600">{skills.join(', ')}</p>
                </div>
            )}
            
            {experience.length > 0 && (
                <div className="mt-3">
                    <h3 className="font-bold text-gray-700">Experience</h3>
                    {experience.map((exp, idx) => (
                        <div key={idx} className="mt-1">
                            <p className="font-medium">{exp.jobTitle} at {exp.company}</p>
                            <p className="text-sm text-gray-500">{exp.duration}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
    
    // Creative Template
    const CreativeTemplate = () => (
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow" id="resume-preview">
            <div className="text-center border-b-2 border-purple-300 pb-4">
                <h2 className="text-3xl font-bold text-purple-700">{personalInfo.fullName || 'Your Name'}</h2>
                <p className="text-purple-600">{personalInfo.email || ''}</p>
                {personalInfo.phone && <p className="text-purple-500 text-sm">{personalInfo.phone}</p>}
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-bold text-pink-600 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 6).map((s, i) => (
                            <span key={i} className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-sm">{s}</span>
                        ))}
                    </div>
                    
                    {education.length > 0 && (
                        <div className="mt-3">
                            <h3 className="font-bold text-pink-600 mb-1">Education</h3>
                            {education.map((edu, i) => (
                                <p key={i} className="text-sm">{edu.degree} - {edu.institution}</p>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-pink-600 mb-2">Experience</h3>
                    <p className="text-sm">{experience.length} position{experience.length !== 1 ? 's' : ''}</p>
                    {projects.length > 0 && (
                        <div className="mt-3">
                            <h3 className="font-bold text-pink-600 mb-1">Projects</h3>
                            <p className="text-sm">{projects.length} projects completed</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
    
    // Template selector
    if (template === 'minimal') return <MinimalTemplate />;
    if (template === 'creative') return <CreativeTemplate />;
    return <ModernTemplate />;
};

export default ResumePreview;