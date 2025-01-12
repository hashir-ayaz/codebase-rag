const VITE_API_URL = import.meta.env.VITE_API_URL;

export const submitRepo = async (repoUrl: string) => {
  try {
    const response = await fetch(`${VITE_API_URL}/api/embed-codebase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repoUrl }),
    });

    if (response.ok) {
      return await response.json(); // Return JSON data if successful
    } else {
      console.error("Failed to submit repo");
      throw new Error("Failed to submit repo");
    }
  } catch (error) {
    console.error("Error submitting repo:", error);
    throw error; // Rethrow the error to handle it in the caller
  }
};
