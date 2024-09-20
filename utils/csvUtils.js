const fs = require('fs');
const path = require('path');

// Ensure CSV file exists and create it with headers if it doesn't
function ensureFileExists(filePath, headers) {
    const dirPath = path.dirname(filePath); // Ensure the directory exists
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); // Create the directory
    }

    if (!fs.existsSync(filePath)) {
        // Create the file with the headers
        fs.writeFileSync(filePath, headers.join(',') + '\n', 'utf8');
    }
}

// Write data to CSV with a new line for each record
function writeDataToCSV(filePath, data) {
    ensureFileExists(filePath, ['id', 'first_name', 'last_name', 'email', 'password', 'phone']);
    const row = `${data.id},${data.first_name},${data.last_name},${data.email},${data.password},${data.phone}\n`;

    // Append the new row to the CSV file
    fs.appendFileSync(filePath, row, 'utf8');
}

// Read data from CSV
function readDataFromCSV(filePath) {
    ensureFileExists(filePath, ['id', 'first_name', 'last_name', 'email', 'password', 'phone']);

    return new Promise((resolve, reject) => {
        const results = [];
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return reject(err);

            const rows = data.split('\n').filter(row => row);
            const headers = rows.shift().split(',');

            rows.forEach(row => {
                const values = row.split(',');
                const entry = {};
                headers.forEach((header, index) => {
                    entry[header] = values[index];
                });
                results.push(entry);
            });

            resolve(results);
        });
    });
}

module.exports = { writeDataToCSV, readDataFromCSV };
