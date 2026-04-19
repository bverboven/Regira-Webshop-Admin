<template>
    <FacetTreeOverview :item="itemAsFacet" :selected-type="Entity.name" />
</template>

<script setup lang="ts">
import { computed } from "vue"
import FacetEntity from "@/entities/facets/data/Entity"
import FacetTreeOverview from "@/entities/facets/tree/Overview.vue"
import Entity from "../data/Entity"

const props = defineProps<{
    item: Entity
}>()

const itemAsFacet = computed(() => {
    const facet = new FacetEntity()
    facet.id = props.item.id
    facet.title = props.item.title
    facet.code = props.item.code
    facet.description = props.item.description
    facet.parentEntities = []
    facet.childEntities = []
    facet.facetParentGroups = []
    facet.facetChildGroups = []
    return facet
})
</script>
