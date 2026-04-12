<template>
    <div>
        <div class="row mb-2">
            <div class="col">
                <div class="input-group">
                    <div class="input-group-text">
                        <Icon name="price" />
                    </div>
                    <input type="number" step="0.01" v-model.number="newItem.price" class="form-control" :placeholder="$t('price')" />
                </div>
            </div>
            <div class="col">
                <DateInput v-model="newItem.startDate" :label="$t('date')" class="form-control" />
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
                    <div class="input-group">
                        <div class="input-group-text">
                            <Icon name="price" />
                        </div>
                        <input type="number" step="0.01" v-model.number="item.price" class="form-control" />
                    </div>
                </div>
                <div class="col">
                    <DateInput v-model="item.startDate" :label="$t('date')" class="form-control" />
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
import { orderByDesc } from "@/regira_modules/utilities/array-utility"
import Product from "../data/Entity"
import ProductPricePeriod from "./Entity"

const model = defineModel<Product>({ required: true })
const items = computed(() => orderByDesc(model.value.prices ?? [], (x) => x.startDate && new Date(x.startDate)))

function handleRemove(item: ProductPricePeriod) {
    item._deleted = !item._deleted
}

const newItem = ref<ProductPricePeriod>(ProductPricePeriod.create({ objectId: model.value.id }))
function handleAdd(item: ProductPricePeriod) {
    if (!item.price) return
    model.value.prices ??= []
    model.value.prices.push(item)
    newItem.value = ProductPricePeriod.create({ objectId: model.value.id })
}
</script>
