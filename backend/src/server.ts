import { chunkCodebase, saveToVectorDb, queryCodebase } from "./chroma_db.js";
import { generateNameForCodeFolder } from "./utils.js";
import { downloadRepository, collectCodeFiles } from "./code_service.js";
import express from "express";
const app = express();
const port = 3000;
app.use(express.json());

/**
 * this endpoint will receive the repo url -> then download the repo -> then save the code into a file
 */
app.post("/api/embed-codebase", async (req: any, res: any) => {
  try {
    // console.log("req.body is ", req);
    const repoUrl: string = req.body.repoUrl;
    const folderName = generateNameForCodeFolder(repoUrl);
    await downloadRepository(repoUrl, folderName);

    // using the repo url to make a name for the local path to store the code at
    const localPath = `./cloned_codebases/${folderName}`;
    await collectCodeFiles(localPath, folderName);

    // chunk the code base
    const docs = await chunkCodebase(localPath);
    // store the codebase in the chroma db

    await saveToVectorDb(folderName, docs);

    res.json({ message: "Repository downloaded and code collected." });
  } catch (error) {
    console.error("Error in Embedding and saving the codebase", error);
    res.json({ error: error });
  }
});

/**
 * this endpoint receives the query -> then embeds the query and searches the code base for the appropirate chunks -> then calls open ai api and returns a text response
 */
app.post("/api/query", async (req: any, res: any) => {
  try {
    // Destructure and type variables from req.body
    const { query, folderName }: { query: string; folderName: string } =
      req.body;

    if (!query || !folderName) {
      return res
        .status(400)
        .json({ error: "Missing query or folderName in request body" });
    }
    // Search the codebase for the most relevant chunks
    const responseDocs = await queryCodebase(query, folderName);

    // Return the response
    res.json({ response: responseDocs });
  } catch (error) {
    console.error("Error processing query:", error);

    if (error instanceof Error) {
      res.json({ error: error.message });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
