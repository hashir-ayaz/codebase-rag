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

function sanitizeCollectionName(input: string): string {
  // Ensure the string contains 3-63 characters
  let sanitized = input.substring(0, 63);

  // Replace invalid characters with underscores (alphanumeric, underscores, hyphens are allowed)
  sanitized = sanitized.replace(/[^a-zA-Z0-9_-]/g, "_");

  // Ensure the name starts and ends with an alphanumeric character
  if (!/^[a-zA-Z0-9]/.test(sanitized)) {
    sanitized = "a" + sanitized.slice(1);
  }
  if (!/[a-zA-Z0-9]$/.test(sanitized)) {
    sanitized = sanitized.slice(0, -1) + "z";
  }

  // Replace consecutive periods with a single underscore
  sanitized = sanitized.replace(/\.\./g, "_");

  // Ensure the name is not a valid IPv4 address
  const ipv4Pattern =
    /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
  if (ipv4Pattern.test(sanitized)) {
    sanitized = sanitized.replace(/\./g, "_");
  }

  // Ensure the name has a minimum length of 3
  if (sanitized.length < 3) {
    sanitized = sanitized.padEnd(3, "x");
  }

  return sanitized;
}

export { generateNameForCodeFolder, generateUUID, sanitizeCollectionName };
