import simpleGit from "simple-git";
import { promises as fsPromises } from "node:fs";
import fs from "fs-extra";
import path from "path";
import unzipper from "unzipper";
import axios from "axios";
import { validExtensions } from "./constants.js";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import AppError from "./error/AppError.js";

// Initialize Git
const git = simpleGit();

// Types
interface DirectoryStructure {
  name: string;
  type: "file" | "folder";
  children?: DirectoryStructure[];
}

// Utilities for Repository Downloading

/**
 * Parses a GitHub repository URL and extracts the owner and repository name.
 * @param {string} repoUrl - The GitHub repository URL.
 * @returns {{ owner: string; repo: string }} - The owner and repository name.
 * @throws Will throw an error if the URL is invalid.
 */
const parseRepoUrl = (repoUrl: string): { owner: string; repo: string } => {
  try {
    const match = repoUrl.match(/github\.com\/(.+?)\/(.+?)(\.git)?$/);
    if (!match) {
      throw new AppError("Invalid GitHub repository URL.", 400);
    }
    return { owner: match[1], repo: match[2] };
  } catch (error) {
    console.error("Error parsing repository URL:", error);
    throw error;
  }
};

/**
 * Downloads a ZIP file from the provided URL and saves it to the specified path.
 * @param {string} zipUrl - The URL of the ZIP file to download.
 * @param {string} zipPath - The local file path to save the downloaded ZIP.
 * @throws Will throw an error if the download fails.
 */
const downloadZip = async (zipUrl: string, zipPath: string) => {
  try {
    const response = await axios({
      url: zipUrl,
      method: "GET",
      responseType: "stream",
    });

    if (response.status !== 200) {
      throw new AppError(
        `Failed to download ZIP file. Status code: ${response.status}`,
        400
      );
    }

    const writer = fs.createWriteStream(zipPath);
    response.data.pipe(writer);

    await new Promise<void>((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log("ZIP file downloaded.");
  } catch (error) {
    console.error("Error downloading ZIP file:", error);
    throw new AppError("Failed to download ZIP file.", 400);
  }
};

/**
 * Extracts a ZIP file to the specified local path and removes the ZIP file afterward.
 * @param {string} zipPath - The path to the ZIP file.
 * @param {string} localPath - The directory to extract the ZIP contents into.
 * @throws Will throw an error if extraction fails.
 */
const extractZip = async (zipPath: string, localPath: string) => {
  try {
    await fs
      .createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: localPath }))
      .promise();

    console.log("ZIP file extracted.");
    await fs.remove(zipPath); // Clean up ZIP file
  } catch (error) {
    console.error("Error extracting ZIP file:", error);
    throw new AppError("Failed to extract ZIP file.", 400);
  }
};

/**
 * Downloads a GitHub repository by cloning its ZIP archive, extracting it, and saving it locally.
 * @param {string} repoUrl - The GitHub repository URL.
 * @param {string} folderName - The local folder name to save the repository.
 */
const downloadRepository = async (
  owner: string,
  repo: string,
  folderName: string
) => {
  const localPath = `./cloned_codebases/${folderName}`;

  try {
    const zipUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/main.zip`;
    const zipPath = path.join(localPath, `${repo}.zip`);

    console.log(`Downloading repository from: ${zipUrl}`);

    await fs.ensureDir(localPath);
    await downloadZip(zipUrl, zipPath);
    await extractZip(zipPath, localPath);

    console.log(`Repository extracted to: ${localPath}`);
  } catch (error) {
    console.error("Error downloading repository:", error);
    throw new AppError("Failed to download repository.", 400);
  }
};

// Utilities for File Collection

/**
 * Processes a single file by reading its content and appending it to the output file.
 * @param {string} filePath - The path to the file to process.
 * @param {string} outputFilePath - The path to the output file.
 */
const processFile = async (filePath: string, outputFilePath: string) => {
  try {
    const codeContent = await fsPromises.readFile(filePath, "utf8");
    await fs.appendFile(
      outputFilePath,
      `\n\n// File: ${filePath}\n\n` + codeContent
    );
    console.log(`Added content from: ${filePath}`);
  } catch (error) {
    console.error(`Error processing file (${filePath}):`, error);
    throw new Error(`Failed to process file: ${filePath}`);
  }
};

/**
 * Recursively processes a directory, handling subdirectories and valid files.
 * @param {string} currentPath - The current directory path to process.
 * @param {string} outputFilePath - The path to the output file.
 */
const processDirectory = async (
  currentPath: string,
  outputFilePath: string
) => {
  try {
    const entries = await fsPromises.readdir(currentPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        await processDirectory(fullPath, outputFilePath);
      } else if (validExtensions.includes(path.extname(entry.name))) {
        await processFile(fullPath, outputFilePath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory (${currentPath}):`, error);
    throw new AppError(`Failed to process directory: ${currentPath}`, 400);
  }
};

/**
 * Collects all code files from a directory and aggregates their content into a single file.
 * @param {string} dirPath - The path to the directory to collect code files from.
 */
const collectCodeFiles = async (dirPath: string) => {
  const outputFilePath = path.join(dirPath, "/all_code.txt");

  try {
    await fs.writeFile(outputFilePath, "", "utf8"); // Ensure the file exists and is empty
    await processDirectory(dirPath, outputFilePath);
    console.log(`All code files aggregated into: ${outputFilePath}`);
  } catch (error) {
    console.error("Error while collecting code files:", error);
    throw new Error("Failed to collect code files.");
  }
};

// Utilities for Directory Structure

/**
 * Recursively generates the directory structure up to a specified depth.
 * @param {string} folderPath - The path to the current folder.
 * @param {number} depth - The current recursion depth.
 * @returns {Promise<DirectoryStructure | null>} - The directory structure or null if depth exceeds.
 */
const generateFolderStructure = async (
  folderPath: string,
  depth: number
): Promise<DirectoryStructure | null> => {
  try {
    if (depth > 3) return null;

    const stats = await fs.stat(folderPath);
    if (!stats.isDirectory())
      throw new Error(`${folderPath} is not a directory.`);

    const structure: DirectoryStructure = {
      name: path.basename(folderPath),
      type: "folder",
      children: [],
    };

    const items = await fs.readdir(folderPath);
    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      const itemStats = await fs.stat(itemPath);

      if (itemStats.isDirectory()) {
        const childStructure = await generateFolderStructure(
          itemPath,
          depth + 1
        );
        if (childStructure) structure.children?.push(childStructure);
      } else {
        structure.children?.push({
          name: item,
          type: "file",
        });
      }
    }

    return structure;
  } catch (error) {
    console.error(`Error generating folder structure (${folderPath}):`, error);
    throw new AppError(
      `Failed to generate folder structure: ${folderPath}`,
      500
    );
  }
};

/**
 * Generates the directory structure for a given folder name.
 * @param {string} folderName - The name of the folder.
 * @param {number} [depth=0] - The current recursion depth.
 * @returns {Promise<DirectoryStructure | null>} - The directory structure or null if an error occurs.
 */
const generateDirectoryStructure = async (
  folderName: string,
  depth: number = 0
): Promise<DirectoryStructure | null> => {
  const localPath = path.resolve(`./cloned_codebases/${folderName}`);
  try {
    return await generateFolderStructure(localPath, depth);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error generating directory structure: ${error.message}`);
      throw new Error(`Failed to generate directory structure: ${folderName}`);
    } else {
      console.error(
        `Unexpected error generating directory structure: ${error}`
      );
      throw new AppError(
        `Unexpected error generating directory structure: ${folderName}`,
        400
      );
    }
  }
};

// Utilities for README Summarization

/**
 * Recursively searches for a README.md file within a folder.
 * @param {string} folderName - The path to the folder to search within.
 * @returns {Promise<string | null>} - The path to the README.md file or null if not found.
 */
const findReadmeFile = async (currentPath: string): Promise<string | null> => {
  try {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        const result = await findReadmeFile(fullPath);
        if (result) return result;
      } else if (entry.isFile() && entry.name.toLowerCase() === "readme.md") {
        return fullPath;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error finding README file in (${currentPath}):`, error);
    throw new AppError(`Failed to find README file in: ${currentPath}`, 400);
  }
};

/**
 * Summarizes the content of the README.md file within a given folder.
 * @param {string} folderName - The name of the folder containing the README.md file.
 * @returns {Promise<string>} - The summary of the README or an appropriate message if not found or an error occurs.
 */
const summarizeReadme = async (folderName: string): Promise<string> => {
  const basePath = `./cloned_codebases/${folderName}`;
  try {
    const readmePath = await findReadmeFile(basePath);
    if (!readmePath) {
      console.warn("No README.md file found.");
      return "no readme found";
    }

    const readmeContent = await fs.readFile(readmePath, "utf8");

    // Initialize the LLM for summarization
    const llm = new ChatGroq({
      model: "llama3-8b-8192",
      temperature: 0,
      maxTokens: undefined,
      maxRetries: 2,
      apiKey: process.env.GROQ_API_KEY,
    });

    // Define the prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert software engineer analyzing a README file. Provide a concise summary of the project, covering:
    
    1. Project purpose and main functionality
    2. Key technologies and languages used
    3. Main features (2-3 points)
    4. Basic setup/installation process
    5. High-level technical architecture
    
    Keep your summary brief but informative, suitable for a quick technical overview.`,
      ],
      ["user", "README content:\n{readmeContent}"],
    ]);

    // Create the chain
    const chain = prompt.pipe(llm);

    // Invoke the chain with the README content
    const result = await chain.invoke({
      readmeContent: readmeContent || "",
    });

    console.log("Summarization result:", result);

    return JSON.stringify(result.content) || "summary could not be generated.";
  } catch (error) {
    console.error("Error summarizing README:", error);
    throw new AppError("Failed to summarize README.", 400);
  }
};

// Exports
export {
  downloadRepository,
  collectCodeFiles,
  generateDirectoryStructure,
  summarizeReadme,
  findReadmeFile,
  parseRepoUrl,
};
