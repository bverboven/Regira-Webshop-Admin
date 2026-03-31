<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <InputSelector v-model="newItem.parent" v-model:idValue="newItem.parentId"
                    :filterDefaults="{ exclude: excludedIds }" />
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
                    <FormModalButton :modelValue="item.parent" />
                    {{ item.parent?.title ?? '' }}
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
import type FacetGroup from "../data/Entity"
import FacetGroupLinkParent from "./FacetGroupLinkParent"
import InputSelector from "../selecting/InputSelector.vue"
import FormModalButton from "../details/FormModalButton.vue"

const props = defineProps<{
    facetGroup: FacetGroup
}>()

const items = defineModel<FacetGroupLinkParent[]>({ default: () => [] })
const excludedIds = computed(() => [props.facetGroup.id, ...props.facetGroup.parentEntities?.map(x => x.parentId) ?? [], ...props.facetGroup.childEntities?.map(x => x.childId) ?? []])

function handleRemove(item: FacetGroupLinkParent) {
    item._deleted = !item._deleted
}

const newItem = ref<FacetGroupLinkParent>(FacetGroupLinkParent.create({ childId: props.facetGroup.id }))
function handleAdd(item: FacetGroupLinkParent) {
    items.value.push(FacetGroupLinkParent.create({ ...item }))
    newItem.value = FacetGroupLinkParent.create({ childId: props.facetGroup.id })
}
</script>
