<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <InputSelector v-model="newItem.facet" v-model:idValue="newItem.facetId" :filterDefaults="{ exclude: excludedIds }" />
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
                    <FormModalButton :modelValue="item.facet" />
                    {{ item.facet?.title ?? "" }}
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
import InputSelector from "@/entities/facets/selecting/InputSelector.vue"
import FormModalButton from "@/entities/facets/details/FormModalButton.vue"
import type FacetGroup from "../data/Entity"
import FacetGroupLinkChild from "./FacetChildGroup"

const props = defineProps<{
    facetGroup: FacetGroup
}>()

const items = defineModel<FacetGroupLinkChild[]>({ default: () => [] })
const excludedIds = computed(() => [
    props.facetGroup.id,
    ...(props.facetGroup.parentFacets?.filter((x) => !x._deleted).map((x) => x.facetId) ?? []),
    ...(props.facetGroup.childFacets?.filter((x) => !x._deleted).map((x) => x.facetId) ?? []),
])

function handleRemove(item: FacetGroupLinkChild) {
    item._deleted = !item._deleted
}

const newItem = ref<FacetGroupLinkChild>(FacetGroupLinkChild.create({ facetGroupId: props.facetGroup.id }))
function handleAdd(item: FacetGroupLinkChild) {
    items.value.push(FacetGroupLinkChild.create({ ...item }))
    newItem.value = FacetGroupLinkChild.create({
        facetGroupId: props.facetGroup.id,
    })
}
</script>
