const { chunkCodebase, saveToVectorDb, queryCodebase } = require("./chroma_db");
const { generateNameForCodeFolder } = require("./utils");
const { downloadRepository, collectCodeFiles } = require("./code_service");
const express = require("express");
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
    await collectCodeFiles(localPath);

    // chunk the code base
    const docs = await chunkCodebase(localPath);
    // store the codebase in the chroma db

    await saveToVectorDb(folderName, docs);

    res.json({ message: "Repository downloaded and code collected." });
  } catch (error) {
    console.error("Error downloading repository:", error);
    res.json({ error: error });
  }
});

/**
 * this endpoint receives the query -> then embeds the query and searches the code base for the appropirate chunks -> then calls open ai api and returns a text response
 */
app.post("/api/query", (req: any, res: any) => {
  const folderName = req.body.folderName;
  // get the query
  const query: string = req.body.query;
  // search the code base for the most relevant chunks
  queryCodebase(query, folderName);
  // return the response
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
