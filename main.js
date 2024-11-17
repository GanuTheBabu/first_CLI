const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const https = require('https');

const rl = readline.createInterface({ input, output });

function createGitHubOptions(answer) {
    const options = {
        hostname: 'api.github.com',
        path: `/users/${answer}/events`,
        method: 'GET',
        headers: {
            'User-Agent': 'Node.js', // GitHub requires a User-Agent header
            'Authorization': `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`, // Replace with your actual token
        },
    };
    return options;
}

rl.question('Enter the GitHub username to search: ', (answer) => {
    const options = createGitHubOptions(answer);

    const req = https.request(options, (res) => {
        let info = ''; // Ensure `info` is properly scoped

        console.log(`Status Code: ${res.statusCode}`); // Log the status code
        if (res.statusCode === 404) {
            console.log(`User "${answer}" not found.`);
            rl.close();
            return;
        }

        res.on('data', (chunk) => {
            info += chunk; // Accumulate data chunks
        });

        res.on('end', () => {
            try {
                const parsedInfo = JSON.parse(info); // Parse response
                console.log('Response received:', parsedInfo); // Display parsed data
            } catch (error) {
                console.error('Error parsing response:', error.message);
            }
            rl.close(); // Close readline interface after response ends
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
        rl.close(); // Ensure readline is closed even on errors
    });

    req.end(); // End the request
});
