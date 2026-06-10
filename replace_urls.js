const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir);

const baseUrl = 'https://xiaxizuishuai.github.io/shell-carving/';

files.forEach(file => {
    if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js') || file.endsWith('.json')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        let newContent = content
            // Match images path with prefix " or ' or ( or space
            .replace(/(["'\(\s])(?:\.\/|\.\.\/)?(images\/[^\s"'<>]+)/g, `$1${baseUrl}$2`)
            // Match 3D path with prefix
            .replace(/(["'\(\s])(?:\.\/|\.\.\/)?(3D\/[^\s"'<>]+)/g, `$1${baseUrl}$2`)
            // Handle some hardcoded Chinese paths if they exist
            .replace(/(["'\(\s])(?:\.\/|\.\.\/)?(藏品\/[^\s"'<>]+)/g, `$1${baseUrl}$2`);
            
        if (content !== newContent) {
            fs.writeFileSync(path.join(dir, file), newContent, 'utf8');
            console.log(`Updated ${file}`);
        }
    }
});
console.log('Path replacement completed!');
