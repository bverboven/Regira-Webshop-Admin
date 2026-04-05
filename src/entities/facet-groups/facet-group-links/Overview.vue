<template>
    <div class="row">
        <div class="col-lg-6">
            <FormSection :title="$t('facetGroup.parentFacets')">
                <OverviewParentEntities v-model="item" :filter-defaults="{ exclude: excludedIds }" />
            </FormSection>
        </div>
        <div class="col-lg-6">
            <FormSection :title="$t('facetGroup.childFacets')">
                <OverviewChildEntities v-model="item" :filter-defaults="{ exclude: excludedIds }" />
            </FormSection>
        </div>
    </div>
</template>

<script setup lang="ts">
import type FacetGroup from "../data/Entity"
import OverviewParentEntities from "./InputSelectorInlineParent.vue"
import OverviewChildEntities from "./InputSelectorInlineChild.vue"
import { computed } from "vue"

const item = defineModel<FacetGroup>({ required: true })

const excludedIds = computed(() => [
    ...item.value.parentFacets?.filter(x => !x._deleted).map(x => x.facetId) ?? [],
    ...item.value.childFacets?.filter(x => !x._deleted).map(x => x.facetId) ?? []
])
</script>
