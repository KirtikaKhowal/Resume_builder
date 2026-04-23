const express = require('express');
const { 
    saveResume, 
    getResumes, 
    getResumeById, 
    deleteResume,
    analyzeResume 
} = require('../controllers/resumeController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware); // All routes require authentication
router.post('/save', saveResume);
router.get('/all', getResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);
router.post('/analyze', analyzeResume);

module.exports = router;