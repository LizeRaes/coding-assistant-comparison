# JavaScript Module Structure

This directory contains the refactored JavaScript code for the AI Coding Assistant Comparison tool, organized into focused modules for better maintainability.

## File Structure

### `utils.js` (~50 lines)
**Purpose**: Utility functions used across the application
- `getFieldValue()` - Extracts appropriate value from data fields (handles short/long format)
- `createScrollHint()` - Creates scroll hint element above table
- `getAvailableFields()` - Returns array of available filter fields

### `table-config.js` (~150 lines)
**Purpose**: Table configuration and column definitions
- `getTableColumns()` - Returns array of Tabulator column definitions
- `getTableConfig()` - Returns complete Tabulator configuration object
- All column formatters use `getFieldValue()` to handle short/long data format

### `filters.js` (~180 lines)
**Purpose**: Advanced filtering functionality
- `updateFilters()` - Updates table filters based on filter groups
- `createOperatorSelect()` - Creates AND/OR operator dropdown
- `createFilterCriterion()` - Creates individual filter criterion UI
- `clearAdvancedFilters()` - Clears all advanced filters
- `getFilterGroups()` - Returns current filter groups

### `quick-filters.js` (~150 lines)
**Purpose**: Quick filter bar implementation
- `initializeQuickFilters()` - Sets up quick filter bar UI
- `updateQuickFilters()` - Updates and applies quick filters
- `clearQuickFilters()` - Clears all quick filters
- `getQuickFilterLogic()` - Returns filter logic function for combining

### `main.js` (~150 lines)
**Purpose**: Main application orchestration
- `combinedFilter()` - Merges quick and advanced filters
- `updateAllFilters()` - Updates all filters and applies to table
- `clearAllFilters()` - Clears both quick and advanced filters
- `initializeApp()` - Main application initialization
- Handles DOM event listeners and module coordination

## Module Dependencies

```
main.js
├── utils.js
├── table-config.js
├── filters.js
└── quick-filters.js
```

## Loading Order

The modules must be loaded in this order (as specified in `index.html`):

1. `data/assistants.js` - Data source
2. `js/utils.js` - Utility functions
3. `js/table-config.js` - Table configuration
4. `js/filters.js` - Advanced filters
5. `js/quick-filters.js` - Quick filters
6. `js/main.js` - Main application

## Key Benefits

- **Maintainability**: Each file has a single responsibility
- **Readability**: Files are under 200 lines each
- **Reusability**: Functions are properly exported and can be reused
- **Testability**: Individual modules can be tested in isolation
- **Scalability**: Easy to add new features or modify existing ones

## Data Format Support

All modules properly handle the new data format with `short` and `long` properties:
- Table formatters use `getFieldValue()` to display short values
- Filter logic uses `getFieldValue()` to search and filter correctly
- Backward compatible with old string-only format 