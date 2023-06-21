const fs = require('fs');
const path = require('path');
const classNamesToReference = [];
const includeTests = process.argv.includes('t');
// Default Apex classes directory (used if no directory is passed via command line)
let apexClassesDirectory = './';
// Define the directory where Obsidian notes will be created
const obsidianNotesDirectory = './apex_map_Obsidian_files';

function run() {
    processPassedParams();
    classNamesToReference.push(...getFileNames(apexClassesDirectory));
    deleteOldNotes(obsidianNotesDirectory);
    processDirectory(apexClassesDirectory);
}

// Recursive function to explore directories and create notes
function processDirectory(directory) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach((dirent) => {
        const fullPath = path.join(directory, dirent.name);

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
    let fileContent = fs.readFileSync(filePath, 'utf8');

    // Create a note title from the file name (without the extension)
    const noteTitle = path.basename(filePath, '.cls');

    // Create the note file in the Obsidian notes directory
    const notePath = path.join(obsidianNotesDirectory, `${noteTitle}.md`);

    let noteContent = '';
    // Check if the file content starts with "@isTest" and add a tag if so
    if (fileContent.trimStart().toLowerCase().startsWith('@istest') || noteTitle.toLowerCase().endsWith('test')) {
        // Check if the "t" parameter was provided, exclude test classes if not
        if ( includeTests ) {
            noteContent += '#isTest\n\n';
        } else {
            return;
        }
    }

    noteContent += insertLinksToOtherClasses(fileContent, noteTitle);
    // Add the file content to the note as a fenced code block
    noteContent += '```java\n' + fileContent + '\n```';
    // Write the note content to the note
    fs.writeFileSync(notePath, noteContent);

}

// Function to read all class names in the source directory and its subdirectories
function getFileNames(sourceDirectory) {
    let classNamesToReference = [];

    // Use a helper function to recursively search subdirectories
    function searchDirectory(directory) {
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                // If the file is a directory, search its contents
                searchDirectory(filePath);
            } else if (path.extname(file) === '.cls') {
                // If the file is a .cls file, add its name (without the extension) to the array
                let fileName = path.basename(file, '.cls');
                                
                if (!fileName.endsWith('Exception')){ classNamesToReference.push(fileName); }
            }
        }
    }
    searchDirectory(sourceDirectory);
    return classNamesToReference;
}

function insertLinksToOtherClasses(fileContent, noteTitle){
    // Create a RegExp to match "new ClassName(), classname.methodName(), etc."
    // const newInstanceRegExp = /\b([\w]+)(\.\w+)?(\.\w+)?(\s+)?\(.*?\)/g;

    // let match;
    let linkedClasses = new Set(); // To avoid adding multiple links to the same class
    noteLinksSection = 'Refers To:\n';

    // Linking to other class names found in the repository and referenced in the file
    let foundItems = classNamesToReference.filter(str => (str != noteTitle && (fileContent.includes(' '+str) || fileContent.includes('='+str) ) ));
    foundItems.forEach(item => {
        if(!linkedClasses.has(item) ) 
            {
                // Add a link to the referenced class in Obsidian format
                noteLinksSection += `[[${item}]]\n`;
                linkedClasses.add(item);
            }
    });

    return noteLinksSection + '\n\n';
}

// Function to delete all files in the directory
function deleteOldNotes(directoryPath) {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const stat = fs.statSync(filePath);

        // If the file is not a directory, delete it
        if (!stat.isDirectory()) {
            fs.unlinkSync(filePath);
        }
    }
}

function processPassedParams() {
   // Check if the "a" parameter was provided
   let aIndex = process.argv.indexOf('d');
   if (aIndex !== -1 && process.argv[aIndex + 1]) {
       // If the "a" parameter was provided and there's another argument after it, use it as the directory
       apexClassesDirectory = process.argv[aIndex + 1];
   }
}

// Start the exploration
run();