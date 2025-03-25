document.addEventListener("DOMContentLoaded", function () {
    let table;
    let filterGroups = []; // Array of filter groups, each group has filters and operator

    // Initialize Tabulator table with pre-loaded data
    table = new Tabulator("#table", {
        data: assistants, // This will be available from the JSON file
        layout: "fitColumns",
        columns: [
            { title: "Tool", field: "Tool", formatter: "link", formatterParams: { urlField: "Website" }},
            { title: "Pricing", field: "Pricing" },
            { title: "Code Completion", field: "Code Completion" },
            { title: "Chat", field: "Chat" },
            { title: "Smart Apply", field: "Smart Apply" },
            { title: "On Prem Option", field: "On Prem Option" },
            { title: "Agent Mode", field: "Agent Mode" },
            { title: "Watch Out", field: "Watch Out" },
        ],
    });

    // Filtering logic
    function updateFilters() {
        if (filterGroups.length === 0) {
            table.clearFilter();
        } else {
            table.setFilter((data) => {
                // For each group (we currently only have one group)
                return filterGroups.every(group => {
                    // Map each filter in the group to its result
                    const results = group.filters.map(filter => {
                        const value = data[filter.field];
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

    function createOperatorSelect(group) {
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
            updateFilters();
        });
        
        return operatorSelect;
    }

    document.getElementById("addFilter").addEventListener("click", function () {
        const filterContainer = document.createElement("div");
        filterContainer.className = "flex items-center gap-2 bg-gray-200 p-2 rounded-md";

        const fieldSelect = document.createElement("select");
        fieldSelect.className = "p-2 border rounded";
        ["Tool", "Pricing", "Code Completion", "Chat", "Smart Apply", "On Prem Option", "Agent Mode"].forEach(field => {
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
        valueInput.className = "p-2 border rounded flex-grow";
        valueInput.placeholder = "Enter value";

        valueInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                filter.value = valueInput.value;
                updateFilters();
            }
        });

        const removeButton = document.createElement("button");
        removeButton.textContent = "❌";
        removeButton.className = "text-red-500";
        removeButton.addEventListener("click", () => {
            const groupIndex = filterGroups.findIndex(g => g.filters.includes(filter));
            if (groupIndex !== -1) {
                filterGroups[groupIndex].filters = filterGroups[groupIndex].filters.filter(f => f !== filter);
                if (filterGroups[groupIndex].filters.length === 0) {
                    filterGroups.splice(groupIndex, 1);
                }
            }
            // Remove the entire row (including operator if it exists)
            filterContainer.parentElement.remove();
            updateFilters();
        });

        const filter = { field: "Tool", type: "like", value: "" }; // Default to "contains" (like)
        
        // Create a new filter group if this is the first filter
        if (filterGroups.length === 0) {
            filterGroups.push({ filters: [filter], operator: "AND" });
        } else {
            // Add to the last group
            filterGroups[filterGroups.length - 1].filters.push(filter);
        }

        fieldSelect.addEventListener("change", () => {
            filter.field = fieldSelect.value;
            updateFilters();
        });
        
        conditionSelect.addEventListener("change", () => {
            filter.type = conditionSelect.value === "is" ? "=" :
                          conditionSelect.value === "is not" ? "!=" :
                          conditionSelect.value === "contains" ? "like" : "not like";
            updateFilters();
        });
        
        valueInput.addEventListener("input", () => {
            filter.value = valueInput.value;
            updateFilters();
        });

        filterContainer.append(fieldSelect, conditionSelect, valueInput, removeButton);
        
        const filtersContainer = document.getElementById("filters");
        
        // Create a wrapper div for the filter row that will include both the filter and operator
        const filterRowWrapper = document.createElement("div");
        filterRowWrapper.className = "flex items-center gap-2 mb-2";
        
        // If this isn't the first filter, add the operator before the filter
        if (filterGroups[0].filters.length > 1) {
            const operatorSelect = createOperatorSelect(filterGroups[0]);
            const previousRow = filtersContainer.lastElementChild;
            if (previousRow) {
                previousRow.appendChild(operatorSelect);
            }
        }
        
        filterRowWrapper.appendChild(filterContainer);
        filtersContainer.appendChild(filterRowWrapper);
        
        valueInput.focus();
        updateFilters();
    });

    document.getElementById("clearFilters").addEventListener("click", function () {
        filterGroups = [];
        document.getElementById("filters").innerHTML = "";
        updateFilters();
    });
});
