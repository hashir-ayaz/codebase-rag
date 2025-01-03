import { ChatPromptTemplate } from "@langchain/core/prompts";

const validExtensions: string[] = [
  ".js", // JavaScript
  ".ts", // TypeScript
  ".py", // Python
  ".cpp", // C++
  ".c", // C
  ".dart", // Dart
  ".rs", // Rust
  ".java", // Java
  ".cs", // C#
  ".go", // Go
  ".rb", // Ruby
  ".php", // PHP
  ".html", // HTML
  ".css", // CSS
  ".scss", // Sass
  ".json", // JSON
  ".yaml", // YAML
  ".yml", // YAML
  ".swift", // Swift
  ".kt", // Kotlin
  ".m", // Objective-C
  ".h", // C/C++ Header
  ".tsx", // TypeScript JSX
  ".jsx", // JavaScript JSX
  ".sh", // Shell Script
  ".bat", // Batch Script
  ".pl", // Perl
  ".sql", // SQL
  ".md", // Markdown
  ".xml", // XML
  ".r", // R
];

const validTextSplitters = {
  html: ".html",
  cpp: ".cpp",
  go: ".go",
  java: ".java",
  js: ".js",
  php: ".php",
  proto: ".proto",
  python: ".py",
  rst: ".rst",
  ruby: ".rb",
  rust: ".rs",
  scala: ".scala",
  swift: ".swift",
  markdown: ".md",
  latex: ".tex",
  sol: ".sol",
};

const systemPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert programming assistant. Your task is to provide accurate and helpful responses to coding questions based on the given context. 
    Use the provided code snippets and documentation to inform your answers. 
    If the information isn't sufficient to answer the question, say so clearly.
    Always provide code examples when appropriate, and explain your reasoning.`,
  ],
  ["user", `{context}`],
  ["user", "Answer the following question: {question}"],
]);

export { validExtensions, validTextSplitters, systemPrompt };
