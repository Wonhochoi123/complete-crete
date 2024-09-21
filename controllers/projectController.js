const csvUtils = require('../utils/csvUtils');

// CSV file location for project data
const projectFilePath = './data/projects.csv';
const projectHeaders = ['id', 'project_name', 'project_address', 'customer_id', 'status', 'created_at'];

// Controller for creating a new project
exports.createProject = async (req, res) => {
    const { project_name, project_address, customer_id } = req.body;

    try {
        const newProject = {
            id: Date.now().toString(),
            project_name,
            project_address,
            customer_id,
            status: 'open',  // Default project status is open
            created_at: new Date().toISOString(),
        };

        // Write the new project to CSV
        await csvUtils.writeDataToCSV(projectFilePath, newProject, projectHeaders);

        res.status(201).json({ message: 'Project created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Controller for getting open projects
exports.getOpenProjects = async (req, res) => {
    try {
        const projects = await csvUtils.readDataFromCSV(projectFilePath, projectHeaders);

        // Filter projects by open status
        const openProjects = projects.filter(project => project.status === 'open');

        res.status(200).json(openProjects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Controller for updating project status (e.g., close a project)
exports.updateProjectStatus = async (req, res) => {
    const { projectId, status } = req.body;

    try {
        const projects = await csvUtils.readDataFromCSV(projectFilePath, projectHeaders);
        const projectIndex = projects.findIndex(p => p.id === projectId);

        if (projectIndex === -1) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const project = projects[projectIndex];
        project.status = status;

        // Update the project status in the CSV
        await csvUtils.updateCSV(projectFilePath, project, projectId, projectHeaders);

        res.status(200).json({ message: 'Project updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
