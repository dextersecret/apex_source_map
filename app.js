const fs = require('fs');
const path = require('path');

// Define the directory containing your Apex classes
const apexClassesDirectory = 'C:/Users/vlmi/Documents/myVSCodeProjects/Feb23/bts-sfdx/force-app/main/default/classes';

// Define the directory where Obsidian notes will be created
const obsidianNotesDirectory = './BTS_apex_map_Obsidian_files';

// Recursive function to explore directories and create notes
function exploreDirectory(directory) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach((dirent) => {
        const fullPath = path.join(directory, dirent.name);

        if (dirent.isDirectory()) {
            // If the current item is a directory, explore it
            exploreDirectory(fullPath);
        } else if (dirent.isFile() && path.extname(fullPath) === '.cls') {
            // If the current item is a .cls file, create a note
            createObsidianNote(fullPath);
        }
    });
}

// Function to create an Obsidian note from a .cls file
function createObsidianNote(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Create a note title from the file name (without the extension)
    const noteTitle = path.basename(filePath, '.cls');

    // Create the note file in the Obsidian notes directory
    const notePath = path.join(obsidianNotesDirectory, `${noteTitle}.md`);

    // Write the file content to the note
    fs.writeFileSync(notePath, fileContent);
}

// Start the exploration
exploreDirectory(apexClassesDirectory);
