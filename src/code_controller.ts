const simpleGit = require("simple-git");
const git = simpleGit();
const fs = require("fs-extra");
const path = require("path");

async function cloneRepository(repoUrl: string, localPath: string) {
  try {
    await git.clone(repoUrl, localPath);
    console.log(`Repository cloned to ${localPath}`);
  } catch (error) {
    console.error("Error cloning repository:", error);
  }
}

// cloneRepository(
//   "https://github.com/hashir-ayaz/JobProviderPanel.git",
//   "/home/hashir/Documents/codebase-rag/cloned_codebases/codebase2"
// );

/**
 * Recursively scans the directory for code files and appends their content to all_code.txt.
 * @param {string} dirPath - The path to the repository.
 */
async function collectCodeFiles(dirPath: string) {
  const validExtensions: string[] = [
    ".js",
    ".ts",
    ".py",
    ".cpp",
    ".c",
    ".dart",
    ".rs",
  ];
  const outputFilePath: string = path.join(dirPath, "all_code.txt");

  try {
    // Ensure the output file exists and is empty
    await fs.writeFile(outputFilePath, "", "utf8");

    async function processDirectory(currentPath: string) {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          // Recursively process subdirectories
          await processDirectory(fullPath);
        } else if (validExtensions.includes(path.extname(entry.name))) {
          // Append the content of valid code files
          const codeContent = await fs.readFile(fullPath, "utf8");
          await fs.appendFile(
            outputFilePath,
            `\n\n// File: ${fullPath}\n\n` + codeContent
          );
          console.log(`Added content from: ${fullPath}`);
        }
      }
    }

    // Start processing from the given directory
    await processDirectory(dirPath);
    console.log(`All code files have been aggregated into: ${outputFilePath}`);
  } catch (error) {
    console.error("Error while collecting code files:", error);
  }
}

// Example usage:
const repoPath =
  "/home/hashir/Documents/codebase-rag/cloned_codebases/codebase1"; // Replace with your repository path
collectCodeFiles(repoPath);
