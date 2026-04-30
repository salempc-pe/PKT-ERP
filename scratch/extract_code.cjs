const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\8c93b045-951f-4e65-a007-5a0e54fa6ac9\\.system_generated\\logs\\overview.txt';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const data = JSON.parse(line);
    if (data.step_index === 325) {
      const toolCall = data.tool_calls.find(tc => tc.name === 'write_to_file');
      if (toolCall) {
        let content = toolCall.args.CodeContent;
        // The content is a stringified string in the JSON
        if (content.startsWith('"') && content.endsWith('"')) {
          // This is actually double-stringified in the logs sometimes
          // Or just a string literal
        }
        // Actually, JSON.parse already handled one level.
        // If it's still escaped, we might need another JSON.parse or manual fix.
        try {
            // The content might be a double-stringified JSON string
            let finalContent = content;
            if (content.startsWith('"')) {
                finalContent = JSON.parse(content);
            }
            fs.writeFileSync('scratch/PayrollDashboardCard.jsx', finalContent);
        } catch(e) {
            fs.writeFileSync('scratch/PayrollDashboardCard.jsx', content);
        }
      }
    }
  } catch (e) {}
});
