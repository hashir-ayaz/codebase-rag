# Codebase Embedding and Querying API

This project provides a RESTful API for embedding and querying codebases. It enables users to download a GitHub repository, process the codebase, store it in a vector database, and query it for relevant information.

---

## Features

- **Embed Codebase**:

  - Downloads a GitHub repository using a URL.
  - Processes and chunks the codebase.
  - Stores the processed data in a vector database.

- **Query Codebase**:
  - Accepts a natural language query.
  - Searches the vector database for the most relevant code chunks.
  - Returns the results for further processing.

---

## API Endpoints

### 1. **Embed Codebase**

- **POST** `/api/embed-codebase`
- **Description**: Downloads and processes a GitHub repository, embedding its code into a vector database.
- **Request Body**:
  ```json
  {
    "repoUrl": "https://github.com/user/repository.git"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Repository downloaded and code collected."
  }
  ```

### 2. **Query Codebase**

- **POST** `/api/query`
- **Description**: Queries the vector database with a natural language query.
- **Request Body**:
  ```json
  {
    "query": "What does the codebase do?",
    "folderName": "user_repository_timestamp"
  }
  ```
- **Response**:
  ```json
  {
    "response": [
      /* relevant code chunks */
    ]
  }
  ```

---

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-repo/codebase-embedding-api.git
   cd codebase-embedding-api
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Build the Project**:

   ```bash
   npm run build
   ```

4. **Start Server** (TypeScript):
   ```bash
   node dist/server.js
   ```

---

## Usage

1. Start the server:
   ```bash
   npm run start
   ```
2. Use an API client (like Postman or cURL) to interact with the endpoints.

---

## Requirements

- **Node.js** (v18+)
- **NPM**
- **TypeScript**

---

## Folder Structure

```
src/
├── server.ts             # Main server file
├── utils.ts              # Utility functions
├── code_service.ts       # Code processing logic
├── chroma_db.ts          # Vector database functions
cloned_codebases/         # Directory for downloaded repositories
```

---
