const fs = require('fs');
const logPath = 'C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\8c93b045-951f-4e65-a007-5a0e54fa6ac9\\.system_generated\\logs\\overview.txt';

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n');

for (const line of lines) {
    if (line.includes('"step_index":325')) {
        const data = JSON.parse(line);
        const toolCall = data.tool_calls.find(tc => tc.name === 'write_to_file');
        if (toolCall) {
            let code = toolCall.args.CodeContent;
            // It seems the logs store the args as a JSON string or something
            // Let's try to unescape it properly
            try {
                // If it's a JSON-encoded string, this will unescape it
                const unescaped = JSON.parse(code);
                fs.writeFileSync('src/modules/client/payroll/PayrollDashboardCard.jsx', unescaped);
                console.log('Successfully recovered to src/modules/client/payroll/PayrollDashboardCard.jsx');
            } catch (e) {
                // Fallback if not JSON-encoded
                fs.writeFileSync('src/modules/client/payroll/PayrollDashboardCard.jsx', code);
                console.log('Recovered with potential escaping to src/modules/client/payroll/PayrollDashboardCard.jsx');
            }
        }
    }
}
