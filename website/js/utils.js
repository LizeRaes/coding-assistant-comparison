// Utility functions for the AI Coding Assistant Comparison tool

/**
 * Helper function to extract the appropriate value from a data field
 * If the field has a 'short' property, use that; otherwise use the direct value
 * @param {Object} data - The data object containing the field
 * @param {string} field - The field name to extract
 * @returns {string} The appropriate value for display
 */
function getFieldValue(data, field) {
    const value = data[field];
    if (value && typeof value === 'object' && value.short !== undefined) {
        return value.short;
    }
    return value;
}

/**
 * Create a scroll hint element above the table
 * @param {HTMLElement} tableElement - The table element to add the hint above
 */
function createScrollHint(tableElement) {
    const scrollHint = document.createElement("div");
    scrollHint.className = "scroll-hint";
    scrollHint.textContent = "Scroll horizontally to see all columns →";
    tableElement.parentElement.insertBefore(scrollHint, tableElement);
}

/**
 * Get all available fields for filtering
 * @returns {Array} Array of field names
 */
function getAvailableFields() {
    return [
        "Tool",
        "Pricing",
        "Code Completion",
        "Chat",
        "Smart Apply",
        "Context Retrieval",
        "Output Not Copyrighted Guarantee",
        "Supported IDEs",
        "Underlying Model",
        "On Prem Option",
        "Respects Code Flavor",
        "Agent Mode",
        "Controls Tools",
        "Nice To Haves",
        "Watch Out"
    ];
}

// Export functions for use in other modules
window.getFieldValue = getFieldValue;
window.createScrollHint = createScrollHint;
window.getAvailableFields = getAvailableFields; 