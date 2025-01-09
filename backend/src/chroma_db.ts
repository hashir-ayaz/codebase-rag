// import { ChromaClient } from "chromadb";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { config } from "dotenv";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { promises as fs } from "fs";
import { generateUUID } from "./utils.js";
import type { Document } from "@langchain/core/documents";
import path from "path";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { ChatGroq } from "@langchain/groq";
import { groqPrompt } from "./constants.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
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
      chunkSize: 1000,
      chunkOverlap: 0,
    });

    // load the codebase file (all_code.txt)
    const loader = new TextLoader(path.join(localPath, "/all_code.txt"));
    const docs: Document[] = await loader.load();

    // split the codebase into chunks
    const chunks: Document[] = await textSplitter.splitDocuments(docs);

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

const saveToVectorDb = async (folderName: string, docs: Document[]) => {
  const CHROMA_URL = process.env.CHROMA_URL;
  try {
    // create vector store
    const vectorStore = new Chroma(embeddings, {
      collectionName: folderName,
      // url: "http://localhost:8000",
      url: CHROMA_URL, // Optional, will default to this value
      collectionMetadata: {
        "hnsw:space": "cosine",
      }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
    });
    console.log("vector store created!");
    // add docs to vector store
    await vectorStore.addDocuments(docs, {
      ids: docs.map((doc) => generateUUID()),
    });
    console.log("docs added to vector store!");

    return docs;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error creating vector store: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
    } else {
      console.error(
        `An unexpected error occurred while creating vector store: ${error}`
      );
    }
    throw error; // Re-throw the error for the calling code to handle if necessary
  }
};

const retrieveFromVectorDb = async (query: string, folderName: string) => {
  // get the vector store
  const vectorStore = new Chroma(embeddings, {
    collectionName: folderName,
    url: "http://localhost:8001", // Optional, will default to this value
    collectionMetadata: {
      "hnsw:space": "cosine",
    }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
  });
  console.log("vector store created!");

  // const filter = { source: "https://example.com" };

  const similaritySearchResults = await vectorStore.similaritySearch(query, 10);

  for (const doc of similaritySearchResults) {
    console.log(`* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`);
  }

  return similaritySearchResults;
};

const queryLLM = async (
  query: string,
  folderName: string,
  retrievedDocs: any,
  directoryStructure: any,
  readmeContent: string
) => {
  //  query llama 3.1 with groq
  const llm = new ChatGroq({
    model: "llama-3.1-70b-versatile",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    apiKey: process.env.GROQ_API_KEY,
  });

  const prompt = groqPrompt;

  const chain = prompt.pipe(llm);

  const response = await chain.invoke({
    question: query,
    context: retrievedDocs,
    directoryStructure,
    readmeContent,
  });

  return response.content;
};

export { chunkCodebase, saveToVectorDb, retrieveFromVectorDb, queryLLM };
