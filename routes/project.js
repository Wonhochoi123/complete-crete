const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Create a new project
router.post('/new', projectController.createProject);

// Get open projects
router.get('/open', projectController.getOpenProjects);

module.exports = router;
