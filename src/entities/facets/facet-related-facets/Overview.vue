<template>
    <div class="row">
        <div class="col-lg-6">
            <FormSection>
                <template #title>
                    <h3 class="p-2 mb-2"><Icon :name="Facet.name" /> {{ $t("facet.parentFacets") }}</h3>
                </template>
                <InputSelectorInlineParent v-model="item" />
            </FormSection>
        </div>
        <div class="col-lg-6">
            <FormSection>
                <template #title>
                    <h3 class="p-2 mb-2"><Icon :name="Facet.name" /> {{ $t("facet.childFacets") }}</h3>
                </template>
                <InputSelectorInlineChild v-model="item" />
            </FormSection>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import Facet from "../data/Entity"
import InputSelectorInlineParent from "./InputSelectorInlineParent.vue"
import InputSelectorInlineChild from "./InputSelectorInlineChild.vue"

const item = defineModel<Facet>({ required: true })

const excludedIds = computed(() => [
    ...(item.value.parentEntities?.filter((x) => !x._deleted).map((x) => x.parentId) ?? []),
    ...(item.value.childEntities?.filter((x) => !x._deleted).map((x) => x.childId) ?? []),
])
</script>
