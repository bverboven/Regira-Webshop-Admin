<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <InputSelector v-model="newItem.child" v-model:idValue="newItem.childId" />
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

        <Debug :modelValue="{
            items: items.map(x => `${x.id} - ${(x.child?.title ?? '')}`),
        }" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import type Facet from "../data/Entity"
import FacetChild from "./Entity"
import InputSelector from "../selecting/InputSelector.vue"
import { Debug } from "@/regira_modules/vue/debug"
import FormModalButton from "../details/FormModalButton.vue"

const props = defineProps<{
    facet: Facet
}>()

const items = defineModel<FacetChild[]>({ default: () => [] })

function handleRemove(item: FacetChild) {
    item._deleted = !item._deleted
}

const newItem = ref<FacetChild>(FacetChild.create({ parentId: props.facet.id }))
function handleAdd(item: FacetChild) {
    items.value.push(FacetChild.create({ ...item }))
    newItem.value = FacetChild.create({ parentId: props.facet.id })
}
</script>
