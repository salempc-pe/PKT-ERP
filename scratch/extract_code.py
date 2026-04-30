import json
import os

log_path = r'C:\Users\Usuario\.gemini\antigravity\brain\8c93b045-951f-4e65-a007-5a0e54fa6ac9\.system_generated\logs\overview.txt'

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('step_index') == 325:
                for tool_call in data.get('tool_calls', []):
                    if tool_call['name'] == 'write_to_file':
                        content = tool_call['args']['CodeContent']
                        # Remove the extra quotes if it's a string within the JSON
                        if content.startswith('"') and content.endswith('"'):
                            content = content[1:-1]
                        # Fix escaped newlines and other characters
                        content = content.replace('\\n', '\n').replace('\\"', '"').replace("\\'", "'")
                        print(content)
                        break
        except Exception:
            continue
