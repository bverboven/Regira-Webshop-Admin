<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <InputSelector v-model="newItem.child" v-model:idValue="newItem.childId"
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
                    <FormModalButton :modelValue="item.child" />
                    {{ item.child?.title ?? '' }}
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
import FacetGroupLinkChild from "./FacetGroupLinkChild"
import InputSelector from "../selecting/InputSelector.vue"
import FormModalButton from "../details/FormModalButton.vue"

const props = defineProps<{
    facetGroup: FacetGroup
}>()

const items = defineModel<FacetGroupLinkChild[]>({ default: () => [] })
const excludedIds = computed(() => [props.facetGroup.id, ...props.facetGroup.parentEntities?.map(x => x.parentId) ?? [], ...props.facetGroup.childEntities?.map(x => x.childId) ?? []])

function handleRemove(item: FacetGroupLinkChild) {
    item._deleted = !item._deleted
}

const newItem = ref<FacetGroupLinkChild>(FacetGroupLinkChild.create({ parentId: props.facetGroup.id }))
function handleAdd(item: FacetGroupLinkChild) {
    items.value.push(FacetGroupLinkChild.create({ ...item }))
    newItem.value = FacetGroupLinkChild.create({ parentId: props.facetGroup.id })
}
</script>
