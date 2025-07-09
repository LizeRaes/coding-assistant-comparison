// Quick filter bar functionality for the AI Coding Assistant Comparison tool

/**
 * Quick filter column definitions
 */
const quickFilterColumns = [
    { field: "Code Completion", label: "Code Completion" },
    { field: "Chat", label: "Chat Support" },
    { field: "Smart Apply", label: "Smart Apply" },
    { field: "Output Not Copyrighted Guarantee", label: "Output Not Copyrighted" },
    { field: "On Prem Option", label: "On Prem Option" },
    { field: "Respects Code Flavor", label: "Respects Code Flavor" },
    { field: "Agent Mode", label: "Agent Mode" }
];

let quickFilterState = {
    toggleState: {},
    textSearchValue: ""
};

/**
 * Initialize the quick filter bar
 * @param {Object} table - The Tabulator table instance
 * @param {Function} updateCallback - Callback to call when filters change
 */
function initializeQuickFilters(table, updateCallback) {
    const quickFiltersBar = document.getElementById("quick-filters-bar");
    if (!quickFiltersBar) return;

    // Initialize toggle state
    quickFilterColumns.forEach(col => quickFilterState.toggleState[col.field] = false);

    // Create container
    const bar = document.createElement("div");
    bar.className = "flex flex-wrap gap-2 items-center bg-white p-3 rounded-lg shadow-md mb-2 flex-col";

    // First row: label + toggles
    const firstRow = document.createElement("div");
    firstRow.className = "flex flex-wrap gap-2 items-center w-full mb-2";
    const label = document.createElement("span");
    label.textContent = "Click to filter:";
    label.className = "font-semibold mr-2";
    firstRow.appendChild(label);

    // Toggle buttons
    quickFilterColumns.forEach(col => {
        const btn = document.createElement("button");
        btn.textContent = col.label;
        btn.className = "px-3 py-1 rounded border font-semibold bg-white text-gray-800 hover:bg-green-100 transition";
        btn.setAttribute("data-field", col.field);
        btn.addEventListener("click", () => {
            quickFilterState.toggleState[col.field] = !quickFilterState.toggleState[col.field];
            updateQuickFilters(table, updateCallback);
        });
        firstRow.appendChild(btn);
    });
    bar.appendChild(firstRow);

    // Second row: clear button, text search label, text input
    const secondRow = document.createElement("div");
    secondRow.className = "flex flex-wrap gap-2 items-center w-full";

    // Clear all filters button
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear All Filters";
    clearBtn.className = "px-3 py-1 rounded bg-red-500 text-white font-semibold hover:bg-red-700 transition hidden";
    clearBtn.addEventListener("click", () => {
        clearQuickFilters(table, updateCallback);
    });
    secondRow.appendChild(clearBtn);

    // Text search label
    const searchLabel = document.createElement("span");
    searchLabel.textContent = "Free text search";
    searchLabel.className = "ml-2 font-semibold";
    secondRow.appendChild(searchLabel);

    // Free text search
    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.placeholder = "eg. IntelliJ";
    textInput.className = "ml-2 px-3 py-1 border rounded w-64 text-gray-400";
    textInput.addEventListener("input", (e) => {
        quickFilterState.textSearchValue = e.target.value;
        updateQuickFilters(table, updateCallback);
    });
    textInput.addEventListener("focus", () => {
        if (!textInput.value) textInput.classList.remove("text-gray-400");
    });
    textInput.addEventListener("blur", () => {
        if (!textInput.value) textInput.classList.add("text-gray-400");
    });
    secondRow.appendChild(textInput);

    bar.appendChild(secondRow);
    quickFiltersBar.appendChild(bar);

    // Store references for later use
    quickFilterState.firstRow = firstRow;
    quickFilterState.clearBtn = clearBtn;
    quickFilterState.textInput = textInput;
}

/**
 * Update the quick filters and apply them to the table
 * @param {Object} table - The Tabulator table instance
 * @param {Function} updateCallback - Callback to call when filters change
 */
function updateQuickFilters(table, updateCallback) {
    // Update button styles
    quickFilterState.firstRow.querySelectorAll("button[data-field]").forEach(btn => {
        const field = btn.getAttribute("data-field");
        if (quickFilterState.toggleState[field]) {
            btn.classList.remove("bg-white", "text-gray-800");
            btn.classList.add("bg-green-500", "text-white");
        } else {
            btn.classList.remove("bg-green-500", "text-white");
            btn.classList.add("bg-white", "text-gray-800");
        }
    });

    // Show/hide clear button
    const anyActive = Object.values(quickFilterState.toggleState).some(v => v) || quickFilterState.textSearchValue.length > 0;
    quickFilterState.clearBtn.classList.toggle("hidden", !anyActive);

    // Greyed out text for input
    if (!quickFilterState.textInput.value) {
        quickFilterState.textInput.classList.add("text-gray-400");
    } else {
        quickFilterState.textInput.classList.remove("text-gray-400");
    }

    // Apply filters
    if (Object.values(quickFilterState.toggleState).some(v => v) || quickFilterState.textSearchValue.length > 0) {
        table.setFilter((data) => {
            // All toggles must match (contains-check)
            for (const col of quickFilterColumns) {
                if (quickFilterState.toggleState[col.field] && (!getFieldValue(data, col.field) || !getFieldValue(data, col.field).includes("✅"))) return false;
            }
            // Text search: match any field
            if (quickFilterState.textSearchValue.length > 0) {
                const search = quickFilterState.textSearchValue.toLowerCase();
                let found = false;
                for (const key in data) {
                    const fieldValue = getFieldValue(data, key);
                    if (fieldValue && fieldValue.toString().toLowerCase().includes(search)) {
                        found = true;
                        break;
                    }
                }
                if (!found) return false;
            }
            return true;
        });
    } else {
        table.clearFilter();
    }

    // Call the update callback to combine with other filters
    if (updateCallback) {
        updateCallback();
    }
}

/**
 * Clear all quick filters
 * @param {Object} table - The Tabulator table instance
 * @param {Function} updateCallback - Callback to call when filters change
 */
function clearQuickFilters(table, updateCallback) {
    quickFilterColumns.forEach(col => quickFilterState.toggleState[col.field] = false);
    quickFilterState.textSearchValue = "";
    quickFilterState.textInput.value = "";
    updateQuickFilters(table, updateCallback);
}

/**
 * Get the quick filter logic function for combining with other filters
 * @returns {Function} The quick filter logic function
 */
function getQuickFilterLogic() {
    return function(data) {
        // All toggles must match (contains-check)
        for (const col of quickFilterColumns) {
            if (quickFilterState.toggleState[col.field] && (!getFieldValue(data, col.field) || !getFieldValue(data, col.field).includes("✅"))) return false;
        }
        // Text search: match any field
        if (quickFilterState.textSearchValue.length > 0) {
            const search = quickFilterState.textSearchValue.toLowerCase();
            let found = false;
            for (const key in data) {
                const fieldValue = getFieldValue(data, key);
                if (fieldValue && fieldValue.toString().toLowerCase().includes(search)) {
                    found = true;
                    break;
                }
            }
            if (!found) return false;
        }
        return true;
    };
}

// Export functions for use in other modules
window.initializeQuickFilters = initializeQuickFilters;
window.updateQuickFilters = updateQuickFilters;
window.clearQuickFilters = clearQuickFilters;
window.getQuickFilterLogic = getQuickFilterLogic; 