const fs = require('fs');
const path = require('path');

// Ensure directory and file exist, create them if they don't
function ensureFileExists(filePath, headers) {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); // Create directory
    }

    if (!fs.existsSync(filePath)) {
        // Create file and write headers
        fs.writeFileSync(filePath, headers.join(',') + '\n', 'utf8');
    }
}

// Write data to a customer's CSV file, appending a new line
function writeDataToCustomerFile(email, data) {
    const filePath = path.join(__dirname, '../data/customers', `${email}.csv`);
    const headers = ['id', 'first_name', 'last_name', 'email', 'password', 'phone', 'company_name', 'company_address'];

    ensureFileExists(filePath, headers);

    const row = `${Object.values(data).join(',')}\n`;
    fs.appendFileSync(filePath, row, 'utf8'); // Append the new row to the CSV
}

// Read the last line of a customer's CSV file
function readLastLineFromCustomerFile(email) {
    const filePath = path.join(__dirname, '../data/customers', `${email}.csv`);

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            return reject(new Error('Customer file not found'));
        }

        // Read the file and return the last line
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }

            const lines = data.trim().split('\n');
            const lastLine = lines[lines.length - 1];
            resolve(lastLine);
        });
    });
}

// Copy content from old file to a new one
function copyCSVFile(oldEmail, newEmail) {
    const oldFilePath = path.join(__dirname, '../data/customers', `${oldEmail}.csv`);
    const newFilePath = path.join(__dirname, '../data/customers', `${newEmail}.csv`);

    if (fs.existsSync(oldFilePath)) {
        const data = fs.readFileSync(oldFilePath, 'utf8');
        fs.writeFileSync(newFilePath, data);  // Copy contents to new file
    } else {
        throw new Error('Customer file not found for copying.');
    }
}

module.exports = {
    writeDataToCustomerFile,
    readLastLineFromCustomerFile,
    copyCSVFile,
};
