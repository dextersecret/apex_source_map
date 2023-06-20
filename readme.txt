This script:

Reads the given directory and its subdirectories for '.cls' files.
For each '.cls' file it finds, it creates an Obsidian note with the same name and content in the given Obsidian notes directory.
It finds relationships between classes and adds them to the notes as links.

=== USING THE APP ===
0. Install Obsidian: Obsidian is a free, local-first, markdown-based knowledge management tool. Download and install it from the official website: https://obsidian.md/.
1. Replace 'C:/ ... /force-app/main/default/classes' with your own path before running the script.
2. run command: `node app.js` To include tests include the `t` parameter: `node app.js t`
3. Open Obsidian and point your vault to the directory with notes. Default: './BTS_apex_map_Obsidian_files'.

===== OBSIDIAN NAVIGATION =====
- Use the Graph view to explore the repository.
- Use the search bar to search for keywords in the repository.
- The links show relationships between classes.
- Hold Ctrl and hover over a node to see class contents. Click on the node while holding Ctrl to open the file in a new tab.