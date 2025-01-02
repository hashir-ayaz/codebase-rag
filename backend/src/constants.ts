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

export { validExtensions, validTextSplitters };
