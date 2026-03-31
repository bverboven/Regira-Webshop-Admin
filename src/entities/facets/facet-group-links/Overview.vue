<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <InputSelector v-model="newItem.facetGroup" v-model:idValue="newItem.facetGroupId" />
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
                    <FormModalButton :modelValue="item.facetGroup" />
                    {{ item.facetGroup?.title ?? '' }}
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
import { ref } from "vue"
import type Facet from "../data/Entity"
import FacetFacetGroup from "./Entity"
import InputSelector from "@/entities/facet-groups/selecting/InputSelector.vue"
import FormModalButton from "@/entities/facet-groups/details/FormModalButton.vue"

const props = defineProps<{
    facet: Facet
}>()

const items = defineModel<FacetFacetGroup[]>({ default: () => [] })

function handleRemove(item: FacetFacetGroup) {
    item._deleted = !item._deleted
}

const newItem = ref<FacetFacetGroup>(FacetFacetGroup.create({ facetId: props.facet.id }))
function handleAdd(item: FacetFacetGroup) {
    items.value.push(FacetFacetGroup.create({ ...item }))
    newItem.value = FacetFacetGroup.create({ facetId: props.facet.id })
}
</script>
