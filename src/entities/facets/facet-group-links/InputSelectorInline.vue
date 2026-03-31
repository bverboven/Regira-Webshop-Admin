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
            <InputSelector @select="handleAdd" :filterDefaults="{ exclude: excludeIds }" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { type Entity as FacetGroup } from "@/entities/facet-groups"
import type Facet from "../data/Entity"
import FacetGroupLink from "./Entity"
import InputSelector from "@/entities/facet-groups/selecting/InputSelector.vue"
import FormModalButton from "@/entities/facet-groups/details/FormModalButton.vue"

const props = defineProps<{
    facet: Facet
}>()

const items = defineModel<FacetGroupLink[]>({ default: () => [] })
const excludeIds = computed(() => items.value.map(i => i.facetGroupId))

function handleRemove(item: FacetGroupLink) {
    item._deleted = !item._deleted
}

function handleAdd(item?: FacetGroup) {
    items.value.push(FacetGroupLink.create({ facetId: props.facet.id, facetGroupId: item?.id, facetGroup: item }))
}
</script>
