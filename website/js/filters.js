// Advanced filtering functionality for the AI Coding Assistant Comparison tool

let filterGroups = [];

/**
 * Update the table filters based on current filter groups
 * @param {Object} table - The Tabulator table instance
 */
function updateFilters(table) {
    if (filterGroups.length === 0) {
        table.clearFilter();
    } else {
        table.setFilter((data) => {
            // For each group (we currently only have one group)
            return filterGroups.every(group => {
                // Map each filter in the group to its result
                const results = group.filters.map(filter => {
                    const value = getFieldValue(data, filter.field);
                    switch (filter.type) {
                        case "=": return value === filter.value;
                        case "!=": return value !== filter.value;
                        case "like": return value?.toString().toLowerCase().includes(filter.value.toLowerCase());
                        case "not like": return !value?.toString().toLowerCase().includes(filter.value.toLowerCase());
                        default: return true;
                    }
                });

                // If operator is AND, all must be true. If OR, at least one must be true
                return group.operator === "AND" ? 
                    results.every(result => result) : 
                    results.some(result => result);
            });
        });
    }
    document.getElementById("clearFilters").classList.toggle("hidden", filterGroups.length === 0);
}

/**
 * Create an operator select dropdown for filter groups
 * @param {Object} group - The filter group object
 * @param {Function} updateCallback - Callback to call when operator changes
 * @returns {HTMLElement} The operator select element
 */
function createOperatorSelect(group, updateCallback) {
    const operatorSelect = document.createElement("select");
    operatorSelect.className = "p-2 border rounded bg-blue-100 ml-2";
    ["AND", "OR"].forEach(op => {
        const option = document.createElement("option");
        option.value = op;
        option.textContent = op;
        operatorSelect.appendChild(option);
    });
    
    operatorSelect.addEventListener("change", () => {
        group.operator = operatorSelect.value;
        updateCallback();
    });
    
    return operatorSelect;
}

/**
 * Create a filter criterion UI element
 * @param {Object} table - The Tabulator table instance
 * @param {Function} updateCallback - Callback to call when filter changes
 * @returns {Object} Object containing the filter container and filter object
 */
function createFilterCriterion(table, updateCallback) {
    const filterContainer = document.createElement("div");
    filterContainer.className = "flex items-center gap-2 bg-gray-200 p-2 rounded-md";

    const fieldSelect = document.createElement("select");
    fieldSelect.className = "p-2 border rounded";
    getAvailableFields().forEach(field => {
        const option = document.createElement("option");
        option.value = field;
        option.textContent = field;
        fieldSelect.appendChild(option);
    });

    const conditionSelect = document.createElement("select");
    conditionSelect.className = "p-2 border rounded";
    ["contains", "is", "is not", "does not contain"].forEach(cond => {
        const option = document.createElement("option");
        option.value = cond;
        option.textContent = cond;
        conditionSelect.appendChild(option);
    });

    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.className = "filter-value-input";
    valueInput.placeholder = "Enter value";

    // Create container for input and buttons
    const inputContainer = document.createElement("div");
    inputContainer.className = "input-container";
    inputContainer.appendChild(valueInput);

    // Create symbol buttons container
    const symbolButtons = document.createElement("div");
    symbolButtons.className = "symbol-buttons";

    // Create buttons for each symbol
    const symbols = [
        { symbol: "✅", tooltip: "Click to insert ✅" },
        { symbol: "✖️", tooltip: "Click to insert ✖️" }
    ];

    symbols.forEach(({ symbol, tooltip }) => {
        const button = document.createElement("button");
        button.textContent = symbol;
        button.className = "symbol-button";
        button.setAttribute("data-tooltip", tooltip);
        button.addEventListener("click", () => {
            // Get cursor position
            const start = valueInput.selectionStart;
            const end = valueInput.selectionEnd;
            
            // Insert symbol at cursor position
            valueInput.value = valueInput.value.substring(0, start) + 
                             symbol + 
                             valueInput.value.substring(end);
            
            // Move cursor after inserted symbol
            valueInput.selectionStart = valueInput.selectionEnd = start + symbol.length;
            
            // Update filter and maintain focus
            filter.value = valueInput.value;
            updateCallback();
            valueInput.focus();
        });
        symbolButtons.appendChild(button);
    });

    inputContainer.appendChild(symbolButtons);

    valueInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            filter.value = valueInput.value;
            updateCallback();
        }
    });

    valueInput.addEventListener("input", () => {
        filter.value = valueInput.value;
        updateCallback();
    });

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove criterion";
    removeButton.className = "remove-button";
    removeButton.addEventListener("click", () => {
        const groupIndex = filterGroups.findIndex(g => g.filters.includes(filter));
        if (groupIndex !== -1) {
            filterGroups[groupIndex].filters = filterGroups[groupIndex].filters.filter(f => f !== filter);
            if (filterGroups[groupIndex].filters.length === 0) {
                filterGroups.splice(groupIndex, 1);
            }
        }
        filterContainer.parentElement.remove();
        updateCallback();
    });

    const filter = { field: "Tool", type: "like", value: "" };
    
    if (filterGroups.length === 0) {
        filterGroups.push({ filters: [filter], operator: "AND" });
    } else {
        filterGroups[filterGroups.length - 1].filters.push(filter);
    }

    fieldSelect.addEventListener("change", () => {
        filter.field = fieldSelect.value;
        updateCallback();
    });
    
    conditionSelect.addEventListener("change", () => {
        filter.type = conditionSelect.value === "is" ? "=" :
                      conditionSelect.value === "is not" ? "!=" :
                      conditionSelect.value === "contains" ? "like" : "not like";
        updateCallback();
    });

    filterContainer.append(fieldSelect, conditionSelect, inputContainer, removeButton);
    
    return { filterContainer, filter };
}

/**
 * Clear all advanced filters
 */
function clearAdvancedFilters() {
    filterGroups = [];
    const filtersDiv = document.getElementById("filters");
    if (filtersDiv) filtersDiv.innerHTML = "";
}

/**
 * Get the current filter groups
 * @returns {Array} Array of filter groups
 */
function getFilterGroups() {
    return filterGroups;
}

// Export functions for use in other modules
window.updateFilters = updateFilters;
window.createOperatorSelect = createOperatorSelect;
window.createFilterCriterion = createFilterCriterion;
window.clearAdvancedFilters = clearAdvancedFilters;
window.getFilterGroups = getFilterGroups; 