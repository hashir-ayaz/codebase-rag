import {
  chunkCodebase,
  saveToVectorDb,
  retrieveFromVectorDb,
  queryLLM,
} from "./chroma_db.js";
import { generateNameForCodeFolder } from "./utils.js";
import {
  downloadRepository,
  collectCodeFiles,
  generateDirectoryStructure,
  summarizeReadme,
} from "./code_service.js";
import express from "express";
const app = express();
const port = 3000;
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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
    await collectCodeFiles(localPath);

    // chunk the code base
    const docs = await chunkCodebase(localPath);
    // store the codebase in the chroma db
    console.log("chunking codebase done");
    await saveToVectorDb(folderName, docs);

    res
      .json({
        message: "Repository downloaded and code collected.",
        folderName,
      })
      .status(200);
  } catch (error) {
    console.error("Error in Embedding and saving the codebase", error);
    res.json({ error: error }).status(500);
  }
});

interface DirectoryStructure {
  name: string;
  type: "file" | "folder";
  children?: DirectoryStructure[];
}
/**
 * this endpoint receives the query -> then embeds the query and searches the code base for the appropirate chunks -> then calls open ai api and returns a text response
 */
app.post("/api/query", async (req: any, res: any) => {
  try {
    const query: string = req.body.query;
    const folderName: string = req.body.folderName;
    const retrievedDocs = await retrieveFromVectorDb(query, folderName);

    const directoryStructure = await generateDirectoryStructure(folderName);
    console.log("directoryStructure is ", directoryStructure);

    const readmeContent: string = await summarizeReadme(folderName);

    const response = await queryLLM(
      query,
      folderName,
      retrievedDocs,
      directoryStructure,
      readmeContent
    );
    res.json({ message: response });
  } catch (error) {
    console.error("Error in querying the codebase", error);
    res.json({ error: error });
  }
});

app.all("*", (req: any, res: any) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port} 🚀`);
});
