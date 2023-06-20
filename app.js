const fs = require('fs');
const path = require('path');

// Define the directory containing your Apex classes
const apexClassesDirectory = 'C:/Users/vlmi/Documents/myVSCodeProjects/Feb23/bts-sfdx/force-app/main/default/classes';

// Define the directory where Obsidian notes will be created
const obsidianNotesDirectory = './BTS_apex_map_Obsidian_files';

// Recursive function to explore directories and create notes
function processDirectory() {
    makeObsidianNotes();
}

function makeObsidianNotes() {
    fs.readdirSync(apexClassesDirectory, { withFileTypes: true }).forEach((dirent) => {
        const fullPath = path.join(apexClassesDirectory, dirent.name);

        if (dirent.isDirectory()) {
            // If the current item is a directory, explore it
            processDirectory(fullPath);
        } else if (dirent.isFile() && path.extname(fullPath) === '.cls') {
            // If the current item is a .cls file, create a note
            createObsidianNote(fullPath);
        }
    });
}

// Function to create an Obsidian note from a .cls file
function createObsidianNote(filePath) {
    const includeTests = false;
    let isTest = false;
    let fileContent = fs.readFileSync(filePath, 'utf8');

    // Create a note title from the file name (without the extension)
    const noteTitle = path.basename(filePath, '.cls');

    // Create the note file in the Obsidian notes directory
    const notePath = path.join(obsidianNotesDirectory, `${noteTitle}.md`);

    // Check if the file content starts with "@isTest" and add a tag if so
    let noteContent = '';
    if (fileContent.trimStart().toLowerCase().startsWith('@istest') || noteTitle.toLowerCase().endsWith('test')) {
        noteContent += '#isTest\n\n';
        isTest = true;
        if (isTest && !includeTests) {
            return;
        }
    }

    if (!isTest) {
        // Add the file content to the note as a fenced code block
        noteContent += '```java\n' + fileContent + '\n```';
        // Write the note content to the note
        fs.writeFileSync(notePath, noteContent);
    }

}

// List internal classes
function listInternalClasses(fileContent){
    let internalClassNames = [];

    const newInstanceRegExp = /\b(Class)\s+([\w]+)(\s+)?\(.*?\)/gi;
    let match;

    while ((match = newInstanceRegExp.exec(fileContent)) !== null) {
        if ( match[1] != null ) {
            internalClassNames.add(match[1]);
        }
    }
    return internalClassNames;
}

// Start the exploration
processDirectory();
