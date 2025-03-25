document.addEventListener("DOMContentLoaded", function () {
    let table;
    let filterGroups = [];

    // Initialize Tabulator table with pre-loaded data
    table = new Tabulator("#table", {
        data: assistants,
        layout: "fitDataFill",
        height: "100%",
        cellRendered:function(cell){
            // Store full value for tooltip
            cell.getElement().setAttribute("data-full-value", cell.getValue());
            
            // Add special styling for tool column cells
            if(cell.getField() === "Tool") {
                cell.getElement().style.backgroundColor = "#f3f4f6";
            }
        },
        columns: [
            { 
                title: "Tool\nName", 
                field: "Tool", 
                width: 150,
                minWidth: 120,
                frozen: true,
                formatter: function(cell) {
                    const value = cell.getValue();
                    const url = cell.getData().Website;
                    if (!value) return "";
                    return url ? `<a href="${url}" target="_blank">${value}</a>` : value;
                }
            },
            { 
                title: "Pricing\nInfo", 
                field: "Pricing", 
                width: 150,
                minWidth: 120
            },
            { 
                title: "Code\nCompletion", 
                field: "Code Completion", 
                width: 150,
                minWidth: 120
            },
            { 
                title: "Chat\nSupport", 
                field: "Chat", 
                width: 150,
                minWidth: 120
            },
            { 
                title: "Smart\nApply", 
                field: "Smart Apply", 
                width: 120
            },
            { 
                title: "Context\nRetrieval", 
                field: "Context Retrieval", 
                width: 120
            },
            { 
                title: "Output\nCopyright", 
                field: "Output Not Copyrighted Guarantee", 
                width: 120
            },
            { 
                title: "Supported\nIDEs", 
                field: "Supported IDEs", 
                width: 120
            },
            { 
                title: "Underlying\nModel", 
                field: "Underlying Model", 
                width: 120
            },
            { 
                title: "On-Prem\nOption", 
                field: "On Prem Option", 
                width: 120
            },
            { 
                title: "Code\nFlavor", 
                field: "Respects Code Flavor", 
                width: 120
            },
            { 
                title: "Agent\nMode", 
                field: "Agent Mode", 
                width: 120
            },
            { 
                title: "Controls\nTools", 
                field: "Controls Tools", 
                width: 120
            },
            { 
                title: "Nice To\nHaves", 
                field: "Nice To Haves", 
                width: 120
            },
            { 
                title: "Watch\nOut", 
                field: "Watch Out", 
                width: 120
            }
        ],
        rowHeight: 70,
        movableColumns: false,
        resizableColumns: false,
    });

    // Get all available fields for filtering
    const availableFields = [
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
        availableFields.forEach(field => {
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
