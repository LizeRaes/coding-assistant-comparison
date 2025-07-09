// Main application module for the AI Coding Assistant Comparison tool

let table;

/**
 * Combined filter function that merges quick filters and advanced filters
 * @param {Object} data - The data object to filter
 * @returns {boolean} Whether the data passes all filters
 */
function combinedFilter(data) {
    // Quick filter logic
    let quickMatch = true;
    const quickFilterLogic = getQuickFilterLogic();
    if (typeof quickFilterLogic === "function") {
        quickMatch = quickFilterLogic(data);
    }
    
    // Advanced filter logic
    let advancedMatch = true;
    const filterGroups = getFilterGroups();
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

/**
 * Update all filters and apply them to the table
 */
function updateAllFilters() {
    if (getFilterGroups().length === 0) {
        table.clearFilter();
    } else {
        table.setFilter(combinedFilter);
    }
}

/**
 * Clear all filters (both quick and advanced)
 */
function clearAllFilters() {
    // Clear quick filters
    clearQuickFilters(table, updateAllFilters);
    
    // Clear advanced filters
    clearAdvancedFilters();
    
    // Update the table
    updateAllFilters();
}

/**
 * Initialize the advanced filter functionality
 */
function initializeAdvancedFilters() {
    const addFilterBtn = document.getElementById("addFilter");
    if (addFilterBtn) {
        addFilterBtn.addEventListener("click", function () {
            const { filterContainer, filter } = createFilterCriterion(table, updateAllFilters);
            
            const filtersContainer = document.getElementById("filters");
            
            // Create a wrapper div for the filter row that will include both the filter and operator
            const filterRowWrapper = document.createElement("div");
            filterRowWrapper.className = "flex items-center gap-2 mb-2";
            
            // If this isn't the first filter, add the operator before the filter
            const filterGroups = getFilterGroups();
            if (filterGroups[0] && filterGroups[0].filters.length > 1) {
                const operatorSelect = createOperatorSelect(filterGroups[0], updateAllFilters);
                const previousRow = filtersContainer.lastElementChild;
                if (previousRow) {
                    previousRow.appendChild(operatorSelect);
                }
            }
            
            filterRowWrapper.appendChild(filterContainer);
            filtersContainer.appendChild(filterRowWrapper);
            
            // Focus on the value input
            const valueInput = filterContainer.querySelector("input");
            if (valueInput) {
                valueInput.focus();
            }
            
            updateAllFilters();
        });
    }

    // Set up clear filters button
    const clearFiltersBtn = document.getElementById("clearFilters");
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", clearAllFilters);
    }
}

/**
 * Initialize tooltip functionality for short/long cells
 */
function initializeTooltips() {
    let tooltip = null;
    let currentCell = null;

    // Create tooltip element
    function createTooltip() {
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'hover-tooltip';
            tooltip.style.cssText = `
                position: fixed;
                background: #1e40af;
                color: white;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.3);
                z-index: 9999;
                white-space: pre-wrap;
                max-width: 400px;
                word-wrap: break-word;
                font-size: 14px;
                line-height: 1.5;
                pointer-events: none;
                border: 2px solid #2563eb;
                display: none;
            `;
            document.body.appendChild(tooltip);
        }
    }

    // Show tooltip
    function showTooltip(event, cell) {
        createTooltip();
        const longText = cell.getAttribute('data-long');
        if (longText) {
            tooltip.textContent = longText;
            tooltip.style.display = 'block';
            
            // Position tooltip near mouse cursor
            const x = event.clientX + 15;
            const y = event.clientY - 15;
            
            // Adjust position to keep tooltip in viewport
            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            let finalX = x;
            let finalY = y;
            
            // Adjust horizontal position if tooltip would go off-screen
            if (x + tooltipRect.width > viewportWidth) {
                finalX = x - tooltipRect.width - 30;
            }
            
            // Adjust vertical position if tooltip would go off-screen
            if (y - tooltipRect.height < 0) {
                finalY = y + 30;
            }
            
            tooltip.style.left = finalX + 'px';
            tooltip.style.top = finalY + 'px';
        }
    }

    // Hide tooltip
    function hideTooltip() {
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    // Add event listeners to table
    document.addEventListener('mouseover', function(event) {
        const cell = event.target.closest('.short-long-cell');
        if (cell && cell !== currentCell) {
            currentCell = cell;
            showTooltip(event, cell);
        }
    });

    document.addEventListener('mousemove', function(event) {
        if (tooltip && tooltip.style.display === 'block') {
            const cell = event.target.closest('.short-long-cell');
            if (cell && cell === currentCell) {
                // Update tooltip position as mouse moves
                const x = event.clientX + 15;
                const y = event.clientY - 15;
                
                const tooltipRect = tooltip.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                let finalX = x;
                let finalY = y;
                
                if (x + tooltipRect.width > viewportWidth) {
                    finalX = x - tooltipRect.width - 30;
                }
                
                if (y - tooltipRect.height < 0) {
                    finalY = y + 30;
                }
                
                tooltip.style.left = finalX + 'px';
                tooltip.style.top = finalY + 'px';
            }
        }
    });

    document.addEventListener('mouseout', function(event) {
        const cell = event.target.closest('.short-long-cell');
        if (cell && cell === currentCell) {
            currentCell = null;
            hideTooltip();
        }
    });
}

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('Starting table initialization...');
    
    // Create scroll hint
    const tableElement = document.querySelector("#table");
    createScrollHint(tableElement);
    
    // Initialize table
    table = new Tabulator("#table", getTableConfig());
    
    // Initialize quick filters
    initializeQuickFilters(table, updateAllFilters);
    
    // Initialize advanced filters
    initializeAdvancedFilters();
    
    // Initialize tooltips
    initializeTooltips();
    
    console.log('Application initialized successfully');
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp); 