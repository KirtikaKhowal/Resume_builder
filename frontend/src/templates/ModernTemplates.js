import React from 'react';

const ModernTemplate = ({ data, colors, fonts }) => {
    const { personalInfo, skills, experience, education, projects } = data;
    
    return (
        <div className="modern-resume" style={{ fontFamily: fonts?.body || 'Inter' }}>
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r p-8 text-white" style={{ background: `linear-gradient(135deg, ${colors?.primary || '#2563EB'}, ${colors?.secondary || '#7C3AED'})` }}>
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full"></div>
                <h1 className="text-4xl font-bold mb-2">{personalInfo?.fullName || 'Your Name'}</h1>
                <p className="text-xl opacity-90">{personalInfo?.title || 'Professional Title'}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <span>📧 {personalInfo?.email}</span>
                    <span>📱 {personalInfo?.phone}</span>
                    <span>📍 {personalInfo?.address}</span>
                </div>
            </div>
            
            <div className="p-8">
                {/* Summary */}
                {personalInfo?.summary && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2" style={{ color: colors?.primary }}>Professional Summary</h3>
                        <p className="text-gray-600">{personalInfo.summary}</p>
                    </div>
                )}
                
                {/* Skills */}
                {skills?.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3" style={{ color: colors?.primary }}>Technical Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 rounded-full text-sm" style={{ background: `${colors?.primary}20`, color: colors?.primary }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Experience & Education Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-3" style={{ color: colors?.primary }}>Work Experience</h3>
                        {experience?.map((exp, i) => (
                            <div key={i} className="mb-4">
                                <p className="font-bold">{exp.jobTitle}</p>
                                <p className="text-sm text-gray-500">{exp.company} | {exp.duration}</p>
                                <p className="text-sm text-gray-600 mt-1">{exp.responsibilities}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-3" style={{ color: colors?.primary }}>Education</h3>
                        {education?.map((edu, i) => (
                            <div key={i} className="mb-4">
                                <p className="font-bold">{edu.degree}</p>
                                <p className="text-sm text-gray-500">{edu.institution}</p>
                                <p className="text-sm text-gray-500">{edu.year}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Projects */}
                {projects?.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3" style={{ color: colors?.primary }}>Key Projects</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {projects.map((project, i) => (
                                <div key={i} className="border rounded-lg p-3">
                                    <p className="font-bold">{project.name}</p>
                                    <p className="text-sm text-gray-500">{project.technologies}</p>
                                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModernTemplate;