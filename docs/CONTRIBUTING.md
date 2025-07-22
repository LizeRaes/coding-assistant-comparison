# Contributing to AI Coding Assistant Comparison

Thank you for contributing to the **AI Coding Assistant Comparison**! This is a community-driven effort to maintain an up-to-date comparison of AI-powered coding assistants.

## 🚀 How to Contribute

### Adding or Updating a Tool

1. **Fork this repository**
2. **Edit the appropriate data file** based on the tool type:
   - `website/data/coding_assistants.js` - For IDE-integrated coding assistants
   - `website/data/cli_assistants.js` - For command-line tools
   - `website/data/low_code_assistants.js` - For no-code/low-code platforms
   - `website/data/specialized_assistants.js` - For specialized tools (e.g., migration tools)

3. **Add your tool entry** following the format below
4. **Test your changes** by opening `website/index.html` in your browser
5. **Submit a Pull Request**

### Example Entry (Jules)

```javascript
{
  "Tool": "Jules",
  "tool_type": "coding_assistant",
  "Homepage": "https://jules.google/",
  "PricingLink": "",
  "Logo Url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvAXEz4EsU3RQHCV96BAfJusei09ZBjQOG2g&s",
  "Details Link": "tools/jules.html",
  "Open Source": { "short": "✖️", "long": "✖️" },
  "Code Completion": { "short": "✖️", "long": "✖️" },
  "Chat": { "short": "✅", "long": "✅" },
  "Smart Apply": { "short": "✅", "long": "✅(edits files)" },
  "Context Retrieval": { "short": "inspects project", "long": "inspects project" },
  "Output Not Copyrighted Guarantee": { "short": "✖️", "long": "✖️" },
  "Supported IDEs": { "short": "Web UI, GitHub PRs", "long": "Web UI, GitHub PRs" },
  "Underlying Model": { "short": "Gemini", "long": "Gemini" },
  "On Prem Option": { "short": "✖️", "long": "✖️" },
  "Respects Code Flavor": { "short": "unknown", "long": "unknown" },
  "Pricing": { "short": "Free (beta)", "long": "Free (beta)" },
  "Agent Mode": { "short": "background agent", "long": "background agent" },
  "Controls Tools": { "short": "runs tests, manages PRs, integrates with GitHub", "long": "runs tests, manages PRs, integrates with GitHub" },
  "Nice To Haves": { "short": "GitHub integration, branch selection, runs code in VM, creates PR, audio summaries", "long": "GitHub integration, branch selection, runs code in VM, creates PR, audio summaries" },
  "Watch Out": { "short": "mainly intended for small features and repetitive work", "long": "mainly intended for small features and repetitive work" }
}
```

### Key Points

- **Copy the Jules example** and replace the values
- **Use sentence case** for descriptions (only uppercase proper nouns, abbreviations)
- **Include both `short` and `long` versions** for each field
- **Add `tool_type`** matching the file name: `coding_assistant`, `cli_tool`, `low_code`, or `specialized`
- **Keep information accurate and objective**

### Reporting Issues

- **Open an Issue** for incorrect/outdated information
- **Request new columns** via Issues for comparison improvements

## 📄 Field Descriptions

| Field | Description |
|-------|-------------|
| `Tool` | Tool name |
| `tool_type` | Category: `coding_assistant`, `cli_tool`, `low_code`, `specialized` |
| `Homepage` | Official website URL |
| `PricingLink` | Pricing page URL (optional) |
| `Logo Url` | Tool logo image URL |
| `Details Link` | Auto-generated, leave as `tools/toolname.html` |
| `Open Source` | ✅ for open source, ✖️ for proprietary |
| `Code Completion` | ✅ for inline code completion |
| `Chat` | ✅ for chat interface |
| `Smart Apply` | How code changes are applied |
| `Context Retrieval` | How the tool gets code context |
| `Output Not Copyrighted Guarantee` | ✅ if vendor guarantees no potential copyright issues |
| `Supported IDEs` | List of supported development environments |
| `Underlying Model` | AI models used (Claude, GPT, etc.) |
| `On Prem Option` | ✅ if self-hosted option available |
| `Respects Code Flavor` | How the tool adapts to project conventions |
| `Pricing` | Pricing information |
| `Agent Mode` | ✅ for autonomous agent capabilities |
| `Controls Tools` | What tools the AI can control |
| `Nice To Haves` | Positive features/advantages |
| `Watch Out` | Limitations, concerns, or warnings |
