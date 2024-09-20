const Project = require('../models/Project');

// Controller for creating a new project
exports.createProject = async (req, res) => {
    const { project_name, project_address, customer_id } = req.body;

    try {
        const newProject = new Project({
            project_name,
            project_address,
            customer_id,
            status: 'open',  // Default project status is open
        });

        // Save the new project to the database
        await newProject.save();

        res.status(201).json({ message: 'Project created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Controller for getting open projects
exports.getOpenProjects = async (req, res) => {
    try {
        const openProjects = await Project.find({ status: 'open' });

        res.status(200).json(openProjects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
