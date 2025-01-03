import * as dotenv from "dotenv";
dotenv.config();

import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import type { Document } from "@langchain/core/documents";

// Load environment variables from .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "";
// const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT || "";
const PINECONE_INDEX = process.env.PINECONE_INDEX || "";

async function makeVectorStore() {
  // Use a valid embedding model name:
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
    modelName: "text-embedding-3-small", // valid OpenAI embedding model
  });

  // Initialize Pinecone
  const pinecone = new PineconeClient({ apiKey: PINECONE_API_KEY });
  //   await pinecone.init({
  //     apiKey: PINECONE_API_KEY,
  //     environment: PINECONE_ENVIRONMENT,
  //   });

  // Access the index
  const pineconeIndex = pinecone.Index(PINECONE_INDEX);

  // Create or load the vector store from an existing Pinecone index
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
    // optionally set a namespace: namespace: "foo",
  });
  console.log("Vector store created!");

  return vectorStore;
}

async function insertDocuments() {
  // Build (or load) the vector store
  const vectorStore = await makeVectorStore();

  // Example documents
  const document1: Document = {
    pageContent: "The powerhouse of the cell is the mitochondria",
    metadata: { source: "https://example.com" },
  };

  const document2: Document = {
    pageContent: "Buildings are made out of brick",
    metadata: { source: "https://example.com" },
  };

  const document3: Document = {
    pageContent: "Mitochondria are made out of lipids",
    metadata: { source: "https://example.com" },
  };

  const document4: Document = {
    pageContent: "The 2024 Olympics are in Paris",
    metadata: { source: "https://example.com" },
  };

  const documents = [document1, document2, document3, document4];

  // Add documents to the vector store
  await vectorStore.addDocuments(documents, {
    ids: ["1", "2", "3", "4"],
  });

  console.log("Documents inserted into Pinecone!");
}

// Run insertDocuments
console.log("Inserting documents into Pinecone...");
insertDocuments().catch((error) => {
  console.error("Error inserting documents:", error);
});
