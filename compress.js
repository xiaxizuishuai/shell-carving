const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, '3D');
const files = fs.readdirSync(targetDir);

files.forEach(file => {
    if (file.endsWith('.glb')) {
        if (file.includes('副本')) {
            console.log(`Skipping and deleting duplicate: ${file}`);
            fs.unlinkSync(path.join(targetDir, file));
            return;
        }
        console.log(`Compressing ${file}...`);
        const inputPath = path.join(targetDir, file);
        const tempPath = path.join(targetDir, `temp_${file}`);
        try {
            // Using npx gltf-pipeline with -d for draco compression
            execSync(`npx gltf-pipeline -i "${inputPath}" -o "${tempPath}" -d`);
            // Replace the original file with the compressed one
            fs.renameSync(tempPath, inputPath);
            console.log(`Successfully compressed ${file}`);
        } catch (e) {
            console.error(`Failed to compress ${file}: ${e.message}`);
            // if temp file exists due to error, remove it
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
    } else if (file.includes('副本')) {
        try {
            fs.unlinkSync(path.join(targetDir, file));
            console.log(`Deleted duplicate file: ${file}`);
        } catch (e) {}
    }
});
console.log('Compression process completed!');
