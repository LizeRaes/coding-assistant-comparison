# Contributing to AI Coding Assistant Comparison

Thank you for your interest in contributing to the **AI Coding Assistant Comparison**! This is a community-driven effort to maintain an up-to-date and reliable comparison of AI-powered coding assistants. Your contributions are invaluable in keeping this resource accurate and helpful.

## 🚀 How to Contribute

### 1️⃣ Submitting a New AI Tool or Updating an Existing One
1. **Fork this repository** to your own GitHub account.
2. **Edit the `data/assistants.json` file** to add or update an entry.
   - Ensure that your tool's details match the existing format.
   - Keep information **accurate and objective**.
3. **Submit a Pull Request (PR)** with your changes.
4. **Fill out the PR template**, indicating whether you are a **tool maintainer** or a **user**.
5. **Wait for review** – maintainers will verify the changes and approve the PR.

### 2️⃣ Reporting Issues or Suggesting Improvements
- If you find incorrect or outdated information, **open an Issue** on GitHub.
- If you want a **new column added** to improve comparison details, request it via an Issue.

## 📄 Formatting Guidelines
Each tool entry in `assistants.json` should follow this structure:
```json
{
      "Tool": "Cursor",
      "Code Completion": "✅",
      "Chat": "✅",
      "Smart Apply": "✅",
      "Context Retrieval": "unknown (works great) / agent mode",
      "Output Not Copyrighted Guarantee": "✖️",
      "Supported IDEs": "VSCode clone",
      "Underlying Model": "Claude, GPT, Gemini, DeepSeek, custom model",
      "On Prem Option": "✖️",
      "Respects Code Flavor": "✅ rules file",
      "Pricing": "free tier, 20$/month",
      "Agent Mode": "✅",
      "Controls Tools": "terminal, tests, compiler, pluggable MCP servers",
      "Nice To Haves": "exceptionally good at propagating changes to all necessary files, intuitive 'Apply Diff' for each modified file",
      "Watch Out": "VSCode clone (separate IDE), no IntelliJ support"
    }
```
