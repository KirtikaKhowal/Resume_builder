import React from 'react';

const ProfessionalTemplate = ({ data, colors }) => {
    const { personalInfo, skills, experience, education, projects } = data;
    
    return (
        <div className="professional-resume max-w-4xl mx-auto bg-white shadow-xl">
            {/* Sidebar layout */}
            <div className="flex">
                {/* Left Sidebar */}
                <div className="w-1/3 p-6" style={{ background: colors?.sidebar || '#1E293B' }}>
                    <div className="text-center mb-6">
                        <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                            {personalInfo?.fullName?.charAt(0) || 'Y'}
                        </div>
                        <h2 className="text-white text-xl font-bold mt-4">{personalInfo?.fullName}</h2>
                        <p className="text-white/70 text-sm">{personalInfo?.title}</p>
                    </div>
                    
                    <div className="text-white/90 text-sm space-y-4">
                        <div>
                            <h3 className="font-semibold text-white mb-2">Contact</h3>
                            <p>📧 {personalInfo?.email}</p>
                            <p>📱 {personalInfo?.phone}</p>
                            <p>📍 {personalInfo?.address}</p>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold text-white mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-1">
                                {skills?.slice(0, 8).map((skill, i) => (
                                    <span key={i} className="px-2 py-1 bg-white/20 rounded text-xs">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Content */}
                <div className="w-2/3 p-6">
                    {personalInfo?.summary && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2" style={{ color: colors?.primary }}>Profile</h3>
                            <p className="text-gray-600 text-sm">{personalInfo.summary}</p>
                        </div>
                    )}
                    
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3" style={{ color: colors?.primary }}>Experience</h3>
                        {experience?.map((exp, i) => (
                            <div key={i} className="mb-4">
                                <p className="font-bold text-gray-800">{exp.jobTitle}</p>
                                <p className="text-sm text-gray-500">{exp.company} | {exp.duration}</p>
                                <p className="text-sm text-gray-600 mt-1">{exp.responsibilities}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-3" style={{ color: colors?.primary }}>Education</h3>
                        {education?.map((edu, i) => (
                            <div key={i} className="mb-3">
                                <p className="font-bold text-gray-800">{edu.degree}</p>
                                <p className="text-sm text-gray-500">{edu.institution}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessionalTemplate;