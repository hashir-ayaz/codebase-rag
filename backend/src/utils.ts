const generateNameForCodeFolder = (repoUrl: string) => {
  const match = repoUrl.match(/github\.com\/(.+?)\/(.+?)(\.git)?$/);
  if (!match) {
    throw new Error("Invalid GitHub repository URL.");
  }

  const [_, owner, repo] = match;

  // Get the current timestamp
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, ""); // Removes special characters

  return `${owner}_${repo}_${timestamp}`;
};

export { generateNameForCodeFolder };
