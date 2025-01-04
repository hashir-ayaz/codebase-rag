import simpleGit from "simple-git";
import { promises as fsPromises } from "node:fs";
import fs from "fs-extra";
import path from "path";
import unzipper from "unzipper";
import axios from "axios";
import { validExtensions } from "./constants.js";

const git = simpleGit();

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
  // Replace with the path to the repository
  const outputFilePath: string = path.join(dirPath, "/all_code.txt");

  try {
    // Ensure the output file exists and is empty
    await fs.writeFile(outputFilePath, "", "utf8");

    async function processDirectory(currentPath: string) {
      const entries = await fsPromises.readdir(currentPath, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          // Recursively process subdirectories
          await processDirectory(fullPath);
        } else if (validExtensions.includes(path.extname(entry.name))) {
          // Append the content of valid code files
          const codeContent = await fsPromises.readFile(fullPath, "utf8");
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

interface DirectoryStructure {
  name: string;
  type: "file" | "folder";
  children?: DirectoryStructure[];
}

const generateDirectoryStructure = async (
  folderName: string,
  depth: number = 0
): Promise<DirectoryStructure | null> => {
  if (depth > 3) {
    return null; // Stop recursion if depth exceeds 3 levels
  }

  const localPath: string = path.resolve(`./cloned_codebases/${folderName}`); // Resolve the path

  try {
    const stats = await fs.stat(localPath);

    if (!stats.isDirectory()) {
      throw new Error(`${folderName} is not a directory.`);
    }

    const structure: DirectoryStructure = {
      name: path.basename(localPath),
      type: "folder",
      children: [],
    };

    const items = await fs.readdir(localPath);

    for (const item of items) {
      const itemPath = path.join(localPath, item);
      const itemStats = await fs.stat(itemPath);

      if (itemStats.isDirectory()) {
        const childStructure = await generateDirectoryStructure(
          path.join(folderName, item),
          depth + 1
        );
        if (childStructure) {
          structure.children?.push(childStructure);
        }
      } else {
        structure.children?.push({
          name: item,
          type: "file",
        });
      }
    }

    return structure;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error generating directory structure: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
    } else {
      console.error(
        `An unexpected error occurred while generating directory structure: ${error}`
      );
    }

    return null;
  }
};

export { downloadRepository, collectCodeFiles, generateDirectoryStructure };
