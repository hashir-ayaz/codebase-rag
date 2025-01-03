const simpleGit = require("simple-git");
const git = simpleGit();
const fs = require("fs-extra");
const path = require("path");
const unzipper = require("unzipper");
const axios = require("axios");
const { validExtensions } = require("./constants");

async function downloadRepository(repoUrl: string, folderName: string) {
  const localPath: string = `./cloned_codebases/${folderName}`; // Replace with desired local path

  try {
    // Extract owner and repo name from the URL
    const match = repoUrl.match(/github\.com\/(.+?)\/(.+?)(\.git)?$/);
    if (!match) {
      throw new Error("Invalid GitHub repository URL.");
    }

    const [_, owner, repo] = match;

    // Construct GitHub API URL for downloading as ZIP
    const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/main.zip`;

    console.log(`Downloading repository from: ${zipUrl}`);

    // Download the ZIP file
    const response = await axios({
      url: zipUrl,
      method: "GET",
      responseType: "stream",
    });

    const zipPath = path.join(localPath, `${repo}.zip`);
    await fs.ensureDir(localPath);

    // Save the ZIP file
    const writer = fs.createWriteStream(zipPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log("Repository downloaded. Extracting...");

    // Extract the ZIP file
    await fs
      .createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: localPath }))
      .promise();

    console.log(`Repository extracted to ${localPath}`);
    await fs.remove(zipPath); // Clean up ZIP file
  } catch (error) {
    console.error("Error downloading repository:", error);
  }
}

// Example usage
// const repoUrl = "https://github.com/hashir-ayaz/JobProviderPanel.git"; // Replace with actual repo URL
// downloadRepository(repoUrl, localPath);

/**
 * Recursively scans the directory for code files and appends their content to all_code.txt.
 * @param {string} dirPath - The path to the repository.
 */
async function collectCodeFiles(dirPath: string, foldername: string) {
  const newDirPath: string = dirPath + `./cloned_codebases/${dirPath}`; // Replace with the path to the repository
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

const queryLlm = async (query: string, folderName: string): Promise<string> => {
  //  query llama 3.1 with groq
  return "response";
};

export { downloadRepository, collectCodeFiles };
