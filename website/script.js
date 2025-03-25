document.addEventListener("DOMContentLoaded", function () {
    let table;
    let filters = [];

    // Initialize Tabulator table with pre-loaded data
    table = new Tabulator("#table", {
        data: assistants, // This will be available from the JSON file
        layout: "fitColumns",
        columns: [
            { title: "Tool", field: "Tool", formatter: "link", formatterParams: { urlField: "Website" }, headerFilter: "input" },
            { title: "Pricing", field: "Pricing", headerFilter: "input" },
            { title: "Code Completion", field: "Code Completion" },
            { title: "Chat", field: "Chat" },
            { title: "Smart Apply", field: "Smart Apply" },
            { title: "On Prem Option", field: "On Prem Option" },
            { title: "Agent Mode", field: "Agent Mode" },
            { title: "Watch Out", field: "Watch Out", headerFilter: "input" },
        ],
    });

    // Filtering logic
    function updateFilters() {
        table.setFilter(filters);
        document.getElementById("clearFilters").classList.toggle("hidden", filters.length === 0);
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
        ["is", "is not", "contains", "does not contain"].forEach(cond => {
            const option = document.createElement("option");
            option.value = cond;
            option.textContent = cond;
            conditionSelect.appendChild(option);
        });

        const valueInput = document.createElement("input");
        valueInput.type = "text";
        valueInput.className = "p-2 border rounded";
        valueInput.placeholder = "Enter value";

        const removeButton = document.createElement("button");
        removeButton.textContent = "❌";
        removeButton.className = "text-red-500";
        removeButton.addEventListener("click", () => {
            filters = filters.filter(f => f !== filter);
            filterContainer.remove();
            updateFilters();
        });

        const filter = { field: "Tool", type: "=", value: "" };
        filters.push(filter);

        fieldSelect.addEventListener("change", () => filter.field = fieldSelect.value);
        conditionSelect.addEventListener("change", () => {
            filter.type = conditionSelect.value === "is" ? "=" :
                          conditionSelect.value === "is not" ? "!=" :
                          conditionSelect.value === "contains" ? "like" : "not like";
        });
        valueInput.addEventListener("input", () => filter.value = valueInput.value);

        filterContainer.append(fieldSelect, conditionSelect, valueInput, removeButton);
        document.getElementById("filters").appendChild(filterContainer);
        updateFilters();
    });

    document.getElementById("clearFilters").addEventListener("click", function () {
        filters = [];
        document.getElementById("filters").innerHTML = "";
        updateFilters();
    });
});
