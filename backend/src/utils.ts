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

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export { generateNameForCodeFolder, generateUUID };
