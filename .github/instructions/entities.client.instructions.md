---
applyTo: "src/entities/**"
---

# Entities – Add Reference Guide

All entities should be added to `src/entities/<folder>/`.

## Files

```
<entity>/
├── index.ts
├── setup.ts
├── config/
│   └── config.ts
├── data/
│   ├── Entity.ts
│   ├── EntityService.ts
│   └── store.ts
├── details/
│   ├── Details.vue
│   ├── Form.vue
│   └── FormModalButton.vue
├── filter/
│   ├── Filter.vue
│   ├── FilterAdv.vue
│   ├── FilterInline.vue
│   └── SearchObject.ts
├── overview/
│   ├── List.vue
│   ├── ListItem.vue
│   └── Overview.vue
└── selecting/
    ├── Autocomplete.vue
    ├── InputSelector.vue
    ├── Selector.vue
    ├── SelectorDropDown.vue
    ├── SelectorList.vue
    ├── SelectorModalButton.vue
    └── SelectorSearch.vue
```

## Files That Require Updates

### Entity config

**`config/config.ts`**

- key
- routePrefix: used in the URL for the entity's overview and details pages and also as a key in the navigation config in `public/config.json`.
- overviewTitle and detailsTitle: used as titles on the overview and details pages, respectively.
- description: a brief description of the entity, shown on the dashboard
- icon: the icon representing the entity (bootstrap icons)
- api: the base path for API calls related to this entity
- searchUrl:
    - bigger entities: `api + "/search"`
    - smaller entities: `api` (same as listUrl)

### Data

**`data/Entity.ts`**

Modify the exported class name (e.g. `class Product`) and the `Entity` alias at the bottom for the default export.
If the entity has no `title` property, make sure to update the `$title` getter.
Customize all properties for the entity.

### List/Overview

**`filter/SearchObject.ts`**
Customize all properties for the search object.

**`filter/FilterAdv.vue`**
Implement all properties from `filter/SearchObject.ts`.

**`overview/List.vue`**
Customize the headers in the list component.

**`overview/ListItem.vue`**
Customize the properties displayed in the list item component.

### Input

**`Form.vue`**
Customize the form fields for the entity.

### Selecting

**`SelectorList.vue`**
Customize the headers and properties in the list component.

**`selecting/Autocomplete.vue` and `SelectorDropDown.vue`**
Customize only if $title doesn't return the desired title for the entity. Otherwise, it will work out of the box.
SelectorDropDown is used for smaller entities with fewer data.

## Files That Do NOT Need Changes

The following files reference the entity only through the generic `Entity` import or `Entity.name` dynamic access, so they remain untouched during a rename:

- `data/store.ts`
- `setup.ts`
- `index.ts`
- `filter/Filter.vue`, `FilterInline.vue`
- `overview/Overview.vue`
- `details/FormModalButton.vue`
- `selecting/Autocomplete.vue`, `InputSelector.vue`, `Selector.vue`, `SelectorDropDown.vue`, `SelectorModalButton.vue`, `SelectorSearch.vue`

## Navigation

Modify `./public/config.json` to update the navigation menu if the entity is listed there.
The key for each entity is it's routePrefix from config/config.ts.

**entities**: list all entities in the system, with links to their overview pages.
**dashboard**: list entity here if it should be accessible from the dashboard.
**navbar**: list entity here if it should be
The key for each entity is it's routePrefix from config/config.ts. accessible from the navbar. This list is limited in size and should only include the most important entities that users need quick access to.

