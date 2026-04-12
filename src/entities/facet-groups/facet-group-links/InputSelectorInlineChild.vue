<template>
    <div class="row">
        <template v-for="item in items" :key="item.id">
            <div class="col-auto mb-2 pe-0">
                <div class="form-control p-0" :class="{ 'is-deleted': item._deleted }">
                    <FormModalButton :modelValue="item.facet" />
                    {{ item.facet?.title ?? "" }}
                    <button type="button" class="btn btn-outline-danger border-0" @click="handleRemove(item)">
                        <Icon name="delete" />
                    </button>
                </div>
            </div>
        </template>
        <div class="col-auto mb-2">
            <InputSelector @select="handleAdd" :filterDefaults="filterDefaults" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type Facet from "@/entities/facets/data/Entity"
import InputSelector from "@/entities/facets/selecting/InputSelector.vue"
import FormModalButton from "@/entities/facets/details/FormModalButton.vue"
import type FacetGroup from "../data/Entity"
import FacetGroupFacet from "./FacetGroupFacet"

const props = defineProps<{
    filterDefaults?: Record<string, any>
}>()

const facetGroup = defineModel<FacetGroup>({ required: true })
const items = computed(() => facetGroup.value.childFacets ?? [])

function handleRemove(item: FacetGroupFacet) {
    item._deleted = !item._deleted || props.filterDefaults?.exclude?.includes(item.facetId)
}

function handleAdd(item?: Facet) {
    facetGroup.value.childFacets ??= []
    facetGroup.value.childFacets.push(
        FacetGroupFacet.create({
            facetGroupId: facetGroup.value.id,
            facetId: item?.id,
            facetGroup: item,
        })
    )
}
</script>
