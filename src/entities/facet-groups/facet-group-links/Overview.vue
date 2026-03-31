<template>
    <div class="row">
        <div class="col-lg-6">
            <FormSection :title="$t('facetGroup.parentEntities')">
                <OverviewParentEntities v-model="item.parentEntities" :facetGroup="item" />
            </FormSection>
        </div>
        <div class="col-lg-6">
            <FormSection :title="$t('facetGroup.childEntities')">
                <OverviewChildEntities v-model="item.childEntities" :facetGroup="item" />
            </FormSection>
        </div>
    </div>
</template>

<script setup lang="ts">
import type FacetGroup from "../data/Entity"
import OverviewParentEntities from "./OverviewParentEntities.vue"
import OverviewChildEntities from "./OverviewChildEntities.vue"

const item = defineModel<FacetGroup>({ required: true })
</script>
