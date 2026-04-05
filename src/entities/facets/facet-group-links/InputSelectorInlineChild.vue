<template>
    <div class="row">
        <template v-for="item in items" :key="item.id">
            <div class="col-auto mb-2 pe-0">
                <div class="form-control p-0" :class="{ 'is-deleted': item._deleted }">
                    <FormModalButton :modelValue="item.facetGroup" />
                    {{ item.facetGroup?.title ?? '' }}
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
import type FacetGroup from "@/entities/facet-groups/data/Entity"
import InputSelector from "@/entities/facet-groups/selecting/InputSelector.vue"
import FormModalButton from "@/entities/facet-groups/details/FormModalButton.vue"
import type Facet from "../data/Entity"
import FacetFacetGroup from "../facet-group-links/FacetFacetGroup"

const props = defineProps<{
    filterDefaults?: Record<string, any>
}>()

const facet = defineModel<Facet>({ required: true })
const items = computed(() => facet.value.facetChildGroups ?? [])

function handleRemove(item: FacetFacetGroup) {
    item._deleted = !item._deleted || props.filterDefaults?.exclude?.includes(item.facetGroupId)
}

function handleAdd(item?: FacetGroup) {
    facet.value.facetChildGroups ??= []
    facet.value.facetChildGroups.push(FacetFacetGroup.create({ facetId: facet.value.id, facetGroupId: item?.id, facetGroup: item }))
}
</script>
