import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const ATSScore = ({ resumeData }) => {
    const [score, setScore] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [keywords, setKeywords] = useState([]);

    useEffect(() => {
        analyzeResume();
    }, [resumeData]);

    const analyzeResume = () => {
        let totalScore = 0;
        const suggestionsList = [];
        const keywordsFound = [];

        // Check name
        if (resumeData?.personalInfo?.fullName) {
            totalScore += 10;
            keywordsFound.push('Name');
        } else {
            suggestionsList.push('Add your full name');
        }

        // Check email/contact
        if (resumeData?.personalInfo?.email) {
            totalScore += 10;
            keywordsFound.push('Contact Info');
        } else {
            suggestionsList.push('Add email and phone number');
        }

        // Check summary
        if (resumeData?.personalInfo?.summary?.length > 50) {
            totalScore += 15;
            keywordsFound.push('Professional Summary');
        } else if (resumeData?.personalInfo?.summary?.length > 0) {
            totalScore += 8;
            suggestionsList.push('Expand your summary to 50+ characters');
        } else {
            suggestionsList.push('Add a professional summary');
        }

        // Check skills
        if (resumeData?.skills?.length >= 5) {
            totalScore += 20;
            keywordsFound.push(`Skills (${resumeData.skills.length})`);
        } else if (resumeData?.skills?.length >= 3) {
            totalScore += 12;
            suggestionsList.push('Add more relevant skills (aim for 5+)');
        } else {
            suggestionsList.push('Add 5+ technical skills');
        }

        // Check experience
        if (resumeData?.experience?.length >= 2) {
            totalScore += 20;
            keywordsFound.push(`Experience (${resumeData.experience.length} positions)`);
        } else if (resumeData?.experience?.length === 1) {
            totalScore += 10;
            suggestionsList.push('Add more work experience');
        } else {
            suggestionsList.push('Add work experience');
        }

        // Check projects
        if (resumeData?.projects?.length >= 2) {
            totalScore += 15;
            keywordsFound.push(`Projects (${resumeData.projects.length})`);
        } else if (resumeData?.projects?.length === 1) {
            totalScore += 8;
            suggestionsList.push('Add one more project');
        } else {
            suggestionsList.push('Add projects to showcase your work');
        }

        // Check achievements
        if (resumeData?.achievements?.length >= 2) {
            totalScore += 10;
            keywordsFound.push(`Achievements (${resumeData.achievements.length})`);
        } else {
            suggestionsList.push('Add measurable achievements');
        }

        setScore(totalScore);
        setSuggestions(suggestionsList);
        setKeywords(keywordsFound);
    };

    const getScoreColor = () => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreMessage = () => {
        if (score >= 80) return 'Excellent! Your resume is ATS-friendly';
        if (score >= 60) return 'Good, but could be improved';
        return 'Needs improvement for better ATS results';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-purple-600" />
                ATS Resume Score
            </h3>
            
            {/* Score Circle */}
            <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            fill="none" stroke="#E5E7EB" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            fill="none" stroke={score >= 70 ? '#22C55E' : score >= 50 ? '#EAB308' : '#EF4444'} 
                            strokeWidth="3" 
                            strokeDasharray={`${score}, 100`} />
                        <text x="18" y="20.5" textAnchor="middle" className="text-2xl font-bold" fill="currentColor">
                            {score}
                        </text>
                    </svg>
                </div>
                <p className={`font-medium mt-2 ${getScoreColor()}`}>{getScoreMessage()}</p>
            </div>
            
            {/* Keywords Found */}
            <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">✅ Keywords Found</h4>
                <div className="flex flex-wrap gap-2">
                    {keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            {kw}
                        </span>
                    ))}
                </div>
            </div>
            
            {/* Suggestions */}
            {suggestions.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <AlertCircle size={14} className="text-yellow-500" />
                        Suggestions for Improvement
                    </h4>
                    <ul className="space-y-1">
                        {suggestions.map((s, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="text-yellow-500">•</span>
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* Score Tip */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                    💡 Tip: Higher ATS score means better chances of getting noticed by recruiters!
                </p>
            </div>
        </div>
    );
};

export default ATSScore;