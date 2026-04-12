<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <InputSelector v-model="newItem.parent" v-model:idValue="newItem.parentId" :filterDefaults="{ exclude: excludedIds }" />
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-success" @click="handleAdd(newItem)">
                    <Icon name="new" />
                </button>
            </div>
        </div>

        <template v-for="item in items" :key="item.id">
            <div class="row mb-2" :class="{ 'is-deleted': item._deleted }">
                <div class="col">
                    <FormModalButton :modelValue="item.parent" />
                    {{ item.parent?.title ?? "" }}
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-outline-danger" @click="handleRemove(item)">
                        <Icon name="delete" />
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import type Facet from "../data/Entity"
import FacetParent from "./FacetParent"
import InputSelector from "../selecting/InputSelector.vue"
import FormModalButton from "../details/FormModalButton.vue"

const props = defineProps<{
    facet: Facet
}>()

const items = defineModel<FacetParent[]>({ default: () => [] })
const excludedIds = computed(() => [
    props.facet.id,
    ...(props.facet.parentFacets?.map((x) => x.parentId) ?? []),
    ...(props.facet.childFacets?.map((x) => x.childId) ?? []),
])

function handleRemove(item: FacetParent) {
    item._deleted = !item._deleted
}

const newItem = ref<FacetParent>(FacetParent.create({ childId: props.facet.id }))
function handleAdd(item: FacetParent) {
    items.value.push(FacetParent.create({ ...item }))
    newItem.value = FacetParent.create({ childId: props.facet.id })
}
</script>
