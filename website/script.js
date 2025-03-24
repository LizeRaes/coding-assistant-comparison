async function loadTools() {
    try {
        const response = await fetch('../data/tools.json');
        const data = await response.json();
        return data.tools;
    } catch (error) {
        console.error('Error loading tools:', error);
        return [];
    }
}

function renderTable(tools) {
    const tbody = document.querySelector('#comparison-table tbody');
    tbody.innerHTML = '';

    tools.forEach(tool => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <a href="${tool.website}" target="_blank">${tool.name}</a>
            </td>
            <td>${tool.company}</td>
            <td>
                ${tool.pricing.free_tier ? '✓ Free tier<br>' : ''}
                Individual: ${tool.pricing.individual}<br>
                Enterprise: ${tool.pricing.enterprise}
            </td>
            <td>
                ${Object.entries(tool.features)
                    .map(([feature, has]) => `${has ? '✓' : '✗'} ${feature.replace(/_/g, ' ')}`)
                    .join('<br>')}
            </td>
            <td>${tool.supported_languages.join(', ')}</td>
            <td>${tool.ide_support.join(', ')}</td>
        `;
        
        tbody.appendChild(row);
    });
}

function setupFilters(tools) {
    const searchInput = document.getElementById('search');
    const featureFilter = document.getElementById('feature-filter');

    function filterTools() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedFeature = featureFilter.value;

        const filtered = tools.filter(tool => {
            const matchesSearch = tool.name.toLowerCase().includes(searchTerm) ||
                                tool.company.toLowerCase().includes(searchTerm);
            
            const matchesFeature = !selectedFeature || tool.features[selectedFeature];
            
            return matchesSearch && matchesFeature;
        });

        renderTable(filtered);
    }

    searchInput.addEventListener('input', filterTools);
    featureFilter.addEventListener('change', filterTools);
}

async function initialize() {
    const tools = await loadTools();
    renderTable(tools);
    setupFilters(tools);
}

document.addEventListener('DOMContentLoaded', initialize); 