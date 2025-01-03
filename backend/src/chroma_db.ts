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
  try {
    const textSplitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
      chunkSize: 300,
      chunkOverlap: 0,
    });

    // load the codebase file (all_code.txt)
    const codebase = await fs.readFile(
      path.join(localPath, "/all_code.txt"),
      "utf-8"
    );

    const docs = await textSplitter.createDocuments([codebase]);
    console.log(docs);
    return docs;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error chunking codebase: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
    } else {
      console.error(
        `An unexpected error occurred while chunking codebase: ${error}`
      );
    }
    throw error; // Re-throw the error for the calling code to handle if necessary
  }
};

const saveToVectorDb = async (folderName: string, docs: object) => {
  try {
    // get collection
    const collection = await client.getOrCreateCollection({
      name: folderName,
      embeddingFunction: embedder,
    });

    console.log("docs in saveToVectorDb", docs);
    await collection.add(docs);
    console.log("Data saved to vector database");
    // display the data
    const peekedData = await collection.peek();
    console.log(peekedData);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error saving to vector database: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
    } else {
      console.error(`An unexpected error occurred: ${error}`);
    }
    throw error; // Re-throw the error if you want calling code to handle it
  }
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
