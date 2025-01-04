// import { ChromaClient } from "chromadb";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { config } from "dotenv";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { promises as fs } from "fs";
import { generateUUID } from "./utils";
import type { Document } from "@langchain/core/documents";
import path from "path";
import { TextLoader } from "langchain/document_loaders/fs/text";

config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const LANGCHAIN_TRACING_V2 = process.env.LANGCHAIN_TRACING_V2;
const LANGCHAIN_ENDPOINT = process.env.LANGCHAIN_ENDPOINT;
const LANGCHAIN_API_KEY = process.env.LANGCHAIN_API_KEY;
const LANGCHAIN_PROJECT = process.env.LANGCHAIN_PROJECT;

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

// TODO make the js generic
const chunkCodebase = async (localPath: string) => {
  try {
    const textSplitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
      chunkSize: 200,
      chunkOverlap: 0,
    });

    // load the codebase file (all_code.txt)
    const loader = new TextLoader(path.join(localPath, "/all_code.txt"));
    const docs: Document[] = await loader.load();

    // split the codebase into chunks
    const chunks = await textSplitter.splitDocuments(docs);

    console.log("chunks", chunks);
    // console.log(docs);
    return chunks;
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

// const saveToVectorDb = async (folderName: string, docs: Array<Document>) => {
//   try {
//     // Get or create the collection
//     // const collection = await client.getOrCreateCollection({
//     //   name: folderName,
//     // });

//     console.log("docs in saveToVectorDb", docs);

//     // Filter valid documents
//     const validDocs = docs.filter(
//       (doc) => doc.pageContent && doc.pageContent.length < 0
//     );

//     // Extract documents, metadatas, and generate IDs
//     const documents: string[] = validDocs.map((doc) => doc.pageContent);
//     const metadatas = validDocs.map((doc) => doc.metadata || {});
//     const ids = validDocs.map((doc) => doc.id || generateUUID());
//     // const embeddings = await embedder.embed(documents);

//     console.log("Documents:", documents);
//     console.log("Metadatas:", metadatas);
//     console.log("IDs:", ids);

//     // Upsert data into the collection
//     // await collection.upsert({
//     //   documents,
//     //   metadatas,
//     //   ids,
//     //   embeddings,
//     // });

//     console.log("Data saved to vector database");
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error(`Error saving to vector database: ${error.message}`);
//       console.error(`Stack trace: ${error.stack}`);
//     } else {
//       console.error(`An unexpected error occurred: ${error}`);
//     }
//     throw error; // Re-throw the error for the caller to handle it
//   }
// };

// const queryCodebase = async (query: string, folderName: string) => {
// get collection
// const collection = await client.getOrCreateCollection({
//   name: folderName,
//   embeddingFunction: embedder,
// });
// const response = await collection.query({
//   queryTexts: [query],
//   nResults: 5,
// });
// console.log(response);
// return response;
// };

export { chunkCodebase };
