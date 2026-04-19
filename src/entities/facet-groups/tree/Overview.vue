<template>
    <FacetTreeOverview :item="item as unknown as Facet" :selected-type="Entity.name" />
</template>

<script setup lang="ts">
import type Facet from "@/entities/facets/data/Entity"
import FacetTreeOverview from "@/entities/facets/tree/Overview.vue"
import Entity from "../data/Entity"

defineProps<{
    item: Entity
}>()
</script>
