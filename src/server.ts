const express = require("express");
const app = express();
const port = 3000;

app.post("/api/embed-codebase", (req: any, res: any) => {});

app.post("/api/query-codebase", (req: any, res: any) => {});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
