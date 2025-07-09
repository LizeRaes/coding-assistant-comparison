// Table configuration for the AI Coding Assistant Comparison tool

/**
 * Get the table column configuration
 * @returns {Array} Array of column definitions for Tabulator
 */
function getTableColumns() {
    return [
        {
            title: "Tool\nName", 
            field: "Tool", 
            width: 120, 
            frozen: true,
            cssClass: "tool-column",
            formatter: function(cell) {
                const value = cell.getValue();
                const homepage = cell.getData().Homepage;
                return homepage ? 
                    `<a href="${homepage}" target="_blank" style="font-size: 15px; font-weight: 800;">${value}</a>` : 
                    `<div style="font-size: 15px; font-weight: 800;">${value}</div>`;
            },
            variableHeight: true
        },
        {
            title: "Code\nCompletion", 
            field: "Code Completion", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                return getFieldValue(cell.getData(), "Code Completion");
            }
        },
        {
            title: "Chat\nSupport", 
            field: "Chat", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                return getFieldValue(cell.getData(), "Chat");
            }
        },
        {
            title: "Smart\nApply", 
            field: "Smart Apply", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                return getFieldValue(cell.getData(), "Smart Apply");
            }
        },
        {
            title: "Context\nRetrieval", 
            field: "Context Retrieval", 
            width: 180, 
            variableHeight: true,
            formatter: function(cell) {
                return getFieldValue(cell.getData(), "Context Retrieval");
            }
        },
        {
            title: "Output Not\nCopyrighted", 
            field: "Output Not Copyrighted Guarantee", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                return getFieldValue(cell.getData(), "Output Not Copyrighted Guarantee");
            }
        },
        {
            title: "Supported\nIDEs", 
            field: "Supported IDEs", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                return getFieldValue(cell.getData(), "Supported IDEs");
            }
        },
        {
            title: "Underlying\nModel", 
            field: "Underlying Model", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                return getFieldValue(cell.getData(), "Underlying Model");
            }
        },
        {
            title: "On Prem\nOption", 
            field: "On Prem Option", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                return getFieldValue(cell.getData(), "On Prem Option");
            }
        },
        {
            title: "Respects\nCode Flavor", 
            field: "Respects Code Flavor", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                return getFieldValue(cell.getData(), "Respects Code Flavor");
            }
        },
        {
            title: "Pricing\nInfo", 
            field: "Pricing", 
            width: 120, 
            formatter: function(cell) {
                const value = getFieldValue(cell.getData(), "Pricing");
                const pricingLink = cell.getData().PricingLink;
                return pricingLink ? `<a href="${pricingLink}" target="_blank">${value}</a>` : value;
            },
            variableHeight: true
        },
        {
            title: "Agent\nMode", 
            field: "Agent Mode", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                return getFieldValue(cell.getData(), "Agent Mode");
            }
        },
        {
            title: "Controls\nTools", 
            field: "Controls Tools", 
            width: 120, 
            variableHeight: true,
            formatter: function(cell) {
                return getFieldValue(cell.getData(), "Controls Tools");
            }
        },
        {
            title: "Nice To\nHaves", 
            field: "Nice To Haves", 
            width: 180, 
            variableHeight: true,
            formatter: function(cell) {
                return getFieldValue(cell.getData(), "Nice To Haves");
            }
        },
        {
            title: "Watch\nOut", 
            field: "Watch Out", 
            width: 180, 
            variableHeight: true,
            formatter: function(cell) {
                return getFieldValue(cell.getData(), "Watch Out");
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