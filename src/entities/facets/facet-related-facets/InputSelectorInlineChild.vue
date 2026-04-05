<template>
    <div class="row">
        <template v-for="item in items" :key="item.id">
            <div class="col-auto mb-2 pe-0">
                <div class="form-control p-0" :class="{ 'is-deleted': item._deleted }">
                    <FormModalButton :modelValue="item.child" />
                    {{ item.child?.title ?? '' }}
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
import type Facet from "../data/Entity"
import RelatedEntity from "./RelatedEntity"
import FacetChild from "./FacetChild"
import InputSelector from "../selecting/InputSelector.vue"
import FormModalButton from "../details/FormModalButton.vue"

const props = defineProps<{
    filterDefaults?: Record<string, any>
}>()

const facet = defineModel<Facet>({ required: true })
const items = computed(() => facet.value.childEntities ?? [])

function handleRemove(item: RelatedEntity) {
    item._deleted = !item._deleted || props.filterDefaults?.exclude?.includes(item.childId)
}

function handleAdd(item?: Facet) {
    items.value.push(FacetChild.create({ parentId: facet.value.id, childId: item?.id, child: item }))
}
</script>
