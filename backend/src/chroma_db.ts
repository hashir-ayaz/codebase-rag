// import { ChromaClient } from "chromadb";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { config } from "dotenv";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { generateUUID } from "./utils.js";
import type { Document } from "@langchain/core/documents";
import path from "path";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { ChatGroq } from "@langchain/groq";
import { formattedMessages, messages } from "./constants.js";
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
      url: CHROMA_URL,
      collectionMetadata: {
        "hnsw:space": "cosine",
      },
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
  try {
    // Initialize the vector store
    const vectorStore = new Chroma(embeddings, {
      collectionName: folderName,
      url: process.env.CHROMA_URL, // Optional, will default to this value
      collectionMetadata: {
        "hnsw:space": "cosine",
      }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
    });
    console.log("vector store created!");

    // Perform similarity search
    const similaritySearchResults = await vectorStore.similaritySearch(
      query,
      10
    );

    for (const doc of similaritySearchResults) {
      console.log(
        `* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`
      );
    }

    return similaritySearchResults;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error querying the vector store: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
    } else {
      console.error(`An unexpected error occurred: ${error}`);
    }
    throw error; // Re-throw the error for the calling code to handle if necessary
  }
};

const queryLLM = async (
  query: string,
  folderName: string,
  retrievedDocs: any,
  directoryStructure: any,
  readmeContent: string
) => {
  console.log("inside the queryLLM function");
  //  query llama 3.1 with groq
  const primaryLLM = new ChatGroq({
    model: "llama-3.1-8b-instant",
    temperature: 0,
    maxTokens: 1000,
    maxRetries: 2,
    apiKey: process.env.GROQ_API_KEY,
  });

  const fallbackLLM = new ChatGroq({
    model: "llama3-8b-8192",
    temperature: 0,
    maxTokens: 1000,
    maxRetries: 2,
    apiKey: process.env.GROQ_API_KEY,
  });

  const modelWithFallback = primaryLLM.withFallbacks({
    fallbacks: [fallbackLLM],
  });

  const groqPrompt = ChatPromptTemplate.fromMessages(formattedMessages);
  const prompt = groqPrompt;

  // print the prompt
  console.log("prompt", prompt);

  const chain = prompt.pipe(modelWithFallback);

  console.log("query", query);
  console.log("retrievedDocs", retrievedDocs);
  console.log("directoryStructure", directoryStructure);
  console.log("readmeContent", readmeContent);

  const response = await chain.invoke({
    question: query,
    context: retrievedDocs,
    directoryStructure,
    readmeContent,
  });

  // appending the query and response to the prompt
  formattedMessages.push(
    { role: "ai", content: JSON.stringify(response.content) },
    {
      role: "user",
      content:
        "Answer the following question about the provided codebase: {question}",
    }
  );

  console.log("the ai's response is", response);
  return response.content;
};

export { chunkCodebase, saveToVectorDb, retrieveFromVectorDb, queryLLM };
