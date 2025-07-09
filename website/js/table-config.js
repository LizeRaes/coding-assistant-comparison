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
                    return `<img src="${logoUrl}" alt="Logo" style="width: 40px; height: 40px; object-fit: contain; display: block; margin: 0 auto; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">`;
                }
                const firstLetter = toolName ? toolName.charAt(0).toUpperCase() : '?';
                return `<div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 24px; font-weight: 900; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">${firstLetter}</div>`;
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
            formatter: createShortLongFormatter("Code Completion")
        },
        {
            title: "Chat\nSupport", 
            field: "Chat", 
            width: 120, 
            variableHeight: true,
            formatter: createShortLongFormatter("Chat")
        },
        {
            title: "Smart\nApply", 
            field: "Smart Apply", 
            width: 120, 
            variableHeight: true,
            formatter: createShortLongFormatter("Smart Apply")
        },
        {
            title: "Context\nRetrieval", 
            field: "Context Retrieval", 
            width: 180, 
            variableHeight: true,
            formatter: createShortLongFormatter("Context Retrieval")
        },
        {
            title: "Output Not\nCopyrighted", 
            field: "Output Not Copyrighted Guarantee", 
            width: 120, 
            variableHeight: true,
            formatter: createShortLongFormatter("Output Not Copyrighted Guarantee")
        },
        {
            title: "Supported\nIDEs", 
            field: "Supported IDEs", 
            width: 120, 
            variableHeight: true,
            formatter: createShortLongFormatter("Supported IDEs")
        },
        {
            title: "Underlying\nModel", 
            field: "Underlying Model", 
            width: 120, 
            variableHeight: true,
            formatter: createShortLongFormatter("Underlying Model")
        },
        {
            title: "On Prem\nOption", 
            field: "On Prem Option", 
            width: 120, 
            variableHeight: true,
            formatter: createShortLongFormatter("On Prem Option")
        },
        {
            title: "Respects\nCode Flavor", 
            field: "Respects Code Flavor", 
            width: 120, 
            variableHeight: true,
            formatter: createShortLongFormatter("Respects Code Flavor")
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
                    return `<div class="short-long-cell" data-long="${value.long.replace(/"/g, '&quot;')}" style="cursor: help;">${displayValue}</div>`;
                } else {
                    // Only has direct value
                    const displayValue = getFieldValue(data, "Pricing");
                    return pricingLink ? `<a href="${pricingLink}" target="_blank">${displayValue}</a>` : displayValue;
                }
            },
            variableHeight: true
        },
        {
            title: "Agent\nMode", 
            field: "Agent Mode", 
            width: 120, 
            variableHeight: true,
            formatter: createShortLongFormatter("Agent Mode")
        },
        {
            title: "Controls\nTools", 
            field: "Controls Tools", 
            width: 120, 
            variableHeight: true,
            formatter: createShortLongFormatter("Controls Tools")
        },
        {
            title: "Nice To\nHaves", 
            field: "Nice To Haves", 
            width: 180, 
            variableHeight: true,
            formatter: createShortLongFormatter("Nice To Haves")
        },
        {
            title: "Watch\nOut", 
            field: "Watch Out", 
            width: 180, 
            variableHeight: true,
            formatter: createShortLongFormatter("Watch Out")
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