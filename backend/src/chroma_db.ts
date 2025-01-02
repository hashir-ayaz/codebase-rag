const { ChromaClient } = require("chromadb");
const { OpenAIEmbeddingFunction } = require("chromadb");
const dotenv = require("dotenv");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const fs = require("fs-extra");
const path = require("path");

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const client = new ChromaClient({
  path: "http://localhost:8000", // Adjust if Chroma is hosted elsewhere
});

const embedder = new OpenAIEmbeddingFunction({
  openai_api_key: OPENAI_API_KEY,
});

// TODO make the js generic
const chunkCodebase = async (localPath: string) => {
  const textSplitter = new RecursiveCharacterTextSplitter().fromLanguage("js", {
    chunkSize: 60,
    overlap: 0,
  });

  // load the codebase file (all_code.txt)
  const codebase = await fs.readFile(
    path.join(localPath, "/all_code.txt"),
    "utf-8"
  );

  const docs = await textSplitter.createDocuments([codebase]);
  console.log(docs);
  return docs;
};

const saveToVectorDb = async (folderName: string, docs: object) => {
  // get collection
  const collection = await client.getOrCreateCollection({
    name: folderName,
    embeddingFunction: embedder,
  });

  await collection.add(docs);

  // display the data
  const peekedData = await collection.peek();
  console.log(peekedData);
};

const queryCodebase = async (query: string, folderName: string) => {
  // get collection
  const collection = await client.getOrCreateCollection({
    name: folderName,
    embeddingFunction: embedder,
  });

  const response = await collection.query({
    queryTexts: [query],
    nResults: 5,
  });
  console.log(response);

  return response;
};

export { chunkCodebase, saveToVectorDb, queryCodebase };
