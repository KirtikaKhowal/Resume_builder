import React, { useState } from 'react';

const predefinedSkills = [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js',
    'Node.js', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby',
    'MongoDB', 'MySQL', 'PostgreSQL', 'Firebase',
    'Express.js', 'Django', 'Flask', 'Spring Boot',
    'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure',
    'Communication', 'Leadership', 'Problem Solving', 'Teamwork'
];

const Skills = ({ data, updateData }) => {
    const [customSkill, setCustomSkill] = useState('');

    const handleSkillToggle = (skill) => {
        if (data.includes(skill)) {
            updateData(data.filter(s => s !== skill));
        } else {
            updateData([...data, skill]);
        }
    };

    const addCustomSkill = () => {
        if (customSkill.trim() && !data.includes(customSkill.trim())) {
            updateData([...data, customSkill.trim()]);
            setCustomSkill('');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Skills</h2>
            
            {/* Predefined Skills */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Select your skills:</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {predefinedSkills.map(skill => (
                        <label key={skill} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.includes(skill)}
                                onChange={() => handleSkillToggle(skill)}
                                className="w-4 h-4 text-blue-600"
                            />
                            <span>{skill}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Custom Skills */}
            <div>
                <label className="block text-sm font-medium mb-2">Add Custom Skill:</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                        placeholder="e.g., GraphQL, Redis, etc."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={addCustomSkill} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Add
                    </button>
                </div>
            </div>

            {/* Selected Skills Display */}
            {data.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Selected Skills ({data.length}):</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm flex items-center gap-2">
                                {skill}
                                <button onClick={() => handleSkillToggle(skill)} className="hover:text-red-200">×</button>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Skills;