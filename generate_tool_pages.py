#!/usr/bin/env python3
"""
Generate individual tool pages from the four separate data files
"""

import json
import os
import re
import subprocess
import tempfile
from pathlib import Path
from urllib.parse import urlparse

def clean_filename(tool_name):
    """Convert tool name to a clean filename"""
    # Remove special characters and replace spaces with hyphens
    clean = re.sub(r'[^\w\s-]', '', tool_name)
    clean = re.sub(r'[-\s]+', '-', clean)
    return clean.lower()

def get_field_value(data, field):
    """Extract the appropriate value from a data field"""
    value = data.get(field)
    if value and isinstance(value, dict) and 'short' in value:
        return value['short']
    return value

def get_long_value(data, field):
    """Extract the long value from a data field if available"""
    value = data.get(field)
    if value and isinstance(value, dict) and 'long' in value:
        return value['long']
    return None

def get_category_display_name(tool_type):
    """Convert tool_type to display name"""
    category_map = {
        'coding_assistant': 'Coding Assistant',
        'cli_tool': 'CLI Tool', 
        'low_code': 'Low Code / No Code Tool',
        'specialized': 'Specialized Tool'
    }
    return category_map.get(tool_type, tool_type)

def generate_tool_page(tool_data, output_dir):
    """Generate HTML page for a single tool"""
    tool_name = tool_data['Tool']
    filename = clean_filename(tool_name) + '.html'
    filepath = output_dir / filename
    
    # Extract data
    homepage = tool_data.get('Homepage', '')
    pricing_link = tool_data.get('PricingLink', '')
    logo_url = tool_data.get('Logo Url', '')
    version = tool_data.get('Version', '')
    last_updated = tool_data.get('Last Updated', '')
    tool_type = tool_data.get('tool_type', '')
    category_display = get_category_display_name(tool_type)
    
    # Get summary
    summary = tool_data.get('Summary', 'No summary provided')
    
    # Get pricing and open source info
    pricing_data = tool_data.get('Pricing', '')
    open_source_data = tool_data.get('Open Source', '')
    
    # Format pricing text
    if isinstance(pricing_data, dict):
        pricing_text = pricing_data.get('long') or pricing_data.get('short') or ''
    else:
        pricing_text = pricing_data
    pricing_html = f"<p>{pricing_text if pricing_text else 'Pricing information not available'}</p>"
    if pricing_link:
        pricing_html += f'<p><a href="{pricing_link}" target="_blank" rel="noopener">See latest pricing on vendor site ↗</a></p>'
    
    # Format open source text
    if isinstance(open_source_data, dict):
        open_source_text = open_source_data.get('long') or open_source_data.get('short') or ''
    else:
        open_source_text = open_source_data
    
    # Define fields to include in features table
    feature_fields = [
        'Code Completion',
        'Chat',
        'Smart Apply', 
        'Context Retrieval',
        'Output Not Copyrighted Guarantee',
        'Supported IDEs',
        'Underlying Model',
        'On Prem Option',
        'Respects Code Flavor',
        'Agent Mode',
        'Controls Tools'
    ]
    
    # Generate features table rows (only long values)
    feature_rows = []
    for field in feature_fields:
        value = tool_data.get(field, '')
        if value:
            # Get long value if available, otherwise use the direct value
            if isinstance(value, dict) and 'long' in value:
                display_value = value['long']
            else:
                display_value = value
            
            if display_value:  # Only add if there's a value to display
                feature_rows.append(f"""
      <tr>
        <td>{field}</td>
        <td>{display_value}</td>
      </tr>""")
    
    # Get pros and cons
    nice_to_haves = get_field_value(tool_data, 'Nice To Haves')
    watch_out = get_field_value(tool_data, 'Watch Out')
    
    # Generate HTML
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>{tool_name} - AI Coding Tool Comparison</title>
  <meta name="description" content="Full feature details and comparison for {tool_name}, an AI coding assistant. Explore integrations, capabilities, pros, and cons." />
  <meta name="keywords" content="{tool_name}, AI coding assistant, code completion, developer tools, IDE integration" />
  <meta name="author" content="AI Coding Assistant Comparison" />
  <meta property="og:title" content="{tool_name} - AI Coding Tool Comparison" />
  <meta property="og:description" content="Full feature details and comparison for {tool_name}, an AI coding assistant." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://aitoolcomparator.com/tools/{filename}" />
  <link rel="stylesheet" href="../styles.css" />
  <link rel="icon" type="image/png" href="../code-assist.png" />
  <link rel="apple-touch-icon" href="../code-assist.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="../code-assist.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="../code-assist.png" />
  <style>
    body {{
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f3f4f6;
    }}
    
    .container {{
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }}
    
    header {{
      background: linear-gradient(135deg, #1e40af, #3b82f6);
      color: white;
      padding: 40px;
      text-align: center;
    }}
    
    header h1 {{
      margin: 0 0 20px 0;
      font-size: 2.5em;
      font-weight: 800;
    }}
    
    header p {{
      margin: 10px 0;
      font-size: 1.1em;
    }}
    
    header a {{
      color: #93c5fd;
      text-decoration: none;
      font-weight: 600;
    }}
    
    header a:hover {{
      text-decoration: underline;
    }}
    
    .tool-logo {{
      width: 120px;
      height: 120px;
      object-fit: contain;
      margin: 20px auto;
      display: block;
      background: white;
      border-radius: 10px;
      padding: 10px;
    }}
    
    .tool-info {{
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-top: 20px;
      font-size: 0.9em;
      opacity: 0.9;
      flex-wrap: wrap;
    }}
    
    .category-badge {{
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9em;
      margin: 10px 0;
      display: inline-block;
    }}
    
    section {{
      padding: 30px 40px;
      border-bottom: 1px solid #e5e7eb;
    }}
    
    section:last-child {{
      border-bottom: none;
    }}
    
    h2 {{
      color: #1e40af;
      font-size: 1.8em;
      margin-bottom: 20px;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 10px;
    }}
    
    h3 {{
      color: #374151;
      font-size: 1.3em;
      margin: 25px 0 15px 0;
    }}
    
    .pricing-open-source {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 0;
      margin-bottom: 0;
      /* No custom padding, let section handle it */
    }}
    
    .pricing, .open-source {{
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;
    }}
    
    .pricing h3, .open-source h3 {{
      margin-top: 0;
      color: #1e40af;
    }}
    
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }}
    
    th, td {{
      padding: 15px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }}
    
    th {{
      background: #1e40af;
      color: white;
      font-weight: 600;
    }}
    
    tr:nth-child(even) {{
      background: #f9fafb;
    }}
    
    tr:hover {{
      background: #f3f4f6;
    }}
    
    .pros-cons {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 20px;
    }}
    
    .pros, .cons {{
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid;
    }}
    
    .pros {{
      border-left-color: #10b981;
    }}
    
    .cons {{
      border-left-color: #ef4444;
    }}
    
    footer {{
      background: #374151;
      color: white;
      text-align: center;
      padding: 20px;
    }}
    
    footer a {{
      color: #93c5fd;
      text-decoration: none;
      font-weight: 600;
    }}
    
    footer a:hover {{
      text-decoration: underline;
    }}
    
    @media (max-width: 768px) {{
      .pros-cons, .pricing-open-source {{
        grid-template-columns: 1fr;
      }}
      
      .tool-info {{
        flex-direction: column;
        gap: 10px;
      }}
      
      header {{
        padding: 20px;
      }}
      
      section {{
        padding: 20px;
      }}
    }}
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>{tool_name}</h1>
      <div class="category-badge">{category_display}</div>
      <p><a href="{homepage}" target="_blank" rel="noopener">Official Website ↗</a></p>
      {f'<img src="{logo_url}" alt="{tool_name} logo" class="tool-logo" />' if logo_url else ''}
      <div class="tool-info">
        {f'<p>Version: {version}</p>' if version else ''}
        {f'<p>Last updated: {last_updated}</p>' if last_updated else ''}
      </div>
    </header>

    <section>
      <h2>Summary</h2>
      <p>{summary}</p>
    </section>

    <section>
      <div class="pricing-open-source">
        <div class="pricing">
          <h3>Pricing</h3>
          {pricing_html}
        </div>
        <div class="open-source">
          <h3>Open Source</h3>
          <p>{open_source_text if open_source_text else 'Open source information not available'}</p>
        </div>
      </div>
    </section>

    <section>
      <h2>Features</h2>
      <table>
        <tr>
          <th>Feature</th>
          <th>Details</th>
        </tr>{''.join(feature_rows)}
      </table>
    </section>

    <section>
      <h2>Pros & Cons</h2>
      <div class="pros-cons">
        <div class="pros">
          <h3>Nice To Haves</h3>
          <p>{nice_to_haves if nice_to_haves else 'No specific advantages listed.'}</p>
        </div>
        <div class="cons">
          <h3>Watch Out</h3>
          <p>{watch_out if watch_out else 'No specific concerns listed.'}</p>
        </div>
      </div>
    </section>

    <footer>
      <p><a href="../index.html">← Back to tool comparison table</a></p>
    </footer>
  </div>
</body>
</html>"""
    
    # Write file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"Generated: {filename}")
    return filename

def parse_js_file(js_file):
    """Parse a JavaScript file containing a const array assignment."""
    with open(js_file, 'r', encoding='utf-8') as f:
        content = f.read().strip()
    
    # Extract the variable name from the const declaration
    if content.startswith('const '):
        # Find the first space after 'const' and the first '=' after that
        const_end = content.find(' ', 6)  # Skip 'const '
        equals_pos = content.find('=', const_end)
        if equals_pos != -1:
            # Get everything after the '='
            content = content[equals_pos + 1:].strip()
    
    # Remove trailing semicolon if present
    if content.endswith(';'):
        content = content[:-1]
    
    # Remove any trailing or leading whitespace/newlines
    content = content.strip()
    
    # Now parse as JSON
    return json.loads(content)

def main():
    """Main function to generate all tool pages"""
    # Setup paths
    script_dir = Path(__file__).parent
    website_dir = script_dir / 'website'
    data_dir = website_dir / 'data'
    output_dir = website_dir / 'tools'
    
    # Clear and recreate output directory
    if output_dir.exists():
        import shutil
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True)
    
    # Define the four data files
    data_files = [
        ('coding_assistants.js', 'coding_assistant'),
        ('cli_assistants.js', 'cli_tool'),
        ('low_code_assistants.js', 'low_code'),
        ('specialized_assistants.js', 'specialized')
    ]
    
    # Read and combine data from all files
    all_tools = []
    for filename, tool_type in data_files:
        js_file = data_dir / filename
        if not js_file.exists():
            print(f"Warning: {js_file} not found, skipping...")
            continue
        
        try:
            tools = parse_js_file(js_file)
            # Add tool_type to each tool if not already present
            for tool in tools:
                if 'tool_type' not in tool:
                    tool['tool_type'] = tool_type
            all_tools.extend(tools)
            print(f"Loaded {len(tools)} tools from {filename}")
        except Exception as e:
            print(f"Error parsing {filename}: {e}")
            continue
    
    if not all_tools:
        print("No tools found in any data files!")
        return
    
    # Generate pages for each tool and collect mapping
    generated_files = []
    tool_to_filename = {}
    for tool in all_tools:
        if tool.get('Tool'):  # Only process tools with names
            filename = generate_tool_page(tool, output_dir)
            generated_files.append(filename)
            tool_to_filename[tool['Tool']] = f"tools/{filename}"
    
    print(f"\nGenerated {len(generated_files)} tool pages in {output_dir}")
    print("Files generated:")
    for filename in sorted(generated_files):
        print(f"  - {filename}")
    
    # Write mapping for use in JS
    with open(website_dir / 'tools' / 'tool_page_map.json', 'w', encoding='utf-8') as f:
        json.dump(tool_to_filename, f, indent=2)
    
    print(f"\nTool page mapping saved to {website_dir / 'tools' / 'tool_page_map.json'}")

if __name__ == "__main__":
    main() 