const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    project_name: { type: String, required: true },
    project_address: { type: String, required: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    status: { type: String, default: 'open' },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', ProjectSchema);
