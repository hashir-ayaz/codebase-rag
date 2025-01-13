import {
  chunkCodebase,
  saveToVectorDb,
  retrieveFromVectorDb,
  queryLLM,
} from "./chroma_db.js";
import { generateNameForCodeFolder, sanitizeCollectionName } from "./utils.js";
import {
  downloadRepository,
  collectCodeFiles,
  generateDirectoryStructure,
  summarizeReadme,
  parseRepoUrl,
} from "./code_service.js";
import express from "express";
const app = express();
const port = 3000;
import cors from "cors";
import AppError from "./error/AppError.js";

app.set("trust proxy", true); //only needed for deployment

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://143.110.183.231:5173",
      "https://codebaserag.hashirayaz.site",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Request received from ${req.ip} for ${req.url}`);
  next();
});
/**
 * this endpoint will receive the repo url -> then download the repo -> then save the code into a file
 */
app.post("/api/embed-codebase", async (req: any, res: any) => {
  try {
    // console.log("req.body is ", req);
    const repoUrl: string = req.body.repoUrl;

    const { owner, repo } = parseRepoUrl(repoUrl);

    let folderName = generateNameForCodeFolder(repoUrl);
    folderName = sanitizeCollectionName(folderName);

    await downloadRepository(owner, repo, folderName);

    // using the repo url to make a name for the local path to store the code at
    const localPath = `./cloned_codebases/${folderName}`;
    await collectCodeFiles(localPath);

    // chunk the code base
    const docs = await chunkCodebase(localPath);
    // store the codebase in the chroma db
    console.log("chunking codebase done");
    await saveToVectorDb(folderName, docs);

    res.status(200).json({
      message: "Repository downloaded and code collected.",
      folderName,
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.status).json({ error: error.message });
    } else {
      console.error("Error in embedding codebase", error);
      res.status(500).json({ error: error.message });
    }
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
  } catch (error: any) {
    console.error("Error in querying the codebase", error);
    res.json({ error: error.message }).status(500);
  }
});

app.all("*", (req: any, res: any) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${port} 🚀`);
});
