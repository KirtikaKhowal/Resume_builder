import React, { useState } from 'react';
import axios from 'axios';

const ResumeAnalysis = ({ skills, experience, projects, education, token }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);

    const analyzeResume = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/analyze', {
                skills: skills || [],
                experience: experience || [],
                projects: projects || [],
                education: education || []
            });
            setAnalysis(response.data);
            setShowAnalysis(true);
        } catch (error) {
            console.error('Analysis error:', error);
            alert('Error analyzing resume: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (!showAnalysis) {
        return (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-6">
                <div className="text-center">
                    <div className="text-5xl mb-4">🤖</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">AI Resume Analyzer</h3>
                    <p className="text-gray-600 mb-4">Get AI-powered job recommendations based on your skills</p>
                    <p className="text-sm text-gray-500 mb-4">Currently analyzing: {skills?.length || 0} skills, {experience?.length || 0} experiences</p>
                    <button 
                        onClick={analyzeResume}
                        disabled={loading || !skills?.length}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
                    >
                        {loading ? '🔍 Analyzing...' : '🔍 Analyze My Resume'}
                    </button>
                    {!skills?.length && (
                        <p className="text-xs text-orange-500 mt-2">⚠️ Add some skills first to get accurate analysis!</p>
                    )}
                </div>
            </div>
        );
    }

    const getScoreColor = (score) => {
        if (score >= 70) return 'text-green-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBg = (score) => {
        if (score >= 70) return 'bg-green-500';
        if (score >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-6">
            {/* Analysis Results */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold text-gray-800">📊 Resume Analysis Report</h3>
                    <button onClick={() => setShowAnalysis(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                {/* Score Circle */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={getScoreBg(analysis.resumeScore)} strokeWidth="3" strokeDasharray={`${analysis.resumeScore}, 100`} />
                            <text x="18" y="20.5" textAnchor="middle" className="text-2xl font-bold" fill="currentColor">{analysis.resumeScore}</text>
                        </svg>
                    </div>
                    <p className={`font-bold mt-2 ${getScoreColor(analysis.resumeScore)}`}>
                        {analysis.resumeScore >= 70 ? 'Excellent Resume!' : analysis.resumeScore >= 50 ? 'Good Resume!' : 'Needs Improvement'}
                    </p>
                    <p className="text-sm text-gray-500">Resume Score</p>
                </div>
                
                {/* Job Market Fit */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Job Market Fit</span>
                        <span className={`font-bold ${
                            analysis.summary?.jobMarketFit === 'Excellent' ? 'text-green-600' :
                            analysis.summary?.jobMarketFit === 'Good' ? 'text-yellow-600' : 'text-red-600'
                        }`}>{analysis.summary?.jobMarketFit || 'Needs Improvement'}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">Total Skills: {analysis.summary?.totalSkills || 0}</div>
                </div>
                
                {/* Suggestions */}
                {analysis.suggestions && analysis.suggestions.length > 0 && (
                    <div className="mb-6">
                        <h4 className="font-semibold text-orange-600 mb-2">⚠️ Improvement Suggestions</h4>
                        <ul className="space-y-1">
                            {analysis.suggestions.map((s, i) => (
                                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                    <span className="text-orange-500">•</span> {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            
            {/* Top Job Recommendations */}
            {analysis.topRecommendations && analysis.topRecommendations.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Top Job Recommendations</h3>
                    <div className="space-y-4">
                        {analysis.topRecommendations.map((role, idx) => (
                            <div key={idx} className={`border-2 rounded-xl p-4 ${idx === 0 ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-2xl mb-2">{role.icon || '💼'}</div>
                                        <h4 className="text-lg font-bold text-gray-800">{role.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                                            role.matchPercentage >= 70 ? 'bg-green-100 text-green-700' :
                                            role.matchPercentage >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>{role.matchPercentage}% Match</span>
                                    </div>
                                </div>
                                
                                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                                    <div className="bg-gray-100 rounded p-2"><span className="text-gray-500">💰 Salary</span><p className="font-semibold">{role.salary || 'N/A'}</p></div>
                                    <div className="bg-gray-100 rounded p-2"><span className="text-gray-500">📈 Demand</span><p className="font-semibold">{role.demand || 'Medium'}</p></div>
                                    <div className="bg-gray-100 rounded p-2"><span className="text-gray-500">⏰ Experience</span><p className="font-semibold">{role.experience || '0-3 years'}</p></div>
                                </div>
                                
                                {role.matchedSkills && role.matchedSkills.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-xs text-gray-500 mb-1">✓ Matched Skills:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {role.matchedSkills.slice(0, 5).map((skill, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {role.missingSkills && role.missingSkills.length > 0 && idx === 0 && (
                                    <div className="mt-3">
                                        <p className="text-xs text-orange-500 mb-1">⚠️ Skills to Learn:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {role.missingSkills.map((skill, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Career Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">💡 Career Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">🎯 <span>Focus on learning {analysis.topRecommendations?.[0]?.missingSkills?.slice(0, 3).join(', ') || 'in-demand skills'} to improve your job prospects</span></li>
                    <li className="flex items-start gap-2">📚 <span>Build projects using {analysis.topRecommendations?.[0]?.title || 'recommended'} technologies</span></li>
                    <li className="flex items-start gap-2">🔗 <span>Get certified in {analysis.topRecommendations?.[0]?.title || 'your target role'}</span></li>
                    <li className="flex items-start gap-2">🌐 <span>Network with professionals in {analysis.topRecommendations?.[0]?.title || 'your field'} on LinkedIn</span></li>
                </ul>
            </div>
            
            {/* Re-analyze Button */}
            <div className="text-center">
                <button onClick={analyzeResume} disabled={loading} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">🔄 Re-analyze Resume</button>
            </div>
        </div>
    );
};

export default ResumeAnalysis;