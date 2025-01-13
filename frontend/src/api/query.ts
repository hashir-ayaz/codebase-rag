export async function fetchQuery(input: string, folderName: string) {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  try {
    const response = await fetch(`${VITE_API_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: input, folderName }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch query results.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchQuery:", error);
    throw error;
  }
}
