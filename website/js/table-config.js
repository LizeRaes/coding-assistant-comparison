// Table configuration for the AI Coding Assistant Comparison tool

/**
 * Create a formatter that shows short value with long description on hover
 * @param {string} field - The field name to format
 * @returns {Function} The formatter function
 */
function createShortLongFormatter(field) {
    return function(cell) {
        const data = cell.getData();
        const value = data[field];
        
        if (value && typeof value === 'object' && value.short !== undefined && value.long !== undefined) {
            // Has both short and long versions
            return `<div class="short-long-cell" data-long="${value.long.replace(/"/g, '&quot;')}" style="cursor: help;">${value.short}</div>`;
        } else {
            // Only has direct value
            return getFieldValue(data, field);
        }
    };
}

// Helper: wrap value in a span for centering
function centerCellFormatter(field) {
    return function(cell) {
        const value = getFieldValue(cell.getData(), field);
        return `<span>${value !== undefined && value !== null ? value : ''}</span>`;
    };
}

// --- Load tool page map ---
let toolPageMap = {};
fetch('/tools/tool_page_map.json')
  .then(res => res.json())
  .then(map => { toolPageMap = map; if(window.table) window.table.redraw(true); });

/**
 * Get the table column configuration
 * @returns {Array} Array of column definitions for Tabulator
 */
function getTableColumns() {
    return [
        {
            title: "Logo", 
            field: "Logo Url", 
            width: 60, 
            frozen: true,
            cssClass: "logo-column",
            formatter: function(cell) {
                const logoUrl = cell.getValue();
                const toolName = cell.getData().Tool;
                if (logoUrl) {
                    return `<div style="width: 40px; height: 40px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"><img src="${logoUrl}" alt="Logo" style="width: 32px; height: 32px; object-fit: contain; display: block;"></div>`;
                }
                const firstLetter = toolName ? toolName.charAt(0).toUpperCase() : '?';
                return `<div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 24px; font-weight: 900; text-shadow: 1px 1px 2px rgba(0,0,0,0.3); background: #2563eb; border-radius: 8px;">${firstLetter}</div>`;
            },
            variableHeight: true,
            headerSort: false
        },
        {
            title: "Tool\nName", 
            field: "Tool", 
            width: 120, 
            frozen: true,
            cssClass: "tool-column",
            formatter: function(cell) {
                const value = cell.getValue();
                const homepage = cell.getData().Homepage;
                const href = homepage ? homepage : '#';
                const tabIndex = homepage ? '' : 'tabindex="-1"';
                return `<a href="${href}" ${tabIndex} target="_blank" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 15px; font-weight: 800; color: white; text-decoration: underline dotted;">${value}</a>`;
            },
            variableHeight: true
        },
        {
            title: "Details", 
            field: "Details Link", 
            width: 110, 
            minWidth: 100,
            cssClass: "details-link-column",
            formatter: function(cell) {
                const detailsLink = cell.getValue();
                if (detailsLink) {
                    return `<a href="${detailsLink}" target="_blank" title="View details" style="color: white; font-weight: 400; text-decoration: underline dotted; font-size: 15px; display: inline-flex; align-items: center; gap: 4px;">Details <span style='font-size: 1.1em;'>↗</span></a>`;
                }
                return '';
            },
            headerSort: false,
            variableHeight: true
        },
        {
            title: "Code\nCompletion", 
            field: "Code Completion", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                // Use the short/long formatter, but wrap in a span for centering
                const html = createShortLongFormatter("Code Completion")(cell);
                return `<span>${html}</span>`;
            }
        },
        {
            title: "Chat\nSupport", 
            field: "Chat", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                const html = createShortLongFormatter("Chat")(cell);
                return `<span>${html}</span>`;
            }
        },
        {
            title: "Smart\nApply", 
            field: "Smart Apply", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                const html = createShortLongFormatter("Smart Apply")(cell);
                return `<span>${html}</span>`;
            }
        },
        {
            title: "Context\nRetrieval", 
            field: "Context Retrieval", 
            width: 180, 
            variableHeight: true,
            formatter: function(cell) {
                const html = createShortLongFormatter("Context Retrieval")(cell);
                return `<span>${html}</span>`;
            }
        },
        {
            title: "Output Not\nCopyrighted", 
            field: "Output Not Copyrighted Guarantee", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                const html = createShortLongFormatter("Output Not Copyrighted Guarantee")(cell);
                return `<span>${html}</span>`;
            }
        },
        {
            title: "Supported\nIDEs", 
            field: "Supported IDEs", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                const html = createShortLongFormatter("Supported IDEs")(cell);
                return `<span>${html}</span>`;
            }
        },
        {
            title: "Underlying\nModel", 
            field: "Underlying Model", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                const html = createShortLongFormatter("Underlying Model")(cell);
                return `<span>${html}</span>`;
            }
        },
        {
            title: "On Prem\nOption", 
            field: "On Prem Option", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                const html = createShortLongFormatter("On Prem Option")(cell);
                return `<span>${html}</span>`;
            }
        },
        {
            title: "Respects\nCode Flavor", 
            field: "Respects Code Flavor", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                const html = createShortLongFormatter("Respects Code Flavor")(cell);
                return `<span>${html}</span>`;
            }
        },
        {
            title: "Pricing\nInfo", 
            field: "Pricing", 
            width: 120, 
            formatter: function(cell) {
                const data = cell.getData();
                const value = data.Pricing;
                const pricingLink = data.PricingLink;
                
                if (value && typeof value === 'object' && value.short !== undefined && value.long !== undefined) {
                    // Has both short and long versions
                    const displayValue = pricingLink ? `<a href="${pricingLink}" target="_blank">${value.short}</a>` : value.short;
                    return `<span><div class="short-long-cell" data-long="${value.long.replace(/"/g, '&quot;')}" style="cursor: help;">${displayValue}</div></span>`;
                } else {
                    // Only has direct value
                    const displayValue = getFieldValue(data, "Pricing");
                    return `<span>${pricingLink ? `<a href="${pricingLink}" target="_blank">${displayValue}</a>` : displayValue}</span>`;
                }
            },
            variableHeight: true
        },
        {
            title: "Agent\nMode", 
            field: "Agent Mode", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                const html = createShortLongFormatter("Agent Mode")(cell);
                return `<span>${html}</span>`;
            }
        },
        {
            title: "Controls\nTools", 
            field: "Controls Tools", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                const html = createShortLongFormatter("Controls Tools")(cell);
                return `<span>${html}</span>`;
            }
        },
        {
            title: "Nice To\nHaves", 
            field: "Nice To Haves", 
            width: 180, 
            variableHeight: true,
            formatter: function(cell) {
                const html = createShortLongFormatter("Nice To Haves")(cell);
                return `<span>${html}</span>`;
            }
        },
        {
            title: "Watch\nOut", 
            field: "Watch Out", 
            width: 180, 
            variableHeight: true,
            formatter: function(cell) {
                const html = createShortLongFormatter("Watch Out")(cell);
                return `<span>${html}</span>`;
            }
        },
    ];
}

/**
 * Get the table configuration object
 * @returns {Object} Tabulator configuration object
 */
function getTableConfig() {
    return {
        data: assistants,
        layout: "fitColumns",
        columns: getTableColumns(),
        height: "100%",
        rowFormatter: function(row) {
            const index = row.getPosition() + 1;
            const colorClass = `row-color-${((index - 1) % 6) + 1}`;
            row.getElement().classList.add(colorClass);
        }
    };
}

// Export functions for use in other modules
window.getTableColumns = getTableColumns;
window.getTableConfig = getTableConfig; 