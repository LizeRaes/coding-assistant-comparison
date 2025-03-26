# Contributing to AI Coding Assistant Comparison

Thank you for your interest in contributing to the **AI Coding Assistant Comparison**! This is a community-driven effort to maintain an up-to-date and reliable comparison of AI-powered coding assistants. Your contributions are invaluable in keeping this resource accurate and helpful.

## 🚀 How to Contribute

### 1️⃣ Submitting a New AI Tool or Updating an Existing One
1. **Fork this repository** to your own GitHub account.
2. **Edit the `data/assistants.json` file** to add or update an entry.
   - You can use `Ctrl+F` to quickly find an existing tool's entry
   - Ensure that your tool's details match the existing format.
   - Keep information **accurate and objective**.
3. **Test your changes** by opening `index.html` in your browser to preview how it will look on the website
4. **Submit a Pull Request (PR)** with your changes.
5. **Fill out the PR template**, indicating whether you are a **tool maintainer** or a **user**.
6. **Wait for review** – maintainers will verify the changes and approve the PR.

### 2️⃣ Reporting Issues or Suggesting Improvements
- If you find incorrect or outdated information, **open an Issue** on GitHub.
- If you want a **new column added** to improve comparison details, request it via an Issue.

## 📄 Formatting Guidelines
Each tool entry in `assistants.json` should follow this structure:
```json
{
      "Tool": "My New Code Assistant",
      "Homepage": "https://mynewassistant.com/", // (optional)
      "PricingLink": "https://mynewassistant.com/pricing", // (optional)
      "Code Completion": "✅",
      "Chat": "✅",
      "Smart Apply": "edits files",
      "Context Retrieval": "manual select / RAG (opt.)",
      "Output Not Copyrighted Guarantee": "✖️",
      "Supported IDEs": "VSCode, IntelliJ, WebStorm",
      "Underlying Model": "Claude, GPT-4",
      "On Prem Option": "✖️",
      "Respects Code Flavor": "✅ config file",
      "Pricing": "free tier, 15$/month",
      "Agent Mode": "✅",
      "Controls Tools": "terminal, tests, compiler",
      "Nice To Haves": "great at refactoring, supports multiple languages",
      "Watch Out": "no support for Visual Studio"
}
```
