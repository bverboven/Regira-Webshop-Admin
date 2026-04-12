<template>
    <div class="row">
        <template v-for="item in items" :key="item.id">
            <div class="col-auto mb-2 pe-0">
                <div class="form-control p-0" :class="{ 'is-deleted': item._deleted }">
                    <FormModalButton :modelValue="item.supplier!" />
                    {{ getSupplier(item.supplier!)?.$title ?? "" }}
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
import { type Entity as Party, FormModalButton, InputSelector, useEntityStore } from "@/entities/parties"
import type Product from "../data/Entity"
import ProductSupplier from "./Entity"

const model = defineModel<Product>({ required: true })
const items = computed(() => model.value.suppliers ?? [])
const excludeIds = computed(() => items.value.map((i) => i.supplierId))

function handleRemove(item: ProductSupplier) {
    item._deleted = !item._deleted
}

function handleAdd(item?: Party) {
    if (!model.value.suppliers) model.value.suppliers = []
    model.value.suppliers.push(
        ProductSupplier.create({
            productId: model.value.id,
            supplierId: item?.id,
            supplier: item,
        })
    )
}

const { fromPool, service } = useEntityStore()
const getSupplier = (x: Party) => {
    const supplier = fromPool(x)
    console.debug("getSupplier", { x, supplier })
    return supplier
}
</script>
