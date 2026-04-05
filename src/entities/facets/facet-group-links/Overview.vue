<template>
    <div class="row">
        <div class="col-lg-6">
            <FormSection>
                <template #title>
                    <h3 class="p-2 mb-2">
                        <Icon :name="FacetGroup.name" /> {{ $t('facet.parentFacetGroups') }}
                    </h3>
                </template>
                <OverviewParentGroups v-model="item" :filter-defaults="{ exclude: excludedIds }" />
            </FormSection>
        </div>
        <div class="col-lg-6">
            <FormSection>
                <template #title>
                    <h3 class="p-2 mb-2">
                        <Icon :name="FacetGroup.name" /> {{ $t('facet.childFacetGroups') }}
                    </h3>
                </template>
                <OverviewChildGroups v-model="item" :filter-defaults="{ exclude: excludedIds }" />
            </FormSection>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type Facet from "../data/Entity"
import FacetGroup from "../../facet-groups/data/Entity"
import OverviewParentGroups from "./InputSelectorInlineParent.vue"
import OverviewChildGroups from "./InputSelectorInlineChild.vue"

const item = defineModel<Facet>({ required: true })

const excludedIds = computed(() => [
    ...item.value.facetParentGroups?.filter(x => !x._deleted).map(x => x.facetGroupId) ?? [],
    ...item.value.facetChildGroups?.filter(x => !x._deleted).map(x => x.facetGroupId) ?? []
])
</script>
