const { exec } = require('child_process');
const path = require('path');

// Define the script directory and files to analyze
const scriptDir = '/skuska.js';
const filesToAnalyse = '/polyfil.js';

const pmdCommand = path.join(scriptDir, 'run.sh') + ' pmd -d ' + filesToAnalyse;

exec(pmdCommand, (error, stdout, stderr) => {
    if (error) {
        console.error('Error: ' + stderr);
        process.exit(-1);
    } else {
        console.log(stdout);
        process.exit(0);
    }
});
