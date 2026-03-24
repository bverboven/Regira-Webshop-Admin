---
applyTo: "src/entities/**"
---

# Entity Folder – Source Code Reference

Complete source code of every file in a standard entity folder. Replace `<EntityName>` with the PascalCase entity name (e.g. `Product`), `<entityName>` with camelCase, and `<entity-names>` with the kebab-case plural used for routing and API paths.

---

## index.ts

```ts
export { default as config } from "./config/config"
export { default as Entity } from "./data/Entity"
export { default as EntityService } from "./data/EntityService"
export { default as useEntityStore } from "./data/store"

export { default as Filter } from "./filter/Filter.vue"
export { default as FilterInline } from "./filter/FilterInline.vue"
export { default as FilterAdv } from "./filter/FilterAdv.vue"

export { default as Autocomplete } from "./selecting/Autocomplete.vue"
export { default as FormModalButton } from "./details/FormModalButton.vue"
export { default as InputSelector } from "./selecting/InputSelector.vue"
export { default as Selector } from "./selecting/Selector.vue"
export { default as SelectorList } from "./selecting/SelectorList.vue"
export { default as SelectorSearch } from "./selecting/SelectorSearch.vue"
export { default as SelectorModalButton } from "./selecting/SelectorModalButton.vue"

export { default as Overview } from "./overview/Overview.vue"
export { default as Details } from "./details/Details.vue"
export { default as Form } from "./details/Form.vue"

export { default as plugin } from "./setup"
```

---

## setup.ts

```ts
import type { AxiosInstance } from "axios"
import type { App } from "vue"
import type { RouteRecordRaw } from "vue-router"
import type { IServiceProvider } from "@/regira_modules/vue/ioc"
import type { IIconProvider } from "@/regira_modules/vue/ui/icons"
import { DetailsSummary } from "@/regira_modules/vue/entities"
import config from "./config/config"
import { Entity } from "./data/Entity"
import Overview from "./overview/Overview.vue"
import Details from "./details/Details.vue"
import Form from "./details/Form.vue"
import EntityService from "./data/EntityService"

export function createRoutes(): Array<RouteRecordRaw> {
    const key = Entity.name
    return [
        {
            path: `/${config.routePrefix}`,
            name: `${key}Overview`,
            component: Overview,
        },
        {
            path: `/${config.routePrefix}/:id`,
            name: `${key}Details`,
            component: Details,
            children: [
                {
                    path: "details",
                    name: `${key}Fiche`,
                    component: DetailsSummary,
                },
                {
                    path: "edit",
                    name: `${key}Form`,
                    component: Form,
                },
            ],
            redirect: () => ({ name: `${key}Form` }),
        },
    ] as Array<RouteRecordRaw>
}

export function addServices(serviceProvider: IServiceProvider) {
    serviceProvider.add(Entity.name, (sp) => new EntityService(sp.get<AxiosInstance>("axios")!, config))
}
export function addIcons(icons: IIconProvider) {
    icons.add(Entity.name, config.icon!)
}

export default {
    install(app: App<Element>, { routes }: { routes: Array<RouteRecordRaw> }) {
        routes.push(...createRoutes())

        addServices(app.config.globalProperties.$services)
        addIcons(app.config.globalProperties.$icons)

        app.config.globalProperties.$configs[Entity.name] = config

        console.debug("install", Entity.name)
    },
}
```

---

## config/config.ts

```ts
import type { IConfig } from "@/regira_modules/vue/entities"
import Entity from "../data/Entity"

const api = "/<entity-names>"

const config: IConfig = {
    id: Entity.name,
    key: "<EntityName>",

    routePrefix: "<entity-names>",
    baseQueryParams: {
        includes: [],
    },
    initialQuery: {},

    overviewTitle: "<entityNames>",
    detailsTitle: "<entityName>",
    description: "<entityNames>Description",
    icon: "bi bi-building-fill-gear",  // replace with appropriate icon (Bootstrap icons)

    defaultPageSize: 10,

    api,
    detailsUrl: api,
    listUrl: api,
    searchUrl: api + "/search",
    // searchUrl: api, // if the entity is small and doesn't require a separate search endpoint, use the list endpoint for searching as well
    saveUrl: api,
    deleteUrl: api,
}

export default config
```

---

## data/Entity.ts

```ts
import { EntityBase } from "@/regira_modules/vue/entities"

export class <EntityName> extends EntityBase {
    id: number = 0
    code?: string
    title: string
    description?: string
    created?: Date
    lastModified?: Date
    isArchived?: boolean

    override get $id(): string | number {
        return this.id || "new"
    }
    override get $title(): string | undefined {
        return this.title
    }
}

export const Entity = <EntityName>

export default <EntityName>
```

---

## data/EntityService.ts

```ts
import type { AxiosInstance } from "axios"
import { EntityServiceBase, type IConfig } from "@/regira_modules/vue/entities"
import Entity from "./Entity"

export class EntityService extends EntityServiceBase<Entity> {
    constructor(axios: AxiosInstance, config: IConfig) {
        super(axios, config)
    }

    override toEntity(item: object): Entity {
        return item instanceof Entity ? item : Object.assign(this.createInstance(Entity as new () => Entity), item || {})
    }
}

export default EntityService
```

---

## data/store.ts

```ts
import { defineStore } from "pinia"
import { get } from "@/regira_modules/vue/ioc"
import { createStore, type IEntityService } from "@/regira_modules/vue/entities"
import Entity from "./Entity"

export const useEntityStore = defineStore(Entity.name, () => {
    const service = get<IEntityService<Entity>>(Entity.name)!
    return createStore<Entity>(service, Entity.name)
})

export default useEntityStore
```

---

## filter/SearchObject.ts

```ts
import { SearchObjectBase } from "@/regira_modules/vue/entities"

export class EntitySearchObject extends SearchObjectBase {
    code?: string
    title?: string

    minCreated?: Date
    maxCreated?: Date
    minLastModified?: Date
    maxLastModified?: Date
}

export default EntitySearchObject
```

---

## filter/Filter.vue

```vue
<template>
    <div>
        <slot name="inline" :handleToggle="handleToggle">
            <FilterInline v-model="searchObject" @filter="handleFilter" @toggle-adv="handleToggle" />
        </slot>

        <Teleport to="#modals">
            <MyModal :is-visible="showAdv" :title="props.modalTitle || 'Advanced search'" :show-footer="true" :full-width="true" @close="handleClose" @submit="handleSubmit">
                <slot name="title"></slot>
                <slot name="adv" :handleUpdate="handleUpdate" :handleSubmit="handleSubmit" :handleClose="handleClose"></slot>

                <Debug :modelValue="searchObject" />
            </MyModal>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useVModelField } from "@/regira_modules/vue/vue-helper"
import { useFilter, type FilterEmits } from "@/regira_modules/vue/entities"
import type SearchObject from "./SearchObject"
import FilterInline from "./FilterInline.vue"

interface Emits extends /* @vue-ignore */ FilterEmits {}

const emit = defineEmits<Emits>()
const props = defineProps<{
    modelValue: object
    modalTitle?: string
    resultCount?: number
}>()

const searchObject = useVModelField<SearchObject>(props, emit)

const showAdv = ref(false)
const { handleUpdate, handleFilter } = useFilter({ searchObject, emit })

function handleToggle() {
    showAdv.value = !showAdv.value
}
function handleClose() {
    showAdv.value = false
}
function handleSubmit() {
    handleUpdate()
    handleClose()
}
</script>
```

---

## filter/FilterAdv.vue

```vue
<template>
    <div class="adv-filter">
        <div class="row">
            <div class="col mb-2" v-if="resultCount != null">
                <span class="text-info">{{ resultCount }} results</span>
                <small v-if="filterIsActive" class="ms-2 italic-muted">({{ $t("filtersAreApplied") }})</small>
            </div>
            <div class="col mb-2 text-end">
                <IconButton icon="clear" @click="handleReset" :showText="true" />
            </div>
        </div>
        <div class="row">
            <!-- keywords -->
            <div class="col mb-2">
                <div class="input-group">
                    <div class="input-group-text"><Icon name="search" /></div>
                    <input v-model.lazy.trim="searchObject.q" class="form-control" :placeholder="$t('keywords')" />
                </div>
            </div>
        </div>
        <div class="row">
            <!-- title -->
            <div class="col mb-2">
                <div class="input-group">
                    <div class="input-group-text"><Icon name="title" /></div>
                    <input v-model.lazy.trim="searchObject.title" class="form-control" placeholder="title" />
                </div>
            </div>
        </div>
        <div class="row">
            <!-- minDate -->
            <div class="col-sm mb-2">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="from" />
                    </div>
                    <input type="date" v-model="searchObject.minDate" class="form-control" />
                </div>
            </div>
            <!-- maxDate -->
            <div class="col-sm mb-2">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="to" />
                    </div>
                    <input type="date" v-model="searchObject.maxDate" class="form-control" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useVModelField } from "@/regira_modules/vue/vue-helper"
import { useFilter, type FilterEmits } from "@/regira_modules/vue/entities"
import SearchObject from "./SearchObject"

interface Emits extends /* @vue-ignore */ FilterEmits {}

const emit = defineEmits<Emits>()
const props = defineProps<{
    modelValue: SearchObject
    resultCount?: number
}>()

const searchObject = useVModelField<SearchObject>(props, emit)

const { filterIsActive, handleReset } = useFilter({ searchObject, emit, Constructor: SearchObject })
</script>
```

---

## filter/FilterInline.vue

```vue
<template>
    <div class="row">
        <div class="col-auto">
            <div class="input-group">
                <IconButton icon="clear" class="btn-outline-secondary" @click="handleReset" />
                <input v-model.lazy.trim="searchObject.q" class="form-control" :placeholder="$t('keywords')" @change="handleUpdate" />
                <IconButton icon="search" class="btn-outline-primary d-none d-sm-block" @click="handleUpdate" />
                <IconButton v-if="showToggleAdv" icon="filter" :class="filterIsActive ? 'btn-info' : 'btn-outline-info'" @click="handleToggle" />
            </div>
            <small v-if="filterIsActive" class="d-none d-sm-inline italic-muted">{{ $t("filtersAreApplied") }}</small>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useFilter, type FilterEmits } from "@/regira_modules/vue/entities"
import SearchObject from "./SearchObject"
import { useVModelField } from "@/regira_modules/vue/vue-helper"

interface Emits extends /* @vue-ignore */ FilterEmits {}

const emit = defineEmits<Emits>()
const props = withDefaults(
    defineProps<{
        modelValue: SearchObject
        resultCount?: number
        showToggleAdv?: boolean
    }>(),
    {
        modelValue: () => new SearchObject(),
        showToggleAdv: false,
    }
)
const searchObject = useVModelField<SearchObject>(props, emit)

const { filterIsActive, handleReset, handleUpdate, handleToggle } = useFilter({ searchObject, emit, Constructor: SearchObject })
</script>
```

---

## overview/Overview.vue

```vue
<template>
    <section class="overview">
        <div class="row justify-content-between gx-0 gx-sm-1">
            <div class="col col-lg-auto order-1">
                <!-- Filter -->
                <Filter v-model="searchObject" @filter="updateOverviewRoute(true)" @change="updateOverviewRoute(true)" :result-count="itemsCount">
                    <template #adv="{ handleClose }">
                        <slot name="filterAdv" :result-count="itemsCount" :search="updateOverviewRoute" :search-object="searchObject" :paging-info="pagingInfo" :handle-close="handleClose">
                            <component :is="FilterAdv" v-model="searchObject" :result-count="itemsCount" @filter="updateOverviewRoute(true)" @change="updateOverviewRoute(true)" @close="handleClose" />
                        </slot>
                    </template>
                </Filter>
            </div>
            <div class="col-12 col-lg order-3 order-lg-2">
                <Feedback v-bind="{ feedback }" :hideCloseButton="true" />
            </div>
            <div class="col-auto order-2 order-lg-3 ps-2">
                <RouterLink :to="{ name: Entity.name + 'Details', params: { id: 'new' } }" class="btn btn-info">
                    <Icon name="new" /><span class="d-none d-sm-inline ms-1">{{ $t("new") }}</span>
                </RouterLink>
            </div>
        </div>

        <!-- Paging - ResultSummary -->
        <div class="row">
            <div class="col order-2">
                <template v-if="pagingInfo != null">
                    <Paging
                        class="mt-2"
                        v-show="!isLoading && itemsCount != null && itemsCount > pagingInfo.pageSize!"
                        v-model="pagingInfo"
                        :count="itemsCount || 0"
                        @change="updateOverviewRoute(false)"
                    />
                </template>
            </div>
            <div class="col-12 col-sm-auto order-1 order-sm-3">
                <ResultSummary v-if="items?.length" :visibleCount="items.length" :totalCount="itemsCount" />
            </div>
        </div>

        <!-- List - Loading -->
        <LoadingContainer :is-loading="isLoading">
            <component
                :is="List"
                v-if="items && items.length > 0"
                v-model="items"
                @request-save="handleRequestSave"
                @request-remove="handleRequestRemove"
                @save="handleSave"
                @remove="handleRemove"
                @request-reload="updateOverviewRoute(false)"
            />
            <p v-if="items && items.length <= 0" class="italic-muted">{{ $t("noResults") }}</p>
        </LoadingContainer>

        <!-- Paging -->
        <template v-if="pagingInfo != null">
            <Paging class="mt-2" v-show="!isLoading && itemsCount != null && itemsCount > pagingInfo.pageSize!" v-model="pagingInfo" :count="itemsCount || 0" @change="updateOverviewRoute(false)" />
        </template>

        <Debug :modelValue="items" />
    </section>
</template>

<script setup lang="ts">
import { useSearchView, useRouteOverview, type OverviewEmits } from "@/regira_modules/vue/entities"
import { Paging, LoadingContainer, Feedback } from "@/regira_modules/vue/ui"
import { useAuthStore } from "@/regira_modules/vue/auth"
import ResultSummary from "@/components/ResultSummary.vue"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import SearchObject from "../filter/SearchObject"
import Filter from "../filter/Filter.vue"
import FilterAdv from "../filter/FilterAdv.vue"
import List from "./List.vue"

interface Emits extends /* @vue-ignore */ OverviewEmits<Entity> {}
defineEmits<Emits>()

const { service } = useEntityStore()

const {
    searchObject,
    pagingInfo,

    items,
    itemsCount,

    isLoading,
    feedback,

    applySave,
    applyRemove,

    handleSave,
    handleRemove,

    searchHandler,
} = useSearchView<Entity, SearchObject>({
    service,
    searchObject: new SearchObject(),
    defaultPageSize: config.defaultPageSize,
})
const { updateOverviewRoute } = useRouteOverview({
    searchObject,
    pagingInfo,
    handler: searchHandler,
    defaultPageSize: config.defaultPageSize,
})

// trigger searchHandler when logging in or refreshing token
const authStore = useAuthStore()
authStore.$onAction(({ name, after }) => ["login", "refresh"].includes(name) && after(() => authStore.isAuthenticated && searchHandler(false)))

async function handleRequestSave(item: Entity) {
    const result = await applySave(item)
    if (result != null) {
        handleSave(result)
    }
}
async function handleRequestRemove(item: Entity) {
    await applyRemove(item)
    handleRemove(item)
}
</script>
```

---

## overview/List.vue

```vue
<template>
    <div class="entity-list">
        <div class="row pb-2 border-bottom border-bottom-1">
            <div class="col-auto fw-bold"><Icon name="edit" class="m-1" /></div>
            <div class="col-2 col-lg-1 fw-bold">{{ $t("code") }}</div>
            <div class="col fw-bold">{{ $t("name") }}</div>
            <div v-if="!readonly" class="col-auto d-none d-md-block fw-bold"><Icon name="delete" class="text-muted m-1" /></div>
        </div>
        <template v-for="(item, i) in items" :key="item.$id">
            <ListItem
                v-model="items[i]"
                :readonly="readonly"
                :class="{ 'bg-light': i % 2 == 0 }"
                @request-save="$emit('request-save', $event)"
                @request-remove="$emit('request-remove', $event)"
                @save="$emit('save', $event)"
                @remove="$emit('remove', $event)"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { OverviewEmits } from "@/regira_modules/vue/entities"
import useEntityStore from "../data/store"
import type Entity from "../data/Entity"
import ListItem from "./ListItem.vue"

interface Emits extends /* @vue-ignore */ OverviewEmits<Entity> {}
const emit = defineEmits<Emits>()
const props = defineProps<{
    modelValue?: Array<Entity>
    readonly?: boolean
}>()

const { fromPool } = useEntityStore()

const items = computed<Array<Entity>>({
    get: () => fromPool(props.modelValue || []),
    set: (value) => emit("update:modelValue", value),
})
</script>
```

---

## overview/ListItem.vue

```vue
<template>
    <div class="row border-bottom border-bottom-1 py-2">
        <div class="col-auto">
            <router-link :to="{ name: Entity.name + 'Details', params: { id: item.$id } }" class="btn btn-link p-1">
                <Icon :name="Entity.name" />
            </router-link>
        </div>
        <div class="col-2 col-lg-1 text-truncate">
            {{ item.code }}
        </div>
        <div class="col text-truncate">
            {{ item.$title }}
        </div>
        <div v-if="!readonly" class="col-auto d-none d-md-block">
            <ConfirmButton icon="delete" class="m-0 p-1" :modal-type="ModalType.danger" @confirm="$emit('request-remove', item)">{{ $t("deleteItem", { title: item?.$title }) }}</ConfirmButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useVModelField } from "@/regira_modules/vue/vue-helper"
import { ModalType, ConfirmButton } from "@/regira_modules/vue/ui"
import type { SaveResult } from "@/regira_modules/vue/entities"
import Entity from "../data/Entity"

const emit = defineEmits<{
    (e: "update:modelValue", args: Entity): void
    (e: "save", args: SaveResult<Entity>): void
    (e: "remove", args: Entity): void
    (e: "request-save", args: Entity): void
    (e: "request-remove", args: Entity): void
}>()
const props = defineProps<{
    modelValue: Entity
    readonly?: boolean
}>()

const item = useVModelField<Entity>(props, emit)
</script>
```

---

## details/Form.vue

```vue
<template>
    <form @submit.prevent="handleSubmit" :modelValue="item">
        <div class="row form-buttons">
            <div class="col col-md-auto order-1">
                <FormButtonsRow :item="item" :readonly="readonly" :feedback="feedback" :show-delete="item?.id > 0" @cancel="handleCancel" @remove="handleRemove" @restore="handleRestore" />
            </div>
            <div class="col-auto order-2 order-md-3">
                <RouterLink v-if="isPopup" :to="{ name: `${Entity.name}Details`, params: { id: item.$id } }" class="btn btn-default py-1" target="_blank" :title="$t('popOut')">
                    <Icon name="popOut" />
                </RouterLink>
                <RouterLink v-else-if="overviewUrl" :to="overviewUrl" class="btn btn-info py-1">
                    <Icon name="list" /> <span class="d-none d-md-inline ms-1">{{ $t("overview") }}</span>
                </RouterLink>
            </div>
            <div class="col-md order-3 order-md-2">
                <Feedback :feedback="feedback" />
            </div>
        </div>

        <div class="row">
            <div class="col">
                <FormSection :title="$t(config.detailsTitle || '')" :readonly="readonly">
                    <div class="row">
                        <div class="col-md mb-2">
                            <div class="input-group">
                                <div class="input-group-text"><Icon name="title" /></div>
                                <input v-model="item.title" maxlength="128" :readonly="readonly" class="form-control" />
                            </div>
                            <FormLabel :label="$t('name')" />
                        </div>
                        <div class="col-md mb-2">
                            <div class="input-group">
                                <div class="input-group-text"><Icon name="code" /></div>
                                <input v-model="item.code" maxlength="8" :readonly="readonly" class="form-control" />
                            </div>
                            <FormLabel :label="$t('code')" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col mb-2">
                            <DescriptionInput v-model="item.description" :label="$t('notes')" :readonly="readonly" />
                        </div>
                    </div>
                </FormSection>
            </div>
        </div>

        <Debug
            :modelValue="{
                item,
            }"
        />
    </form>
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from "vue-router"
import { Feedback } from "@/regira_modules/vue/ui"
import { FormButtonsRow } from "@/components/input"
import { useForm, type FormEmits, formDefaults } from "@/regira_modules/vue/entities"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"

interface Emits extends /* @vue-ignore */ FormEmits<Entity> {}
const emit = defineEmits<Emits>()
const props = withDefaults(
    defineProps<{
        modelValue: Entity
        readonly?: boolean
        overviewUrl?: string | RouteRecordRaw
        isPopup?: boolean
        initialTab?: string
    }>(),
    { ...formDefaults }
)

const { service: entityService } = useEntityStore()

const { item, feedback, handleCancel, handleSubmit, handleRemove, handleRestore } = useForm<Entity>({ entityService, props, emit })
</script>
```

---

## details/FormModalButton.vue

```vue
<template>
    <button type="button" class="btn btn-default" @click="open">
        <slot><Icon :name="Entity.name" /></slot>
        <Teleport to="#modals">
            <MyModal :is-visible="isOpen" :title="modalTitle || $tm(config.detailsTitle || '')" :showFooter="false" :full-width="false" @close="close" @cancel="handleCancel" @submit="handleSave">
                <Form v-model="item" :initial-tab="initialTab" :readonly="readonly" :is-popup="true" @cancel="handleCancel" @save="handleSave" @remove="handleRemove" />
            </MyModal>
        </Teleport>
    </button>
</template>

<script setup lang="ts">
import { computed, type Ref } from "vue"
import { useVModelField } from "@/regira_modules/vue/vue-helper"
import { useModal, type FormModalEmits } from "@/regira_modules/vue/entities"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import Form from "./Form.vue"

interface Emits extends /* @vue-ignore */ FormModalEmits<Entity> {}

const emit = defineEmits<Emits>()
const props = defineProps<{
    modelValue?: Entity
    readonly?: boolean
    itemDefaults?: Ref<Record<string, any>> | Record<string, any>
    initialTab?: string
    label?: string
    closeOnSave?: boolean
}>()

const modelRef = useVModelField<Entity>(props, emit)
const { service: entityService } = useEntityStore()

const modalTitle = computed(() => props.label || entityService.toEntity(modelRef.value).$title)
const {
    item,
    isOpen,

    close,
    open,

    handleSave,
    handleRemove,
    handleCancel,
} = useModal<Entity>({ entityService, model: modelRef, itemDefaults: props.itemDefaults, closeOnSave: props.closeOnSave, closeOnCancel: false, closeOnDelete: true, emit })

defineExpose({
    item,
    isOpen,
    open,
    close,
})
</script>
```

---

## selecting/Autocomplete.vue

```vue
<template>
    <Autocomplete v-model="item" :search="search" :max-results="maxResults" :id-selector="idSelector" :display-item-formatter="displayItemFormatter" :placeholder="placeholder" ref="autoEl">
        <template #default="{ item, q }">
            <div class="row">
                <div class="col">{{ item.title }}</div>
                <div v-if="item?.parentEntity" class="col d-none d-md-block"><Icon :name="Entity.name" class="me-1" /> {{ item.parentEntity?.title }}</div>
            </div>
        </template>
    </Autocomplete>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { Autocomplete } from "@/regira_modules/vue/ui"
import { get } from "@/regira_modules/vue/ioc"
import type { IEntityService } from "@/regira_modules/vue/entities"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"

const emit = defineEmits<{
    (e: "update:modelValue", args?: Entity): void
    (e: "update:idValue", args?: number): void
    (e: "select", args?: Entity): void
}>()
const props = withDefaults(
    defineProps<{
        modelValue?: Entity
        maxResults?: number
        filterDefaults?: Record<string, any>
        placeholder?: string
    }>(),
    { maxResults: 10 }
)

const { fromPool } = useEntityStore()
const item = computed({
    get: () => fromPool(props.modelValue) as Entity,
    set: (value) => {
        emit("update:modelValue", value)
        emit("update:idValue", value?.id)
        emit("select", value)
    },
})

// expose refs
const autoEl = ref<any>(null)
defineExpose({
    autoEl,
    get inputEl() {
        return autoEl.value.inputEl
    },
    resetQ: () => autoEl.value.resetQ(),
    search: (q?: string) => autoEl.value.search(q),
    reset: () => autoEl.value.reset(),
})

const entityService = get<IEntityService<Entity>>(Entity.name)!
const search = (q: string) => entityService.list({ ...props.filterDefaults, title: (q?.split(" ") || []).map((x) => `*${x}*`).join(" "), pageSize: props.maxResults })
const idSelector = (item?: Entity) => item?.$id?.toString()
const displayItemFormatter = (item?: Entity) => item?.$title as string
</script>
```

---

## selecting/InputSelector.vue

```vue
<template>
    <div class="input-selector input-group text-nowrap">
        <slot name="prepend">
            <FormModalButton
                v-model="item"
                :item-defaults="itemDefaults"
                :readonly="readonly"
                :close-on-save="closeOnSave"
                class="btn btn-outline-secondary"
                @save="({ saved }) => handleSelect(saved)"
            >
                <Icon :name="Entity.name" v-if="item?.id" /><Icon v-else name="new" />
            </FormModalButton>
        </slot>
        <slot>
            <Autocomplete class="form-control" v-model="item" :filter-defaults="filterDefaults" :readonly="readonly" :placeholder="placeholder" @select="handleSelect" ref="autoEl" />
        </slot>
        <slot name="append">
            <template v-if="!readonly">
                <button v-if="!readonly" type="button" v-show="item != null" class="btn btn-outline-secondary" @click="handleSelect(undefined)"><Icon name="clear" /></button>
                <SelectorModalButton v-model="item" :filter-defaults="filterDefaults" :disabled="readonly" @select="handleSelect" class="btn btn-outline-info" />
            </template>
        </slot>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from "vue"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import FormModalButton from "../details/FormModalButton.vue"
import Autocomplete from "./Autocomplete.vue"
import SelectorModalButton from "./SelectorModalButton.vue"

const emit = defineEmits<{
    (e: "update:modelValue", args?: Entity): void
    (e: "update:idValue", args?: number | string): void
    (e: "select", args?: Entity): void
}>()
const props = defineProps<{
    modelValue?: Entity
    idValue?: number | string
    readonly?: boolean
    itemDefaults?: Ref<Record<string, any>> | Record<string, any>
    filterDefaults?: Record<string, any>
    closeOnSave?: boolean
    placeholder?: string
}>()

const { fromPool, list } = useEntityStore()
const item = computed<Entity | undefined>({
    get: () => fromPool(props.modelValue) as Entity,
    set: (value) => {
        emit("update:modelValue", value)
        emit("update:idValue", value?.id)
    },
})
const autoEl = ref<any>(null)
defineExpose({
    resetQ: () => autoEl.value.resetQ(),
})

function handleSelect(selected?: Entity) {
    if (item.value?.id != selected?.id) {
        item.value = selected // emit
        emit("select", selected)
    }

    if (selected == null) {
        // empty q in autocomplete
        const { resetQ } = autoEl.value
        resetQ()
    }
}

onMounted(async () => {
    if (props.idValue && !props.modelValue?.id) {
        const model = await list({ id: props.idValue })
        emit("update:modelValue", model[0])
    }
})
</script>
```

---

## selecting/Selector.vue

```vue
<template>
    <div class="row g-1">
        <div v-for="(item, i) in items" :key="item.id" class="col-auto">
            <div class="text-nowrap p-2 border rounded-1">
                <FormModalButton v-model="items![i]" class="m-0 p-0" />
                {{ item.title }}
                <IconButton icon="delete" class="m-0 py-0 px-1" @click="handleRemove(item)" />
            </div>
        </div>
        <div class="col-auto">
            <InputSelector v-model="newItem" @select="handleSelect" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import useEntityStore from "../data/store"
import type Entity from "../data/Entity"
import FormModalButton from "../details/FormModalButton.vue"
import InputSelector from "./InputSelector.vue"

const emit = defineEmits<{
    (e: "update:modelValue", args: Array<Entity>): void
    (e: "update:idsValue", args: Array<number>): void
}>()
const props = defineProps<{
    modelValue?: Array<Entity>
    idsValue?: Array<number>
}>()

const { fromPool, list } = useEntityStore()
const items = computed<Array<Entity>>({
    get: () => fromPool(props.modelValue || []) as Array<Entity>,
    set: (value) => emit("update:modelValue", value as Array<Entity>),
})

const newItem = ref<Entity>()
function handleSelect(selected?: Entity) {
    console.debug("handleSelect", { selected })
    if (selected == null) {
        return
    }

    if (items.value.every((x) => x.$id != selected?.$id)) {
        const newVal = [...items.value, selected]
        emit(
            "update:idsValue",
            newVal.map((x) => x.id!)
        )
        emit("update:modelValue", newVal)
    }
    newItem.value = undefined
}
function handleRemove(selected: Entity) {
    console.debug("handleRemove", { selected })
    const newVal = items.value.filter((x) => x.$id != selected?.$id)
    emit(
        "update:idsValue",
        newVal.map((x) => x.id!)
    )
    emit("update:modelValue", newVal)
}

onMounted(async () => {
    console.debug("Selector", { modelValue: props.modelValue, ids: props.idsValue })
    if ((props.idsValue?.length || 0) > 0 && props.modelValue?.length != props.idsValue?.length) {
        const models = await list({ id: props.idsValue })
        emit("update:modelValue", models)
    }
})
</script>
```

---

## selecting/SelectorDropDown.vue

```vue
<template>
    <select v-model="selected" class="form-select">
        <option value=""></option>
        <option v-for="item in items" :value="item.id" :key="item.id">
            {{ item.title }}
        </option>
    </select>
</template>

<script setup lang="ts">
import { computed, onMounted, type Ref } from "vue"
import type Entity from "../data/Entity"
import useEntityStore from "../data/store"

const emit = defineEmits<{
    (e: "update:modelValue", args?: Entity): void
    (e: "update:idValue", args?: number): void
}>()
const props = defineProps<{
    modelValue?: Entity
    idValue?: number
}>()

const selected = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit("update:idValue", value?.id)
        emit("update:modelValue", value)
    },
})
const { fromCache } = useEntityStore()

const items = computed(() => (fromCache() as Array<Ref<Entity>>)!.map((x) => x.value))
onMounted(() => {
    if (!selected.value && props.idValue) {
        selected.value = items.value.find((x) => x.id == props.idValue)
    }
})
</script>
```

---

## selecting/SelectorList.vue

```vue
<template>
    <div class="entity-list">
        <div class="row pb-2 border-bottom border-bottom-1">
            <div class="col-auto fw-bold"><Icon name="select" class="m-1" /></div>
            <div class="col-2 fw-bold">{{ $t("code") }}</div>
            <div class="col fw-bold">{{ $t("name") }}</div>
        </div>

        <template v-for="(item, i) in items" :key="item.$id">
            <div class="row border-bottom border-bottom-1 py-2" :class="{ 'is-selected': isSelected(item) }">
                <div class="col-auto">
                    <IconButton :icon="isSelected(item) ? 'selected' : 'select'" class="btn-default py-0 px-1" @click="handleSelect(item)" />
                </div>
                <div class="col-2 text-truncate">
                    {{ item.code }}
                </div>
                <div class="col text-truncate">
                    <FormModalButton :modelValue="items[i]" class="p-1" />
                    {{ item.$title }}
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { OverviewEmits } from "@/regira_modules/vue/entities"
import type Entity from "../data/Entity"
import useEntityStore from "../data/store"
import FormModalButton from "../details/FormModalButton.vue"

interface Emits extends /* @vue-ignore */ OverviewEmits<Entity> {
    (e: "select", selected: Entity): void
}
const emit = defineEmits<Emits>()
const props = defineProps<{
    modelValue?: Array<Entity>
    selected?: Entity
}>()

const isSelected = computed(() => (item: Entity) => item.$id == props.selected?.$id)
const { fromPool } = useEntityStore()
const items = computed<Array<Entity>>({
    get: () => fromPool(props.modelValue || []),
    set: (value) => emit("update:modelValue", value),
})

function handleSelect(item: Entity) {
    emit("select", item?.$id !== props.selected?.$id ? item : null)
}
</script>
```

---

## selecting/SelectorModalButton.vue

```vue
<template>
    <button type="button" class="btn btn-default" @click="open">
        <slot><Icon name="search" /></slot>
        <Teleport to="#modals">
            <MyModal :is-visible="isOpen" :title="modalTitle || $tm(config.overviewTitle || '')" :showFooter="true" :full-width="true" @close="close" @cancel="handleCancel" @submit="handleSubmit">
                <SelectorSearch v-model="selected" :filter-defaults="filterDefaults" :item-defaults="itemDefaults" :page-size="maxResults" />
            </MyModal>
        </Teleport>
    </button>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, type Ref } from "vue"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import SelectorSearch from "./SelectorSearch.vue"

const emit = defineEmits<{
    (e: "update:modelValue", selected?: Entity): void
    (e: "select", selected?: Entity): void
}>()
const props = withDefaults(
    defineProps<{
        modelValue?: Entity
        filterDefaults?: Record<string, any>
        itemDefaults?: Ref<Record<string, any>> | Record<string, any>
        label?: string
        maxResults?: number
    }>(),
    { maxResults: 5 }
)

const selected = ref<Entity>()
const isOpen = ref(false)
const { service: entityService } = useEntityStore()
const modalTitle = computed(() => props.label || entityService.toEntity(props.modelValue || {}).$title)

function open() {
    selected.value = props.modelValue
    isOpen.value = true
}
function close() {
    isOpen.value = false
}
function handleCancel() {
    close()
}
function handleSubmit() {
    console.debug("submitSelection", { selected: selected.value })
    emit("update:modelValue", selected.value)
    emit("select", selected.value)
    close()
}

watchEffect(() => (selected.value = props.modelValue))
</script>
```

---

## selecting/SelectorSearch.vue

```vue
<template>
    <section class="selector-search">
        <div class="row">
            <div class="col col-md-auto order-1">
                <!-- Filter -->
                <Filter v-model="searchObject" :result-count="itemsCount" @filter="searchHandler(true)"
                    @change="searchHandler(true)">
                    <template #inline="{ handleToggle }">
                        <slot name="inline" :result-count="itemsCount" :search="searchHandler"
                            :search-object="searchObject" :paging-info="pagingInfo" :handle-toggle="handleToggle">
                            <FilterInline v-model="searchObject" :result-count="itemsCount"
                                @filter="searchHandler(true)" @change="searchHandler(true)"
                                @toggle-adv="handleToggle" />
                        </slot>
                    </template>
                    <template #adv="{ handleClose }">
                        <slot name="filterAdv" :result-count="itemsCount" :search="searchHandler"
                            :search-object="searchObject" :paging-info="pagingInfo" :handle-close="handleClose">
                            <component :is="FilterAdv" v-model="searchObject" :result-count="itemsCount"
                                @filter="searchHandler(true)" @change="searchHandler(true)" @close="handleClose" />
                        </slot>
                    </template>
                </Filter>
            </div>
            <div class="col-12 col-md order-3 order-md-2">
                <div class="overflow-hidden">
                    <Feedback v-bind="{ feedback }" :hideCloseButton="true" />
                    <div v-show="!feedback.status.value" class="row g-0">
                        <div class="col-auto">
                            <div v-if="selected?.id" class="form-control bg-info py-0">
                                <IconButton icon="selected" class="px-1 me-1" @click="handleSelect(undefined)" />
                                <FormModalButton v-model="selected" class="px-1" /> {{ selected.$title }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-auto order-2 mb-2">
                <FormModalButton :item-defaults="itemDefaults" :close-on-save="true"
                    @save="({ saved }) => handleSelect(saved)" class="btn btn-info">
                    <Icon name="new" /> <span class="d-none d-sm-inline">{{ $t("new") }}</span>
                </FormModalButton>
            </div>
        </div>

        <!-- Paging - ResultSummary -->
        <div class="row">
            <div class="col order-2">
                <template v-if="pagingInfo != null">
                    <Paging class="mt-2" v-show="!isLoading && itemsCount != null && itemsCount > pagingInfo.pageSize!"
                        v-model="pagingInfo" :button-type="ButtonType.button" :count="itemsCount || 0"
                        @change="searchHandler(false)" />
                </template>
            </div>
            <div class="col-12 col-sm-auto order-1 order-sm-3">
                <ResultSummary v-if="items?.length" :visibleCount="items.length" :totalCount="itemsCount" />
            </div>
        </div>

        <!-- List - Loading -->
        <LoadingContainer :is-loading="isLoading">
            <slot name="list" :items="items" :search-object="searchObject" :paging-info="pagingInfo">
                <component :is="List" v-model="items" :selected="selected" @select="handleSelect" />
            </slot>
        </LoadingContainer>

        <!-- Paging -->
        <template v-if="pagingInfo != null">
            <Paging class="mt-2" v-show="!isLoading && itemsCount != null && itemsCount > pagingInfo.pageSize!"
                v-model="pagingInfo" :button-type="ButtonType.button" :count="itemsCount || 0"
                @change="searchHandler(false)" />
        </template>

        <Debug :modelValue="{ items }" />
    </section>
</template>

<script setup lang="ts">
import { onMounted, type Ref } from "vue"
import { useSearchView } from "@/regira_modules/vue/entities"
import { Paging, LoadingContainer, Feedback, ButtonType } from "@/regira_modules/vue/ui"
import ResultSummary from "@/components/ResultSummary.vue"
import config from "../config/config"
import Entity from "../data/Entity"
import useEntityStore from "../data/store"
import SearchObject from "../filter/SearchObject"
import FormModalButton from "../details/FormModalButton.vue"
import FilterInline from "../filter/FilterInline.vue"
import FilterAdv from "../filter/FilterAdv.vue"
import Filter from "../filter/Filter.vue"
import List from "./SelectorList.vue"

const props = defineProps<{
    filterDefaults?: Record<string, any>
    itemDefaults?: Ref<Record<string, any>> | Record<string, any>
    pageSize?: number
}>()

const selected = defineModel<Entity>()

const { service } = useEntityStore()

const {
    searchObject,
    pagingInfo,

    items,
    itemsCount,

    isLoading,
    feedback,

    searchHandler,
} = useSearchView<Entity, SearchObject>({
    service,
    searchObject: Object.assign(new SearchObject(), props.filterDefaults || {}),
    defaultPageSize: props.pageSize || config.defaultPageSize,
})

console.debug("SelectorSearch", { searchObject, pagingInfo, items, itemsCount })

function handleSelect(item?: Entity) {
    feedback.success(item != null ? `${item.$title} selected` : `selection removed`)
    selected.value = item
}

onMounted(searchHandler)
</script>
```
