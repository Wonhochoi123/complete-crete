// const mongoose = require('mongoose');
//
// const connectDB = async () => {
//     try {
//         await mongoose.connect('mongodb://localhost:27017/your-db-name');
//         console.log('MongoDB connected successfully');
//     } catch (err) {
//         console.error('MongoDB connection failed:', err);
//         process.exit(1);
//     }
// };
//
// module.exports = connectDB;



const mongoose = require('mongoose');

// Replace the <username>, <password>, and <dbname> with your actual credentials from MongoDB Atlas
const uri = 'mongodb+srv://cwh930503:IJ9jjo6zUvIoV95p@cluster0.1a2ek.mongodb.net/cc?retryWrites=true&w=majority';

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
