document.addEventListener("DOMContentLoaded", function () {
    let table;
    let filterGroups = [];

    // Helper function to extract the appropriate value from a data field
    // If the field has a 'short' property, use that; otherwise use the direct value
    function getFieldValue(data, field) {
        const value = data[field];
        if (value && typeof value === 'object' && value.short !== undefined) {
            return value.short;
        }
        return value;
    }

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

    // Only declare addFilterBtn once at the top
    console.log('DEBUG: About to query for addFilter button');
    const addFilterBtn = document.getElementById("addFilter");
    console.log('DEBUG: addFilterBtn is', addFilterBtn);
    if (addFilterBtn) {
        addFilterBtn.addEventListener("click", function () {
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
    } else {
        console.warn("addFilter button not found in DOM");
    }

    document.getElementById("clearFilters").addEventListener("click", function () {
        filterGroups = [];
        document.getElementById("filters").innerHTML = "";
        updateFilters();
    });

    // === Quick Filter Bar Implementation ===
    const quickFilterColumns = [
        { field: "Code Completion", label: "Code Completion" },
        { field: "Chat", label: "Chat Support" },
        { field: "Smart Apply", label: "Smart Apply" },
        { field: "Output Not Copyrighted Guarantee", label: "Output Not Copyrighted" },
        { field: "On Prem Option", label: "On Prem Option" },
        { field: "Respects Code Flavor", label: "Respects Code Flavor" },
        { field: "Agent Mode", label: "Agent Mode" }
    ];

    const quickFiltersBar = document.getElementById("quick-filters-bar");
    if (quickFiltersBar) {
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

        // State
        const toggleState = {};
        quickFilterColumns.forEach(col => toggleState[col.field] = false);
        let textSearchValue = "";

        // Toggle buttons
        quickFilterColumns.forEach(col => {
            const btn = document.createElement("button");
            btn.textContent = col.label;
            btn.className = "px-3 py-1 rounded border font-semibold bg-white text-gray-800 hover:bg-green-100 transition";
            btn.setAttribute("data-field", col.field);
            btn.addEventListener("click", () => {
                toggleState[col.field] = !toggleState[col.field];
                updateQuickFilters();
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
            quickFilterColumns.forEach(col => toggleState[col.field] = false);
            textSearchValue = "";
            textInput.value = "";
            updateQuickFilters();
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
            textSearchValue = e.target.value;
            updateQuickFilters();
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

        // Update button styles and filter table
        function updateQuickFilters() {
            // Update button styles
            firstRow.querySelectorAll("button[data-field]").forEach(btn => {
                const field = btn.getAttribute("data-field");
                if (toggleState[field]) {
                    btn.classList.remove("bg-white", "text-gray-800");
                    btn.classList.add("bg-green-500", "text-white");
                } else {
                    btn.classList.remove("bg-green-500", "text-white");
                    btn.classList.add("bg-white", "text-gray-800");
                }
            });
            // Show/hide clear button
            const anyActive = Object.values(toggleState).some(v => v) || textSearchValue.length > 0;
            clearBtn.classList.toggle("hidden", !anyActive);
            // Greyed out text for input
            if (!textInput.value) {
                textInput.classList.add("text-gray-400");
            } else {
                textInput.classList.remove("text-gray-400");
            }
            // Build filter array
            let filters = [];
            quickFilterColumns.forEach(col => {
                if (toggleState[col.field]) {
                    filters.push({ field: col.field, type: "contains-check", value: "✅" });
                }
            });
            if (textSearchValue.length > 0) {
                filters.push({ field: "*", type: "like", value: textSearchValue });
            }
            // Apply filters
            if (filters.length === 0) {
                table.clearFilter();
            } else {
                table.setFilter((data) => {
                    // All toggles must match (contains-check)
                    for (const col of quickFilterColumns) {
                        if (toggleState[col.field] && (!getFieldValue(data, col.field) || !getFieldValue(data, col.field).includes("✅"))) return false;
                    }
                    // Text search: match any field
                    if (textSearchValue.length > 0) {
                        const search = textSearchValue.toLowerCase();
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
            }
            // Save state for global use
            window.quickFilterBarState = { toggleState: { ...toggleState }, textSearchValue, quickFilterColumns };
            // Always use combinedFilter
            table.setFilter(combinedFilter);
        }
    }

    // === Advanced Filters Toggle ===
    const advancedToggleDiv = document.getElementById("advanced-filters-toggle");
    const advancedFiltersDiv = document.getElementById("filters");
    let advancedVisible = false;
    // Commenting out the Advanced Filters toggle button
    /*
    if (advancedToggleDiv && advancedFiltersDiv) {
        // Create toggle button
        const advBtn = document.createElement("button");
        advBtn.innerHTML = '<svg class="inline mr-1" width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="7" stroke="#333" stroke-width="2"/><line x1="14.4142" y1="14" x2="18" y2="17.5858" stroke="#333" stroke-width="2" stroke-linecap="round"/></svg>Advanced Filters';
        advBtn.className = "px-3 py-1 rounded bg-blue-100 text-blue-900 font-semibold border border-blue-300 hover:bg-blue-200 transition";
        advBtn.setAttribute("aria-expanded", "false");
        advBtn.addEventListener("click", () => {
            advancedVisible = !advancedVisible;
            advancedFiltersDiv.style.display = advancedVisible ? "block" : "none";
            addFilterBtn.style.display = advancedVisible ? "inline-block" : "none";
            advBtn.setAttribute("aria-expanded", advancedVisible ? "true" : "false");
        });
        advancedToggleDiv.appendChild(advBtn);
        // Hide advanced by default
        advancedFiltersDiv.style.display = "none";
        addFilterBtn.style.display = "none";
    }
    */

    // === Combine Quick and Advanced Filters ===
    // Save original updateFilters
    const originalUpdateFilters = updateFilters;
    // Patch updateFilters to combine with quick filters
    function combinedFilter(data) {
        // Quick filter logic (reuse from quick filter bar)
        let quickMatch = true;
        if (typeof window.quickFilterBarLogic === "function") {
            quickMatch = window.quickFilterBarLogic(data);
        }
        // Advanced filter logic (reuse from updateFilters)
        let advancedMatch = true;
        if (filterGroups.length > 0) {
            advancedMatch = false;
            for (const group of filterGroups) {
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
                advancedMatch = group.operator === "AND" ? results.every(Boolean) : results.some(Boolean);
                if (!advancedMatch) break;
            }
        }
        return quickMatch && advancedMatch;
    }
    // Patch table filtering to combine both
    // Save quick filter logic for reuse
    window.quickFilterBarLogic = function(data) {
        // This logic must match the quick filter bar's setFilter logic
        if (!window.quickFilterBarState) return true;
        const { toggleState, textSearchValue, quickFilterColumns } = window.quickFilterBarState;
        // All toggles must match (contains-check)
        for (const col of quickFilterColumns) {
            if (toggleState[col.field] && (!getFieldValue(data, col.field) || !getFieldValue(data, col.field).includes("✅"))) return false;
        }
        // Text search: match any field
        if (textSearchValue.length > 0) {
            const search = textSearchValue.toLowerCase();
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
    // Patch quick filter bar to update global state and always use combinedFilter
    if (quickFiltersBar) {
        // ...inside updateQuickFilters...
        // Add this at the end of updateQuickFilters:
        // Save state for global use
        window.quickFilterBarState = { toggleState: { ...toggleState }, textSearchValue, quickFilterColumns };
        // Always use combinedFilter
        table.setFilter(combinedFilter);
    }
    // Patch updateFilters to always use combinedFilter
    updateFilters = function() {
        // Re-render advanced filter UI as before
        if (filterGroups.length === 0) {
            table.clearFilter();
        } else {
            table.setFilter(combinedFilter);
        }
        document.getElementById("clearFilters").classList.toggle("hidden", filterGroups.length === 0);
    };

    // --- Clear All Filters Function ---
    function clearAllFilters() {
        // Reset quick filter toggles and text
        if (window.quickFilterBarState) {
            const { quickFilterColumns } = window.quickFilterBarState;
            quickFilterColumns.forEach(col => window.quickFilterBarState.toggleState[col.field] = false);
            window.quickFilterBarState.textSearchValue = "";
        }
        // Reset quick filter UI if present
        const quickFiltersBar = document.getElementById("quick-filters-bar");
        if (quickFiltersBar) {
            const textInput = quickFiltersBar.querySelector("input[type='text']");
            if (textInput) {
                textInput.value = "";
                textInput.classList.add("text-gray-400");
            }
            quickFiltersBar.querySelectorAll("button[data-field]").forEach(btn => {
                btn.classList.remove("bg-green-500", "text-white");
                btn.classList.add("bg-white", "text-gray-800");
            });
        }
        // Reset advanced filters
        filterGroups = [];
        const filtersDiv = document.getElementById("filters");
        if (filtersDiv) filtersDiv.innerHTML = "";
        // Update table and both UIs
        if (typeof window.updateQuickFilters === "function") window.updateQuickFilters();
        if (typeof updateFilters === "function") updateFilters();
    }

    // Attach clearAllFilters to both clear buttons
    function attachClearAllFilters() {
        // Advanced filter clear button
        const advClearBtn = document.getElementById("clearFilters");
        if (advClearBtn) {
            advClearBtn.onclick = clearAllFilters;
        }
        // Quick filter bar clear button
        const quickFiltersBar = document.getElementById("quick-filters-bar");
        if (quickFiltersBar) {
            const quickClearBtn = quickFiltersBar.querySelector("button");
            if (quickClearBtn && quickClearBtn.textContent.includes("Clear All Filters")) {
                quickClearBtn.onclick = clearAllFilters;
            }
        }
    }
    // Call after DOM and bars are rendered
    setTimeout(attachClearAllFilters, 0);
});
