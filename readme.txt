This script:

Reads the given directory and its subdirectories for '.cls' files.
For each '.cls' file it finds, it creates an Obsidian note with the same name and content in the given Obsidian notes directory.


=== HOW TO USE ===
0. Install Obsidian: Obsidian is a free, local-first, markdown-based knowledge management tool. Download and install it from the official website: https://obsidian.md/.
1. Replace 'C:/ ... /force-app/main/default/classes' with your own path before running the script.
2. run command: `node app.js`

x. Open Obsidian and point your vault to the directory. Default: './BTS_apex_map_Obsidian_files'.
y. Use the Graph view to explore the repository.
z. Use the search bar to search for keywords in the repository.
%. Use the backlinks to see which classes are using the class you are currently viewing.
$: Use the outline view to see the class structure.