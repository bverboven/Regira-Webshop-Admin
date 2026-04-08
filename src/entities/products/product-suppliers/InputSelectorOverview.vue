<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <InputSelector @select="handleAdd" :filterDefaults="{ exclude: excludeIds }" />
            </div>
        </div>

        <template v-for="item in items" :key="item.id">
            <div class="row mb-2" :class="{ 'is-deleted': item._deleted }">
                <div class="col">
                    <div class="input-group">
                        <FormModalButton :modelValue="item.supplier!" />
                        <span class="form-control">{{ getSupplier(item.supplier!)?.$title ?? '' }}</span>
                        <button type="button" class="btn btn-outline-danger" @click="handleRemove(item)">
                            <Icon name="delete" />
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { type Entity as Party, FormModalButton, InputSelector, useEntityStore } from "@/entities/parties"
import type Product from "../data/Entity"
import ProductSupplier from "./Entity"

const model = defineModel<Product>({ required: true })
const items = computed(() => model.value.suppliers ?? [])
const excludeIds = computed(() => items.value.map(i => i.supplierId))

function handleRemove(item: ProductSupplier) {
    item._deleted = !item._deleted
}

function handleAdd(item?: Party) {
    if (!model.value.suppliers) model.value.suppliers = []
    model.value.suppliers.push(ProductSupplier.create({ productId: model.value.id, supplierId: item?.id, supplier: item }))
}

const { fromPool } = useEntityStore()
const getSupplier = (x: Party) => fromPool(x)
</script>
