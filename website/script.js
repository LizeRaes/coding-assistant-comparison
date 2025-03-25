document.addEventListener("DOMContentLoaded", function () {
    let table;
    let filterGroups = [];

    // Add scroll hint text above table
    const tableElement = document.querySelector("#table");
    const scrollHint = document.createElement("div");
    scrollHint.className = "scroll-hint";
    scrollHint.textContent = "Scroll horizontally to see all columns →";
    tableElement.parentElement.insertBefore(scrollHint, tableElement);

    // Initialize Tabulator table with pre-loaded data
    console.log('Starting table initialization...');
    table = new Tabulator("#table", {
        data: assistants,
        layout: "fitColumns",
        columns: [
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
            {title: "Code\nCompletion", field: "Code Completion", width: 120, variableHeight: true},
            {title: "Chat\nSupport", field: "Chat", width: 120, variableHeight: true},
            {title: "Smart\nApply", field: "Smart Apply", width: 120, variableHeight: true},
            {title: "Context\nRetrieval", field: "Context Retrieval", width: 180, variableHeight: true},
            {title: "Output Not\nCopyrighted", field: "Output Not Copyrighted Guarantee", width: 120, variableHeight: true},
            {title: "Supported\nIDEs", field: "Supported IDEs", width: 120, variableHeight: true},
            {title: "Underlying\nModel", field: "Underlying Model", width: 120, variableHeight: true},
            {title: "On Prem\nOption", field: "On Prem Option", width: 120, variableHeight: true},
            {title: "Respects\nCode Flavor", field: "Respects Code Flavor", width: 120, variableHeight: true},
            {
                title: "Pricing\nInfo", 
                field: "Pricing", 
                width: 120, 
                formatter: function(cell) {
                    const value = cell.getValue();
                    const pricingLink = cell.getData().PricingLink;
                    return pricingLink ? `<a href="${pricingLink}" target="_blank">${value}</a>` : value;
                },
                variableHeight: true
            },
            {title: "Agent\nMode", field: "Agent Mode", width: 120, variableHeight: true},
            {title: "Controls\nTools", field: "Controls Tools", width: 120, variableHeight: true},
            {title: "Nice To\nHaves", field: "Nice To Haves", width: 180, variableHeight: true},
            {title: "Watch\nOut", field: "Watch Out", width: 180, variableHeight: true},
        ],
        height: "100%",
        rowFormatter: function(row) {
            const index = row.getPosition() + 1;
            const colorClass = `row-color-${((index - 1) % 6) + 1}`;
            row.getElement().classList.add(colorClass);
        }
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
                updateFilters();
                valueInput.focus();
            });
            symbolButtons.appendChild(button);
        });

        inputContainer.appendChild(symbolButtons);

        valueInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                filter.value = valueInput.value;
                updateFilters();
            }
        });

        valueInput.addEventListener("input", () => {
            filter.value = valueInput.value;
            updateFilters();
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
            updateFilters();
        });

        const filter = { field: "Tool", type: "like", value: "" };
        
        if (filterGroups.length === 0) {
            filterGroups.push({ filters: [filter], operator: "AND" });
        } else {
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

        filterContainer.append(fieldSelect, conditionSelect, inputContainer, removeButton);
        
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
