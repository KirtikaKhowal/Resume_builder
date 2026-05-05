import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../App.css";


const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/login');
            return;
        }
        
        if (userData) {
            setUser(JSON.parse(userData));
        }
        
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://resume-builder-1-hf4l.onrender.com/api/resume/all', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setResumes(response.data || []);
        } catch (error) {
            console.error('Fetch error:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-lg px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">Resume Builder</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">Welcome, {user?.name || 'User'}!</span>
                        <button 
                            onClick={() => navigate('/builder')} 
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            + New Resume
                        </button>
                        <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold mb-6">Your Resumes</h2>
                
                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : resumes.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 mb-4">No resumes created yet</p>
                        <button 
                            onClick={() => navigate('/builder')} 
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                        >
                            Create Your First Resume
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume) => (
                            <div key={resume._id} className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    {resume.personalInfo?.fullName || 'Untitled Resume'}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                                </p>
                                <button 
                                    onClick={() => navigate(`/builder/${resume._id}`)} 
                                    className="w-full bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                >
                                    Edit
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;