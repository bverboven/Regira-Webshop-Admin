<template>
    <div class="row">
        <template v-for="item in items" :key="item.id">
            <div class="col-auto mb-2 pe-0">
                <div class="form-control p-0" :class="{ 'is-deleted': item._deleted }">
                    <FormModalButton :modelValue="item.component" />
                    {{ item.component?.title ?? "" }}
                    <button type="button" class="btn btn-outline-danger border-0" @click="handleRemove(item)">
                        <Icon name="delete" />
                    </button>
                </div>
            </div>
        </template>
        <div class="col-auto mb-2">
            <InputSelector @select="handleAdd" :filterDefaults="{ exclude: excludeIds }" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type Product from "../data/Entity"
import ProductComponent from "./Entity"
import InputSelector from "../selecting/InputSelector.vue"
import FormModalButton from "../details/FormModalButton.vue"

const props = defineProps<{
    product: Product
}>()

const items = defineModel<ProductComponent[]>({ default: () => [] })
const excludeIds = computed(() => items.value.map((i) => i.componentId))

function handleRemove(item: ProductComponent) {
    item._deleted = !item._deleted
}

function handleAdd(item?: Product) {
    items.value.push(
        ProductComponent.create({
            assemblyId: props.product.id,
            componentId: item?.id,
            component: item,
        })
    )
}
</script>
